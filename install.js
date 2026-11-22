(function () {
  "use strict";
  var bar = document.getElementById("installBar");
  var headBtn = document.getElementById("install");
  var text = document.getElementById("installText");
  var go = document.getElementById("installGo");
  var close = document.getElementById("installClose");
  var gate = document.getElementById("gate");
  if (!bar || !text || !go || !close || !gate) return;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) return;

  var KEY = "sp_install_dismissed";
  var WEEK = 7 * 24 * 60 * 60 * 1000;
  var ua = navigator.userAgent;
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Snapchat|TikTok/i.test(ua);
  var deferred = null;

  function dismissedRecently() {
    try { var t = parseInt(localStorage.getItem(KEY), 10); return t > 0 && Date.now() - t < WEEK; } catch (e) { return false; }
  }
  function remember() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function showBar() { if (!dismissedRecently()) bar.hidden = false; }
  function hideAll() { bar.hidden = true; if (headBtn) headBtn.hidden = true; }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    text.textContent = "Install Safe Pleasure: one tap, private, opens like an app.";
    go.hidden = false;
    if (headBtn) headBtn.hidden = false;
    if (gate.hidden === true) showBar();
  });
  window.addEventListener("appinstalled", function () { deferred = null; hideAll(); });

  function install() {
    if (!deferred) return;
    var d = deferred;
    deferred = null;
    d.prompt();
    d.userChoice.then(function (c) {
      hideAll();
      if (!c || c.outcome !== "accepted") remember();
    }).catch(function () {});
  }
  go.addEventListener("click", install);
  if (headBtn) headBtn.addEventListener("click", install);
  close.addEventListener("click", function () { bar.hidden = true; remember(); });

  if (inApp) {
    text.textContent = "For the best experience, open this page in Chrome or Safari, then install the app.";
    go.hidden = true;
  } else if (isIOS) {
    text.textContent = "Install: tap the Share button, then Add to Home Screen.";
    go.hidden = true;
  }

  var timer = setInterval(function () {
    if (gate.hidden === true) {
      clearInterval(timer);
      setTimeout(function () { if (deferred || isIOS || inApp) showBar(); }, 1500);
    }
  }, 500);
})();
