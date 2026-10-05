import { useMemo, useState } from "react";
import { Building2, MapPin, Plus, Search, SquarePen, Trash2, Users, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { candidateService } from "../../services/candidateService";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";
import type { Party } from "../../types";

export default function NominationPage() {
  const { provinces, districts, candidates, setCandidates } = useAppContext();
  const [provinceId,setProvinceId]=useState("");
  const [districtId,setDistrictId]=useState("");
  const [name,setName]=useState("");
  const [modalOpen,setModalOpen]=useState(false);
  const [editingParty,setEditingParty]=useState<Party | null>(null);
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState("");
  const [partyQuery,setPartyQuery]=useState("");
  const list=candidates[districtId] || [];
  const filteredParties=useMemo(()=>list.filter(p=>p.name.toLowerCase().includes(partyQuery.trim().toLowerCase())),[list,partyQuery]);
  const { pageItems, pagination, resetPage } = usePagination(filteredParties);
  const provinceDistricts=useMemo(()=>districts.filter(d=>String(d.provinceId)===provinceId),[districts,provinceId]);

  const changeProvince=(e: React.ChangeEvent<HTMLSelectElement>)=>{
    const nextProvinceId=e.target.value;
    setProvinceId(nextProvinceId);
    setDistrictId("");
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
  const openEdit=(party: Party)=>{
    const partyDistrict=districts.find(d=>String(d.id)===String(party.districtId))||districts.find(d=>String(d.id)===districtId);
    setEditingParty(party);
    setProvinceId(String(partyDistrict?.provinceId??provinceId));
    setDistrictId(String(partyDistrict?.id??districtId));
    setName(party.name);
    setSaveError("");
    setModalOpen(true);
  };
  const saveEdit=async()=>{
    if(!name.trim()||!districtId||!editingParty)return;
    setSaving(true);setSaveError("");
    const oldDistrictId=String(editingParty.districtId??districtId);
    try{
      const item=await candidateService.update(Number(oldDistrictId),editingParty.id,{name:name.trim(),districtId:Number(districtId)});
      setCandidates(prev=>{
        const next={...prev};
        const oldList=next[oldDistrictId]||[];
        next[oldDistrictId]=oldList.filter(candidate=>candidate.id!==editingParty.id);
        if(oldDistrictId===districtId){
          next[oldDistrictId]=oldList.map(candidate=>candidate.id===editingParty.id?{...candidate,...item,name:name.trim(),districtId:Number(districtId)}:candidate);
        }else{
          next[districtId]=[...(next[districtId]||[]),{...item,name:name.trim(),districtId:Number(districtId)}];
        }
        return next;
      });
      setPartyQuery("");resetPage();setEditingParty(null);setName("");setModalOpen(false);
    }catch(error){setSaveError(error?.response?.data?.message||error.message||"Could not update this party.");}
    finally{setSaving(false);}
  };
  const remove=async id=>{
    await candidateService.delete(Number(districtId),id);
    setCandidates(prev=>({...prev,[districtId]:(prev[districtId]||[]).filter(x=>x.id!==id)}));
    resetPage();
  };

  return <div>
    <PageHeader title="Party Nominations" description="Register parties for each configured district." action={<Button icon={Plus} onClick={()=>{setEditingParty(null);setName("");setSaveError("");setModalOpen(true);}}>Add Party</Button>}/>
    <Card><div className="form-grid nomination-filters">
      <label><span className="nomination-filter-label"><MapPin size={14}/> Province</span><select className="input" value={provinceId} onChange={changeProvince}><option value="">Select province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label><span className="nomination-filter-label"><Building2 size={14}/> District</span><select className="input" value={districtId} onChange={e=>{setDistrictId(e.target.value);resetPage();}} disabled={!provinceId||!provinceDistricts.length}><option value="">{!provinceId?"Select province first":provinceDistricts.length?"Select district":"No districts in this province"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      <label><span className="nomination-filter-label"><Search size={14}/> Search party</span><input className="input" type="search" placeholder="Enter party name" value={partyQuery} onChange={e=>{setPartyQuery(e.target.value);resetPage();}}/></label>
    </div></Card>
    <Card><div className="card-title"><h3>Registered parties</h3><p>{districts.find(d=>d.id===Number(districtId))?.name} · {filteredParties.length} shown / {list.length} registered</p></div>
      <DataTable columns={["#","Party","Actions"]}>{pageItems.map((c,i)=><tr key={c.id}><td>{(pagination?.page-1||0)*(pagination?.pageSize||10)+i+1}</td><td><strong>{c.name}</strong></td><td><div className="row-actions"><button className="row-action" onClick={()=>openEdit(c)} aria-label={`Edit ${c.name}`} title="Edit"><SquarePen size={16}/></button><button className="row-action delete" onClick={()=>remove(c.id)} aria-label={`Remove ${c.name}`} title="Remove"><Trash2 size={16}/></button></div></td></tr>)}</DataTable>
      {!filteredParties.length&&<div className="module-empty">{partyQuery?"No parties match your search.":"No parties registered for this district yet."}</div>}
      <Pagination {...(pagination || {page:1,pageCount:1,total:filteredParties.length,pageSize:10,setPage:()=>{}})} />
    </Card>
    {modalOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&!saving&&setModalOpen(false)}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="party-dialog-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Users size={19}/></span><div><h3 id="party-dialog-title">{editingParty?"Edit party":"Add party"}</h3><p>{editingParty?"Update the party details below.":"Register a party for the selected district."}</p></div></div><button className="modal-close" onClick={()=>{setModalOpen(false);setEditingParty(null);}} aria-label="Close" disabled={saving}><X size={18}/></button></div><form onSubmit={e=>{e.preventDefault();editingParty?saveEdit():add();}}><label className="modal-field">Province<select className="input" value={provinceId} onChange={e=>{setProvinceId(e.target.value);setDistrictId("");}} required><option value="">Select a province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District<select className="input" value={districtId} onChange={e=>setDistrictId(e.target.value)} disabled={!provinceId||!provinceDistricts.length} required><option value="">{!provinceId?"Select province first":provinceDistricts.length?"Select a district":"No districts in this province"}</option>{provinceDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>{provinceId&&!provinceDistricts.length&&<p className="seat-allocation-empty-hint">Create a district for this province before registering a party.</p>}<label className="modal-field">Party name<input autoFocus className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter party name" required maxLength={100}/></label>{saveError&&<div className="error-box seat-allocation-error">{saveError}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={()=>{setModalOpen(false);setEditingParty(null);}} disabled={saving}>Cancel</button><Button type="submit" icon={editingParty?SquarePen:Plus} disabled={saving||!districtId}>{saving?"Saving…":editingParty?"Save changes":"Add party"}</Button></div></form></section></div>}
  </div>;
}
