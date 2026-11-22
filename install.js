(function () {
  var bar = document.getElementById("installBar");
  if (bar === null) return;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) return;
  var KEY = "sp_install_dismissed";
  var dismissed = false;
  try { dismissed = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  if (dismissed) return;

  var ua = navigator.userAgent;
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var inApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Snapchat/i.test(ua);
  var deferred = null;
  var text = document.getElementById("installText");
  var go = document.getElementById("installGo");
  var close = document.getElementById("installClose");
  var gate = document.getElementById("gate");

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    text.textContent = "Add Safe Pleasure to your home screen for quick, private access.";
    go.hidden = false;
  });
  window.addEventListener("appinstalled", function () { bar.hidden = true; });

  if (inApp) {
    text.textContent = "For the best experience, open this page in Chrome or Safari, then install the app.";
    go.hidden = true;
  } else if (isIOS) {
    text.textContent = "Install: tap the Share button, then Add to Home Screen.";
    go.hidden = true;
  } else {
    text.textContent = "Install: open your browser menu, then tap Install app or Add to Home screen.";
    go.hidden = true;
  }

  go.addEventListener("click", function () {
    if (deferred === null) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; bar.hidden = true; });
  });
  close.addEventListener("click", function () {
    bar.hidden = true;
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
  });

  var timer = setInterval(function () {
    if (gate.hidden === true) {
      clearInterval(timer);
      setTimeout(function () { bar.hidden = false; }, 1500);
    }
  }, 500);
})();
