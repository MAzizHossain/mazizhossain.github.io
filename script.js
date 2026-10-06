// =========================================================
// Site configuration
// =========================================================

var NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "publications.html", label: "Publications" },
  { href: "gaming.html", label: "Gaming", section: "gaming" },
  { href: "teaching.html", label: "Teaching" },
  { href: "gallery.html", label: "Gallery" },
  { href: "contact.html", label: "Contact" }
];

var SITE_NAME = "Mohammed Aziz Hossain";

var FOOTER_HTML =
  "<p>&copy; 2026 Aziz Hossain. Built with GitHub Pages.</p>";

var THEME_KEY = "site-theme";


// =========================================================
// Theme
// =========================================================

function preferredTheme() {
  var stored = null;

  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (e) {}

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  var btn = document.getElementById("themeToggle");

  if (btn) {
    btn.textContent = theme === "dark" ? "Light" : "Dark";
    btn.setAttribute(
      "aria-pressed",
      theme === "dark" ? "true" : "false"
    );
  }
}

// Initial theme application before DOM loads to prevent page flickering
applyTheme(preferredTheme());


// =========================================================
// Current page helper
// =========================================================

function currentPage() {
  var path = window.location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}


// =========================================================
// Header Renderer
// =========================================================

function renderHeader() {
  var page = currentPage();

  var links = NAV_ITEMS.map(function (item) {
    var activeClass = item.href === page ? 'class="active"' : '';
    var sectionAttr = item.section ? `data-section="${item.section}"` : '';

    return `<a href="${item.href}" ${activeClass} ${sectionAttr}>${item.label}</a>`;
  }).join("\n    ");

  return `
    <div class="sidebar-top">
      <a class="wordmark" href="index.html">${SITE_NAME}</a>
      <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span></span>
        <span></span>
        <span></span>
        <span class="sr-only">Menu</span>
      </button>
    </div>
    <nav class="nav-links" id="nav-links" aria-label="Main navigation">
      ${links}
    </nav>
  `;
}


// =========================================================
// Theme tab button renderer
// =========================================================

function renderThemeTab() {
  return (
    '<button class="theme-tab" id="themeToggle" type="button" aria-pressed="false" aria-label="Switch color theme">' +
    'Dark' +
    '</button>'
  );
}


// =========================================================
// Mobile Navigation Toggle
// =========================================================

function initToggle() {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("nav-links");

  if (!toggle || !links) {
    return;
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    var isOpen = links.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    var isOpen = links.classList.contains("open");
    if (!isOpen) return;

    var clickedInsideMenu = links.contains(event.target);
    var clickedToggle = toggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      links.classList.contains("open")
    ) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}


// =========================================================
// Theme Toggle Handler
// =========================================================

function initThemeToggle() {
  var btn = document.getElementById("themeToggle");

  if (!btn) {
    return;
  }

  applyTheme(preferredTheme());

  btn.addEventListener("click", function () {
    var current =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

    var next = current === "dark" ? "light" : "dark";

    applyTheme(next);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
  });
}


// =========================================================
// Expandable News / Currently panels
// =========================================================

function initInfoPanels() {
  var buttons = document.querySelectorAll(".info-toggle");

  if (!buttons.length) {
    return;
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var panelId = button.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);

      if (!panel) {
        return;
      }

      var isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        isOpen ? "false" : "true"
      );

      panel.hidden = isOpen;
    });
  });
}


// =========================================================
// Mobile News / Current Progress drawer
// =========================================================

function initUpdatesDrawer() {
  var drawer = document.querySelector(".side-updates");
  var toggle = document.querySelector(".updates-drawer-toggle");

  if (!drawer || !toggle) {
    return;
  }

  var arrow = toggle.querySelector("span");

  toggle.addEventListener("click", function () {
    var isOpen = drawer.classList.toggle("updates-open");

    toggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close site updates" : "Open site updates"
    );

    if (arrow) {
      arrow.textContent = isOpen ? "←" : "→";
    }
  });
}


// =========================================================
// Dim the drawer tab only when it overlaps text (mobile only,
// and only while the drawer is closed — once open, the panel
// covering content is expected, so no dimming there).
// =========================================================

function initUpdatesTabDimming() {
  var drawer = document.querySelector(".side-updates");
  var toggle = document.querySelector(".updates-drawer-toggle");

  if (!drawer || !toggle) {
    return;
  }

  var mobileQuery = window.matchMedia("(max-width: 700px)");
  var ticking = false;

  function checkOverlap() {
    ticking = false;

    if (!mobileQuery.matches || drawer.classList.contains("updates-open")) {
      toggle.classList.remove("tab-dim");
      return;
    }

    var rect = toggle.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;

    var previousPointerEvents = toggle.style.pointerEvents;
    toggle.style.pointerEvents = "none";
    var elAtPoint = document.elementFromPoint(x, y);
    toggle.style.pointerEvents = previousPointerEvents;

    var overText = false;
    if (elAtPoint) {
      var textEl = elAtPoint.closest("p, h1, h2, h3, li, a, span, blockquote");
      if (textEl && textEl.textContent.trim().length > 0) {
        overText = true;
      }
    }

    toggle.classList.toggle("tab-dim", overText);
  }

  function requestCheck() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(checkOverlap);
    }
  }

  window.addEventListener("scroll", requestCheck, { passive: true });
  window.addEventListener("resize", requestCheck);
  checkOverlap();
}


// =========================================================
// Dynamic Publications
// =========================================================

function loadPublications() {
  var container = document.getElementById("publications");

  if (!container) {
    return;
  }

  fetch("publications.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load publications.json");
      }
      return response.json();
    })
    .then(function (data) {
      var publications = data.publications || [];

      publications.sort(function (a, b) {
        return b.year - a.year;
      });

      container.innerHTML = "";

      var currentYear = null;
      var rowList = null;

      publications.forEach(function (publication) {
        if (publication.year !== currentYear) {
          currentYear = publication.year;

          var yearHeading = document.createElement("p");
          yearHeading.className = "year-heading";
          yearHeading.textContent = currentYear;
          container.appendChild(yearHeading);

          rowList = document.createElement("div");
          rowList.className = "row-list";
          container.appendChild(rowList);
        }

        var row = document.createElement("div");
        row.className = "row";

        row.innerHTML = `
          <div class="row-head">
            <span class="row-title">
              <a href="${publication.doi}" target="_blank" rel="noopener noreferrer">
                ${publication.title}
              </a>
            </span>
            <span class="row-meta">
              ${publication.journal}
            </span>
          </div>
          <p class="row-desc">
            ${publication.authors}
          </p>
          <div class="row-links">
            <a href="${publication.doi}" target="_blank" rel="noopener noreferrer">
              DOI
            </a>
          </div>
        `;

        rowList.appendChild(row);
      });
    })
    .catch(function (error) {
      console.error("Publication loading error:", error);
      var isFileProtocol = window.location.protocol === "file:";
      var msg = isFileProtocol 
        ? "Publications cannot be fetched via file:// protocol. Use a local HTTP server."
        : "Unable to load publications at this time.";

      container.innerHTML = `<p class="publication-error">${msg}</p>`;
    });
}


// =========================================================
// Gallery Features
// =========================================================

function initGalleryYearGuess() {
  var buttons = document.querySelectorAll(".guess-year");

  if (!buttons.length) {
    return;
  }

  buttons.forEach(function (button) {
    var buttonText = button.querySelector(".guess-year-text");

    if (!buttonText) {
      return;
    }

    button.addEventListener("click", function () {
      var galleryItem = button.closest(".gallery-item");

      if (!galleryItem) {
        return;
      }

      var year = galleryItem.dataset.year;
      var yearDisplay = galleryItem.querySelector(".gallery-year");

      if (!yearDisplay) {
        return;
      }

      var isRevealed = button.getAttribute("aria-expanded") === "true";

      if (!isRevealed) {
        yearDisplay.textContent = year;
        buttonText.textContent = "Hide the year";
        button.setAttribute("aria-expanded", "true");
      } else {
        yearDisplay.textContent = "";
        buttonText.textContent = "Guess the year";
        button.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function shuffleGallery() {
  var gallery = document.querySelector(".gallery-grid");

  if (!gallery) {
    return;
  }

  var items = Array.from(gallery.querySelectorAll(".gallery-item"));

  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }

  items.forEach(function (item) {
    gallery.appendChild(item);
  });
}

var lightbox = null;
var lightboxImage = null;
var lightboxClose = null;
var previousFocusedElement = null;

function initLightbox() {
  lightbox = document.getElementById("lightbox");
  lightboxImage = document.getElementById("lightbox-image");
  lightboxClose = document.querySelector(".lightbox-close");

  if (!lightbox || !lightboxImage || !lightboxClose) {
    return;
  }

  var galleryImages = document.querySelectorAll(".gallery-item img");

  galleryImages.forEach(function (image) {
    image.addEventListener("click", function () {
      openLightbox(image);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightboxClose.addEventListener("click", function () {
    closeLightbox();
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }

    if (event.key === "Tab" && !lightbox.hidden) {
      event.preventDefault();
      lightboxClose.focus();
    }
  });
}

function openLightbox(image) {
  if (!lightbox || !lightboxImage) {
    return;
  }

  previousFocusedElement = document.activeElement;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightbox.hidden = false;

  requestAnimationFrame(function () {
    lightbox.classList.add("active");
  });

  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("active");
  document.body.classList.remove("lightbox-open");

  lightboxImage.src = "";
  lightboxImage.alt = "";

  setTimeout(function () {
    if (lightbox && !lightbox.classList.contains("active")) {
      lightbox.hidden = true;
    }
  }, 160);

  if (
    previousFocusedElement &&
    typeof previousFocusedElement.focus === "function"
  ) {
    previousFocusedElement.focus();
  }
}


// =========================================================
// Discourage casual image saving (desktop + mobile)
// Note: this only stops casual saving. Anyone can still get
// the file via dev tools, so also watermark and downsize.
// =========================================================

function initImageProtection() {
  var selector = ".gallery-item img, #lightbox-image";

  function isProtected(el) {
    return (
      el &&
      el.tagName === "IMG" &&
      (el.closest(".gallery-item") || el.id === "lightbox-image")
    );
  }

  // --- CSS (mobile long-press menu on iOS, text/image selection, dragging)
  // Injected here so no stylesheet edit is needed.
  var style = document.createElement("style");
  style.textContent =
    selector + " {" +
    "  -webkit-touch-callout: none;" +   // iOS long-press "Save Image" menu
    "  -webkit-user-select: none;" +
    "  user-select: none;" +
    "  -webkit-user-drag: none;" +
    "}";
  document.head.appendChild(style);

  // --- Desktop: right-click / ctrl-click / trackpad menu
  // --- Android: long-press also fires "contextmenu"
  document.addEventListener("contextmenu", function (event) {
    if (isProtected(event.target)) {
      event.preventDefault();
    }
  });

  // --- Desktop: drag image to desktop or another tab
  document.addEventListener("dragstart", function (event) {
    if (isProtected(event.target)) {
      event.preventDefault();
    }
  });

  // --- Mark images as non-draggable (covers older browsers)
  function lockImages() {
    document.querySelectorAll(selector).forEach(function (img) {
      img.setAttribute("draggable", "false");
    });
  }

  lockImages();

  // --- Mobile: suppress the long-press selection/callout on touch devices
  // (passive listeners so scrolling is not affected)
  document.addEventListener(
    "touchstart",
    function (event) {
      if (isProtected(event.target) && event.touches.length > 1) {
        // Multi-finger gestures on the image are not needed; the lightbox
        // is opened with a normal tap, so this does not affect it.
        event.preventDefault();
      }
    },
    { passive: false }
  );
}


// =========================================================
// Initialization
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

  // Inject Header
  var headerSlot = document.getElementById("site-header");
  if (headerSlot) {
    headerSlot.innerHTML = renderHeader();
  }

  // Inject Footer
  var footerSlot = document.getElementById("site-footer");
  if (footerSlot) {
    footerSlot.innerHTML = FOOTER_HTML;
  }

  // Inject Theme Tab
  if (!document.getElementById("themeToggle")) {
    document.body.insertAdjacentHTML("beforeend", renderThemeTab());
  }

  // Shared Features
  initToggle();
  initThemeToggle();
  initInfoPanels();
  initUpdatesDrawer();
  initUpdatesTabDimming();
  loadPublications();

  // Gallery Features
  shuffleGallery();
  initGalleryYearGuess();
  initLightbox();
  initImageProtection();

});
