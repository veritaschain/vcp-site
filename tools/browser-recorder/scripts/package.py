"""Build a deterministic source ZIP; keep browser profiles/dependencies out."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ROOT_FILES = (
    '.gitignore', 'README.md', 'README-ja.md', 'CHANGELOG.md', 'NOTICE.md',
    'package.json', 'package-lock.json', 'verify.mjs',
)
SOURCE_DIRS = ('extension', 'docs', 'examples', 'tests', 'scripts')
EXCLUDED_PARTS = {'__pycache__', 'node_modules', 'browser-evidence'}


def source_paths():
    paths = [ROOT / name for name in ROOT_FILES]
    for directory in SOURCE_DIRS:
        paths.extend(path for path in (ROOT / directory).rglob('*')
                     if path.is_file() and not (EXCLUDED_PARTS & set(path.parts))
                     and path.suffix != '.pyc')
    if any(path.is_symlink() for path in paths):
        raise ValueError('Source symlinks are not part of this archive')
    return sorted(paths, key=lambda path: path.relative_to(ROOT).as_posix())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--refresh-checksums', action='store_true')
    args = parser.parse_args()
    output = args.output.resolve()
    if output.is_relative_to(ROOT):
        parser.error('Keep the output archive outside the source directory')
    paths = source_paths()
    sums = ''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  '
                   f'{path.relative_to(ROOT).as_posix()}\n' for path in paths)
    manifest = ROOT / 'SHA256SUMS'
    if args.refresh_checksums:
        manifest.write_text(sums, encoding='utf-8', newline='\n')
    elif manifest.read_text(encoding='utf-8') != sums:
        parser.error('SHA256SUMS is stale; review changes before --refresh-checksums')
    paths.append(manifest)
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_STORED) as archive:
        for path in sorted(paths, key=lambda path: path.relative_to(ROOT).as_posix()):
            name = 'vap-chrome-recorder/' + path.relative_to(ROOT).as_posix()
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_STORED
            archive.writestr(info, path.read_bytes())
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    print(json.dumps({'archive': str(output), 'sha256': digest,
                      'bytes': output.stat().st_size, 'files': len(paths)}))


if __name__ == '__main__':
    main()
