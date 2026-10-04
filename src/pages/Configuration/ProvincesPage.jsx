import { useMemo, useState } from "react";
import { ArrowLeft, Map, Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { provinceService } from "../../services/provinceService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function ProvincesPage() {
  const navigate = useNavigate();
  const { provinces, setProvinces } = useAppContext();
  const [name,setName]=useState("");
  const [query,setQuery]=useState("");
  const [editing,setEditing]=useState(null);
  const [dialogOpen,setDialogOpen]=useState(false);

  const filteredProvinces = useMemo(() => provinces.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase())), [provinces, query]);
  const { pageItems: visibleProvinces, pagination, resetPage } = usePagination(filteredProvinces);
  const openCreate = () => { setEditing(null); setName(""); setDialogOpen(true); };
  const openEdit = province => { setEditing(province); setName(province.name); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditing(null); setName(""); };

  const add = async () => {
    if (!name.trim()) return;
    const payload = { name: name.trim() };
    if (editing) {
      const item = await provinceService.update(editing.id, payload);
      setProvinces(prev => prev.map(p => p.id === editing.id ? { ...p, ...item, ...payload } : p));
    } else {
      const item = await provinceService.create({ ...payload, districtCount: 0 });
      setProvinces(prev => [...prev, item]);
    }
    closeDialog();
  };
  const remove = async id => {
    await provinceService.delete(id);
    setProvinces(prev => prev.filter(x=>x.id!==id));
  };

  return <div>
    <PageHeader title="Province Management" description="Manage the provinces used by the election system." action={<div className="configuration-page-actions"><button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button><Button icon={Plus} onClick={openCreate}>Add Province</Button></div>}/>
    <div className="module-summary-grid">
      <div className="module-summary-card"><span className="module-summary-icon blue"><Map size={19}/></span><div><small>Total provinces</small><strong>{provinces.length}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon green"><Map size={19}/></span><div><small>Districts covered</small><strong>{provinces.reduce((sum,p)=>sum+(Number(p.districtCount)||0),0)}</strong></div></div>
      <div className="module-summary-card"><span className="module-summary-icon violet"><Map size={19}/></span><div><small>Capacity</small><strong>{provinces.length} <small>/ 15</small></strong></div></div>
    </div>
    <section className="module-panel">
      <div className="module-panel-heading"><div><h3>All provinces</h3><p>Search and manage the regions in your election setup.</p></div><label className="module-search"><Search size={16}/><input aria-label="Search provinces" placeholder="Search provinces" value={query} onChange={e=>{setQuery(e.target.value);resetPage();}}/></label></div>
      <div className="table-scroll"><table className="data-table module-table"><thead><tr><th>Province</th><th>Districts</th><th>Status</th><th className="actions-column">Actions</th></tr></thead><tbody>
        {visibleProvinces.map(p=><tr key={p.id}><td><div className="entity-cell"><span className="entity-avatar">{p.name.slice(0,1).toUpperCase()}</span><strong>{p.name}</strong></div></td><td>{p.districtCount || 0}</td><td><span className="module-status"><i/>Active</span></td><td><div className="row-actions"><button className="row-action" aria-label={`Edit ${p.name}`} title="Edit" onClick={()=>openEdit(p)}><SquarePen size={16}/></button><button className="row-action delete" aria-label={`Delete ${p.name}`} title="Delete" onClick={()=>remove(p.id)}><Trash2 size={16}/></button></div></td></tr>)}
        {!visibleProvinces.length && <tr><td colSpan="4" className="module-empty">{query ? "No provinces match your search." : "No provinces yet. Add a province to get started."}</td></tr>}
      </tbody></table></div>
      <Pagination {...(pagination || {page:1,pageCount:1,total:filteredProvinces.length,pageSize:10,setPage:()=>{}})} />
    </section>
    {dialogOpen && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&closeDialog()}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="province-dialog-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><Map size={19}/></span><div><h3 id="province-dialog-title">{editing ? "Edit province" : "Add province"}</h3><p>{editing ? "Update the province details below." : "Add a province to your election structure."}</p></div></div><button className="modal-close" onClick={closeDialog} aria-label="Close"><X size={18}/></button></div><form onSubmit={e=>{e.preventDefault();add();}}><label className="modal-field">Province name<input autoFocus className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Central Province" required maxLength={80}/></label><div className="modal-actions"><button type="button" className="button secondary" onClick={closeDialog}>Cancel</button><Button type="submit" icon={editing ? SquarePen : Plus}>{editing ? "Save changes" : "Add province"}</Button></div></form></section></div>}
  </div>;
}
