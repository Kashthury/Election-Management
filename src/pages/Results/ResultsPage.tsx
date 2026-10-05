import { useAppContext } from "../../context/AppContext";
import { usePagination } from "../../hooks/usePagination";
import { formatNumber } from "../../utils/formatters";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/common/DataTable";
import { Vote, Calculator, Users, Award } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import type { ResultLogEntry } from "../../types";

export default function ResultsPage() {
  const { lastResult }=useAppContext();
  if(!lastResult) return <Card className="empty"><Award size={38}/><h3>No election result available</h3><p>Complete Election Day to generate a result.</p></Card>;
  return <ResultsContent lastResult={lastResult}/>;
}

function ResultsContent({lastResult}: { lastResult: ResultLogEntry }) {
  const {pageItems,pagination}=usePagination(lastResult.candidates);
  return <div>
    <PageHeader title={`${lastResult.district} — Final Election Results`} description="Round 1, Round 2 and bonus seat allocation."/>
    <div className="stats-grid">
      <StatCard title="Valid Votes" value={formatNumber(lastResult.validVotes)} icon={Vote}/>
      <StatCard title="Threshold" value={formatNumber(lastResult.threshold)} icon={Calculator}/>
      <StatCard title="Parties" value={lastResult.candidates.length} icon={Users}/>
      <StatCard title="Total Seats" value={lastResult.seats} icon={Award}/>
    </div>
    <Card><div className="card-title"><h3>Seat Allocation</h3><p>Final seats are the sum of Round 1, Round 2 and the bonus seat.</p></div>
      <DataTable columns={["#","Party","Votes","Qualification","Round 1","Round 2","Bonus","Total Seats"]}>
        {pageItems.map((c,index)=>{const i=(pagination?.page-1||0)*(pagination?.pageSize||10)+index;return <tr key={c.id}><td>{i+1}</td><td><strong>{c.name}</strong></td><td>{formatNumber(c.votes)}</td><td>{c.qualified?<StatusBadge status="success">Qualified</StatusBadge>:<StatusBadge status="danger">Disqualified</StatusBadge>}</td><td>{c.round1}</td><td>{c.round2}</td><td>{c.bonus?<StatusBadge status="warning">YES</StatusBadge>:"—"}</td><td><strong className="seat-result">{c.totalSeats}</strong></td></tr>;})}
      </DataTable>
      <Pagination {...(pagination || {page:1,pageCount:1,total:lastResult.candidates.length,pageSize:10,setPage:()=>{}})} />
    </Card>
  </div>;
}
