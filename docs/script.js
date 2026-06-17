// ===== Theme toggle with persistence =====
const toggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
// Default is the beige (light) theme; dark = warm charcoal.
if (savedTheme === "dark") {
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

// ===== Typing effect (language-aware) =====
const typedEl = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const typedPhrases = {
  en: [
    "robust, scalable software.",
    "cloud-native microservices.",
    "clean, contract-first APIs.",
    "things that work in production.",
  ],
  fr: [
    "des logiciels robustes et évolutifs.",
    "des microservices cloud-native.",
    "des API claires et contract-first.",
    "des solutions fiables en production.",
  ],
};

// A generation token lets a language switch cancel the previous typing loop.
let typingGen = 0;

function startTyping(lang) {
  if (!typedEl) return;
  const phrases = typedPhrases[lang] || typedPhrases.en;

  if (reduceMotion) {
    typedEl.textContent = phrases[0];
    return;
  }

  const myGen = ++typingGen;
  let pi = 0; // phrase index
  let ci = 0; // char index
  let deleting = false;

  function tick() {
    if (myGen !== typingGen) return; // a newer language loop took over
    const current = phrases[pi];
    ci += deleting ? -1 : 1;
    typedEl.textContent = current.slice(0, ci);

    let delay = deleting ? 45 : 90;
    if (!deleting && ci === current.length) {
      delay = 1800; // pause at full word
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  tick();
}

// ===== Language switch (EN / FR) with persistence =====
const langButtons = document.querySelectorAll("#lang button");

function applyLanguage(lang) {
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-en]").forEach((el) => {
    const value = el.getAttribute("data-" + lang);
    if (value !== null) el.textContent = value;
  });

  langButtons.forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
  localStorage.setItem("lang", lang);
  startTyping(lang);
}

langButtons.forEach((btn) =>
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang))
);

// Initial language: saved preference → browser language → English.
const initialLang =
  localStorage.getItem("lang") ||
  (navigator.language && navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");
applyLanguage(initialLang);
