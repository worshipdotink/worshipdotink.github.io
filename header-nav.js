(function () {
  var CONTACT_MAILTO =
    "mailto:contact@michaeldors.com?subject=Hello%20from%20michaeldors.com";
  var BRAND_TINT_MATCH_THRESHOLD = 42;
  var colorProbe = null;

  function getColorProbe() {
    if (!colorProbe) {
      colorProbe = document.createElement("div");
      colorProbe.style.display = "none";
      document.body.appendChild(colorProbe);
    }
    return colorProbe;
  }

  function readCssColor(varName) {
    var probe = getColorProbe();
    probe.style.backgroundColor = "var(" + varName + ")";
    var computed = getComputedStyle(probe).backgroundColor;
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

  function colorDistance(a, b) {
    return Math.sqrt(
      Math.pow(a.r - b.r, 2) +
        Math.pow(a.g - b.g, 2) +
        Math.pow(a.b - b.b, 2)
    );
  }

  function isBrandHeaderTint(tint) {
    if (!tint) return false;
    var brand = readCssColor("--brand-color");
    var bg = readCssColor("--bg");
    var distToBrand = colorDistance(tint, brand);
    if (distToBrand > BRAND_TINT_MATCH_THRESHOLD) return false;
    return distToBrand < colorDistance(tint, bg);
  }

  function readCurrentHeaderTint() {
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-blur-tint")
      .trim();
    if (!raw) return readCssColor("--bg");
    var parts = raw.split(",").map(function (part) {
      return parseFloat(part.trim());
    });
    if (parts.length < 3 || parts.some(function (n) { return Number.isNaN(n); })) {
      return readCssColor("--bg");
    }
    return { r: parts[0], g: parts[1], b: parts[2] };
  }

  function updateHeaderNavTint(tint) {
    var header = document.querySelector(".top-header");
    if (!header) return;
    header.classList.toggle("is-brand-tint", isBrandHeaderTint(tint));
  }

  function syncNavTintFromHeaderCss() {
    updateHeaderNavTint(readCurrentHeaderTint());
  }

  function isHomePage() {
    return Boolean(document.getElementById("heroSection"));
  }

  function closeMobileMenu(header) {
    if (!header) return;
    header.classList.remove("is-menu-open");
    var toggle = header.querySelector(".header-menu-toggle");
    var menu = header.querySelector(".header-mobile-menu");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (menu) menu.hidden = true;
  }

  function openMobileMenu(header) {
    header.classList.add("is-menu-open");
    var toggle = header.querySelector(".header-menu-toggle");
    var menu = header.querySelector(".header-mobile-menu");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (menu) menu.hidden = false;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markActiveNavLink(header) {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = header.querySelectorAll(".header-nav-link[data-nav-page]");
    links.forEach(function (link) {
      var page = link.getAttribute("data-nav-page");
      var active =
        (page === "home" && isHomePage()) ||
        (page === "about" && path === "about.html") ||
        (page === "projects" && path === "projects.html");
      link.classList.toggle("is-active", active);
    });
  }

  function bindHomeNavigation(link, onHome, homeHref) {
    link.href = onHome ? "#" : homeHref;
    link.addEventListener("click", function (event) {
      if (!onHome) return;
      event.preventDefault();
      scrollToTop();
      closeMobileMenu(link.closest(".top-header"));
    });
  }

  function initSiteHeader() {
    var header = document.querySelector(".top-header");
    if (!header) return;

    var onHome = isHomePage();
    var homeHref = document.body.getAttribute("data-home-href") || "index.html";
    var logoLink = header.querySelector(".header-logo-link");
    var homeLinks = header.querySelectorAll("[data-nav-home]");
    var toggle = header.querySelector(".header-menu-toggle");
    var menu = header.querySelector(".header-mobile-menu");

    if (logoLink) {
      bindHomeNavigation(logoLink, onHome, homeHref);
    }

    homeLinks.forEach(function (link) {
      bindHomeNavigation(link, onHome, homeHref);
    });

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        if (header.classList.contains("is-menu-open")) {
          closeMobileMenu(header);
        } else {
          openMobileMenu(header);
        }
      });

      document.addEventListener("click", function (event) {
        if (!header.classList.contains("is-menu-open")) return;
        if (header.contains(event.target)) return;
        closeMobileMenu(header);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMobileMenu(header);
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          closeMobileMenu(header);
        });
      });
    }

    markActiveNavLink(header);
    syncNavTintFromHeaderCss();
    requestAnimationFrame(syncNavTintFromHeaderCss);
  }

  window.initSiteHeader = initSiteHeader;
  window.syncNavTintFromHeaderCss = syncNavTintFromHeaderCss;
  window.updateHeaderNavTint = updateHeaderNavTint;
  window.MD_CONTACT_MAILTO = CONTACT_MAILTO;

  document.addEventListener("DOMContentLoaded", initSiteHeader);
})();
