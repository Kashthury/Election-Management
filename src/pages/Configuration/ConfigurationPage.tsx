import { ArrowLeft, ArrowRight, BarChart3, Building2, Map, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { ROUTES } from "../../constants/routes";
import PageHeader from "../../components/common/PageHeader";

const modules = [
  {
    title: "Provinces",
    description: "Manage the provinces included in the election and keep your administrative structure up to date.",
    path: ROUTES.PROVINCES,
    icon: Map,
    tone: "blue",
    metric: "provinceCount",
    unit: "configured",
    eyebrow: "GEOGRAPHY",
  },
  {
    title: "Districts",
    description: "Organize districts under their provinces and maintain a clear view of election coverage.",
    path: ROUTES.DISTRICTS,
    icon: Building2,
    tone: "violet",
    metric: "districtCount",
    unit: "configured",
    eyebrow: "GEOGRAPHY",
  },
  {
    title: "Seat allocation",
    description: "Set the number of seats per district and review which areas are ready for allocation.",
    path: ROUTES.SEATS,
    icon: BarChart3,
    tone: "teal",
    metric: "seatCount",
    unit: "seats allocated",
    eyebrow: "REPRESENTATION",
  },
  {
    title: "Vote settings",
    description: "Configure the disqualified vote threshold applied by the election calculation.",
    path: ROUTES.SETTINGS,
    icon: SlidersHorizontal,
    tone: "amber",
    metric: "voteThreshold",
    unit: "vote threshold",
    eyebrow: "ELECTION RULES",
  },
];

export default function ConfigurationPage() {
  const navigate = useNavigate();
  const canGoBack = window.history.state?.idx > 0;
  const { provinces, districts, settings } = useAppContext();
  const allocatedSeats = districts.reduce((sum, district) => sum + (Number(district.seats) || 0), 0);
  const values = {
    provinceCount: provinces.length,
    districtCount: districts.length,
    seatCount: allocatedSeats,
    voteThreshold: `${Number(settings.disqualifiedPercentage) || 0}%`,
  };

  return (
    <div className="configuration-page">
      <PageHeader
        title="Configuration"
        description="Manage the structure and rules that power your election."
        action={<button className="button secondary configuration-back" onClick={() => navigate(canGoBack ? -1 : ROUTES.DASHBOARD)}><ArrowLeft size={16} /> Back</button>}
      />

      <div className="configuration-grid">
        {modules.map(({ title, description, path, icon: Icon, tone, metric, unit, eyebrow }) => (
          <Link className={`configuration-card ${tone}`} to={path} key={path}>
            <div className="configuration-card-top">
              <div className="configuration-card-icon"><Icon size={20} strokeWidth={1.8} /></div>
              <span className="configuration-card-arrow" aria-hidden="true"><ArrowRight size={17} /></span>
            </div>
            <span className="configuration-card-eyebrow">{eyebrow}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="configuration-card-footer">
              <div className="configuration-card-metric"><strong>{values[metric]}</strong><span>{unit}</span></div>
              <span className="configuration-card-link">Manage <ArrowRight size={14} /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
