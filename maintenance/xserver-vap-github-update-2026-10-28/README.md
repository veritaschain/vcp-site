# Integrated VAP website update — 28 October 2026

This reviewed deployment patch supersedes the earlier VAP-LAP-only patch. It applies to the public 27 October Explorer state retrieved on 28 October, not the earlier 26 October baseline. It retains the complete 159-test Explorer notice and integrates VAP-LAP discovery, current Draft 3 errata/hash references, and first-party SDK boundary-test reporting.

The manifest records exact before/after SHA-256 hashes for 15 files. It is a prepared artifact, not proof of server publication. Check every current file against `before_sha256` before applying; stop on any mismatch. Back up the complete site outside the web root, retain a local archive, publish only listed files, then compare the served bytes with `after_sha256` and check desktop/mobile display. Never apply the older patch over the new Explorer state.

Validation: 26 generated pages match their source; 18 unrelated pages and 40 total public files remain byte-identical, including the fixed ZIP and archived deployment copies. Historical code examples, quoted passages and the complete Explorer notice remain unchanged. Only eight sitemap dates change. The generated llms.txt matches the reviewed text.

Experimental extensions remain unadopted; independent reproduction has not been established. SDK results (306 Python / 140 TypeScript per matrix job) are first-party CI results, not independent reproduction. Current normative requirements, existing implementations, signed data, fixed distributions and K3 are unchanged.
