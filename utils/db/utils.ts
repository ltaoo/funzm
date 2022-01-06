export function parseLocalId(id) {
  if (!id) {
    return null;
  }
  const t = String(id);
  if (t.includes("@id")) {
    return Number(t.replace("@id", ""));
  }
  return id;
}

export function isLocalId(id) {
  if (typeof id === "string") {
    return id.includes("@id");
  }
  return true;
}
