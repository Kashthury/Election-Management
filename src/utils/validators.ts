export const required = (value: unknown) => Boolean(String(value ?? "").trim());

export const positiveInteger = (value: unknown) => Number.isInteger(Number(value)) && Number(value) > 0;
