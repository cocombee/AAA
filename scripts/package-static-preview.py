"""Package an audited export while preserving UTC file times for HTTP validation."""
import argparse
from pathlib import Path
import struct
import time
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument("export_directory", type=Path)
parser.add_argument("archive", type=Path)
parser.add_argument("--mount", default="v2", choices=["v2", "vw"])
args = parser.parse_args()
if not (args.export_directory / "index.html").is_file():
    parser.error("Export index.html is missing")
with zipfile.ZipFile(args.archive, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for source in sorted(args.export_directory.rglob("*")):
        if not source.is_file():
            continue
        epoch = int(source.stat().st_mtime)
        entry = zipfile.ZipInfo(f"{args.mount}/{source.relative_to(args.export_directory).as_posix()}", time.gmtime(epoch)[:6])
        entry.external_attr = 0o100644 << 16
        entry.compress_type = zipfile.ZIP_DEFLATED
        # Standard UTC timestamp extension prevents server timezone changes and
        # default 1980 dates from making newly deployed HTML appear older.
        entry.extra = struct.pack("<HHBI", 0x5455, 5, 1, epoch)
        archive.writestr(entry, source.read_bytes())
print(args.archive)
