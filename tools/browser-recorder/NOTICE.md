# Attribution and changes

`extension/lib/canonical.mjs` is adapted from the canonicalization and strict
parser portions of `interop/vap-evidence-pack-demo/verify_node.mjs`, maintained
by VeritasChain Standards Organization (VSO), at commit
`a2a9f6a25906db4be23e6ecd3796eab144d9ac99`.

Source: https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/interop/vap-evidence-pack-demo/verify_node.mjs

License: Creative Commons Attribution 4.0 International
https://creativecommons.org/licenses/by/4.0/legalcode

Changes: Node Buffer operations replaced with TextEncoder, printable-ASCII
restriction replaced with well-formed Unicode, 4 MiB input limit, different
application contract. The rest of the prototype is newly authored for this
task. This development prototype has not been independently audited or
approved by a standards body. No certification or provider endorsement is implied.
