import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { candidateService } from "../../services/candidateService";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DataTable from "../../components/common/DataTable";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination";

export default function NominationPage() {
  const { districts, candidates, setCandidates } = useAppContext();
  const [districtId,setDistrictId]=useState(districts[0]?.id || "");
  const [name,setName]=useState("");
  const list=candidates[districtId] || [];
  const { pageItems, pagination, resetPage } = usePagination(list);

  const add=async()=>{
    if(!name.trim())return;
    const item=await candidateService.create(Number(districtId),{name:name.trim()});
    setCandidates(prev=>({...prev,[districtId]:[...(prev[districtId]||[]),item]}));
    setName("");
  };
  const remove=async id=>{
    await candidateService.delete(Number(districtId),id);
    setCandidates(prev=>({...prev,[districtId]:(prev[districtId]||[]).filter(x=>x.id!==id)}));
  };

  return <div>
    <PageHeader title="Nomination Day" description="Register candidates for each configured district."/>
    <Card><div className="form-grid">
      <label>District<select className="input" value={districtId} onChange={e=>{setDistrictId(e.target.value);resetPage();}}>{districts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      <label>Candidate Name<input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter candidate name"/></label>
      <Button icon={Plus} onClick={add}>Add Candidate</Button>
    </div></Card>
    <Card><div className="card-title"><h3>Candidates</h3><p>{districts.find(d=>d.id===Number(districtId))?.name} · {list.length} registered</p></div>
      <DataTable columns={["#","Candidate","Action"]}>{pageItems.map((c,i)=><tr key={c.id}><td>{(pagination?.page-1||0)*(pagination?.pageSize||10)+i+1}</td><td><strong>{c.name}</strong></td><td><button className="danger-icon" onClick={()=>remove(c.id)} aria-label={`Remove ${c.name}`}><Trash2 size={16}/></button></td></tr>)}</DataTable>
      <Pagination {...(pagination || {page:1,pageCount:1,total:list.length,pageSize:10,setPage:()=>{}})} />
    </Card>
  </div>;
}
