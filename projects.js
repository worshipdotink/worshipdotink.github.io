(function () {
  function togglefilters() {
    var filterBar = document.getElementById("filterbar");
    var filterTags = document.getElementById("filtertags");
    var sortTags = document.getElementById("sorttags");
    if (!filterBar || !filterTags || !sortTags) return;

    if (
      filterBar.classList.contains("openfilterbar") &&
      filterTags.style.display !== "none"
    ) {
      setTimeout(function () {
        sortTags.style.display = "none";
        filterTags.style.display = "none";
        filterBar.classList.remove("openfilterbar");
      }, 200);

      setTimeout(function () {
        filterTags.style.opacity = "0";
        sortTags.style.opacity = "0";
      }, 100);
    } else {
      filterBar.classList.add("openfilterbar");

      setTimeout(function () {
        sortTags.style.display = "none";
        filterTags.style.display = "";
      }, 300);

      setTimeout(function () {
        sortTags.style.opacity = "0";
        filterTags.style.opacity = "1";
      }, 400);
    }
  }

  function nextproject() {
    var section = document.querySelector(".project-area");
    if (!section) return;
    window.scrollBy({
      top: section.offsetHeight,
      left: 0,
      behavior: "smooth"
    });
  }

  function filter(type) {
    var filterAnim = document.getElementById("filteranim");
    var projectContainer = document.getElementById("projectcontainer");
    var filterBar = document.getElementById("filterbar");
    var sortTags = document.getElementById("sorttags");
    var filterTags = document.getElementById("filtertags");
    var filteringContainer = document.getElementById("filteringcontainer");
    var allElements = document.querySelectorAll(".project-area");

    if (filterAnim) filterAnim.style.opacity = "1";
    if (projectContainer) projectContainer.style.display = "none";
    if (filterBar) filterBar.classList.remove("openfilterbar");
    if (sortTags) sortTags.style.display = "none";
    if (filterTags) filterTags.style.display = "none";
    if (filteringContainer) filteringContainer.style.display = "";

    if (type.toLowerCase() === "all") {
      allElements.forEach(function (element) {
        element.style.display = "";
      });
    } else {
      allElements.forEach(function (element) {
        if (element.getAttribute("data-projecttype") !== type.toLowerCase()) {
          element.style.display = "none";
        } else {
          element.style.display = "";
        }
      });
    }

    setTimeout(function () {
      if (projectContainer) projectContainer.style.display = "";
      if (filterAnim) filterAnim.style.opacity = "0";
      if (filteringContainer) filteringContainer.style.display = "none";
    }, 2000);

    window.scrollTo(0, 0);
  }

  function updateFilterBarPosition() {
    var filters = document.getElementById("filterbar");
    var section = document.querySelector(".project-area");
    if (!filters || !section) return;

    var body = document.body;
    var html = document.documentElement;
    var untilfooter =
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) -
      (section.offsetHeight + 30);

    if (window.scrollY > untilfooter) {
      filters.classList.remove("downfilterbar");
      filters.classList.remove("upfilterbar");
      filters.classList.add("superupfilterbar");
    } else {
      filters.classList.add("upfilterbar");
      filters.classList.remove("downfilterbar");
      filters.classList.remove("superupfilterbar");
    }
  }

  function initFilterBar() {
    var filterAnim = document.getElementById("filteranim");
    var sortTags = document.getElementById("sorttags");
    var filterTags = document.getElementById("filtertags");

    if (filterAnim) filterAnim.style.opacity = "0";
    if (sortTags) sortTags.style.display = "none";
    if (filterTags) {
      filterTags.style.display = "none";
      filterTags.style.opacity = "0";
    }
  }

  function updateBirthdayCountdown() {
    var el = document.getElementById("birthdaycountdown");
    if (!el) return;

    var currentYear = new Date().getFullYear();
    var targetDate = new Date(currentYear, 2, 5);
    var currentDate = new Date();

    if (currentDate > targetDate) {
      targetDate.setFullYear(currentYear + 1);
    }

    var daysUntil = Math.ceil(
      (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil === 0) {
      el.textContent = "Today is my birthday!";
    } else if (daysUntil === 1) {
      el.textContent = "1 day until my birthday";
    } else {
      el.textContent = daysUntil + " days until my birthday";
    }
  }

  function initLogoChrome() {
    var root = document.documentElement;
    var headerSampleOffset = 36;
    var colorProbe = document.createElement("div");
    var rafId = null;

    colorProbe.style.display = "none";
    document.body.appendChild(colorProbe);

    function readCssColor(varName) {
      colorProbe.style.backgroundColor = "var(" + varName + ")";
      var computed = getComputedStyle(colorProbe).backgroundColor;
      return parseRgb(computed) || { r: 4, g: 11, b: 9 };
    }

    function parseRgb(computed) {
      var match = computed && computed.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      var parts = match[1].split(",").map(function (part) {
        return parseFloat(part.trim());
      });
      if (parts.length < 3) return null;
      return { r: parts[0], g: parts[1], b: parts[2] };
    }

    function sampleBackgroundColor() {
      var x = Math.round(window.innerWidth / 2);
      var y = headerSampleOffset;
      var el = document.elementFromPoint(x, y);

      while (el && el !== document.documentElement) {
        var bg = getComputedStyle(el).backgroundColor;
        var parsed = parseRgb(bg);
        if (parsed && bg !== "rgba(0, 0, 0, 0)") {
          return parsed;
        }
        el = el.parentElement;
      }

      return readCssColor("--bg");
    }

    function syncChrome() {
      rafId = null;
      var tint = sampleBackgroundColor();

      root.style.setProperty(
        "--header-blur-tint",
        tint.r + ", " + tint.g + ", " + tint.b
      );

      if (typeof window.updateHeaderNavTint === "function") {
        window.updateHeaderNavTint(tint);
      }
    }

    function scheduleChromeSync() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(syncChrome);
    }

    window.addEventListener("scroll", scheduleChromeSync, { passive: true });
    window.addEventListener("resize", scheduleChromeSync);
    window.addEventListener("load", syncChrome);

    var colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (typeof colorScheme.addEventListener === "function") {
      colorScheme.addEventListener("change", syncChrome);
    } else if (typeof colorScheme.addListener === "function") {
      colorScheme.addListener(syncChrome);
    }

    syncChrome();
  }

  window.togglefilters = togglefilters;
  window.nextproject = nextproject;
  window.filter = filter;

  document.addEventListener("DOMContentLoaded", function () {
    initLogoChrome();
    initFilterBar();
    updateBirthdayCountdown();
    updateFilterBarPosition();
    window.addEventListener("scroll", updateFilterBarPosition, { passive: true });
    window.addEventListener("resize", updateFilterBarPosition);
  });
})();
