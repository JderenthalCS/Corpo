export function applyTheme(preference) {
  const root = document.documentElement;

  if (preference === "Light") {
    root.setAttribute("data-theme", "light");
  } else if (preference === "Dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}