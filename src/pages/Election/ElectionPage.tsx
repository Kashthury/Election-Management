import { useMemo, useState } from "react";
import { Calculator, AlertCircle, Building2, Users, Armchair, MapPin, Plus, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { electionService } from "../../services/electionService";
import { ROUTES } from "../../constants/routes";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import VoteEntryTable from "../../components/election/VoteEntryTable";

export default function ElectionPage() {
  const { provinces, districts, candidates, settings, appendResult } = useAppContext();
  const [provinceId,setProvinceId]=useState("");
  const [districtId,setDistrictId]=useState("");
  const district=useMemo(()=>districts.find(d=>d.id===Number(districtId)),[districts,districtId]);
  const list=candidates[districtId] || [];
  const [validVotes,setValidVotes]=useState(0);
  const [votes,setVotes]=useState([]);
  const [error,setError]=useState("");
  const [voteModalOpen,setVoteModalOpen]=useState(false);
  const [draftProvinceId,setDraftProvinceId]=useState("");
  const [draftDistrictId,setDraftDistrictId]=useState("");
  const [draftValidVotes,setDraftValidVotes]=useState("");
  const [partyVoteModalOpen,setPartyVoteModalOpen]=useState(false);
  const [draftPartyId,setDraftPartyId]=useState("");
  const [draftPartyVotes,setDraftPartyVotes]=useState("");
  const navigate=useNavigate();
  const provinceDistricts=useMemo(()=>provinceId?districts.filter(d=>String(d.provinceId)===provinceId):districts,[districts,provinceId]);
  const draftProvinceDistricts=useMemo(()=>draftProvinceId?districts.filter(d=>String(d.provinceId)===draftProvinceId):districts,[districts,draftProvinceId]);
  const visibleVoteDistricts=useMemo(()=>provinceId?(districtId?districts.filter(d=>String(d.id)===districtId):provinceDistricts):districts,[districts,provinceId,districtId,provinceDistricts]);
  const visibleParties=useMemo(()=>visibleVoteDistricts.flatMap(item=>(candidates[item.id]||[]).map(party=>({...party,districtId:String(item.id),provinceId:String(item.provinceId),districtName:item.name}))),[visibleVoteDistricts,candidates]);
  const visiblePartyVotes=visibleParties.map(party=>{
    const partyIndex=(candidates[party.districtId]||[]).findIndex(item=>item.id===party.id);
    return party.districtId===districtId?Number(votes[partyIndex]??0):0;
  });

  const openVoteModal=()=>{
    setDraftProvinceId(provinceId);setDraftDistrictId(districtId);setDraftValidVotes(String(validVotes));setVoteModalOpen(true);
  };
  const openPartyVoteModal=(party=null)=>{
    const selectedParty=party;
    const targetDistrictId=String(selectedParty?.districtId??districtId);
    const targetDistrict=districts.find(item=>String(item.id)===targetDistrictId);
    const targetParties=candidates[targetDistrictId]||[];
    setDraftProvinceId(String(targetDistrict?.provinceId??provinceId));
    setDraftDistrictId(targetDistrictId);
    const currentParty=selectedParty;
    setDraftPartyId(String(currentParty?.id??""));
    const index=currentParty?targetParties.findIndex(item=>item.id===currentParty.id):-1;
    setDraftPartyVotes(index>=0&&targetDistrictId===districtId?String(votes[index]??0):"0");
    setPartyVoteModalOpen(true);
  };
  const applyPartyVote=e=>{
    e.preventDefault();
    const targetParties=candidates[draftDistrictId]||[];
    const partyIndex=targetParties.findIndex(p=>String(p.id)===draftPartyId);
    if(partyIndex<0||!Number.isInteger(Number(draftPartyVotes))||Number(draftPartyVotes)<0)return;
    const districtChanged=draftDistrictId!==districtId;
    setProvinceId(draftProvinceId);setDistrictId(draftDistrictId);
    if(districtChanged){setVotes(targetParties.map((_,index)=>index===partyIndex?Number(draftPartyVotes):0));setValidVotes(0);}
    else setVotes(previous=>{const next=[...previous];next[partyIndex]=Number(draftPartyVotes);return next;});
    setError("");setPartyVoteModalOpen(false);
  };
  const applyVoteDetails=e=>{
    e.preventDefault();
    if(draftDistrictId!==districtId){setVotes((candidates[draftDistrictId]||[]).map(()=>0));setError("");}
    setProvinceId(draftProvinceId);setDistrictId(draftDistrictId);setValidVotes(draftValidVotes);setVoteModalOpen(false);
  };

  const changeProvince=e=>{
    const nextProvinceId=e.target.value;
    setProvinceId(nextProvinceId);
    setDistrictId("");
    setVotes([]);
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
  const total=votes.reduce((s,v)=>s+Number(v||0),0);

  const calculate=async()=>{
    try{
      if(!district || district.seats<=1) throw new Error("The selected district must have more than 1 seat.");
      if(total!==Number(validVotes)) throw new Error(`Vote mismatch: party vote total is ${total.toLocaleString()}, valid votes are ${Number(validVotes).toLocaleString()}.`);
      const result=await electionService.calculate({
        district:district.name,
        seats:district.seats,
        validVotes:Number(validVotes),
        disqualifiedPercentage:settings.disqualifiedPercentage,
        candidates:list.map((c,i)=>({...c,votes:Number(votes[i]||0)})),
      });
      appendResult(result);
      setError("");
      navigate(ROUTES.RESULTS);
    }catch(e){setError(e.message)}
  };

  return <div>
    <PageHeader title="Election Day" description="Enter valid votes and party votes, then calculate the final seat allocation."/>
    <div className="module-summary-grid election-summary-grid">
      <div className="module-summary-card"><span className="module-summary-icon blue"><Building2 size={19}/></span><div><small>Selected district</small><strong className="summary-word">{district?.name || "No district"}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon violet"><Armchair size={19}/></span><div><small>Allocated seats</small><strong>{district?.seats || 0}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon green"><Users size={19}/></span><div><small>Registered parties</small><strong>{list.length}</strong></div></div>
    </div>
    <section className="module-panel election-entry-panel">
      <div className="module-panel-heading election-panel-heading"><div><h3>Vote entry</h3><p>Enter valid votes and party totals for the selected district.</p></div><div className="election-header-filters"><label className="election-district-filter"><MapPin size={16}/><span className="sr-only">Filter by province</span><select value={provinceId} onChange={changeProvince} aria-label="Filter by province"><option value="">Select province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="election-district-filter"><Building2 size={16}/><span className="sr-only">Filter by district</span><select value={districtId} onChange={changeDistrict} aria-label="Filter by district" disabled={!provinceDistricts.length}><option value="">{provinceId?"Select district":"Select province first"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><Button icon={Plus} onClick={openVoteModal}>Valid Votes</Button><Button icon={Plus} onClick={()=>openPartyVoteModal()}>Party Votes</Button></div></div>
      <VoteEntryTable candidates={visibleParties} votes={visiblePartyVotes} onEditVote={openPartyVoteModal} showDistrict={Boolean(!districtId)}/>
      <div className={`vote-summary ${total===Number(validVotes)&&Number(validVotes)>0?"matched":""}`}><span>Party Total <b>{total.toLocaleString()}</b></span><span>Valid Votes <b>{Number(validVotes||0).toLocaleString()}</b></span></div>
      {error && <div className="error-box"><AlertCircle size={18}/>{error}</div>}
      <div className="button-right"><Button icon={Calculator} onClick={calculate}>Calculate Results</Button></div>
    </section>
    {voteModalOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setVoteModalOpen(false)}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="vote-details-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Calculator size={19}/></span><div><h3 id="vote-details-title">Vote details</h3><p>Choose the election area and enter its valid vote count.</p></div></div><button className="modal-close" onClick={()=>setVoteModalOpen(false)} aria-label="Close"><X size={18}/></button></div><form onSubmit={applyVoteDetails}><label className="modal-field">Province<select className="input" value={draftProvinceId} onChange={e=>{setDraftProvinceId(e.target.value);setDraftDistrictId("");}} required><option value="">Select a province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District<select className="input" value={draftDistrictId} onChange={e=>setDraftDistrictId(e.target.value)} disabled={!draftProvinceId||!draftProvinceDistricts.length} required><option value="">{draftProvinceId?(draftProvinceDistricts.length?"Select a district":"No districts in this province"):"Select a province first"}</option>{draftProvinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label className="modal-field">Valid votes<input className="input" type="number" min="0" step="1" value={draftValidVotes} onChange={e=>setDraftValidVotes(e.target.value)} required/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setVoteModalOpen(false)}>Cancel</button><Button type="submit" icon={Check} disabled={!draftDistrictId}>Apply vote details</Button></div></form></section></div>}
    {partyVoteModalOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setPartyVoteModalOpen(false)}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="party-votes-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Users size={19}/></span><div><h3 id="party-votes-title">Party votes</h3><p>Select an election area and party, then record its votes.</p></div></div><button className="modal-close" onClick={()=>setPartyVoteModalOpen(false)} aria-label="Close"><X size={18}/></button></div><form onSubmit={applyPartyVote}><label className="modal-field">Province<select className="input" value={draftProvinceId} onChange={e=>{setDraftProvinceId(e.target.value);setDraftDistrictId("");setDraftPartyId("");setDraftPartyVotes("");}} required><option value="">Select a province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District<select className="input" value={draftDistrictId} onChange={e=>{const nextDistrictId=e.target.value;setDraftDistrictId(nextDistrictId);setDraftPartyId("");setDraftPartyVotes("");}} disabled={!draftProvinceId||!draftProvinceDistricts.length} required><option value="">{draftProvinceId?(draftProvinceDistricts.length?"Select a district":"No districts in this province"):"Select a province first"}</option>{draftProvinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label className="modal-field">Party<select className="input" value={draftPartyId} onChange={e=>{const id=e.target.value;setDraftPartyId(id);const index=(candidates[draftDistrictId]||[]).findIndex(p=>String(p.id)===id);setDraftPartyVotes(draftDistrictId===districtId&&index>=0?String(votes[index]??0):"0");}} disabled={!draftDistrictId||!(candidates[draftDistrictId]||[]).length} required><option value="">{!draftDistrictId?"Select a district first":(candidates[draftDistrictId]||[]).length?"Select a party":"No parties registered in this district"}</option>{(candidates[draftDistrictId]||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">Votes<input autoFocus className="input" type="number" min="0" step="1" value={draftPartyVotes} onChange={e=>setDraftPartyVotes(e.target.value)} required disabled={!draftPartyId}/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setPartyVoteModalOpen(false)}>Cancel</button><Button type="submit" icon={Check} disabled={!draftPartyId}>Save votes</Button></div></form></section></div>}
  </div>;
}
