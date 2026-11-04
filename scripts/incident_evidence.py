"""Optional, record-local claim/source bindings; no VAP wire-format changes.

Schema version 1 is opt-in so historical records are not assigned fabricated
source mappings. Dates are VSO verification cut-offs, not event dates. A cited
source is a reference, not cryptographic or independent confirmation of a claim.
"""
from datetime import date
import html
import re

IDENTIFIER = re.compile(r"[A-Za-z0-9][A-Za-z0-9._-]*\Z")


def _date(value, label):
    if not isinstance(value, str):
        raise ValueError(f"{label}: expected ISO date")
    try:
        parsed = date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"{label}: invalid ISO date {value!r}") from exc
    if parsed.isoformat() != value:
        raise ValueError(f"{label}: expected YYYY-MM-DD")
    return parsed


def validate_evidence_metadata(data):
    """Reject broken bindings even under python -O; never infer legacy dates."""
    cutoff = _date(data['as_of'], 'dataset as_of')
    for record in data['records']:
        rid = record['id']
        version = record.get('evidence_schema_version')
        if version is not None and (type(version) is not int or version != 1):
            raise ValueError(f'{rid}: unsupported evidence_schema_version')
        strict = version == 1
        known = set()
        for source in record['sources']:
            sid = source.get('id')
            if sid is None and not strict:
                continue
            if not isinstance(sid, str) or not IDENTIFIER.fullmatch(sid) or sid in known:
                raise ValueError(f'{rid}: invalid or duplicate source id {sid!r}')
            known.add(sid)
        for kind in ('claims', 'later'):
            for item in record.get(kind, []):
                has = 'source_refs' in item or 'claim_as_of' in item
                if not strict and not has:
                    continue
                refs = item.get('source_refs')
                if (not isinstance(refs, list) or not refs or
                        any(not isinstance(ref, str) or ref not in known for ref in refs) or
                        len(refs) != len(set(refs))):
                    raise ValueError(f'{rid}/{kind}: invalid or unknown source_refs')
                checked = _date(item.get('claim_as_of'), f'{rid}/{kind} claim_as_of')
                if checked > cutoff:
                    raise ValueError(f'{rid}/{kind}: claim_as_of exceeds dataset as_of')
                if kind == 'later' and _date(item['date'], f'{rid}/later date') > checked:
                    raise ValueError(f'{rid}/later: development occurs after verification cut-off')
                note = item.get('evidence_note')
                if note is not None and (not isinstance(note, dict) or any(
                        not isinstance(note.get(lang), str) or not note[lang].strip()
                        for lang in ('en', 'ja'))):
                    raise ValueError(f'{rid}/{kind}: evidence_note requires en and ja')


def source_id(record_id, sid):
    return f'{record_id}-source-{sid}'


def binding_html(record, item, lang):
    refs = item.get('source_refs', [])
    if not refs:
        return ''
    esc = lambda value: html.escape(str(value), quote=True)
    sources = {source.get('id'): source for source in record['sources']}
    links = ', '.join(
        f'<a href="#{esc(source_id(record["id"], ref))}">{esc(sources[ref]["label"])}</a>'
        for ref in refs)
    label, as_of = ('出典', '確認基準日') if lang == 'ja' else ('Sources', 'Claim as of')
    checked = esc(item['claim_as_of'])
    out = (f'<p class="small claim-evidence">{label}: {links}<br>{as_of}: '
           f'<time datetime="{checked}">{checked}</time></p>')
    if item.get('evidence_note'):
        out += f'<p class="small evidence-note">{esc(item["evidence_note"][lang])}</p>'
    return out


def followups_html(record, lang):
    """Show known later disclosures first without overwriting the first account."""
    later = record.get('later', [])
    if not later:
        return ''
    esc = lambda value: html.escape(str(value), quote=True)
    title = '記録済みの続報' if lang == 'ja' else 'Recorded follow-ups'
    notice = ('以下には初回の検証後に記録した続報があります。初回の要約・発生日・判定は当時の記録として保存しています。'
              '続報の存在は、現在までの網羅的な再調査や独立調査の完了を意味しません。' if lang == 'ja' else
              'Later disclosures are recorded below. The initial summary, event date and verdicts remain a historical '
              'verification snapshot. These follow-ups are not a comprehensive current-status check or evidence of a completed independent investigation.')
    rows = []
    for item in sorted(later, key=lambda item: item['date'], reverse=True):
        row = f'<li><time datetime="{esc(item["date"])}">{esc(item["date"])}</time>: {esc(item[lang])}'
        if item.get('source_refs'):
            row += binding_html(record, item, lang)
        elif item.get('url'):
            label = '出典' if lang == 'ja' else 'Source'
            row += f' (<a href="{esc(item["url"])}">{label}</a>)'
        rows.append(row + '</li>')
    return (f'<section class="box follow-ups" aria-label="{title}"><h3>{title}</h3>'
            f'<p class="small">{notice}</p><ul class="src">{"".join(rows)}</ul></section>')
