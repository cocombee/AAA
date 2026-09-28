const key = "aaa-v2-development-session";
export const developmentSessionEvent = "aaa-v2-development-session-change";

export function hasDevelopmentSession() {
  try { return localStorage.getItem(key) === "active"; } catch { return false; }
}

export function startDevelopmentSession() {
  try { localStorage.setItem(key, "active"); } catch { /* Preview remains usable without storage. */ }
  window.dispatchEvent(new Event(developmentSessionEvent));
}

export function endDevelopmentSession() {
  try { localStorage.removeItem(key); } catch { /* Preview remains usable without storage. */ }
  window.dispatchEvent(new Event(developmentSessionEvent));
}
