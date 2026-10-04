export const required = value => Boolean(String(value ?? "").trim());

export const positiveInteger = value => Number.isInteger(Number(value)) && Number(value) > 0;