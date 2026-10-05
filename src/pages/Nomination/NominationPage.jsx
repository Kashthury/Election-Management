import { useMemo, useState } from "react";
import { Building2, MapPin, Plus, Search, Trash2, Users, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { candidateService } from "../../services/candidateService";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function NominationPage() {
  const { provinces, districts, candidates, setCandidates } = useAppContext();
  const initialProvinceId = districts[0]?.provinceId ?? provinces[0]?.id ?? "";
  const [provinceId,setProvinceId]=useState(String(initialProvinceId));
  const initialDistrict = districts.find(d=>String(d.provinceId)===String(initialProvinceId)) || districts[0];
  const [districtId,setDistrictId]=useState(String(initialDistrict?.id ?? ""));
  const [name,setName]=useState("");
  const [modalOpen,setModalOpen]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState("");
  const [partyQuery,setPartyQuery]=useState("");
  const list=candidates[districtId] || [];
  const filteredParties=useMemo(()=>list.filter(p=>p.name.toLowerCase().includes(partyQuery.trim().toLowerCase())),[list,partyQuery]);
  const { pageItems, pagination, resetPage } = usePagination(filteredParties);
  const provinceDistricts=useMemo(()=>districts.filter(d=>String(d.provinceId)===provinceId),[districts,provinceId]);

  const changeProvince=e=>{
    const nextProvinceId=e.target.value;
    const nextDistrict= districts.find(d=>String(d.provinceId)===nextProvinceId);
    setProvinceId(nextProvinceId);
    setDistrictId(String(nextDistrict?.id ?? ""));
    setPartyQuery("");
    resetPage();
  };

  const add=async()=>{
    if(!name.trim())return;
    setSaving(true);setSaveError("");
    try{
      const item=await candidateService.create(Number(districtId),{name:name.trim()});
      setCandidates(prev=>({...prev,[districtId]:[...(prev[districtId]||[]),item]}));
      setPartyQuery("");resetPage();
      setName("");setModalOpen(false);
    }catch(error){setSaveError(error?.response?.data?.message||error.message||"Could not add this party.");}
    finally{setSaving(false);}
  };
  const remove=async id=>{
    await candidateService.delete(Number(districtId),id);
    setCandidates(prev=>({...prev,[districtId]:(prev[districtId]||[]).filter(x=>x.id!==id)}));
    resetPage();
  };

  return <div>
    <PageHeader title="Party Nominations" description="Register parties for each configured district." action={<Button icon={Plus} onClick={()=>{setName("");setSaveError("");setModalOpen(true);}}>Add Party</Button>}/>
    <Card><div className="form-grid nomination-filters">
      <label><span className="nomination-filter-label"><MapPin size={14}/> Province</span><select className="input" value={provinceId} onChange={changeProvince}><option value="">Select province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label><span className="nomination-filter-label"><Building2 size={14}/> District</span><select className="input" value={districtId} onChange={e=>{setDistrictId(e.target.value);resetPage();}} disabled={!provinceDistricts.length}><option value="">{provinceDistricts.length?"Select district":"No districts in this province"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      <label><span className="nomination-filter-label"><Search size={14}/> Search party</span><input className="input" type="search" placeholder="Enter party name" value={partyQuery} onChange={e=>{setPartyQuery(e.target.value);resetPage();}}/></label>
    </div></Card>
    <Card><div className="card-title"><h3>Registered parties</h3><p>{districts.find(d=>d.id===Number(districtId))?.name} · {filteredParties.length} shown / {list.length} registered</p></div>
      <DataTable columns={["#","Party","Action"]}>{pageItems.map((c,i)=><tr key={c.id}><td>{(pagination?.page-1||0)*(pagination?.pageSize||10)+i+1}</td><td><strong>{c.name}</strong></td><td><button className="danger-icon" onClick={()=>remove(c.id)} aria-label={`Remove ${c.name}`}><Trash2 size={16}/></button></td></tr>)}</DataTable>
      {!filteredParties.length&&<div className="module-empty">{partyQuery?"No parties match your search.":"No parties registered for this district yet."}</div>}
      <Pagination {...(pagination || {page:1,pageCount:1,total:filteredParties.length,pageSize:10,setPage:()=>{}})} />
    </Card>
    {modalOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&!saving&&setModalOpen(false)}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="add-party-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Users size={19}/></span><div><h3 id="add-party-title">Add party</h3><p>Register a party for {districts.find(d=>String(d.id)===districtId)?.name || "the selected district"}.</p></div></div><button className="modal-close" onClick={()=>setModalOpen(false)} aria-label="Close" disabled={saving}><X size={18}/></button></div><form onSubmit={e=>{e.preventDefault();add();}}><label className="modal-field">Province<select className="input" value={provinceId} onChange={changeProvince} required><option value="">Select a province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District<select className="input" value={districtId} onChange={e=>{setDistrictId(e.target.value);resetPage();}} disabled={!provinceDistricts.length} required><option value="">{provinceDistricts.length?"Select a district":"No districts in this province"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>{!provinceDistricts.length&&<p className="seat-allocation-empty-hint">Create a district for this province before registering a party.</p>}<label className="modal-field">Party name<input autoFocus className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter party name" required maxLength={100}/></label>{saveError&&<div className="error-box seat-allocation-error">{saveError}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setModalOpen(false)} disabled={saving}>Cancel</button><Button type="submit" icon={Plus} disabled={saving||!districtId}>{saving?"Saving…":"Add party"}</Button></div></form></section></div>}
  </div>;
}
