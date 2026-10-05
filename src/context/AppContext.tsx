import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { initialProvinces, initialDistricts, initialCandidates, initialSettings } from "../mocks/electionData";
import type { CandidatesByDistrict, District, ElectionResult, ElectionSettings, Province, ResultLogEntry } from "../types";

const RESULT_LOG_KEY = "election-system-result-log";
const readResultLog = (): ResultLogEntry[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(RESULT_LOG_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(entry => entry && Array.isArray(entry.candidates)) : [];
  }
  catch { return []; }
};

interface AppContextValue {
  provinces: Province[];
  setProvinces: Dispatch<SetStateAction<Province[]>>;
  districts: District[];
  setDistricts: Dispatch<SetStateAction<District[]>>;
  candidates: CandidatesByDistrict;
  setCandidates: Dispatch<SetStateAction<CandidatesByDistrict>>;
  settings: ElectionSettings;
  setSettings: Dispatch<SetStateAction<ElectionSettings>>;
  lastResult: ResultLogEntry | null;
  setLastResult: Dispatch<SetStateAction<ResultLogEntry | null>>;
  resultsLog: ResultLogEntry[];
  setResultsLog: Dispatch<SetStateAction<ResultLogEntry[]>>;
  appendResult: (result: ElectionResult) => ResultLogEntry;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [provinces, setProvinces] = useState<Province[]>(initialProvinces);
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [candidates, setCandidates] = useState<CandidatesByDistrict>(initialCandidates);
  const [settings, setSettings] = useState<ElectionSettings>(initialSettings);
  const [lastResult, setLastResult] = useState<ResultLogEntry | null>(null);
  const [resultsLog, setResultsLog] = useState(readResultLog);
  useEffect(() => {
    try { localStorage.setItem(RESULT_LOG_KEY, JSON.stringify(resultsLog)); }
    catch { /* Continue using the in-memory result log if storage is unavailable. */ }
  }, [resultsLog]);
  const appendResult = (result: ElectionResult): ResultLogEntry => {
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

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used inside AppProvider");
  return context;
}
