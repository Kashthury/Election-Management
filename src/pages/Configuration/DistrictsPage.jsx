import { useMemo, useState } from "react";
import { ArrowLeft, Building2, Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { districtService } from "../../services/districtService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function DistrictsPage() {
  const navigate = useNavigate();
  const { provinces, districts, setDistricts } = useAppContext();
  const [provinceId,setProvinceId]=useState(provinces[0]?.id || "");
  const [name,setName]=useState("");
  const [query,setQuery]=useState("");
  const [editing,setEditing]=useState(null);
  const [dialogOpen,setDialogOpen]=useState(false);

  const filteredDistricts = useMemo(() => districts.filter(d => `${d.name} ${d.provinceName}`.toLowerCase().includes(query.trim().toLowerCase())), [districts, query]);
  const { pageItems: visibleDistricts, pagination, resetPage } = usePagination(filteredDistricts);
  const openCreate=()=>{setEditing(null);setName("");setProvinceId(provinces[0]?.id || "");setDialogOpen(true);};
  const openEdit=district=>{setEditing(district);setName(district.name);setProvinceId(district.provinceId);setDialogOpen(true);};
  const closeDialog=()=>{setDialogOpen(false);setEditing(null);setName("");};

  const save=async()=>{
    if(!name.trim()) return;
    const province=provinces.find(p=>p.id===Number(provinceId));
    if(!province) return;
    const payload={provinceId:province.id,provinceName:province.name,name:name.trim()};
    if(editing){
      const item=await districtService.update(editing.id,payload);
      setDistricts(prev=>prev.map(d=>d.id===editing.id?{...d,...item,...payload}:d));
    }else{
      const item=await districtService.create({...payload,seats:0});
      setDistricts(prev=>[...prev,item]);
    }
    closeDialog();
  };
  const remove=async id=>{await districtService.delete(id);setDistricts(prev=>prev.filter(d=>d.id!==id));};

  return <div>
    <PageHeader title="District Management" description="Organize districts under their provinces." action={<div className="configuration-page-actions"><button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button><Button icon={Plus} onClick={openCreate} disabled={!provinces.length}>Add District</Button></div>}/>
    <div className="module-summary-grid"><div className="module-summary-card"><span className="module-summary-icon blue"><Building2 size={19}/></span><div><small>Total districts</small><strong>{districts.length}</strong></div></div><div className="module-summary-card"><span className="module-summary-icon green"><Building2 size={19}/></span><div><small>With seats assigned</small><strong>{districts.filter(d=>Number(d.seats)>0).length}</strong></div></div><div className="module-summary-card"><span className="module-summary-icon violet"><Building2 size={19}/></span><div><small>Provinces covered</small><strong>{new Set(districts.map(d=>d.provinceId)).size} <small>/ {provinces.length}</small></strong></div></div></div>
    <section className="module-panel"><div className="module-panel-heading"><div><h3>All districts</h3><p>Review district coverage and keep province assignments up to date.</p></div><label className="module-search"><Search size={16}/><input aria-label="Search districts" placeholder="Search districts" value={query} onChange={e=>{setQuery(e.target.value);resetPage();}}/></label></div>
      <div className="table-scroll"><table className="data-table module-table"><thead><tr><th>District</th><th>Province</th><th>Seats</th><th>Status</th><th className="actions-column">Actions</th></tr></thead><tbody>
        {visibleDistricts.map(d=><tr key={d.id}><td><div className="entity-cell"><span className="entity-avatar violet">{d.name.slice(0,1).toUpperCase()}</span><strong>{d.name}</strong></div></td><td>{d.provinceName}</td><td>{d.seats || "—"}</td><td><span className={`module-status ${Number(d.seats)>0?"":"pending"}`}><i/>{Number(d.seats)>0?"Configured":"Needs seats"}</span></td><td><div className="row-actions"><button className="row-action" aria-label={`Edit ${d.name}`} title="Edit" onClick={()=>openEdit(d)}><SquarePen size={16}/></button><button className="row-action delete" aria-label={`Delete ${d.name}`} title="Delete" onClick={()=>remove(d.id)}><Trash2 size={16}/></button></div></td></tr>)}
        {!visibleDistricts.length&&<tr><td colSpan="5" className="module-empty">{query?"No districts match your search.":"No districts yet. Add a district to get started."}</td></tr>}
      </tbody></table></div><Pagination {...(pagination || {page:1,pageCount:1,total:filteredDistricts.length,pageSize:10,setPage:()=>{}})} />
    </section>
    {dialogOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&closeDialog()}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="district-dialog-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Building2 size={19}/></span><div><h3 id="district-dialog-title">{editing?"Edit district":"Add district"}</h3><p>{editing?"Update the district details below.":"Add a district to a province."}</p></div></div><button className="modal-close" onClick={closeDialog} aria-label="Close"><X size={18}/></button></div><form onSubmit={e=>{e.preventDefault();save();}}><label className="modal-field">Province<select className="input" value={provinceId} onChange={e=>setProvinceId(e.target.value)} required>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District name<input autoFocus className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. North District" required maxLength={80}/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={closeDialog}>Cancel</button><Button type="submit" icon={editing?SquarePen:Plus}>{editing?"Save changes":"Add district"}</Button></div></form></section></div>}
  </div>;
}
