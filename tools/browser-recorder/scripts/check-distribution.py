"""Check source/archive identity, retained history and all three release links."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import zipfile

from package import ROOT, source_paths

VERSION = '0.1.2'
HISTORICAL = {
    '0.1.0': 'd17496cf9b096da85546a1e343e791138a1c807f1a37c518b28c140e424ffcf4',
    '0.1.1': '3a3e4a9fdd91b990b0361fa30234eec724a7a2e557fd2cb2bd2cedcbb13dbbb3',
}
REPOSITORY = ROOT.parents[1]
ANNOUNCEMENT = REPOSITORY / 'vso/announcements/2026-10-31-vap-browser-recorder-preview'
DOWNLOADS = ANNOUNCEMENT / 'downloads'
PUBLIC = 'https://veritaschain.org/vso/announcements/2026-10-31-vap-browser-recorder-preview/downloads/'
PREFIX = 'vap-chrome-recorder/'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ReleaseLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.sections = 0
        self.links = []

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if tag == 'section':
            if self.depth:
                self.depth += 1
            elif values.get('data-recorder-version') == VERSION:
                self.depth = 1
                self.sections += 1
        if tag == 'a' and self.depth:
            self.links.append(values)

    def handle_endtag(self, tag):
        if tag == 'section' and self.depth:
            self.depth -= 1


def main():
    for version, expected in HISTORICAL.items():
        path = DOWNLOADS / f'VAP_Browser_Recorder_v{version}.zip'
        require(digest(path) == expected, f'Historical archive changed: {version}')

    name = f'VAP_Browser_Recorder_v{VERSION}.zip'
    archive_path = DOWNLOADS / name
    current_digest = digest(archive_path)
    require((DOWNLOADS / (name + '.sha256')).read_text() == f'{current_digest}  {name}\n',
            'Current archive checksum sidecar does not match')
    paths = source_paths() + [ROOT / 'SHA256SUMS']
    expected = {PREFIX + path.relative_to(ROOT).as_posix(): path for path in paths}
    with zipfile.ZipFile(archive_path) as archive:
        require(archive.testzip() is None, 'Current archive has a CRC error')
        require(len(archive.namelist()) == len(set(archive.namelist())), 'Duplicate archive member')
        require(set(archive.namelist()) == set(expected), 'Current archive/source file lists differ')
        for member, source in expected.items():
            require(archive.read(member) == source.read_bytes(), f'Current archive/source mismatch: {member}')
        for metadata in ['extension/manifest.json', 'package.json', 'package-lock.json']:
            value = json.loads(archive.read(PREFIX + metadata))
            require(value['version'] == VERSION, f'Wrong version in {metadata}')
            if metadata == 'package-lock.json':
                require(value['packages']['']['version'] == VERSION, 'Wrong lockfile root package version')

    # The capture repair and app version must not silently change the existing
    # signed byte contract, keys/storage implementation or fixed signed examples.
    preserved = [
        'extension/lib/canonical.mjs', 'extension/lib/core.mjs', 'extension/lib/store.mjs',
        'extension/popup.mjs', 'extension/vault.mjs', 'verify.mjs', 'docs/FORMAT.md',
        'examples/synthetic-pack.json', 'examples/synthetic-checkpoint.json',
    ]
    with zipfile.ZipFile(DOWNLOADS / 'VAP_Browser_Recorder_v0.1.1.zip') as historical:
        for relative in preserved:
            require((ROOT / relative).read_bytes() == historical.read(PREFIX + relative),
                    f'Fixed observation implementation/sample changed: {relative}')
        old_manifest = json.loads(historical.read(PREFIX + 'extension/manifest.json'))
        new_manifest = json.loads((ROOT / 'extension/manifest.json').read_text())
        new_manifest['version'] = old_manifest['version']
        require(new_manifest == old_manifest, 'Extension permissions or manifest behavior changed')

    for relative in ['index.html', 'ja/index.html', 'zh/index.html']:
        parser = ReleaseLinks()
        parser.feed((ANNOUNCEMENT / relative).read_text())
        require(parser.sections == 1 and parser.depth == 0, f'Expected one complete current section: {relative}')
        for filename in [name, name + '.sha256']:
            links = [link for link in parser.links if link.get('href') == PUBLIC + filename]
            require(len(links) == 1, f'Expected one current {filename} link: {relative}')
            if filename == name:
                require('download' in links[0], f'Missing download attribute: {relative}')
        require(not any('VAP_Browser_Recorder_v0.1.' in link.get('href', '') and
                        link['href'].rsplit('/', 1)[-1] not in [name, name + '.sha256']
                        for link in parser.links), f'Historical download mixed into current section: {relative}')
    print(json.dumps({'version': VERSION, 'sha256': current_digest,
                      'source_archive_files': len(expected), 'historical_archives': len(HISTORICAL),
                      'preserved_contract_files': len(preserved), 'announcement_locales': 3}))


if __name__ == '__main__':
    main()
