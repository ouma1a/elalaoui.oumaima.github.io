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

// ===== Animated counters (count up when scrolled into view) =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target) || 0;
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = target + suffix;
    return;
  }
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".stat__num").forEach((el) => statObserver.observe(el));

// ===== Scroll progress bar + back-to-top button =====
const progressBar = document.getElementById("progress");
const toTop = document.getElementById("toTop");
function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const ratio = max > 0 ? doc.scrollTop / max : 0;
  if (progressBar) progressBar.style.width = ratio * 100 + "%";
  if (toTop) toTop.classList.toggle("show", doc.scrollTop > 400);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
if (toTop) {
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// ===== Make whole project cards clickable =====
document.querySelectorAll(".card[data-href]").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return; // let explicit links handle themselves
    window.open(card.dataset.href, "_blank", "noopener");
  });
});

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
