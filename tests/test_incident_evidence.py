"""Regression checks for source bindings, historical snapshots and DVP claims."""
import copy
import hashlib
import html
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_incidents import record_html, validate_incidents
from incident_evidence import binding_html, followups_html, validate_evidence_metadata


def data_fixture():
    return {'as_of': '2026-11-04', 'records': [{
        'id': 'RTEST', 'evidence_schema_version': 1,
        'sources': [{'id': 's1', 'label': 'Primary <source>', 'url': 'https://example.invalid/source', 'kind': 'primary'}],
        'claims': [{'claim': {'en': 'Claim', 'ja': '主張'}, 'verdict': 'CONFIRMED',
                    'source_refs': ['s1'], 'claim_as_of': '2026-08-16'}],
        'later': [{'date': '2026-09-09', 'en': 'Later <finding>', 'ja': '続報',
                   'source_refs': ['s1'], 'claim_as_of': '2026-11-04'}],
    }]}


class EvidenceMetadataTests(unittest.TestCase):
    def setUp(self):
        self.data = data_fixture()
        self.record = self.data['records'][0]
        self.claim = self.record['claims'][0]

    def test_valid_bindings(self):
        validate_evidence_metadata(self.data)

    def test_unknown_reference_rejected(self):
        self.claim['source_refs'] = ['missing']
        with self.assertRaisesRegex(ValueError, 'source_refs'):
            validate_evidence_metadata(self.data)

    def test_duplicate_reference_rejected(self):
        self.claim['source_refs'] = ['s1', 's1']
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_duplicate_source_id_rejected(self):
        self.record['sources'] *= 2
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_unsafe_source_id_rejected(self):
        self.record['sources'][0]['id'] = '<script>'
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_strict_source_id_required(self):
        del self.record['sources'][0]['id']
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_invalid_dates_rejected(self):
        for value in ('2026-02-30', '20261104', '', None, 20261104):
            with self.subTest(value=value):
                self.claim['claim_as_of'] = value
                with self.assertRaises(ValueError):
                    validate_evidence_metadata(self.data)

    def test_future_cutoff_rejected(self):
        self.claim['claim_as_of'] = '2026-11-05'
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_followup_before_verification_required(self):
        self.record['later'][0]['claim_as_of'] = '2026-09-08'
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_unknown_schema_rejected(self):
        for value in (True, 2, '1'):
            with self.subTest(value=value):
                self.record['evidence_schema_version'] = value
                with self.assertRaises(ValueError):
                    validate_evidence_metadata(self.data)

    def test_metadata_pair_required(self):
        del self.claim['claim_as_of']
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_unversioned_partial_metadata_rejected(self):
        del self.record['evidence_schema_version']
        del self.claim['source_refs']
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_legacy_not_rewritten_or_inferred(self):
        del self.record['evidence_schema_version']
        for item in self.record['claims'] + self.record['later']:
            del item['source_refs']; del item['claim_as_of']
        old = copy.deepcopy(self.data)
        validate_evidence_metadata(self.data)
        self.assertEqual(old, self.data)
        self.assertEqual(binding_html(self.record, self.claim, 'en'), '')

    def test_bilingual_note_required(self):
        self.claim['evidence_note'] = {'en': 'Only English'}
        with self.assertRaises(ValueError):
            validate_evidence_metadata(self.data)

    def test_metadata_and_followups_escape_html(self):
        out = binding_html(self.record, self.claim, 'en') + followups_html(self.record, 'en')
        self.assertIn('&lt;source&gt;', out)
        self.assertIn('&lt;finding&gt;', out)
        self.assertNotIn('<source>', out)
        self.assertIn('#RTEST-source-s1', out)

    def test_empty_followups(self):
        self.record['later'] = []
        self.assertEqual(followups_html(self.record, 'ja'), '')

    def test_followups_sort_without_mutation(self):
        item = dict(self.record['later'][0], date='2026-10-01', en='Newest')
        self.record['later'].append(item)
        original = copy.deepcopy(self.record)
        out = followups_html(self.record, 'en')
        self.assertLess(out.index('Newest'), out.index('Later &lt;finding&gt;'))
        self.assertEqual(original, self.record)


class PublishedRecordTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'incidents/incidents.json').read_text())
        cls.record = next(r for r in cls.data['records'] if r['id'] == 'R18')

    def test_all_records_validate(self):
        validate_incidents(self.data)

    def test_initial_snapshot_unchanged(self):
        record = self.record
        snapshot = {k: record[k] for k in ('title', 'event_date', 'verified', 'summary')}
        snapshot['claims'] = [{'claim': c['claim'], 'verdict': c['verdict']} for c in record['claims']]
        digest = hashlib.sha256(json.dumps(snapshot, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
        self.assertEqual(digest, '2f2aea0a1c044ce13e6a5c105a664438343e456bf3d9af5f007aa6ca88d7cdf5')

    def test_followups_precede_initial_summary_in_both_languages(self):
        for lang in ('en', 'ja'):
            out = record_html(lang, self.record)
            self.assertLess(out.index('class="box follow-ups"'), out.index('<p>' + html.escape(self.record['summary'][lang], quote=True) + '</p>'))
            self.assertEqual(out.count('class="box follow-ups"'), 1)
            self.assertIn(f'id="R18-source-anthropic-sep09"', out)

    def test_corrected_source_path(self):
        out = record_html('en', self.record)
        self.assertIn('/research/alignment-assessment-cybersecurity-incidents', out)
        self.assertNotIn('/news/alignment-assessment-cybersecurity-incidents', out)

    def test_historical_nonpublication_is_not_current_status(self):
        note = self.record['claims'][2]['evidence_note']
        self.assertIn('not a current claim', note['en'])
        self.assertEqual(self.record['claims'][2]['claim_as_of'], '2026-08-16')

    def test_dvp_all_locales_remain_planned_and_scoped(self):
        forbidden = ('Every Decision, Cryptographically Recorded', 'complete causal chain',
                     'すべての判断を、暗号学的に記録する', '完全な因果連鎖', '完整因果链',
                     '>Required</span>', '>必須</span>', '>必需</span>',
                     '>Complete Record</span>', '>完全な記録</span>', '>完整记录</span>')
        for path in ('vap/dvp/index.html', 'vap/dvp/ja/index.html', 'vap/dvp/zh/index.html'):
            text = (ROOT / path).read_text()
            with self.subTest(path=path):
                self.assertIn('PLANNED', text)
                self.assertIn('id="dvp-scope-limits"', text)
                for phrase in forbidden:
                    self.assertNotIn(phrase, text)


if __name__ == '__main__':
    unittest.main()
