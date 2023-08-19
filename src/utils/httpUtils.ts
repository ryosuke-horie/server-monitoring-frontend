export function formUrlEncode(obj) {
  return Object.keys(obj)
    .map(
      (k) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(
          obj[k] === true ? "true" : obj[k] === false ? "false" : obj[k]
        )}`
    )
    .join("&");
}
