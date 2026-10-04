#!/usr/bin/env python3
"""Copy scripts/label_tool.py into the embedded block of SKILL.md."""
from pathlib import Path
import re

SKILL_DIR = Path(__file__).resolve().parents[1]
skill_path = SKILL_DIR / "SKILL.md"
code = (SKILL_DIR / "scripts" / "label_tool.py").read_text(encoding="utf-8")
pattern = re.compile(r"(<!-- BEGIN_EMBEDDED_LABEL_TOOL -->\n```python\n).*?(```\n<!-- END_EMBEDDED_LABEL_TOOL -->)", re.S)
text = skill_path.read_text(encoding="utf-8")
updated, count = pattern.subn(lambda m: m.group(1) + code + m.group(2), text)
if count != 1:
    raise SystemExit("Embedded block markers not found exactly once")
skill_path.write_text(updated, encoding="utf-8")
print("SKILL.md updated")
