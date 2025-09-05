export const NumericToNumber = {
  to: (v?: number | null) => v,
  from: (v: string | null) => (v == null ? null : parseFloat(v)),
};
