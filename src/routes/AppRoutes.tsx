import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProvincesPage from "../pages/Configuration/ProvincesPage";
import DistrictsPage from "../pages/Configuration/DistrictsPage";
import SeatsPage from "../pages/Configuration/SeatsPage";
import VoteSettingsPage from "../pages/Configuration/VoteSettingsPage";
import ConfigurationPage from "../pages/Configuration/ConfigurationPage";
import NominationPage from "../pages/Nomination/NominationPage";
import ElectionPage from "../pages/Election/ElectionPage";
import ResultsPage from "../pages/Results/ResultsPage";
import ResultLogPage from "../pages/Results/ResultLogPage";
import ReportsPage from "../pages/Reports/ReportsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.CONFIGURATION} element={<ConfigurationPage />} />
        <Route path={ROUTES.PROVINCES} element={<ProvincesPage />} />
        <Route path={ROUTES.DISTRICTS} element={<DistrictsPage />} />
        <Route path={ROUTES.SEATS} element={<SeatsPage />} />
        <Route path={ROUTES.SETTINGS} element={<VoteSettingsPage />} />
        <Route path={ROUTES.NOMINATION} element={<NominationPage />} />
        <Route path={ROUTES.ELECTION} element={<ElectionPage />} />
        <Route path={ROUTES.RESULT_LOG} element={<ResultLogPage />} />
        <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
