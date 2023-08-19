export function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2,"0")}/${String(date.getDate()).padStart(2, "0")}`;
}

export function adjustDate(currentDate, days) {
  const adjustedDate = new Date(currentDate);
  adjustedDate.setDate(currentDate.getDate() + days);
  return formatDate(adjustedDate);
}
