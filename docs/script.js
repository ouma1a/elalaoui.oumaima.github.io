// ===== Theme toggle with persistence =====
const toggle = document.getElementById("themeToggle");
const saved = localStorage.getItem("theme");
// Default is the beige (light) theme; dark = warm espresso.
if (saved === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  toggle.textContent = "☀️";
} else {
  toggle.textContent = "🌙";
}
toggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    toggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    toggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
});

// ===== Reveal sections on scroll =====
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

// ===== Typing effect in hero =====
const phrases = [
  "robust, scalable software.",
  "cloud-native microservices.",
  "clean, contract-first APIs.",
  "things that work in production.",
];
const typedEl = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typedEl && !reduceMotion) {
  let pi = 0;   // phrase index
  let ci = 0;   // char index
  let deleting = false;

  function tick() {
    const current = phrases[pi];
    ci += deleting ? -1 : 1;
    typedEl.textContent = current.slice(0, ci);

    let delay = deleting ? 45 : 90;
    if (!deleting && ci === current.length) {
      delay = 1800;            // pause at full word
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  tick();
} else if (typedEl) {
  typedEl.textContent = phrases[0];
}
