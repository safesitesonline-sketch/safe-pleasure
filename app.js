// WhatsApp number in international format, digits only
const WA_NUMBER = "2348127297983";

(function () {
  // 18+ gate
  const gate = document.getElementById("gate");
  let ok = false;
  try { ok = localStorage.getItem("sp18") === "1"; } catch (e) {}
  if (ok) gate.hidden = true; else document.body.classList.add("locked");

  document.getElementById("enter").onclick = () => {
    try { localStorage.setItem("sp18", "1"); } catch (e) {}
    gate.hidden = true;
    document.body.classList.remove("locked");
  };
  document.getElementById("leave").onclick = () => { location.href = "https://www.google.com"; };
  document.getElementById("yr").textContent = new Date().getFullYear();

  // Contact form -> WhatsApp
  const f = document.getElementById("applyForm");
  const msg = document.getElementById("formMsg");
  const clean = (s) => String(s || "").replace(/[\r\n]+/g, " ").trim().slice(0, 300);

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    const age = parseInt(d.age, 10);
    if (!clean(d.name) || !clean(d.city)) return (msg.textContent = "Please fill in your name and city.");
    if (!(age >= 18 && age <= 99)) return (msg.textContent = "You must be 18 or older.");
    if (!d.consent) return (msg.textContent = "Please tick the confirmation box.");
    if (!/^\d{10,15}$/.test(WA_NUMBER)) return (msg.textContent = "Contact number is not configured yet.");
    msg.textContent = "";
    const text = "Hello, I found Safe Pleasure.\nName: " + clean(d.name) + "\nAge: " + age +
      "\nCity: " + clean(d.city) + "\nLooking for: " + clean(d.want) + "\nMessage: " + clean(d.note);
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  });

  // Highlight the active tab while scrolling
  const tabs = Array.from(document.querySelectorAll(".tabbar a"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tabs.forEach((t) => t.classList.toggle("on", t.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    ["home", "how", "safety", "apply"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Install button (Android/Chrome)
  let deferred = null;
  const btn = document.getElementById("install");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    btn.hidden = false;
  });
  btn.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btn.hidden = true;
  });
  window.addEventListener("appinstalled", () => { btn.hidden = true; });

  // Offline support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }
})();
