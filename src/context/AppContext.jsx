import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialProvinces, initialDistricts, initialCandidates, initialSettings } from "../mocks/electionData";

const RESULT_LOG_KEY = "election-system-result-log";
const readResultLog = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(RESULT_LOG_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(entry => entry && Array.isArray(entry.candidates)) : [];
  }
  catch { return []; }
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [provinces, setProvinces] = useState(initialProvinces);
  const [districts, setDistricts] = useState(initialDistricts);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [settings, setSettings] = useState(initialSettings);
  const [lastResult, setLastResult] = useState(null);
  const [resultsLog, setResultsLog] = useState(readResultLog);
  useEffect(() => {
    try { localStorage.setItem(RESULT_LOG_KEY, JSON.stringify(resultsLog)); }
    catch { /* Continue using the in-memory result log if storage is unavailable. */ }
  }, [resultsLog]);
  const appendResult = result => {
    const entry = { ...result, logId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, calculatedAt: new Date().toISOString() };
    setResultsLog(previous => {
      const next = [entry, ...previous];
      return next;
    });
    setLastResult(entry);
    return entry;
  };

  const value = useMemo(() => ({
    provinces, setProvinces,
    districts, setDistricts,
    candidates, setCandidates,
    settings, setSettings,
    lastResult, setLastResult,
    resultsLog, setResultsLog, appendResult,
  }), [provinces, districts, candidates, settings, lastResult, resultsLog]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
