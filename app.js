// WhatsApp number in international format, digits only
const WA_NUMBER = "2348127297983";

(function () {
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

  const f = document.querySelector("form#applyForm");
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
})();
