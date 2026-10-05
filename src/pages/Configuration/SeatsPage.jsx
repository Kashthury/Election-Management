import { ArrowLeft, BarChart3, Building2, MapPin, Plus, Check, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { districtService } from "../../services/districtService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function SeatsPage() {
  const navigate = useNavigate();
  const { provinces, districts, setDistricts } = useAppContext();
  const [provinceFilter,setProvinceFilter]=useState("all");
  const [districtFilter,setDistrictFilter]=useState("all");
  const [modalOpen,setModalOpen]=useState(false);
  const [allocationProvinceId,setAllocationProvinceId]=useState(String(districts[0]?.provinceId ?? provinces[0]?.id ?? ""));
  const initialDistrict=districts.find(d=>String(d.provinceId)===String(districts[0]?.provinceId ?? provinces[0]?.id))||districts[0];
  const [allocationDistrictId,setAllocationDistrictId]=useState(String(initialDistrict?.id ?? ""));
  const [seatCount,setSeatCount]=useState("");
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState("");
  const [saved,setSaved]=useState(false);
  const allocationDistricts=useMemo(()=>districts.filter(d=>String(d.provinceId)===allocationProvinceId),[districts,allocationProvinceId]);
  const filteredDistricts=useMemo(()=>districts
    .filter(d=>provinceFilter==="all"||String(d.provinceId)===provinceFilter)
    .filter(d=>districtFilter==="all"||String(d.id)===districtFilter)
    .sort((a,b)=>Number((b.status||"active").toLowerCase()==="active")-Number((a.status||"active").toLowerCase()==="active")),[districts,provinceFilter,districtFilter]);
  const {pageItems:visibleDistricts,pagination,resetPage}=usePagination(filteredDistricts);
  const update = async (id,value) => {
    const numericSeats=Number(value);
    if(!Number.isInteger(numericSeats)||numericSeats<1){setSaveError("Enter a whole number of seats greater than zero.");return;}
    setSaving(true);setSaveError("");
    try{
      const item = await districtService.updateSeats(Number(id), numericSeats);
      setDistricts(prev=>prev.map(d=>d.id===Number(id)?{...d,...item,seats:numericSeats}:d));
      setSaved(true);setModalOpen(false);setSeatCount("");
    }catch(error){setSaveError(error?.response?.data?.message||error.message||"Could not save the seat allocation.");}
    finally{setSaving(false);}
  };
  const changeStatus=async(district,status)=>{
    const updated=await districtService.updateStatus(district.id,status);
    setDistricts(prev=>prev.map(item=>item.id===district.id?{...item,...updated,status}:item));
  };
  const openAllocation=()=>{
    const provinceId=String(districts[0]?.provinceId ?? provinces[0]?.id ?? "");
    const district=districts.find(d=>String(d.provinceId)===provinceId)||districts[0];
    setAllocationProvinceId(provinceId);setAllocationDistrictId(String(district?.id??""));setSeatCount("");setSaveError("");setSaved(false);setModalOpen(true);
  };
  const totalSeats=districts.reduce((sum,d)=>sum+(Number(d.seats)||0),0);
  const configuredCount=districts.filter(d=>Number(d.seats)>0).length;
  return <div>
    <PageHeader title="Seat Allocation" description="Set the number of seats available in each district." action={<div className="configuration-page-actions"><button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button><Button icon={Plus} onClick={openAllocation}>Add Seat Allocation</Button></div>}/>
    <div className="module-summary-grid"><div className="module-summary-card"><span className="module-summary-icon blue"><BarChart3 size={19}/></span><div><small>Total seats</small><strong>{totalSeats}</strong></div></div><div className="module-summary-card"><span className="module-summary-icon green"><CheckCircle2 size={19}/></span><div><small>Districts configured</small><strong>{configuredCount} <small>/ {districts.length}</small></strong></div></div><div className="module-summary-card"><span className="module-summary-icon amber"><BarChart3 size={19}/></span><div><small>Needs allocation</small><strong>{districts.length-configuredCount}</strong></div></div></div>
    <section className="module-panel"><div className="module-panel-heading seat-filter-heading"><div><h3>District seat allocation</h3><p>Choose a province, then narrow the table to a district.</p></div><div className="seat-filter-group"><label className="election-district-filter"><MapPin size={16}/><span className="sr-only">Filter by province</span><select value={provinceFilter} aria-label="Filter by province" onChange={e=>{setProvinceFilter(e.target.value);setDistrictFilter("all");resetPage();}}><option value="all">All provinces</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="election-district-filter"><Building2 size={16}/><span className="sr-only">Filter by district</span><select value={districtFilter} aria-label="Filter by district" onChange={e=>{setDistrictFilter(e.target.value);resetPage();}}><option value="all">All districts</option>{districts.filter(d=>provinceFilter==="all"||String(d.provinceId)===provinceFilter).map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label></div></div><div className="table-scroll"><table className="data-table module-table"><thead><tr><th>District</th><th>Province</th><th>Number of seats</th><th>District status</th></tr></thead><tbody>{visibleDistricts.map(d=>{const status=(d.status||"active").toLowerCase();return <tr key={d.id}><td><strong>{d.name}</strong></td><td>{d.provinceName}</td><td>{Number(d.seats)||0}</td><td><label className={`province-status-select ${status}`}><span className="module-status"><i/>{status === "active" ? "Active" : "Inactive"}</span><select aria-label={`${d.name} status`} value={status} onChange={e=>changeStatus(d,e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></label></td></tr>;})}{!visibleDistricts.length&&<tr><td colSpan="4" className="module-empty">No districts match the selected filters.</td></tr>}</tbody></table></div><Pagination {...(pagination || {page:1,pageCount:1,total:filteredDistricts.length,pageSize:10,setPage:()=>{}})} />{saved&&<div className="module-panel-footer"><span className="inline-success"><CheckCircle2 size={15}/> Seat allocation saved.</span></div>}</section>
    {modalOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&!saving&&setModalOpen(false)}><section className="crud-modal" role="dialog" aria-modal="true" aria-labelledby="seat-allocation-title"><div className="crud-modal-heading"><div><span className="crud-modal-icon"><BarChart3 size={19}/></span><div><h3 id="seat-allocation-title">Add seat allocation</h3><p>Select a province and district, then enter its seat count.</p></div></div><button className="modal-close" onClick={()=>setModalOpen(false)} aria-label="Close" disabled={saving}><X size={18}/></button></div><form onSubmit={e=>{e.preventDefault();update(allocationDistrictId,seatCount);}}><label className="modal-field">Province<select className="input" value={allocationProvinceId} onChange={e=>{const nextProvince=e.target.value;const first=districts.find(d=>String(d.provinceId)===nextProvince);setAllocationProvinceId(nextProvince);setAllocationDistrictId(String(first?.id??""));}} required><option value="">Select a province</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="modal-field">District<select className="input" value={allocationDistrictId} onChange={e=>setAllocationDistrictId(e.target.value)} disabled={!allocationDistricts.length} required><option value="">{allocationDistricts.length?"Select a district":"No districts in this province"}</option>{allocationDistricts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>{!districts.length&&<p className="seat-allocation-empty-hint">Create a district in Configuration before adding a seat allocation.</p>}<label className="modal-field">Number of seats<input className="input" type="number" min="1" step="1" value={seatCount} onChange={e=>setSeatCount(e.target.value)} placeholder="Enter seat count" required/></label>{saveError&&<div className="error-box seat-allocation-error">{saveError}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={()=>setModalOpen(false)} disabled={saving}>Cancel</button><Button type="submit" icon={Check} disabled={saving||!allocationDistrictId}>{saving?"Saving…":"Save allocation"}</Button></div></form></section></div>}
  </div>;
}
