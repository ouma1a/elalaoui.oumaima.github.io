// Theme toggle with persistence
const toggle = document.getElementById("themeToggle");
const saved = localStorage.getItem("theme");
if (saved === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  toggle.textContent = "☀️";
}
toggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    toggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    toggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }
});

// Reveal sections on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".section, .hero").forEach((el) => observer.observe(el));
