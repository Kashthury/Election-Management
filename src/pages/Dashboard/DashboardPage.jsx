import { Building2, Map, Users, Vote, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useAppContext } from "../../context/AppContext";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { provinces, districts, candidates } = useAppContext();
  const candidateCount = Object.values(candidates).reduce((sum, list) => sum + list.length, 0);
  const allocatedCount = districts.filter(d => Number(d.seats) > 0).length;

  const workflow = [
    ["01", "Configuration", "Set provinces, districts, seats and vote settings.", ROUTES.CONFIGURATION],
    ["02", "Nominations", "Register and manage candidates by district.", ROUTES.NOMINATION],
    ["03", "Vote entry", "Record valid votes and candidate votes.", ROUTES.ELECTION],
    ["04", "Results", "Review the calculated election results.", ROUTES.RESULTS],
  ];

  return <div>
    <PageHeader title="Election Management" description="Monitor election setup and move through each stage." action={<Button icon={Vote} onClick={() => navigate(ROUTES.ELECTION)}>Enter Votes</Button>}/>
    <div className="stats-grid">
      <StatCard title="Provinces" value={provinces.length} icon={Map}/>
      <StatCard title="Districts" value={districts.length} icon={Building2}/>
      <StatCard title="Candidates" value={candidateCount} icon={Users}/>
      <StatCard title="Districts with seats" value={`${allocatedCount}/${districts.length}`} icon={BarChart3}/>
    </div>
    <div className="dashboard-grid">
      <Card><div className="card-title"><h3>Election workflow</h3><p>Move through the key stages of the election.</p></div>
        {workflow.map(([number,title,description,path]) => <button className="workflow workflow-action" key={number} onClick={() => navigate(path)}>
          <span>{number}</span><div><strong>{title}</strong><p>{description}</p></div><b aria-hidden="true">›</b>
        </button>)}
      </Card>
      <Card><div className="card-title"><h3>Election at a glance</h3><p>Current setup and registration status.</p></div>
        <Readiness icon={Settings} title="Configuration" detail={`${provinces.length} provinces · ${districts.length} districts`} onClick={() => navigate(ROUTES.CONFIGURATION)}/>
        <Readiness icon={Users} tone="violet" title="Candidate nominations" detail={`${candidateCount} candidates registered`} onClick={() => navigate(ROUTES.NOMINATION)}/>
        <Readiness icon={BarChart3} tone="green" title="Seat allocation" detail={`${allocatedCount} of ${districts.length} districts configured`} onClick={() => navigate(ROUTES.SEATS)}/>
      </Card>
    </div>
  </div>;
}

function Readiness({ icon: Icon, tone = "blue", title, detail, onClick }) {
  return <button className="dashboard-readiness" onClick={onClick}><span className={`readiness-icon ${tone}`}><Icon size={17}/></span><span className="readiness-copy"><strong>{title}</strong><small>{detail}</small></span><b aria-hidden="true">›</b></button>;
}
