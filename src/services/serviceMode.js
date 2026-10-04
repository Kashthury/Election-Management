import { mockAdapter } from "./adapters/mockAdapter";
import { apiAdapter } from "./adapters/apiAdapter";

export const useMock = String(import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() === "true";

export const adapter = useMock ? mockAdapter : apiAdapter;