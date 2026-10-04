import { ArrowLeft, BarChart3, Check, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { districtService } from "../../services/districtService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { CheckCircle2 } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function SeatsPage() {
  const navigate = useNavigate();
  const { districts, setDistricts } = useAppContext();
  const [query,setQuery]=useState("");
  const [saved,setSaved]=useState(false);
  const filteredDistricts=useMemo(()=>districts.filter(d=>`${d.name} ${d.provinceName}`.toLowerCase().includes(query.trim().toLowerCase())),[districts,query]);
  const {pageItems:visibleDistricts,pagination,resetPage}=usePagination(filteredDistricts);
  const update = async (id,value) => {
    const item = await districtService.updateSeats(id, value);
    setDistricts(prev=>prev.map(d=>d.id===id?{...d,seats:Number(value)}:d));
    setSaved(false);
    return item;
  };
  const saveChanges=()=>setSaved(true);
  const totalSeats=districts.reduce((sum,d)=>sum+(Number(d.seats)||0),0);
  const configuredCount=districts.filter(d=>Number(d.seats)>0).length;
  return <div>
    <PageHeader title="Seat Allocation" description="Set the number of seats available in each district." action={<div className="configuration-page-actions"><button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button><Button icon={Check} onClick={saveChanges}>Save Changes</Button></div>}/>
    <div className="module-summary-grid"><div className="module-summary-card"><span className="module-summary-icon blue"><BarChart3 size={19}/></span><div><small>Total seats</small><strong>{totalSeats}</strong></div></div><div className="module-summary-card"><span className="module-summary-icon green"><CheckCircle2 size={19}/></span><div><small>Districts configured</small><strong>{configuredCount} <small>/ {districts.length}</small></strong></div></div><div className="module-summary-card"><span className="module-summary-icon amber"><BarChart3 size={19}/></span><div><small>Needs allocation</small><strong>{districts.length-configuredCount}</strong></div></div></div>
    <section className="module-panel"><div className="module-panel-heading"><div><h3>District seat allocation</h3><p>Enter seats for each district. Changes save as you edit.</p></div><label className="module-search"><Search size={16}/><input aria-label="Search districts" placeholder="Search districts" value={query} onChange={e=>{setQuery(e.target.value);resetPage();}}/></label></div><div className="table-scroll"><table className="data-table module-table"><thead><tr><th>District</th><th>Province</th><th>Number of seats</th><th>Status</th></tr></thead><tbody>{visibleDistricts.map(d=><tr key={d.id}><td><strong>{d.name}</strong></td><td>{d.provinceName}</td><td><input className="input number-input" aria-label={`Seats for ${d.name}`} type="number" min="0" value={d.seats} onChange={e=>update(d.id,e.target.value)}/></td><td><span className={`module-status ${Number(d.seats)>0?"":"pending"}`}><i/>{Number(d.seats)>0?"Configured":"Needs allocation"}</span></td></tr>)}{!visibleDistricts.length&&<tr><td colSpan="4" className="module-empty">{query?"No districts match your search.":"No districts available. Add districts first."}</td></tr>}</tbody></table></div><Pagination {...(pagination || {page:1,pageCount:1,total:filteredDistricts.length,pageSize:10,setPage:()=>{}})} />{saved&&<div className="module-panel-footer"><span className="inline-success"><CheckCircle2 size={15}/> All seat allocations are up to date.</span></div>}</section>
  </div>;
}
