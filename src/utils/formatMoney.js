
export function formatMoney(amount = 0, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch (e) {
    return `₹${amount}`;
  }
}