import registryData from "../../data/processed/candidate-register.json";
import records from "../../data/processed/results.json";
import sources from "../../data/processed/sources.json";
import winnerData from "../../data/processed/winners.json";
export type Result = { year:number; ac:number; name:string; candidate:string; party:string; votes:number; rank:number; source:string; sourcePage:number; electors:number|null; nota:number|null; };
export const results = records as Result[];
export type Source={id:string;url:string;publisher:string;title?:string;accessed:string};
export const sourceRegister = sources as Source[];
export const years = [2012,2017,2022] as const;
export const partyColors:Record<string,string> = { BJP:"#e9a16b",INC:"#76b9dc",NPP:"#d9bb63",NPF:"#8cac85","JD(U)":"#bd9aba",AITC:"#7cbeb3",LJP:"#a8aad0",MSCP:"#d98691",KPA:"#a6b898",IND:"#b8b5ab",CPI:"#d98380",OTHER:"#909aa3" };
export const partyNames:Record<string,string>={BJP:"Bharatiya Janata Party",INC:"Indian National Congress",NPP:"National People's Party",NPF:"Naga People's Front","JD(U)":"Janata Dal (United)",IND:"Independent",KPA:"Kuki People's Alliance",AITC:"All India Trinamool Congress",LJP:"Lok Janshakti Party",MSCP:"Manipur State Congress Party",CPI:"Communist Party of India"};
const names="Khundrakpam|Heingang|Khurai|Kshetrigao|Thongju|Keirao|Andro|Lamlai|Thangmeiband|Uripok|Sagolband|Keishamthong|Singjamei|Yaiskul|Wangkhei|Sekmai|Lamsang|Konthoujam|Patsoi|Langthabal|Naoriya Pakhanglakpa|Wangoi|Mayang Imphal|Nambol|Oinam|Bishnupur|Moirang|Thanga|Kumbi|Lilong|Thoubal|Wangkhem|Heirok|Wangjing Tentha|Khangabok|Wabgai|Kakching|Hiyanglam|Sugnu|Jiribam|Chandel|Tengnoupal|Phungyar|Ukhrul|Chingai|Saikul|Karong|Mao|Tadubi|Kangpokpi|Saitu|Tamei|Tamenglong|Nungba|Tipaimukh|Thanlon|Henglep|Churachandpur|Saikot|Singhat".split("|");
export const constituencies=names.map((name,i)=>({id:i+1,name,slug:name.toLowerCase().replaceAll(" ","-"),reservation:i+1===16?"SC":i+1>=41&&i+1!==50?"ST":"GEN"}));
const contests=new Map<string,Result[]>();for(const r of results){const key=r.year+"/"+r.ac;const group=contests.get(key)||[];group.push(r);contests.set(key,group)}for(const group of contests.values())group.sort((a,b)=>b.votes-a.votes);
export function contest(year:number,ac:number){return contests.get(year+"/"+ac)||[]}
export function winner(year:number,ac:number){return contest(year,ac)[0]}
export const winnerRegister=winnerData as Omit<Result,"votes"|"rank"|"electors"|"nota">[];
export function registeredWinner(year:number,ac:number){return winnerRegister.find(r=>r.year===year&&r.ac===ac)}
export function winningParty(year:number,ac:number){return winner(year,ac)?.party||registeredWinner(year,ac)?.party}
export function seatTotals(year:number){const known=constituencies.map(c=>winningParty(year,c.id));if(known.some(p=>!p))return [];const tally:Record<string,number>={};known.forEach(p=>{tally[p!]=(tally[p!]||0)+1});return Object.entries(tally).sort((a,b)=>b[1]-a[1]);}
export function candidateSlug(r:Pick<Result,"candidate"|"year"|"ac">){return r.candidate.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+r.year+"-"+r.ac}
export function number(n:number|null|undefined){return n==null?"Not available":n.toLocaleString("en-IN")}
export const electionSource=(year:number)=>"https://ceomanipur.nic.in/StatisticalReport/AssemblyElection/"+({2012:"statistical_report_2012.pdf",2017:"statistical_report_2017.pdf",2022:"Statistical%20Report%202022.pdf"}[year]||"");
export const directorySource="https://ceomanipur.nic.in/ResultSheets/StateLegislativeAssembly/2022/results";

export type CandidateEntry=Omit<Result,"votes"|"rank"|"electors"|"nota">&{votes:number|null;rank:number|null;verification?:string};
export const candidateIndex=(registryData.length?registryData:records) as CandidateEntry[];
