export function parseLocalId(id) {
  const t = String(id);
  if (t.includes("@id")) {
    return Number(t.replace("@id", ""));
  }
  return Number(id);
}

export function isLocalId(id) {
  if (typeof id === "string") {
    return id.includes("@id");
  }
  return true;
}
