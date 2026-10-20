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
if __name__=='__main__':unittest.main()
