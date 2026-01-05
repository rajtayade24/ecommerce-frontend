// Accepts amount in paise (smallest unit for INR) and returns formatted string
export const formattedRupee = (amountInPaise) => {
  if (amountInPaise == null) return "₹0";
  
  const amount = amountInPaise / 100; // convert paise to rupees
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
};
