export function applyTheme(preference) {
  const root = document.documentElement;

  if (preference === "Light") {
    root.setAttribute("data-theme", "light");
  } else if (preference === "Dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  // Save the choice so it survives a refresh
  localStorage.setItem("theme-preference", preference);
}

// Call this once when the app initializes
export function initTheme() {
  const saved = localStorage.getItem("theme-preference");
  if (saved) applyTheme(saved);
}