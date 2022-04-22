export const toDecimal = (value, max) => (value * (10 / max)) / 10;
export const fromDecimal = (value, max) => (value / (10 / max)) * 10;
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
export const keyify = (label) => label.toLowerCase().replace(/[^a-z]/gi, "_");
