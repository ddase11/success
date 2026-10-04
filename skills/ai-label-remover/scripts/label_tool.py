#!/usr/bin/env python3
"""Inspect and strip PNG/JPEG container metadata, safely unpack ZIP batches and
write verification reports. Never certifies photography and never removes
invisible watermarks; pixel data is not modified."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import stat
import struct
import sys
import tempfile
import zipfile
import zlib

VERSION = "2.0.0"
MAX_BYTES = 64 * 1024 * 1024
MAX_TOTAL_BYTES = 256 * 1024 * 1024
MAX_ZIP_ENTRIES = 1000
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
SOF = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
       0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
PNG_CORE = (b"IHDR", b"PLTE", b"IDAT", b"IEND", b"tRNS")
PNG_COLOR = (b"iCCP", b"sRGB", b"gAMA", b"cHRM", b"cICP", b"sBIT", b"mDCV", b"cLLI")
ICC_TAG = b"ICC_PROFILE\0"
DETECTOR_STATES = ("matched", "not_matched", "unavailable", "not_checked", "error")
STEP_STATES = ("implemented", "executed", "verified", "not_needed", "not_checked", "unavailable", "failed")
VISIBLE_STATES = ("executed", "verified", "not_needed", "not_checked", "unavailable", "failed")


def sniff(data):
    """Return 'PNG' or 'JPEG', or raise with the detected unsupported format."""
    if data.startswith(PNG_SIGNATURE):
        return "PNG"
    if data.startswith(b"\xff\xd8\xff"):
        return "JPEG"
    head = data[:16]
    if head[:6] in (b"GIF87a", b"GIF89a"):
        name = "GIF"
    elif head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        name = "WebP"
    elif head[4:8] == b"ftyp":
        brand = head[8:12]
        name = "AVIF" if brand in (b"avif", b"avis") else "HEIC/HEIF" if brand in (b"heic", b"heix", b"hevc", b"mif1", b"msf1") else "ISO media/video"
    elif head[:4] in (b"II*\0", b"MM\0*"):
        name = "TIFF/RAW"
    elif head[:4] == b"%PDF":
        name = "PDF"
    elif head[:2] == b"BM":
        name = "BMP"
    elif head[:4] == b"PK\x03\x04":
        name = "ZIP"
    else:
        name = "unknown"
    raise ValueError("Unsupported format: " + name + " (only single-frame PNG or JPEG)")


def png_records(data):
    records, pos, ended_idat, seen_idat = [], 8, False, False
    palette_entries, seen_trns = None, False
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError("Not a PNG file")
    while pos < len(data):
        if pos + 12 > len(data):
            raise ValueError("Truncated PNG chunk")
        size, kind = struct.unpack(">I4s", data[pos:pos + 8])
        end = pos + 12 + size
        if end > len(data) or kind[2] & 32 or any(not (65 <= c <= 90 or 97 <= c <= 122) for c in kind):
            raise ValueError("Invalid PNG chunk bounds or name")
        payload = data[pos + 8:end - 4]
        if zlib.crc32(kind + payload) & 0xffffffff != struct.unpack(">I", data[end - 4:end])[0]:
            raise ValueError("PNG CRC mismatch: " + kind.decode("ascii"))
        if kind in (b"acTL", b"fcTL", b"fdAT"):
            raise ValueError("Unsupported format: animated PNG (APNG); original was not changed")
        if not records and (kind != b"IHDR" or size != 13):
            raise ValueError("PNG must begin with a 13-byte IHDR")
        if kind == b"IHDR" and records:
            raise ValueError("Duplicate PNG IHDR")
        if kind == b"IHDR":
            width, height, depth, color, comp, filt, interlace = struct.unpack(">IIBBBBB", payload)
            valid_depths = {0: (1, 2, 4, 8, 16), 2: (8, 16), 3: (1, 2, 4, 8), 4: (8, 16), 6: (8, 16)}
            if not width or not height or depth not in valid_depths.get(color, ()) or comp or filt or interlace > 1:
                raise ValueError("Invalid PNG IHDR values")
        if kind == b"PLTE":
            if seen_idat or seen_trns or palette_entries is not None or not size or size % 3 or size > 768 or color in (0, 4):
                raise ValueError("Invalid PNG palette size, order, or color type")
            palette_entries = size // 3
            if color == 3 and palette_entries > 1 << depth:
                raise ValueError("PNG palette exceeds indexed bit depth")
        if kind == b"tRNS":
            valid_size = (color == 0 and size == 2) or (color == 2 and size == 6) or (color == 3 and palette_entries is not None and 0 < size <= palette_entries)
            if seen_idat or seen_trns or not valid_size:
                raise ValueError("Invalid PNG transparency size, order, or color type")
            if color in (0, 2) and any(int.from_bytes(payload[j:j + 2], "big") >= 1 << depth for j in range(0, size, 2)):
                raise ValueError("PNG transparency sample exceeds bit depth")
            seen_trns = True
        if not kind[0] & 32 and kind not in (b"IHDR", b"PLTE", b"IDAT", b"IEND"):
            raise ValueError("Unknown critical PNG chunk")
        if kind == b"IDAT" and ended_idat:
            raise ValueError("Non-contiguous PNG IDAT chunks")
        if kind != b"IDAT" and seen_idat:
            ended_idat = True
        seen_idat = seen_idat or kind == b"IDAT"
        records.append((kind, data[pos:end], payload))
        pos = end
        if kind == b"IEND":
            if size or not seen_idat:
                raise ValueError("Invalid PNG IEND or missing image data")
            if color == 3 and palette_entries is None:
                raise ValueError("Indexed PNG lacks PLTE")
            return records, len(data) - pos
    raise ValueError("PNG is missing IEND")


def jpeg_records(data):
    if not data.startswith(b"\xff\xd8"):
        raise ValueError("Not a JPEG file")
    records, pos, scan, after_scan = [("SOI", data[:2], b"")], 2, False, False
    while pos < len(data):
        if scan:
            start = pos
            while pos < len(data):
                if data[pos] != 255:
                    pos += 1
                    continue
                marker_pos = pos + 1
                while marker_pos < len(data) and data[marker_pos] == 255:
                    marker_pos += 1
                if marker_pos == len(data):
                    raise ValueError("Truncated JPEG entropy data")
                code = data[marker_pos]
                if code == 0 or code == 1 or 0xD0 <= code <= 0xD7:
                    pos = marker_pos + 1
                else:
                    break
            records.append(("SCAN", data[start:pos], data[start:pos]))
            scan, after_scan = False, True
            continue
        start = pos
        if data[pos] != 255:
            raise ValueError("Invalid JPEG marker boundary")
        while pos < len(data) and data[pos] == 255:
            pos += 1
        if pos == len(data):
            raise ValueError("Truncated JPEG marker")
        code, pos = data[pos], pos + 1
        if code in (0, 0xD8):
            raise ValueError("Invalid or duplicate JPEG SOI marker")
        if code == 0xD9:
            records.append(("EOI", data[start:pos], b""))
            if not any(r[0] in SOF for r in records) or not any(r[0] == 0xDA for r in records):
                raise ValueError("JPEG lacks frame or scan")
            return records, len(data) - pos
        if code == 1 or 0xD0 <= code <= 0xD7:
            records.append((code, data[start:pos], b""))
        else:
            if pos + 2 > len(data):
                raise ValueError("Truncated JPEG segment length")
            size = int.from_bytes(data[pos:pos + 2], "big")
            if size < 2 or pos + size > len(data):
                raise ValueError("Invalid JPEG segment length")
            payload = data[pos + 2:pos + size]
            if code in SOF and (len(payload) < 6 or len(payload) != 6 + 3 * payload[5]):
                raise ValueError("Invalid JPEG frame")
            if code in SOF and any(r[0] in SOF for r in records):
                raise ValueError("Unsupported JPEG: multiple frames (hierarchical)")
            records.append((code, data[start:pos + size], payload))
            pos += size
        scan = code == 0xDA or (code == 0xDC and after_scan)
        after_scan = False
    raise ValueError("JPEG is missing EOI")


def exif_orientation(payload):
    if not payload.startswith(b"Exif\0\0"):
        return None
    tiff = payload[6:]
    if len(tiff) < 8 or tiff[:2] not in (b"II", b"MM"):
        return None
    endian = "little" if tiff[:2] == b"II" else "big"
    num = lambda b: int.from_bytes(b, endian)
    if num(tiff[2:4]) != 42:
        return None
    pos = num(tiff[4:8])
    if pos + 2 > len(tiff):
        return None
    count = num(tiff[pos:pos + 2])
    if pos + 2 + count * 12 > len(tiff):
        return None
    for index in range(count):
        entry = tiff[pos + 2 + index * 12:pos + 14 + index * 12]
        if num(entry[:2]) == 274 and num(entry[2:4]) == 3 and num(entry[4:8]) == 1:
            value = num(entry[8:10])
            return value if 1 <= value <= 8 else None
    return None


def minimal_exif(orientation):
    """A TIFF block holding only the Orientation tag (no camera, software or provenance data)."""
    return (b"MM\0\x2a" + struct.pack(">I", 8) + struct.pack(">H", 1)
            + struct.pack(">HHIHH", 274, 3, 1, orientation, 0) + struct.pack(">I", 0))


def png_chunk(kind, payload):
    return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", zlib.crc32(kind + payload) & 0xffffffff)


def parse(data):
    fmt = sniff(data)
    return fmt, (png_records if fmt == "PNG" else jpeg_records)(data)


def jpeg_name(kind):
    if isinstance(kind, int) and 0xE0 <= kind <= 0xEF:
        return "APP" + str(kind - 0xE0)
    return "COM" if kind == 0xFE else str(kind)


def inspect_bytes(data):
    """Pre-check facts: format, size, color, transparency, orientation, structure, provenance hints."""
    fmt, (records, trailer) = parse(data)
    info = {"format": fmt, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
            "trailing_bytes": trailer, "orientation": None, "has_color_profile": False,
            "structure": [], "provenance_indicators": []}
    hints = set()
    for kind, raw, payload in records:
        if fmt == "PNG":
            name = kind.decode("ascii")
            info["structure"].append({"name": name, "bytes": len(raw)})
            if kind == b"IHDR":
                w, h, depth, color = struct.unpack(">IIBB", payload[:10])
                info.update(width=w, height=h, bit_depth=depth,
                            color_mode={0: "gray", 2: "rgb", 3: "indexed", 4: "gray+alpha", 6: "rgba"}[color],
                            transparency=color in (4, 6))
            if kind == b"tRNS":
                info["transparency"] = True
            if kind == b"eXIf":
                info["orientation"] = exif_orientation(b"Exif\0\0" + payload)
            if kind in (b"iCCP", b"sRGB", b"cICP"):
                info["has_color_profile"] = True
            if kind == b"caBX":
                hints.add("C2PA manifest (caBX)")
            if kind in (b"tEXt", b"zTXt", b"iTXt"):
                key = payload.split(b"\0", 1)[0].decode("latin-1", "replace")
                hints.add("text chunk: " + key)
        else:
            name = kind if isinstance(kind, str) else jpeg_name(kind)
            info["structure"].append({"name": name, "bytes": len(raw)})
            if kind in SOF:
                h, w, comps = struct.unpack(">HHB", payload[1:6])
                info.update(width=w, height=h, bit_depth=payload[0], transparency=False,
                            color_mode={1: "gray", 3: "ycbcr/rgb", 4: "cmyk/ycck"}.get(comps, str(comps) + " components"))
            if kind == 0xE1:
                if payload.startswith(b"Exif\0\0"):
                    info["orientation"] = exif_orientation(payload)
                    hints.add("Exif (APP1)")
                elif b"ns.adobe.com/xap" in payload[:64]:
                    hints.add("XMP (APP1)")
            if kind == 0xE2 and payload.startswith(ICC_TAG):
                info["has_color_profile"] = True
            if kind == 0xEB:
                hints.add("JUMBF/C2PA (APP11)")
            if kind == 0xED:
                hints.add("IPTC/Photoshop (APP13)")
            if kind == 0xFE:
                hints.add("comment (COM)")
        lowered = b"" if kind in ("SCAN", b"IDAT") else payload.lower()
        if b"c2pa" in lowered:
            hints.add("C2PA label")
        if b"trainedalgorithmicmedia" in lowered or b"compositewithtrainedalgorithmicmedia" in lowered:
            hints.add("IPTC DigitalSourceType: AI generated")
    if trailer:
        hints.add("data after end of image")
    info["provenance_indicators"] = sorted(hints)
    return info


def sanitize(data, keep_orientation=True, keep_color=True):
    fmt, (records, trailer) = parse(data)
    is_png = fmt == "PNG"
    kept, removed, residual, warnings = [], [], [], []
    orientation = None
    for kind, raw, payload in records:
        if is_png:
            name = kind.decode("ascii")
            keep = kind in PNG_CORE or (keep_color and kind in PNG_COLOR)
            if kind == b"tRNS":
                residual.append("tRNS: transparency required for image interpretation")
            elif keep and kind in PNG_COLOR:
                residual.append(name + ": color interpretation retained")
            if kind == b"eXIf":
                orientation = exif_orientation(b"Exif\0\0" + payload)
            if not keep and kind in PNG_COLOR:
                warnings.append("Removed " + name + "; displayed colors may change")
        else:
            name = kind if isinstance(kind, str) else jpeg_name(kind)
            keep = not (isinstance(kind, int) and (0xE0 <= kind <= 0xEF or kind == 0xFE))
            if kind == 0xEE and payload.startswith(b"Adobe") and len(payload) >= 12:
                raw = b"\xff\xee\x00\x0e" + payload[:12]
                keep = True
                residual.append("APP14 Adobe: color transform required for image interpretation")
                if len(payload) > 12:
                    removed.append("APP14 trailing extension bytes")
            if kind == 0xE2 and payload.startswith(ICC_TAG):
                if keep_color:
                    keep = True
                    if "APP2 ICC_PROFILE: color interpretation retained" not in residual:
                        residual.append("APP2 ICC_PROFILE: color interpretation retained")
                else:
                    warnings.append("Removed APP2 ICC profile; displayed colors may change")
            if kind == 0xE1 and orientation is None:
                orientation = exif_orientation(payload)
        if keep:
            kept.append((kind, raw))
        else:
            removed.append(name)
    if orientation not in (None, 1):
        if keep_orientation:
            tiff = minimal_exif(orientation)
            if is_png:
                block = (b"eXIf", png_chunk(b"eXIf", tiff))
            else:
                body = b"Exif\0\0" + tiff
                block = (0xE1, b"\xff\xe1" + struct.pack(">H", len(body) + 2) + body)
            kept.insert(1, block)
            residual.append("Orientation " + str(orientation) + ": rebuilt as a one-tag Exif block so display rotation is unchanged")
        else:
            warnings.append("Removed orientation " + str(orientation) + "; display rotation will change")
    output = (PNG_SIGNATURE if is_png else b"") + b"".join(raw for _, raw in kept)
    _, (after, after_trailer) = parse(output)
    allowed = verify_output_records(after, is_png, keep_color)
    image_bytes = lambda rs: b"".join(raw for kind, raw, _ in rs if (kind in (b"IHDR", b"PLTE", b"tRNS", b"IDAT", b"IEND") if is_png else not (isinstance(kind, int) and (0xE0 <= kind <= 0xEF or kind == 0xFE))))
    unchanged = image_bytes(records) == image_bytes(after)
    if not unchanged or after_trailer or not allowed:
        raise ValueError("Output self-verification failed")
    report = {"format": fmt, "removed_fields": removed, "removed_trailing_bytes": trailer,
              "retained_rendering_fields": residual, "warnings": sorted(set(warnings)),
              "self_verification": {
                  "container_markers_checked": True, "all_png_chunk_crcs_checked": is_png,
                  "only_rendering_fields_remain": allowed,
                  "compressed_image_payload_unchanged": unchanged, "output_trailing_bytes": after_trailer},
              "source_sha256": hashlib.sha256(data).hexdigest(), "output_sha256": hashlib.sha256(output).hexdigest()}
    return output, report


def verify_output_records(records, is_png, keep_color):
    for kind, raw, payload in records:
        if is_png:
            if kind in PNG_CORE or (keep_color and kind in PNG_COLOR):
                continue
            if kind == b"eXIf" and len(payload) == 26 and payload[:16] == minimal_exif(1)[:16]:
                continue
            return False
        if not (isinstance(kind, int) and (0xE0 <= kind <= 0xEF or kind == 0xFE)):
            continue
        if kind == 0xEE and len(payload) == 12 and payload.startswith(b"Adobe"):
            continue
        if kind == 0xE2 and keep_color and payload.startswith(ICC_TAG):
            continue
        if kind == 0xE1 and len(payload) == 32 and payload[:22] == b"Exif\0\0" + minimal_exif(1)[:16]:
            continue
        return False
    return True


def decode_check(source_bytes, output_bytes):
    """Decode both files with Pillow when installed; never claims success without it."""
    try:
        import io
        import PIL
        from PIL import Image, ImageOps
    except ImportError:
        return {"status": "unavailable", "reason": "Pillow is not installed; container checks only"}
    try:
        with Image.open(io.BytesIO(source_bytes)) as a, Image.open(io.BytesIO(output_bytes)) as b:
            a.load()
            b.load()
            same_pixels = a.size == b.size and a.mode == b.mode and a.tobytes() == b.tobytes()
            shown_a, shown_b = ImageOps.exif_transpose(a), ImageOps.exif_transpose(b)
            result = {"tool": "Pillow " + PIL.__version__, "size": list(b.size), "mode": b.mode,
                      "decoded_pixels_identical": same_pixels,
                      "displayed_size_identical": shown_a.size == shown_b.size,
                      "color_profile_identical": a.info.get("icc_profile") == b.info.get("icc_profile"),
                      "transparency_preserved": ("A" in a.getbands() or "transparency" in a.info) == ("A" in b.getbands() or "transparency" in b.info)}
        ok = same_pixels and result["displayed_size_identical"] and result["transparency_preserved"]
        result["status"] = "verified" if ok else "failed"
        return result
    except Exception as error:  # Decoder failures must surface as failures.
        return {"status": "failed", "reason": type(error).__name__ + ": " + str(error)}


def step(implemented, executed, status, **extra):
    assert status in STEP_STATES
    return dict({"implemented": implemented, "executed": executed, "status": status}, **extra)


def detector_step(entry):
    if not entry:
        return step(False, False, "not_checked", reason="No detector result supplied; absence is not a negative result")
    before, after = entry.get("before", "not_checked"), entry.get("after", "not_checked")
    if before not in DETECTOR_STATES or after not in DETECTOR_STATES:
        raise ValueError("Detector states must be one of " + ", ".join(DETECTOR_STATES))
    if before == "matched" and after == "not_matched":
        summary, status = "This detector's payload no longer matches under the recorded settings", "verified"
    elif after == "matched":
        summary, status = "Signal still detected", "failed"
    elif before == "not_matched" and after == "not_matched":
        summary, status = "Not detected before or after; removal effect cannot be confirmed", "verified"
    elif "error" in (before, after):
        summary, status = "Detector error", "failed"
    else:
        summary, status = "Detector unavailable or not run", "unavailable" if "unavailable" in (before, after) else "not_checked"
    safe = {k: entry[k] for k in ("detector", "version", "algorithm", "payload_description", "threshold", "preprocessing") if k in entry}
    return step(True, before != "not_checked" or after != "not_checked", status,
                before=before, after=after, interpretation=summary, settings=safe,
                scope="Only the listed detector and payload; other or unknown signals unverified")


def visible_step(entry):
    if not entry:
        return step(False, False, "not_checked", reason="Visible marks not reviewed by this run")
    status = entry.get("status", "not_checked")
    if status not in VISIBLE_STATES:
        raise ValueError("Visible mark status must be one of " + ", ".join(VISIBLE_STATES))
    keep = {k: entry[k] for k in ("marks", "tool", "note", "appearance_checks") if k in entry}
    return step(status in ("executed", "verified"), status in ("executed", "verified", "failed"), status, **keep)


def build_report(source_bytes, output_bytes, strip_report, annotation, source, output):
    annotation = annotation or {}
    original = annotation.get("original_sha256")
    steps = {
        "metadata_cleanup": step(True, True, "verified" if strip_report["removed_fields"] or strip_report["removed_trailing_bytes"] else "not_needed",
                                 removed_fields=strip_report["removed_fields"], removed_trailing_bytes=strip_report["removed_trailing_bytes"],
                                 retained_rendering_fields=strip_report["retained_rendering_fields"]),
        "decode_check": None,
        "visible_marks": visible_step(annotation.get("visible_marks")),
        "invisible_watermark_check": detector_step(annotation.get("detector")),
        "invisible_watermark_removal": step(False, False, "unavailable", reason="Out of scope; this tool never alters pixels"),
        "platform_records": step(False, False, "unavailable", reason="Server-side history, reports and post labels cannot be changed by editing a file"),
        "camera_certification": step(False, False, "unavailable", reason="No camera Exif, signatures or capture history are ever added"),
        "complete_ai_label_removal": step(False, False, "not_checked", reason="Unknown pixel signals and platform history cannot be verified"),
    }
    decode = decode_check(source_bytes, output_bytes)
    status = decode.pop("status")
    steps["decode_check"] = step(status != "unavailable", status != "unavailable", status, **decode)
    output_info = inspect_bytes(output_bytes)
    return {"tool": "label_tool.py " + VERSION, "source": str(source), "output": str(output),
            "original_sha256": original, "source_sha256": strip_report["source_sha256"],
            "output_sha256": strip_report["output_sha256"], "format": strip_report["format"],
            "source_inspection": inspect_bytes(source_bytes),
            "output_inspection": {k: output_info[k] for k in ("width", "height", "color_mode", "transparency", "orientation", "has_color_profile", "provenance_indicators", "trailing_bytes")},
            "warnings": strip_report["warnings"], "self_verification": strip_report["self_verification"],
            "steps": steps,
            "pixels_vs_original": "identical to the input of this step; earlier edits are recorded under visible_marks" if original and original != strip_report["source_sha256"] else "identical (metadata-only path)",
            "ai_origin": "not changed; no photography certification"}


def read_limited(path):
    with Path(path).open("rb") as stream:
        data = stream.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError("Input exceeds the 64 MiB safety limit")
    return data


def publish(destination, payload):
    """Write atomically and never overwrite an existing path."""
    destination = Path(destination)
    if destination.is_symlink() or destination.exists():
        raise ValueError("Destination already exists; choose a new filename: " + destination.name)
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(dir=destination.parent, prefix=".label-tool-", delete=False) as stream:
            temp_path = Path(stream.name)
            stream.write(payload)
            stream.flush()
            os.fsync(stream.fileno())
        os.link(temp_path, destination)
    finally:
        if temp_path is not None:
            temp_path.unlink(missing_ok=True)


def process_bytes(data, source, destination, annotation, keep_orientation, keep_color):
    destination = Path(destination)
    output, strip_report = sanitize(data, keep_orientation, keep_color)
    valid_exts = (".png",) if strip_report["format"] == "PNG" else (".jpg", ".jpeg")
    if destination.suffix.lower() not in valid_exts:
        raise ValueError("Destination extension must match the source container format")
    report = build_report(data, output, strip_report, annotation, source, destination)
    report_path = destination.with_name(destination.name + ".verification.json")
    if report_path.exists():
        raise ValueError("Report path already exists: " + report_path.name)
    publish(destination, output)
    publish(report_path, (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    report["report_path"] = str(report_path)
    return report


def run(source, destination, annotation=None, keep_orientation=True, keep_color=True):
    source, destination = Path(source), Path(destination)
    if destination.is_symlink() or (destination.exists() and destination.resolve() == source.resolve()):
        raise ValueError("Destination must not be the source or a symbolic link")
    if destination.exists():
        raise ValueError("Destination already exists; choose a new filename")
    return process_bytes(read_limited(source), source, destination, annotation, keep_orientation, keep_color)


def safe_zip_members(archive_path):
    """Yield (name, bytes) for image members; reject traversal, links, encryption and bombs."""
    total, skipped = 0, []
    with zipfile.ZipFile(archive_path) as archive:
        infos = archive.infolist()
        if len(infos) > MAX_ZIP_ENTRIES:
            raise ValueError("ZIP has too many entries")
        members = []
        for info in infos:
            name = info.filename
            if info.is_dir():
                continue
            parts = PurePosixPath(name.replace("\\", "/")).parts
            if name.startswith(("/", "\\")) or ".." in parts or (parts and ":" in parts[0]):
                skipped.append({"entry": name, "reason": "unsafe path"})
                continue
            if stat.S_ISLNK(info.external_attr >> 16):
                skipped.append({"entry": name, "reason": "symbolic link"})
                continue
            if parts[0] == "__MACOSX" or parts[-1].startswith("."):
                skipped.append({"entry": name, "reason": "system or hidden file"})
                continue
            if info.flag_bits & 0x1:
                skipped.append({"entry": name, "reason": "encrypted entry"})
                continue
            if info.file_size > MAX_BYTES:
                skipped.append({"entry": name, "reason": "exceeds 64 MiB"})
                continue
            if total + info.file_size > MAX_TOTAL_BYTES:
                raise ValueError("ZIP exceeds the 256 MiB total extraction limit")
            with archive.open(info) as stream:
                data = stream.read(MAX_BYTES + 1)
            if len(data) > MAX_BYTES or len(data) != info.file_size:
                skipped.append({"entry": name, "reason": "declared size mismatch"})
                continue
            total += len(data)
            if total > MAX_TOTAL_BYTES:
                raise ValueError("ZIP exceeds the 256 MiB total extraction limit")
            members.append((name, data))
    return members, skipped


def unique_name(stem, suffix, used):
    candidate, index = stem + "_cleaned" + suffix, 2
    while candidate.lower() in used:
        candidate, index = stem + "_cleaned_" + str(index) + suffix, index + 1
    used.add(candidate.lower())
    return candidate


def batch(inputs, out_dir, annotations=None, make_zip=False, keep_orientation=True, keep_color=True):
    out_dir = Path(out_dir)
    if out_dir.exists() and any(out_dir.iterdir()):
        raise ValueError("Output folder must be new or empty")
    out_dir.mkdir(parents=True, exist_ok=True)
    annotations = annotations or {}
    items, used, results = [], set(), []
    for raw_input in inputs:
        path = Path(raw_input)
        try:
            if zipfile.is_zipfile(path):
                members, skipped = safe_zip_members(path)
                items += [(path.name + "!" + name, name, data) for name, data in members]
                results += [dict(s, input=path.name + "!" + s["entry"], status="skipped") for s in skipped]
            else:
                items.append((path.name, path.name, read_limited(path)))
        except (OSError, ValueError, zipfile.BadZipFile) as error:
            results.append({"input": str(path), "status": "failed", "error": str(error)})
    for label, name, data in items:
        base = PurePosixPath(name.replace("\\", "/")).name
        try:
            fmt = sniff(data)
            suffix = ".png" if fmt == "PNG" else (Path(base).suffix.lower() if Path(base).suffix.lower() in (".jpg", ".jpeg") else ".jpg")
            target = out_dir / unique_name(Path(base).stem or "image", suffix, used)
            annotation = annotations.get(label) or annotations.get(base) or annotations.get("*")
            report = process_bytes(data, label, target, annotation, keep_orientation, keep_color)
            results.append({"input": label, "status": "succeeded", "output": target.name,
                            "report": Path(report["report_path"]).name,
                            "removed_fields": report["steps"]["metadata_cleanup"]["removed_fields"],
                            "decode_check": report["steps"]["decode_check"]["status"],
                            "warnings": report["warnings"]})
        except (OSError, ValueError) as error:
            results.append({"input": label, "status": "unsupported" if str(error).startswith("Unsupported") else "failed", "error": str(error)})
    summary = {"tool": "label_tool.py " + VERSION, "output_folder": str(out_dir),
               "succeeded": sum(r["status"] == "succeeded" for r in results),
               "failed": sum(r["status"] == "failed" for r in results),
               "unsupported_or_skipped": sum(r["status"] in ("unsupported", "skipped") for r in results),
               "items": results,
               "limits": "Container metadata only. Invisible watermarks, platform records and camera certification are not handled."}
    if make_zip:
        zip_path = out_dir / "cleaned_results.zip"
        with zipfile.ZipFile(zip_path, "x", zipfile.ZIP_DEFLATED) as bundle:
            for r in results:
                if r["status"] == "succeeded":
                    bundle.write(out_dir / r["output"], r["output"])
                    bundle.write(out_dir / r["report"], r["report"])
        summary["zip"] = zip_path.name
    publish(out_dir / "summary.json", (json.dumps(summary, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    return summary


def load_annotations(path):
    if not path:
        return {}
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Annotations must be a JSON object keyed by input file name")
    return data


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    p_inspect = sub.add_parser("inspect", help="Report format, size, orientation, structure and provenance hints")
    p_inspect.add_argument("source")
    for name, help_text in (("strip", "Clean one PNG/JPEG into a new file plus .verification.json"),
                            ("batch", "Clean files and/or ZIP archives into a new folder")):
        p = sub.add_parser(name, help=help_text)
        if name == "strip":
            p.add_argument("source")
            p.add_argument("destination")
        else:
            p.add_argument("inputs", nargs="+")
            p.add_argument("--out", required=True)
            p.add_argument("--zip", action="store_true", help="Also bundle cleaned images and reports")
        p.add_argument("--annotations", help="JSON with visible_marks / detector / original_sha256 per input name")
        p.add_argument("--strip-orientation", action="store_true", help="Drop orientation instead of rebuilding it")
        p.add_argument("--strip-color", action="store_true", help="Drop ICC/gamma/sRGB color data as well")
    args = parser.parse_args(argv)
    try:
        if args.command == "inspect":
            result = inspect_bytes(read_limited(args.source))
        else:
            annotations = load_annotations(args.annotations)
            options = dict(keep_orientation=not args.strip_orientation, keep_color=not args.strip_color)
            if args.command == "strip":
                key = Path(args.source).name
                result = run(args.source, args.destination, annotations.get(key) or annotations.get("*"), **options)
            else:
                result = batch(args.inputs, args.out, annotations, args.zip, **options)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        if args.command == "batch" and result["failed"]:
            return 1
        return 0
    except (OSError, ValueError, zipfile.BadZipFile, json.JSONDecodeError) as error:
        print(json.dumps({"error": str(error), "status": "no_success_claim"}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    sys.exit(main())
