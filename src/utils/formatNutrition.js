export const formatNutrition = (value, unit) => {
  if (!value) return "";

  const v = value.replaceAll('"', "").replaceAll(",", "");

  if (v.includes("per")) return v;
  if (v.includes(unit)) return `${v} per 100g`;

  return `${v} ${unit} per 100g`;
};
