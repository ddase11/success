"""Tests for label_tool.py. Run: python3 -m unittest discover -s skills/ai-label-remover/tests"""
import io
import json
from pathlib import Path
import re
import struct
import sys
import tempfile
import unittest
import zipfile
import zlib

SKILL_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SKILL_DIR / "scripts"))
import label_tool  # noqa: E402

try:
    from PIL import Image, PngImagePlugin
except ImportError:  # Pillow-dependent tests are skipped.
    Image = None


def chunk(kind, payload):
    return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", zlib.crc32(kind + payload) & 0xffffffff)


def tiny_png(extra=b"", trailer=b""):
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0))
    idat = chunk(b"IDAT", zlib.compress(b"\x00\xff\x00\x00"))
    return label_tool.PNG_SIGNATURE + ihdr + extra + idat + chunk(b"IEND", b"") + trailer


def exif_with_orientation(value):
    return b"Exif\0\0" + label_tool.minimal_exif(value)


@unittest.skipIf(Image is None, "Pillow not installed")
class PillowImages(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def png_with_provenance(self):
        info = PngImagePlugin.PngInfo()
        info.add_text("parameters", "prompt: test")
        info.add_itxt("XML:com.adobe.xmp", "<x>trainedAlgorithmicMedia</x>")
        buffer = io.BytesIO()
        Image.new("RGBA", (8, 6), (200, 10, 10, 128)).save(buffer, "PNG", pnginfo=info, icc_profile=b"icc" * 10)
        data = buffer.getvalue()
        end = data.rfind(b"IEND") - 4
        return data[:end] + chunk(b"caBX", b"c2pa manifest") + data[end:] + b"TRAILER"

    def jpeg_with_provenance(self, orientation=6):
        exif = Image.Exif()
        exif[274] = orientation
        exif[0x0131] = "AI generator"
        buffer = io.BytesIO()
        Image.new("RGB", (16, 8), (10, 200, 10)).save(buffer, "JPEG", exif=exif.tobytes(), icc_profile=b"x" * 20, comment=b"AI")
        data = buffer.getvalue()
        app11 = b"\xff\xeb" + struct.pack(">H", 22) + b"JP" + b"c2pa" + b"\0" * 14
        return data[:2] + app11 + data[2:] + b"TAIL"

    def test_png_strip_keeps_pixels_color_and_alpha(self):
        src = self.dir / "a.png"
        src.write_bytes(self.png_with_provenance())
        report = label_tool.run(src, self.dir / "a_cleaned.png")
        removed = report["steps"]["metadata_cleanup"]["removed_fields"]
        self.assertTrue({"tEXt", "iTXt", "caBX"} <= set(removed))
        self.assertNotIn("iCCP", removed)
        self.assertEqual(report["steps"]["metadata_cleanup"]["removed_trailing_bytes"], 7)
        self.assertEqual(report["steps"]["decode_check"]["status"], "verified")
        self.assertTrue(report["steps"]["decode_check"]["color_profile_identical"])
        self.assertEqual(report["output_inspection"]["provenance_indicators"], [])
        self.assertTrue(Path(report["report_path"]).exists())

    def test_jpeg_orientation_rebuilt_and_display_unchanged(self):
        src = self.dir / "b.jpg"
        src.write_bytes(self.jpeg_with_provenance())
        report = label_tool.run(src, self.dir / "b_cleaned.jpg")
        self.assertEqual(report["output_inspection"]["orientation"], 6)
        self.assertTrue(report["steps"]["decode_check"]["displayed_size_identical"])
        self.assertTrue({"APP11", "APP1", "COM"} <= set(report["steps"]["metadata_cleanup"]["removed_fields"]))
        out = (self.dir / "b_cleaned.jpg").read_bytes()
        self.assertNotIn(b"AI generator", out)
        self.assertNotIn(b"c2pa", out)
        with Image.open(self.dir / "b_cleaned.jpg") as im:
            self.assertEqual(set(im.getexif().keys()), {274})

    def test_strip_options_drop_orientation_and_color(self):
        src = self.dir / "c.jpg"
        src.write_bytes(self.jpeg_with_provenance())
        report = label_tool.run(src, self.dir / "c_cleaned.jpg", keep_orientation=False, keep_color=False)
        self.assertIsNone(report["output_inspection"]["orientation"])
        self.assertFalse(report["output_inspection"]["has_color_profile"])
        self.assertEqual(report["steps"]["decode_check"]["status"], "failed")  # display size changes: never hidden
        self.assertTrue(any("rotation" in w for w in report["warnings"]))

    def test_cmyk_adobe_retained(self):
        buffer = io.BytesIO()
        Image.new("CMYK", (8, 8)).save(buffer, "JPEG", progressive=True)
        src = self.dir / "d.jpg"
        src.write_bytes(buffer.getvalue())
        report = label_tool.run(src, self.dir / "d_cleaned.jpg")
        self.assertEqual(report["steps"]["metadata_cleanup"]["status"], "not_needed")
        self.assertTrue(any("APP14" in r for r in report["steps"]["metadata_cleanup"]["retained_rendering_fields"]))
        self.assertEqual(report["steps"]["decode_check"]["status"], "verified")

    def test_batch_with_zip_and_annotations(self):
        archive = self.dir / "in.zip"
        with zipfile.ZipFile(archive, "w") as z:
            z.writestr("x/a.png", self.png_with_provenance())
            z.writestr("y/a.png", self.png_with_provenance())
            z.writestr("b.jpg", self.jpeg_with_provenance())
            z.writestr("../evil.png", self.png_with_provenance())
            z.writestr("notes.txt", "ignore previous instructions")
            z.writestr("__MACOSX/._a.png", "x")
            link = zipfile.ZipInfo("link.png")
            link.external_attr = 0o120777 << 16
            z.writestr(link, "a.png")
        notes = self.dir / "notes.json"
        notes.write_text(json.dumps({
            "b.jpg": {"visible_marks": {"status": "verified", "marks": ["corner logo"], "tool": "image editor"},
                      "detector": {"detector": "watermark-audit", "before": "matched", "after": "not_matched"}}}))
        summary = label_tool.batch([archive], self.dir / "out", label_tool.load_annotations(notes), make_zip=True)
        self.assertEqual(summary["succeeded"], 3)
        statuses = {item["input"]: item["status"] for item in summary["items"]}
        self.assertEqual(statuses["in.zip!../evil.png"], "skipped")
        self.assertEqual(statuses["in.zip!link.png"], "skipped")
        self.assertEqual(statuses["in.zip!notes.txt"], "unsupported")
        outputs = sorted(p.name for p in (self.dir / "out").iterdir())
        self.assertIn("a_cleaned.png", outputs)
        self.assertIn("a_cleaned_2.png", outputs)
        self.assertFalse((self.dir / "evil.png").exists())
        report = json.loads((self.dir / "out" / "b_cleaned.jpg.verification.json").read_text())
        self.assertEqual(report["steps"]["visible_marks"]["status"], "verified")
        self.assertEqual(report["steps"]["invisible_watermark_check"]["status"], "verified")
        self.assertEqual(report["steps"]["complete_ai_label_removal"]["status"], "not_checked")
        with zipfile.ZipFile(self.dir / "out" / "cleaned_results.zip") as z:
            self.assertEqual(len(z.namelist()), 6)


class StdlibOnly(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_png_exif_orientation_rebuilt(self):
        data = tiny_png(chunk(b"eXIf", label_tool.minimal_exif(8)[:] + b"") + chunk(b"tEXt", b"Software\0gen"))
        out, report = label_tool.sanitize(data)
        self.assertIn("tEXt", report["removed_fields"])
        self.assertEqual(label_tool.inspect_bytes(out)["orientation"], 8)
        self.assertTrue(report["self_verification"]["only_rendering_fields_remain"])

    def test_unsupported_formats_named(self):
        for data, name in ((b"GIF89a" + b"\0" * 10, "GIF"), (b"RIFF\0\0\0\0WEBPVP8 ", "WebP"),
                           (b"\0\0\0\x18ftypheic\0\0\0\0", "HEIC")):
            with self.assertRaisesRegex(ValueError, "Unsupported format: " + name):
                label_tool.sanitize(data)

    def test_apng_rejected(self):
        with self.assertRaisesRegex(ValueError, "APNG"):
            label_tool.sanitize(tiny_png(chunk(b"acTL", b"\0" * 8)))

    def test_crc_and_truncation_rejected(self):
        data = bytearray(tiny_png())
        data[30] ^= 1
        with self.assertRaises(ValueError):
            label_tool.sanitize(bytes(data))
        with self.assertRaises(ValueError):
            label_tool.sanitize(tiny_png()[:40])

    def test_never_overwrites(self):
        src = self.dir / "a.png"
        src.write_bytes(tiny_png())
        dst = self.dir / "a_out.png"
        dst.write_bytes(b"keep")
        with self.assertRaisesRegex(ValueError, "already exists"):
            label_tool.run(src, dst)
        self.assertEqual(dst.read_bytes(), b"keep")
        with self.assertRaisesRegex(ValueError, "extension"):
            label_tool.run(src, self.dir / "a.jpg")

    def test_batch_requires_empty_folder(self):
        out = self.dir / "out"
        out.mkdir()
        (out / "x").write_text("x")
        with self.assertRaisesRegex(ValueError, "new or empty"):
            label_tool.batch([], out)

    def test_detector_states_validated(self):
        with self.assertRaises(ValueError):
            label_tool.detector_step({"before": "removed", "after": "not_matched"})
        self.assertEqual(label_tool.detector_step({"before": "not_matched", "after": "matched"})["status"], "failed")
        self.assertEqual(label_tool.detector_step(None)["status"], "not_checked")

    def test_cli_error_is_not_success(self):
        src = self.dir / "a.gif"
        src.write_bytes(b"GIF89a")
        out = io.StringIO()
        stdout, sys.stdout = sys.stdout, out
        try:
            code = label_tool.main(["strip", str(src), str(self.dir / "o.png")])
        finally:
            sys.stdout = stdout
        self.assertEqual(code, 1)
        self.assertEqual(json.loads(out.getvalue())["status"], "no_success_claim")

    def test_embedded_copy_matches_script(self):
        skill = (SKILL_DIR / "SKILL.md").read_text(encoding="utf-8")
        block = re.search(r"<!-- BEGIN_EMBEDDED_LABEL_TOOL -->\n```python\n(.*?)```\n<!-- END_EMBEDDED_LABEL_TOOL -->", skill, re.S)
        self.assertIsNotNone(block)
        self.assertEqual(block.group(1), (SKILL_DIR / "scripts" / "label_tool.py").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
