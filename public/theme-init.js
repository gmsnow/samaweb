(function () {
  try {
    var e = localStorage.getItem("theme");
    var t = (e === "light" || e === "dark" || e === "system") ? e : "system";
    var r = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
    var d = document.documentElement;
    d.classList.remove("light", "dark");
    d.classList.add(r);
    d.style.colorScheme = r;
  } catch {}
})();
