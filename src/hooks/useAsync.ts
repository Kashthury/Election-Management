import { useCallback, useEffect, useState } from "react";

export function useAsync(asyncFunction, dependencies = [], immediate = true) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });

  const execute = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFunction(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { ...state, execute };
}