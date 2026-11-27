// ===== 1. Dark Mode Toggle (tersimpan di localStorage) =====
const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");

const applyTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
};

applyTheme(
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);
toggleBtn.addEventListener("click", () =>
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
);

// ===== 2. Form Handling =====
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
const submitBtn = document.getElementById("submitBtn");
const pesan = document.getElementById("pesan");
const counter = document.getElementById("counter");

pesan.addEventListener("input", () => {
  counter.textContent = `${pesan.value.length}/200`;
});

const confetti = () => {
  const colors = ["#34d399", "#fbbf24", "#60a5fa", "#f472b6", "#a78bfa"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    document.body.appendChild(piece);
    const fall = piece.animate(
      [
        { transform: "translateY(0) rotate(0)", opacity: 1 },
        { transform: `translate(${Math.random() * 160 - 80}px, 105vh) rotate(${Math.random() * 720}deg)`, opacity: 0.8 }
      ],
      { duration: 1800 + Math.random() * 1500, easing: "cubic-bezier(.3,.6,.4,1)" }
    );
    fall.onfinish = () => piece.remove();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah reload halaman
  const nama = document.getElementById("nama").value.trim();
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  setTimeout(() => {
    formMsg.hidden = false;
    formMsg.textContent = `🎉 Halo ${nama}, pesan Anda berhasil terkirim!`;
    form.reset();
    counter.textContent = "0/200";
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Pesan";
    confetti();
  }, 900);
});

// ===== 3. Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Kreasi tambahan =====
// Efek mengetik di hero
const words = ["membangun website modern.", "mendesain tampilan responsif.", "belajar HTML, CSS & JavaScript."];
const typed = document.getElementById("typed");
let w = 0, c = 0, deleting = false;

const type = () => {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  c += deleting ? -1 : 1;
  let delay = deleting ? 35 : 75;
  if (!deleting && c > word.length) { deleting = true; delay = 1500; }
  else if (deleting && c < 0) { deleting = false; c = 0; w = (w + 1) % words.length; delay = 400; }
  setTimeout(type, delay);
};
type();

// Reveal section saat di-scroll + hitung angka statistik
const countUp = (el) => {
  const goal = +el.dataset.count;
  let n = 0;
  const step = setInterval(() => {
    el.textContent = ++n;
    if (n >= goal) clearInterval(step);
  }, 250);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Progress bar, tombol back-to-top, dan menu aktif
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("nav ul a");

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max) * 100 + "%";
  toTop.classList.toggle("show", window.scrollY > 400);

  let current = "";
  sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));