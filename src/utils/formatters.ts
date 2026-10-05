export const formatNumber = (value: number | string | null | undefined) => Number(value || 0).toLocaleString();

export const formatPercent = (value: number | string | null | undefined) => `${Number(value || 0)}%`;
