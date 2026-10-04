import { createContext, useContext, useMemo, useState } from "react";
import { initialProvinces, initialDistricts, initialCandidates, initialSettings } from "../mocks/electionData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [provinces, setProvinces] = useState(initialProvinces);
  const [districts, setDistricts] = useState(initialDistricts);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [settings, setSettings] = useState(initialSettings);
  const [lastResult, setLastResult] = useState(null);

  const value = useMemo(() => ({
    provinces, setProvinces,
    districts, setDistricts,
    candidates, setCandidates,
    settings, setSettings,
    lastResult, setLastResult,
  }), [provinces, districts, candidates, settings, lastResult]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}