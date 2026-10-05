import { useMemo, useState } from "react";
import { Calculator, AlertCircle, Building2, Users, Armchair, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { electionService } from "../../services/electionService";
import { ROUTES } from "../../constants/routes";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import VoteEntryTable from "../../components/election/VoteEntryTable";

export default function ElectionPage() {
  const { provinces, districts, candidates, settings, setLastResult } = useAppContext();
  const initialProvinceId=districts[0]?.provinceId ?? provinces[0]?.id ?? "";
  const [provinceId,setProvinceId]=useState(String(initialProvinceId));
  const initialDistrict=districts.find(d=>String(d.provinceId)===String(initialProvinceId))||districts[0];
  const [districtId,setDistrictId]=useState(String(initialDistrict?.id ?? ""));
  const district=useMemo(()=>districts.find(d=>d.id===Number(districtId)),[districts,districtId]);
  const list=candidates[districtId] || [];
  const [validVotes,setValidVotes]=useState(0);
  const [votes,setVotes]=useState([]);
  const [error,setError]=useState("");
  const navigate=useNavigate();
  const provinceDistricts=useMemo(()=>districts.filter(d=>String(d.provinceId)===provinceId),[districts,provinceId]);

  const changeProvince=e=>{
    const nextProvinceId=e.target.value;
    const nextDistrict=districts.find(d=>String(d.provinceId)===nextProvinceId);
    setProvinceId(nextProvinceId);
    setDistrictId(String(nextDistrict?.id ?? ""));
    setVotes((candidates[nextDistrict?.id]||[]).map(()=>0));
    setValidVotes(0);
    setError("");
  };

  const changeDistrict=e=>{
    const id=e.target.value;
    setDistrictId(id);
    if(id){const selected=districts.find(d=>String(d.id)===id);if(selected)setProvinceId(String(selected.provinceId));}
    setVotes((candidates[id]||[]).map(()=>0));
    setValidVotes(0);
    setError("");
  };
  const updateVote=(i,value)=>{
    setVotes(prev=>{const next=[...prev];next[i]=Number(value);return next});
  };
  const total=votes.reduce((s,v)=>s+Number(v||0),0);

  const calculate=async()=>{
    try{
      if(!district || district.seats<=1) throw new Error("The selected district must have more than 1 seat.");
      if(total!==Number(validVotes)) throw new Error(`Vote mismatch: candidate total is ${total.toLocaleString()}, valid votes are ${Number(validVotes).toLocaleString()}.`);
      const result=await electionService.calculate({
        district:district.name,
        seats:district.seats,
        validVotes:Number(validVotes),
        disqualifiedPercentage:settings.disqualifiedPercentage,
        candidates:list.map((c,i)=>({...c,votes:Number(votes[i]||0)})),
      });
      setLastResult(result);
      setError("");
      navigate(ROUTES.RESULTS);
    }catch(e){setError(e.message)}
  };

  return <div>
    <PageHeader title="Election Day" description="Enter valid votes and candidate votes, then calculate the final seat allocation."/>
    <div className="module-summary-grid election-summary-grid">
      <div className="module-summary-card"><span className="module-summary-icon blue"><Building2 size={19}/></span><div><small>Selected district</small><strong className="summary-word">{district?.name || "No district"}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon violet"><Armchair size={19}/></span><div><small>Allocated seats</small><strong>{district?.seats || 0}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon green"><Users size={19}/></span><div><small>Registered candidates</small><strong>{list.length}</strong></div></div>
    </div>
    <section className="module-panel election-entry-panel">
      <div className="module-panel-heading election-panel-heading"><div><h3>Vote entry</h3><p>Enter valid votes and candidate totals for the selected district.</p></div><div className="election-header-filters"><label className="election-district-filter"><MapPin size={16}/><span className="sr-only">Select province</span><select value={provinceId} onChange={changeProvince} aria-label="Select province"><option value="">Select province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="election-district-filter"><Building2 size={16}/><span className="sr-only">Select district</span><select value={districtId} onChange={changeDistrict} aria-label="Select district" disabled={!provinceDistricts.length}><option value="">{provinceDistricts.length?"Select district":"No districts in this province"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label className="election-valid-filter"><span>Valid votes</span><input id="valid-votes" className="input" type="number" min="0" value={validVotes} onChange={e=>setValidVotes(e.target.value)}/></label></div></div>
      <VoteEntryTable candidates={list} votes={votes} onChange={updateVote}/>
      <div className={`vote-summary ${total===Number(validVotes)&&Number(validVotes)>0?"matched":""}`}><span>Candidate Total <b>{total.toLocaleString()}</b></span><span>Valid Votes <b>{Number(validVotes||0).toLocaleString()}</b></span></div>
      {error && <div className="error-box"><AlertCircle size={18}/>{error}</div>}
      <div className="button-right"><Button icon={Calculator} onClick={calculate}>Calculate Results</Button></div>
    </section>
  </div>;
}
