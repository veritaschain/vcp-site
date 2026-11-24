import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))

import build_ietf_activity as b  # noqa: E402


class IetfActivityRecordTest(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(b.SRC.read_text(encoding='utf-8'))

    def test_data_is_valid_and_pages_are_current(self):
        b.validate(self.data)
        for lang in ('en', 'ja'):
            b.write(b.T[lang]['url'], b.page(lang, self.data), check=True)

    def test_every_record_is_from_the_scope_sender_and_in_date_order(self):
        dates = [r['date_utc'] for r in self.data['records']]
        self.assertEqual(dates, sorted(dates))
        self.assertEqual(self.data['scope']['sender'], 'kamimura@veritaschain.org')
        self.assertEqual(self.data['scope']['list'], 'scitt@ietf.org')

    def test_threads_started_by_the_author_need_a_disposition(self):
        data = copy.deepcopy(self.data)
        started = next(r for r in data['records'] if r['context'] == 'started-by-author')
        del started['disposition']
        with self.assertRaises(SystemExit):
            b.validate(data)

    def test_unknown_or_unused_notes_fail(self):
        data = copy.deepcopy(self.data)
        data['records'][0]['notes'].append('no-such-note')
        with self.assertRaises(SystemExit):
            b.validate(data)
        data = copy.deepcopy(self.data)
        data['notes']['unused-note'] = {'en': 'x', 'ja': 'x', 'links': []}
        with self.assertRaises(SystemExit):
            b.validate(data)

    def test_url_must_match_archive_id(self):
        data = copy.deepcopy(self.data)
        data['records'][0]['url'] = 'https://mailarchive.ietf.org/arch/msg/scitt/other/'
        with self.assertRaises(SystemExit):
            b.validate(data)

    def test_pages_carry_the_standing_statements(self):
        en = b.page('en', self.data)
        self.assertIn('none has IETF standing', en)
        self.assertIn('Replies from other participants are not endorsement', en)
        self.assertIn('no Evidence Pack has been accepted in any proceeding', en)
        ja = b.page('ja', self.data)
        self.assertIn('賛同を意味しません', ja)


if __name__ == '__main__':
    unittest.main()
