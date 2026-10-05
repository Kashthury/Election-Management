import { ArrowLeft, BarChart3, Check, MapPin, Building2 } from "lucide-react";
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
  const { provinces, districts, setDistricts } = useAppContext();
  const [provinceFilter,setProvinceFilter]=useState("all");
  const [districtFilter,setDistrictFilter]=useState("all");
  const [saved,setSaved]=useState(false);
  const filteredDistricts=useMemo(()=>districts
    .filter(d=>provinceFilter==="all"||String(d.provinceId)===provinceFilter)
    .filter(d=>districtFilter==="all"||String(d.id)===districtFilter)
    .sort((a,b)=>Number((b.status||"active").toLowerCase()==="active")-Number((a.status||"active").toLowerCase()==="active")),[districts,provinceFilter,districtFilter]);
  const {pageItems:visibleDistricts,pagination,resetPage}=usePagination(filteredDistricts);
  const update = async (id,value) => {
    const item = await districtService.updateSeats(id, value);
    setDistricts(prev=>prev.map(d=>d.id===id?{...d,seats:Number(value)}:d));
    setSaved(false);
    return item;
  };
  const changeStatus=async(district,status)=>{
    const updated=await districtService.updateStatus(district.id,status);
    setDistricts(prev=>prev.map(item=>item.id===district.id?{...item,...updated,status}:item));
  };
  const saveChanges=()=>setSaved(true);
  const totalSeats=districts.reduce((sum,d)=>sum+(Number(d.seats)||0),0);
  const configuredCount=districts.filter(d=>Number(d.seats)>0).length;
  return <div>
    <PageHeader title="Seat Allocation" description="Set the number of seats available in each district." action={<div className="configuration-page-actions"><button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button><Button icon={Check} onClick={saveChanges}>Save Changes</Button></div>}/>
    <div className="module-summary-grid"><div className="module-summary-card"><span className="module-summary-icon blue"><BarChart3 size={19}/></span><div><small>Total seats</small><strong>{totalSeats}</strong></div></div><div className="module-summary-card"><span className="module-summary-icon green"><CheckCircle2 size={19}/></span><div><small>Districts configured</small><strong>{configuredCount} <small>/ {districts.length}</small></strong></div></div><div className="module-summary-card"><span className="module-summary-icon amber"><BarChart3 size={19}/></span><div><small>Needs allocation</small><strong>{districts.length-configuredCount}</strong></div></div></div>
    <section className="module-panel"><div className="module-panel-heading seat-filter-heading"><div><h3>District seat allocation</h3><p>Choose a province, then narrow the table to a district.</p></div><div className="seat-filter-group"><label className="election-district-filter"><MapPin size={16}/><span className="sr-only">Filter by province</span><select value={provinceFilter} aria-label="Filter by province" onChange={e=>{setProvinceFilter(e.target.value);setDistrictFilter("all");resetPage();}}><option value="all">All provinces</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="election-district-filter"><Building2 size={16}/><span className="sr-only">Filter by district</span><select value={districtFilter} aria-label="Filter by district" onChange={e=>{setDistrictFilter(e.target.value);resetPage();}}><option value="all">All districts</option>{districts.filter(d=>provinceFilter==="all"||String(d.provinceId)===provinceFilter).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div></div><div className="table-scroll"><table className="data-table module-table"><thead><tr><th>District</th><th>Province</th><th>Number of seats</th><th>District status</th></tr></thead><tbody>{visibleDistricts.map(d=>{const status=(d.status||"active").toLowerCase();return <tr key={d.id}><td><strong>{d.name}</strong></td><td>{d.provinceName}</td><td><input className="input number-input" aria-label={`Seats for ${d.name}`} type="number" min="0" value={d.seats} onChange={e=>update(d.id,e.target.value)}/></td><td><label className={`province-status-select ${status}`}><span className="module-status"><i/>{status === "active" ? "Active" : "Inactive"}</span><select aria-label={`${d.name} status`} value={status} onChange={e=>changeStatus(d,e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></label></td></tr>;})}{!visibleDistricts.length&&<tr><td colSpan="4" className="module-empty">No districts match the selected filters.</td></tr>}</tbody></table></div><Pagination {...(pagination || {page:1,pageCount:1,total:filteredDistricts.length,pageSize:10,setPage:()=>{}})} />{saved&&<div className="module-panel-footer"><span className="inline-success"><CheckCircle2 size={15}/> All seat allocations are up to date.</span></div>}</section>
  </div>;
}
