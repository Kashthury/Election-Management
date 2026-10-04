import { ArrowLeft, CheckCircle2, Percent, Save, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { settingsService } from "../../services/settingsService";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";

export default function VoteSettingsPage() {
  const navigate = useNavigate();
  const { settings, setSettings } = useAppContext();
  const [saved,setSaved]=useState(false);
  const save = async () => {
    const result=await settingsService.update(settings);
    setSettings(result);
    setSaved(true);
  };
  return <div>
    <PageHeader title="Vote Settings" description="Configure the disqualified vote percentage used by the election calculation." action={<button className="button secondary configuration-back" onClick={() => navigate(ROUTES.CONFIGURATION)}><ArrowLeft size={16}/> Back to Configuration</button>}/>
    <div className="module-summary-grid"><div className="module-summary-card"><span className="module-summary-icon blue"><Percent size={19}/></span><div><small>Current threshold</small><strong>{settings.disqualifiedPercentage}%</strong></div></div><div className="module-summary-card"><span className="module-summary-icon green"><ShieldCheck size={19}/></span><div><small>Policy status</small><strong className="summary-word">Active</strong></div></div><div className="module-summary-card"><span className="module-summary-icon violet"><CheckCircle2 size={19}/></span><div><small>Allowed range</small><strong>0% <small>to 100%</small></strong></div></div></div>
    <section className="settings-workspace"><div className="settings-workspace-heading"><span className="module-summary-icon blue"><ShieldCheck size={20}/></span><div><h3>Vote qualification threshold</h3><p>Set the percentage of votes classified as disqualified for election calculations.</p></div></div><div className="settings-workspace-grid"><div className="settings-control"><label htmlFor="disqualified-percentage">Disqualified vote percentage</label><div className="percentage-input-wrap"><input id="disqualified-percentage" className="input big-input" type="number" min="0" max="100" value={settings.disqualifiedPercentage} onChange={e=>{setSaved(false);setSettings(s=>({...s,disqualifiedPercentage:Number(e.target.value)}));}}/><span>%</span></div><p>Choose a value between 0 and 100. This threshold is used when calculating election results.</p></div><div className="settings-preview"><div><span className="preview-label">CURRENT RULE</span><strong>Votes above <b>{settings.disqualifiedPercentage}%</b> are disqualified</strong></div><span className="preview-shield"><ShieldCheck size={19}/></span></div></div><div className="settings-workspace-footer">{saved&&<span className="inline-success"><CheckCircle2 size={15}/> Settings saved successfully.</span>}<Button icon={Save} onClick={save}>Save Changes</Button></div></section>
  </div>;
}
