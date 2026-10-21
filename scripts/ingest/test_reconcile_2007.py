import importlib.util,json,copy,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('audit',Path(__file__).with_name('reconcile-2007.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class AuditTests(unittest.TestCase):
 def setUp(self):self.data=json.loads(Path('data/processed/assembly-2007-pages.json').read_text());self.data['documents']=[d for d in self.data['documents'] if d['ac']==1]
 def result(self):return m.reconcile_documents(self.data)[0]
 def test_clean(self):self.assertEqual(self.result()['status'],'machine-reconciled')
 def test_changed_final_cell_withheld(self):
  self.data['documents'][0]['pages'][0]['tables'][0][-1][2]='99999';self.assertEqual(self.result()['status'],'withheld')
 def test_missing_postal_withheld(self):
  self.data['documents'][0]['pages'][0]['tables'][0].pop(-2);self.assertTrue(any(p['type']=='missing-footer' for p in self.result()['problems']))
 def test_station_mutation_withheld(self):
  self.data['documents'][0]['pages'][0]['tables'][0][2][2]='999';self.assertTrue(any(p['type']=='station-candidate-accounting' for p in self.result()['problems']))
 def test_blank_candidate_not_zero(self):
  self.data['documents'][0]['pages'][0]['tables'][0][-2][2]='';self.assertEqual(self.result()['status'],'withheld');self.assertIsNone(self.result()['footers']['postal']['candidateVotes'][0])
 def test_explicit_carry_forward_not_a_station(self):
  table=self.data['documents'][0]['pages'][0]['tables'][0];carry=copy.deepcopy(table[2]);carry[0]='';carry[1]='B/F';table.insert(2,carry);self.assertEqual(self.result()['status'],'machine-reconciled');self.assertEqual(self.result()['stationRows'],28)
 def test_changed_repeated_header_withheld(self):
  page=copy.deepcopy(self.data['documents'][0]['pages'][0]);page['page']=2;page['tables']=[page['tables'][0][:2]];page['tables'][0][1][2]='Someone Else (INC)';self.data['documents'][0]['pages'].append(page);self.assertTrue(any(p['type']=='header-variation' for p in self.result()['problems']))
class ReviewedHeaderTests(unittest.TestCase):
 def setUp(self):
  self.data=json.loads(Path('data/processed/assembly-2007-pages.json').read_text());self.reviews=json.loads(Path('data/research/assembly-2007-header-reviews.json').read_text())
 def test_five_numerical_recoveries_from_six_header_maps(self):
  results=m.reconcile_documents(self.data,self.reviews);self.assertEqual(sum(r['status']=='machine-reconciled' for r in results),54);self.assertEqual([r['ac'] for r in results if r['status']=='withheld'],[9,11,20,42,57,59]);self.assertEqual([r['ac'] for r in results if r['headerReview']],[7,9,10,34,51,52])
 def test_changed_source_hash_rejected(self):
  next(s for s in self.data['sources'] if s.get('ac')==7 and s['role']=='indexed-form20')['sha256']='0'*64
  with self.assertRaises(ValueError):m.reconcile_documents(self.data,self.reviews)
 def test_changed_reviewed_header_rejected(self):
  next(d for d in self.data['documents'] if d['ac']==7)['pages'][0]['tables'][0][1][2]='Another Candidate (INC)'
  with self.assertRaises(ValueError):m.reconcile_documents(self.data,self.reviews)
 def test_canonical_label_must_be_source_literal(self):
  self.reviews['records'][0]['canonicalHeader']['labels'][0]='Invented label (INC)'
  with self.assertRaises(ValueError):m.reconcile_documents(self.data,self.reviews)
 def test_unreviewed_extra_header_rejected(self):
  doc=next(d for d in self.data['documents'] if d['ac']==7);page=copy.deepcopy(doc['pages'][0]);page['page']=3;page['tables']=[page['tables'][0][:2]];doc['pages'].append(page)
  with self.assertRaises(ValueError):m.reconcile_documents(self.data,self.reviews)
 def test_review_does_not_mask_vote_corruption(self):
  doc=next(d for d in self.data['documents'] if d['ac']==7);doc['pages'][1]['tables'][0][-1][2]='999999';r=next(r for r in m.reconcile_documents(self.data,self.reviews) if r['ac']==7);self.assertEqual(r['status'],'withheld');self.assertTrue(any(p['type']=='footer-candidate-accounting' for p in r['problems']))
 def test_clipped_literal_not_completed_by_guess(self):
  r=next(r for r in m.reconcile_documents(self.data,self.reviews) if r['ac']==10);self.assertEqual(r['candidateHeaders'][2],'Radhakanta Ningthoukhongjam Singh(NCP');self.assertEqual(r['footers']['final']['candidateVotes'][2],255)
 def test_actual_blank_postal_cell_stays_missing(self):
  r=next(r for r in m.reconcile_documents(self.data,self.reviews) if r['ac']==9);self.assertEqual(r['status'],'withheld');self.assertIsNone(r['footers']['postal']['candidateVotes'][-1]);self.assertEqual(r['footers']['postal']['rawCells'][6],'')
if __name__=='__main__':unittest.main()
