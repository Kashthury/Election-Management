import { FileText } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function ReportsPage() {
  const { lastResult }=useAppContext();
  return <div>
    <PageHeader title="Reports" description="Preview and print the latest election result."/>
    <Card className="report-card">{lastResult ? <>
      <h2>Election Result Report</h2>
      <p><b>District:</b> {lastResult.district}</p>
      <p><b>Total Seats:</b> {lastResult.seats}</p>
      <p><b>Valid Votes:</b> {lastResult.validVotes.toLocaleString()}</p>
      <p><b>Disqualified Threshold:</b> {lastResult.threshold.toLocaleString()}</p>
      <Button icon={FileText} onClick={()=>window.print()}>Print Report</Button>
    </> : <div className="empty"><FileText size={38}/><h3>No report data</h3><p>Generate an election result first.</p></div>}</Card>
  </div>;
}