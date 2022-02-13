export function formatPrice(value?: number) {
  if (value === undefined) return "不明";
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  return formatter.format(value);
}
