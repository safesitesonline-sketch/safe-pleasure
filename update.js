(function () {
  "use strict";
  if (!("serviceWorker" in navigator)) return;
  var bar = document.getElementById("updateBar");
  var go = document.getElementById("updateGo");
  if (!bar || !go) return;
  var hadController = Boolean(navigator.serviceWorker.controller);
  var reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (hadController && !reloading) bar.hidden = false;
    hadController = true;
  });
  go.addEventListener("click", function () { reloading = true; location.reload(); });
  function check() {
    navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r.update(); }).catch(function () {});
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
  setInterval(check, 30 * 60 * 1000);
})();
