(function () {
  // Welcome splash (once per visit, tap to skip)
  const splash = document.getElementById("splash");
  let seen = false;
  try { seen = sessionStorage.getItem("sp_splash") === "1"; } catch (e) {}
  const hideSplash = () => {
    splash.classList.add("out");
    try { sessionStorage.setItem("sp_splash", "1"); } catch (e) {}
    setTimeout(() => { splash.hidden = true; }, 900);
  };
  if (seen) { splash.hidden = true; } else {
    splash.addEventListener("click", hideSplash);
    setTimeout(hideSplash, 3400);
  }

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

  // Scroll reveal + active tab
  const tabs = Array.from(document.querySelectorAll(".tabbar a"));
  if ("IntersectionObserver" in window) {
    const rv = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll(".rv").forEach((el) => rv.observe(el));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) tabs.forEach((t) => t.classList.toggle("on", t.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-40% 0px -50% 0px" });
    ["home", "how", "safety", "apply"].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  } else {
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("in"));
  }

  // Offline support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
  }
})();
