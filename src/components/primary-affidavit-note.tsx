import {DisclosureFieldReview} from './disclosure-field-review';
import Link from 'next/link';
import audit from '../../data/research/affidavit-availability-2022.json';
const normalize=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]/g,'');
export function PrimaryAffidavitNote({year,ac,candidate}:{year:number;ac:number;candidate:string}){
 if(year!==2022)return null;
 const record=audit.records.find(r=>r.ac===ac&&normalize(r.candidate)===normalize(candidate));
 if(!record)return <p className="source-note">No matching primary-document availability observation. Missing evidence is not a negative disclosure.</p>;
 return <><aside className="primary-affidavit-note" aria-label="Primary affidavit document audit"><p className="eyebrow">OFFICIAL PDF / DOCUMENT AVAILABILITY</p><h3>{record.status==='pdf-opened'?'Official PDF retrieved and opened':'Official PDF not verified as accessible'}</h3><p>Checked {record.checkedAt.slice(0,10)}. {record.status==='pdf-opened'?<>{record.pages} pages; native text detected on {record.pagesWithNativeText} pages.</>:<>Audit status: {record.status}. A source-access failure does not mean the candidate omitted a declaration.</>}</p><p>Document availability and text detection do not verify the declared amounts, case details or completeness of the filing. This acquisition audit performs no manual field review or OCR.</p>{record.sha256&&<details><summary>Inspect the document fingerprint</summary><p className="source-note" style={{overflowWrap:'anywhere'}}>SHA-256: {record.sha256}</p><p className="source-note">{record.bytes?.toLocaleString('en-IN')} downloaded bytes. A hash identifies the captured file; it is not a certification of its claims.</p></details>}<p><a className="text-link" href={record.affidavitUrl}>Official PDF at source ↗</a></p><p><Link className="text-link" href="/analysis/disclosures/#primary-affidavits">See primary-document audit coverage ↗</Link></p></aside><DisclosureFieldReview ac={ac} candidate={candidate}/></>;
}
