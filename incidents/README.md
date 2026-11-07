# Incident record source bindings

`incidents.json` is the source for the generated English and Japanese incident
pages. Edit the JSON, add a dated correction when changing an existing account,
then run `python3 scripts/build_incidents.py`. CI uses `--check` to detect stale
output without overwriting it.

## Historical snapshots and follow-ups

A record's title, event date, summary, verification date and claim verdicts describe
its initial verification scope. Later disclosures belong in `later`; they do not
silently replace that historical account or become a new incident by default.
The renderer shows all recorded follow-ups before the initial summary, newest
first. A follow-up is not a comprehensive current-status review or evidence that
an independent investigation has finished.

## Optional record-local metadata (version 1)

Set `evidence_schema_version` to integer `1` on a migrated record. Each source then
needs a unique record-local `id`. Every `claims` and `later` entry needs a nonempty
`source_refs` array of those IDs and an ISO `claim_as_of` date (`YYYY-MM-DD`).
The verification cut-off cannot exceed the dataset's `as_of`; a follow-up's dated
development cannot occur after its verification cut-off. The dataset date is a
last-edit date, not a declaration that every record was rechecked that day.

A bilingual `evidence_note` may clarify attribution or evidentiary limits.
A source reference means that a reader can inspect the cited material; it is not
proof that the claim is true, independently confirmed or cryptographically sealed.
For a historical non-publication check, cite the publication commitment and explain
that the source does not itself prove later absence. Do not infer absence of logs
from their non-publication or infer model safety from an environment explanation.

Existing unversioned records remain valid. Their source mappings and verification
dates must not be fabricated in bulk. Partial metadata, unknown/duplicate source
IDs, duplicate references and malformed dates are rejected even with `python -O`.
This is a site-internal schema, not a change to VAP or any normative requirement.

```sh
python3 -m unittest discover -s tests -p 'test_incident_evidence.py' -v
python3 -O -m unittest discover -s tests -p 'test_incident_evidence.py' -v
python3 scripts/build_incidents.py --check
```

## Pending source review

- [Claude Code approval-file report — primary article unavailable, 8 November 2026](reviews/2026-11-08-claude-code-secrets.md). This review note is not a verified incident record and does not change historical exclusion counters.
