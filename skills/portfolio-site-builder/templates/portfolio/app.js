/* =========================================================================
   Photo Reason — portfolio template runtime.
   Renders the page from the content globals defined in content/*.js:
     window.PORTFOLIO_SITE   — structure (projects, images, social)
     window.PORTFOLIO_I18N   — { en, ja, 'zh-hans' } text per language
   No framework, no build step, no fetch() (so it works from file:// too).
   ========================================================================= */

(function () {
  "use strict";

  var SITE = window.PORTFOLIO_SITE || { projects: [], social: [] };
  var I18N = window.PORTFOLIO_I18N || {};

  // Fixed display order + native labels for the language switch.
  var LOCALES = [
    { code: "en", label: "EN" },
    { code: "ja", label: "日本語" },
    { code: "zh-hans", label: "简体" },
  ].filter(function (l) {
    return I18N[l.code];
  });

  var STORAGE_KEY = "pf-lang";
  var isAbout = document.body.dataset.page === "about";
  var rootURL = new URL("./", document.currentScript.src);
  var expandedProjects = {};
  var projectSelections = {};
  var currentProjectId = null;
  var projectOpener = null;

  // ---- helpers ------------------------------------------------------------

  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /** A labelled placeholder block (shown when an image is missing/absent). */
  function placeholder(aspect) {
    var ph = el("div", "ph", "Image");
    if (aspect) ph.style.aspectRatio = aspect;
    return ph;
  }

  /** An <img> that degrades to a labelled placeholder if the file is missing.
   *  If no src is given at all, returns the placeholder straight away. */
  function imgEl(src, alt, aspect) {
    if (!src) return placeholder(aspect);
    var img = document.createElement("img");
    img.src = new URL(src, rootURL).href;
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      if (img.parentNode) img.parentNode.replaceChild(placeholder(aspect), img);
    });
    return img;
  }

  function resolveLocale() {
    var params = new URLSearchParams(window.location.search);
    var savedLocale = null;
    try {
      savedLocale = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* private mode or blocked storage — continue without a saved choice */
    }
    var order = [
      params.get("lang"),
      savedLocale,
      (navigator.language || "en").toLowerCase(),
      SITE.defaultLocale,
    ];
    for (var i = 0; i < order.length; i++) {
      var want = (order[i] || "").toLowerCase();
      if (!want) continue;
      if (I18N[want]) return want;
      if (want.indexOf("ja") === 0 && I18N["ja"]) return "ja";
      if (want.indexOf("zh") === 0 && I18N["zh-hans"]) return "zh-hans";
      if (want.indexOf("en") === 0 && I18N["en"]) return "en";
    }
    return LOCALES.length ? LOCALES[0].code : "en";
  }

  // ---- state --------------------------------------------------------------

  var locale = resolveLocale();
  var t = I18N[locale] || {};

  function projectText(id) {
    return (t.projects && t.projects[id]) || {};
  }

  // ---- rendering ----------------------------------------------------------

  function renderLangSwitch() {
    var box = $("langSwitch");
    box.innerHTML = "";
    // With only one language there's nothing to switch — hide the control.
    // (display must be forced: .lang-switch's `display:flex` beats [hidden].)
    if (LOCALES.length <= 1) {
      box.style.display = "none";
      return;
    }
    box.style.display = "";
    LOCALES.forEach(function (l) {
      var b = el("button", null, l.label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(l.code === locale));
      b.addEventListener("click", function () {
        setLocale(l.code);
      });
      box.appendChild(b);
    });
  }

  // Explicit locale in cross-page links also works when storage is unavailable.
  function pageLink(path, hash) {
    var url = new URL(path, rootURL);
    url.searchParams.set("lang", locale);
    url.hash = hash || "";
    return url.href;
  }

  function homeLink(hash) {
    return pageLink("index.html", hash);
  }

  function renderNav() {
    var nav = $("nav");
    nav.innerHTML = "";
    var items = t.nav || {};
    [
      [isAbout ? homeLink("work") : "#work", items.work],
      [pageLink("about/index.html"), items.about],
      ["#contact", items.contact],
    ].forEach(function (pair, index) {
      if (!pair[1]) return;
      var a = el("a", null, pair[1]);
      a.href = pair[0];
      if (isAbout && index === 1) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    if (isAbout) {
      $("siteName").textContent = (t.hero && t.hero.name) || "";
      $("siteName").href = homeLink();
    }
  }

  function renderHero() {
    var heroImg = $("heroImg");
    if (SITE.heroImage && heroImg) {
      heroImg.src = SITE.heroImage;
      heroImg.addEventListener("error", function () {
        heroImg.style.display = "none"; // keep the dark backdrop
      });
    } else if (heroImg) {
      heroImg.style.display = "none";
    }
    var hero = t.hero || {};
    $("heroEyebrow").textContent = hero.eyebrow || "";
    $("heroName").textContent = hero.name || "";
    $("heroTagline").textContent = hero.tagline || "";
  }

  function projectMeta(p) {
    var bits = [];
    if (p.year) bits.push(el("span", null, p.year));
    if (p.ongoing) {
      var ong = el("span", "ongoing", (t.ui && t.ui.ongoing) || "ongoing");
      bits.push(ong);
    }
    var wrap = el("span", "project-row__meta");
    bits.forEach(function (b) {
      wrap.appendChild(b);
    });
    return wrap;
  }

  function renderWork() {
    $("workLabel").textContent = (t.labels && t.labels.work) || "";
    var list = $("projects");
    list.innerHTML = "";
    (SITE.projects || []).forEach(function (p) {
      var text = projectText(p.id);
      var li = el("li", "project-row");
      var details = el("details", "project-disclosure");
      var summary = el("summary", "project-summary");
      var heading = el("span", "project-summary__heading");
      heading.appendChild(el("span", "project-row__title", text.title || p.id));
      var side = el("span", "project-summary__side");
      side.appendChild(projectMeta(p));
      var indicator = el("span", "project-indicator");
      indicator.setAttribute("aria-hidden", "true");
      side.appendChild(indicator);
      heading.appendChild(side);
      summary.appendChild(heading);
      if (text.description)
        summary.appendChild(el("span", "project-excerpt", text.description));
      details.appendChild(summary);

      var panel = el("div", "project-panel");
      var thumbs = el("div", "project-preview-strip");
      panel.appendChild(thumbs);
      var footer = el("div", "project-panel__footer");
      var link = el("a", "project-open", ui("viewProject") + " ↗");
      link.href = "#/p/" + encodeURIComponent(p.id);
      footer.appendChild(link);
      footer.appendChild(
        el(
          "span",
          "project-count",
          ui("photographCount").replace(
            "{count}",
            String((p.images || []).length),
          ),
        ),
      );
      panel.appendChild(footer);
      details.appendChild(panel);

      function loadPreview() {
        if (thumbs.childNodes.length) return;
        (p.images || []).slice(0, 4).forEach(function (im) {
          thumbs.appendChild(
            imgEl(
              im.thumb || im.src,
              im.alt || text.title || "",
              im.aspect || "4 / 3",
            ),
          );
        });
      }
      details.open = !!expandedProjects[p.id];
      if (details.open) loadPreview();
      details.addEventListener("toggle", function () {
        if (!details.isConnected) return;
        expandedProjects[p.id] = details.open;
        if (details.open) loadPreview();
      });
      li.appendChild(details);
      list.appendChild(li);
    });
  }

  function renderAbout() {
    var about = t.about || {};
    $("aboutHeading").textContent =
      about.heading || (t.labels && t.labels.about) || "About";
    $("aboutKicker").textContent = [about.role, about.location]
      .filter(Boolean)
      .join(" · ");
    $("aboutStatement").textContent = about.statement || "";
    $("aboutStatement").hidden = !about.statement;
    var biography = $("aboutBio");
    biography.innerHTML = "";
    var paragraphs = Array.isArray(about.bio) ? about.bio : [about.bio];
    paragraphs.filter(Boolean).forEach(function (paragraph) {
      biography.appendChild(el("p", null, paragraph));
    });
    $("aboutRepresentation").textContent = about.representation || "";
    $("aboutRepresentation").hidden = !about.representation;
    var portrait = $("aboutPortrait");
    portrait.innerHTML = "";
    portrait.hidden = !SITE.portraitImage;
    $("aboutIntro").classList.toggle("-no-image", !SITE.portraitImage);
    if (SITE.portraitImage) {
      portrait.appendChild(
        imgEl(SITE.portraitImage, about.imageAlt || "", "4 / 5"),
      );
      if (about.imageCaption)
        portrait.appendChild(el("figcaption", null, about.imageCaption));
    }
    var sections = $("aboutSections");
    sections.innerHTML = "";
    (about.sections || []).forEach(function (section) {
      var entries = (section.entries || []).filter(function (entry) {
        return entry.title;
      });
      if (!section.title || !entries.length) return;
      var block = el("section", "cv-section");
      block.appendChild(el("h2", null, section.title));
      var list = el("ul", "cv-list");
      entries.forEach(function (entry) {
        var item = el("li");
        item.classList.toggle("-undated", !entry.year);
        if (entry.year) item.appendChild(el("span", "cv-year", entry.year));
        var body = el("div");
        body.appendChild(el("span", "cv-title", entry.title));
        if (entry.detail)
          body.appendChild(el("span", "cv-place", entry.detail));
        item.appendChild(body);
        list.appendChild(item);
      });
      block.appendChild(list);
      sections.appendChild(block);
    });
  }

  function renderContact() {
    $("contactLabel").textContent = (t.labels && t.labels.contact) || "";
    var email = SITE.email || "";
    var link = $("contactEmail");
    link.textContent = email;
    link.href = email ? "mailto:" + email : "#";
    link.hidden = !email;

    var ul = $("social");
    ul.innerHTML = "";
    (SITE.social || []).forEach(function (s) {
      var li = document.createElement("li");
      var a = el("a", null, s.label);
      a.href = s.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function renderFooter() {
    var year = new Date().getFullYear();
    var rights = (t.footer && t.footer.rights) || "";
    rights = rights.replace("{year}", year);
    var f = $("footer");
    f.innerHTML = "";
    f.appendChild(el("span", null, rights));

    var credit = el("a", null, "built with Photo Reason skill");
    credit.href = "https://www.photoreason.art/" + locale + "/lab";
    credit.target = "_blank";
    credit.rel = "noopener noreferrer";
    f.appendChild(credit);
  }

  function renderMeta() {
    document.documentElement.lang = locale === "zh-hans" ? "zh-Hans" : locale;
    var meta = t.meta || {};
    if (isAbout) {
      var about = t.about || {};
      meta = {
        title:
          about.metaTitle ||
          (about.heading || "About") +
            " — " +
            ((t.hero && t.hero.name) || "Portfolio"),
        description:
          about.metaDescription || about.statement || meta.description,
      };
    }
    if (meta.title) document.title = meta.title;
    setMeta("name", "description", meta.description || "");
    setMeta("property", "og:title", meta.title || "");
    setMeta("property", "og:description", meta.description || "");
    if (SITE.heroImage) {
      // og:image must be an absolute URL to work when the link is shared.
      setMeta("property", "og:image", new URL(SITE.heroImage, rootURL).href);
    }
  }

  function setMeta(attr, key, value) {
    var node = document.head.querySelector("meta[" + attr + '="' + key + '"]');
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attr, key);
      document.head.appendChild(node);
    }
    node.setAttribute("content", value);
  }

  function renderAll() {
    renderLangSwitch();
    renderNav();
    if (isAbout) renderAbout();
    else {
      renderHero();
      renderWork();
    }
    renderContact();
    renderFooter();
    renderMeta();
    // Re-render whatever route is active (e.g. an open project) in the new lang.
    if (!isAbout) handleRoute();
  }

  // ---- project detail (hash route: #/p/<id>) ------------------------------

  function findProject(id) {
    return (SITE.projects || []).filter(function (p) {
      return p.id === id;
    })[0];
  }

  function renderProject(p) {
    closeLightbox();
    var text = projectText(p.id);
    var view = $("projectView");
    if (view.hidden) projectOpener = document.activeElement;
    view.innerHTML = "";

    var bar = el("div", "pv__bar");
    var back = el("a", "pv__back", "← " + ((t.ui && t.ui.back) || "Back"));
    back.href = "#";
    bar.appendChild(back);
    var metaBits = [
      p.year,
      p.ongoing ? (t.ui && t.ui.ongoing) || "ongoing" : null,
    ]
      .filter(Boolean)
      .join(" · ");
    bar.appendChild(el("span", "pv__meta", metaBits));
    view.appendChild(bar);

    currentProjectId = p.id;
    gallery = (p.images || [])
      .filter(function (im) {
        return im.src;
      })
      .map(function (im, i) {
        return {
          src: im.src,
          thumb: im.thumb || im.src,
          alt: im.alt || (text.title || "") + " — " + (i + 1),
          caption: im.caption || "",
        };
      });
    galleryIndex = Math.min(
      projectSelections[p.id] || 0,
      Math.max(0, gallery.length - 1),
    );

    var body = el("div", "pv__body");
    var head = el("div", "pv__head");
    head.appendChild(el("h2", "pv__title", text.title || p.id));
    if (text.description)
      head.appendChild(el("p", "pv__desc", text.description));
    var galleryButton = el("button", "pv__gallery", ui("gallery"));
    galleryButton.type = "button";
    galleryButton.hidden = !gallery.length;
    galleryButton.addEventListener("click", function () {
      openLightboxAt(galleryIndex);
    });
    head.appendChild(galleryButton);

    var indexWrap = el("details", "pv__index");
    indexWrap.hidden = !gallery.length;
    indexWrap.appendChild(
      el(
        "summary",
        "pv__index-label",
        ui("allPhotos") + " · " + gallery.length,
      ),
    );
    var contactSheet = el("div", "photo-index");
    contactSheet.setAttribute("role", "group");
    contactSheet.setAttribute("aria-label", ui("allPhotos"));
    indexWrap.appendChild(contactSheet);
    indexWrap.addEventListener("toggle", function () {
      if (!indexWrap.open || contactSheet.childNodes.length) return;
      renderThumbnails(contactSheet, function (index) {
        setProjectPhoto(index);
        indexWrap.open = false;
        $("projectEnlarge").focus({ preventScroll: true });
      });
      markProjectThumbnail();
    });
    head.appendChild(indexWrap);
    body.appendChild(head);

    var stage = el("div", "pv__stage");
    stage.hidden = !gallery.length;
    var figure = el("figure", "pv__single");
    var enlarge = el("button", "pv__enlarge");
    enlarge.id = "projectEnlarge";
    enlarge.type = "button";
    enlarge.addEventListener("click", function () {
      openLightboxAt(galleryIndex);
    });
    figure.appendChild(enlarge);
    var caption = el("figcaption");
    caption.id = "projectCaption";
    figure.appendChild(caption);
    stage.appendChild(figure);
    var controls = el("div", "pv__controls");
    var previous = el("button", "pv__previous", "←");
    previous.type = "button";
    previous.setAttribute("aria-label", ui("previous"));
    previous.hidden = gallery.length < 2;
    previous.addEventListener("click", function () {
      stepProject(-1);
    });
    var count = el("span", "pv__count");
    count.id = "projectCount";
    count.setAttribute("role", "status");
    count.setAttribute("aria-live", "polite");
    var nextPhoto = el("button", "pv__next-photo", "→");
    nextPhoto.type = "button";
    nextPhoto.setAttribute("aria-label", ui("nextPhoto"));
    nextPhoto.hidden = gallery.length < 2;
    nextPhoto.addEventListener("click", function () {
      stepProject(1);
    });
    controls.appendChild(previous);
    controls.appendChild(count);
    controls.appendChild(nextPhoto);
    stage.appendChild(controls);
    body.appendChild(stage);
    if (!gallery.length) body.appendChild(el("p", "pv__empty", ui("noPhotos")));
    view.appendChild(body);
    setProjectPhoto(galleryIndex);

    // Quiet editorial handoff to the next body of work.
    var idx = (SITE.projects || []).indexOf(p);
    var next = (SITE.projects || [])[(idx + 1) % SITE.projects.length];
    if (next && next.id !== p.id) {
      var nextWrap = el("div", "pv__next");
      var nextLink = el("a");
      nextLink.href = "#/p/" + next.id;
      nextLink.appendChild(
        el("span", "pv__next-label", (t.ui && t.ui.next) || "Next"),
      );
      nextLink.appendChild(
        el(
          "span",
          "pv__next-title",
          (projectText(next.id).title || next.id) + " →",
        ),
      );
      nextWrap.appendChild(nextLink);
      view.appendChild(nextWrap);
    }

    view.hidden = false;
    view.tabIndex = -1;
    view.setAttribute("role", "region");
    view.setAttribute("aria-label", text.title || p.id);
    setPageCovered(true);
    view.focus({ preventScroll: true });
    view.scrollTop = 0;
    document.body.style.overflow = "hidden";
  }

  function markProjectThumbnail() {
    $("projectView")
      .querySelectorAll(".pv__index [data-photo]")
      .forEach(function (button) {
        button.setAttribute(
          "aria-current",
          String(Number(button.dataset.photo) === galleryIndex),
        );
      });
  }

  function setProjectPhoto(index) {
    var item = gallery[index];
    if (!item || !$("projectEnlarge")) return;
    galleryIndex = index;
    projectSelections[currentProjectId] = index;
    var button = $("projectEnlarge");
    button.innerHTML = "";
    button.setAttribute("aria-label", ui("enlarge") + ": " + item.alt);
    var image = imgEl(item.src, item.alt, "4 / 3");
    if (image.tagName === "IMG") image.loading = "eager";
    button.appendChild(image);
    button.parentNode.id = "project-photo-" + index;
    $("projectCaption").textContent = item.caption;
    $("projectCaption").hidden = !item.caption;
    $("projectCount").textContent = index + 1 + " / " + gallery.length;
    markProjectThumbnail();
  }

  function stepProject(delta) {
    if (gallery.length > 1)
      setProjectPhoto((galleryIndex + delta + gallery.length) % gallery.length);
  }

  function setPageCovered(covered) {
    ["hero", "main", "footer", "langSwitch"].forEach(function (id) {
      $(id).inert = covered;
    });
  }

  function closeProject() {
    closeLightbox();
    var view = $("projectView");
    var wasOpen = !view.hidden;
    view.hidden = true;
    setPageCovered(false);
    if (wasOpen && projectOpener && projectOpener.isConnected)
      projectOpener.focus({ preventScroll: true });
    projectOpener = null;
    view.innerHTML = "";
    currentProjectId = null;
    document.body.style.overflow = "";
  }

  function handleRoute() {
    // Preserve bookmarks and links to the former homepage About section.
    if (window.location.hash === "#about") {
      window.location.replace(pageLink("about/index.html"));
      return;
    }
    var m = window.location.hash.match(/^#\/p\/(.+)$/);
    if (m) {
      var id;
      try {
        id = decodeURIComponent(m[1]);
      } catch (e) {
        closeProject();
        return;
      }
      var p = findProject(id);
      if (p) {
        renderProject(p);
        return;
      }
    }
    closeProject();
  }

  // ---- language switch ----------------------------------------------------

  function setLocale(code) {
    if (!I18N[code] || code === locale) return;
    locale = code;
    t = I18N[code];
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {
      /* private mode — ignore */
    }
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", locale);
      history.replaceState(null, "", url.href);
    } catch (e) {
      /* Some offline hosts disallow history updates; cross-page links retain it. */
    }
    // Brief cross-fade of the page content.
    var main = $("main");
    main.style.transition = "opacity .22s ease";
    main.style.opacity = "0";
    window.setTimeout(function () {
      renderAll();
      main.style.opacity = "1";
    }, 160);
  }

  // ---- gallery: one project's sequence, without a framework ----------------

  // About uses the shared content/navigation runtime, without gallery listeners.
  if (isAbout) {
    renderAll();
    return;
  }

  var lightbox = $("lightbox");
  var lightboxImg = lightbox.querySelector(".lightbox__img");
  var lightboxPrev = lightbox.querySelector(".lightbox__nav.-prev");
  var lightboxNext = lightbox.querySelector(".lightbox__nav.-next");
  var canvas = $("galleryCanvas");
  var gallery = [];
  var galleryIndex = 0;
  var zoomed = false;
  var zoomScale = 1;
  var imageReady = false;
  var surface = $("gallerySurface");
  var zoomRange = $("galleryZoomRange");
  var imageFailed = false;
  var galleryLabels = {
    viewProject: "View project",
    photographCount: "{count} photographs",
    gallery: "Gallery mode",
    allPhotos: "All photographs",
    enlarge: "Enlarge photograph",
    zoom: "Zoom",
    zoomLevel: "Zoom level",
    fit: "Fit image",
    previous: "Previous photograph",
    nextPhoto: "Next photograph",
    close: "Close",
    imageError: "This photograph could not be loaded.",
    noPhotos: "No photographs in this project yet.",
  };

  function ui(key) {
    return (t.ui && t.ui[key]) || (galleryLabels && galleryLabels[key]) || key;
  }

  function renderThumbnails(container, select) {
    container.innerHTML = "";
    gallery.forEach(function (item, index) {
      var button = el("button", "photo-thumb");
      button.type = "button";
      button.dataset.photo = String(index);
      button.setAttribute(
        "aria-label",
        index + 1 + " / " + gallery.length + ": " + item.alt,
      );
      button.appendChild(imgEl(item.thumb, "", "1 / 1"));
      button.addEventListener("click", function () {
        select(index);
      });
      container.appendChild(button);
    });
  }

  function syncZoomControls() {
    var disabled = !imageReady || imageFailed || !$("gallerySheet").hidden;
    $("galleryZoom").disabled = zoomRange.disabled = disabled;
  }

  // Scale relative to fit-to-screen. Keep the chosen image point at the same
  // viewport position, clamping only when an image edge prevents further panning.
  function setZoom(value, point) {
    var frame = canvas.getBoundingClientRect();
    var old = lightboxImg.getBoundingClientRect();
    var x = point ? point.x - frame.left : canvas.clientWidth / 2;
    var y = point ? point.y - frame.top : canvas.clientHeight / 2;
    var u = old.width ? (frame.left + x - old.left) / old.width : 0.5;
    var v = old.height ? (frame.top + y - old.top) / old.height : 0.5;
    u = Math.max(0, Math.min(1, u));
    v = Math.max(0, Math.min(1, v));
    zoomScale = typeof value === "boolean" ? (value ? 2 : 1) : value;
    zoomScale = Math.max(1, Math.min(4, zoomScale));
    if (!imageReady || imageFailed) zoomScale = 1;
    zoomed = zoomScale > 1;
    canvas.classList.toggle("is-zoomed", zoomed);
    var percent = Math.round(zoomScale * 100);
    zoomRange.value = String(percent);
    zoomRange.setAttribute("aria-valuetext", percent + "%");
    $("galleryZoomValue").textContent = percent + "%";
    $("galleryZoom").textContent = ui(zoomed ? "fit" : "zoom");
    $("galleryZoom").setAttribute("aria-pressed", String(zoomed));
    $("galleryImageButton").setAttribute(
      "aria-label",
      ui(zoomed ? "fit" : "zoom"),
    );
    if (!lightbox.open || !canvas.clientWidth || !canvas.clientHeight) return;
    var naturalWidth = lightboxImg.naturalWidth || canvas.clientWidth;
    var naturalHeight = lightboxImg.naturalHeight || canvas.clientHeight;
    var fit = Math.min(
      canvas.clientWidth / naturalWidth,
      canvas.clientHeight / naturalHeight,
    );
    var width = naturalWidth * fit * zoomScale;
    var height = naturalHeight * fit * zoomScale;
    surface.style.width = Math.ceil(Math.max(canvas.clientWidth, width)) + "px";
    surface.style.height =
      Math.ceil(Math.max(canvas.clientHeight, height)) + "px";
    var button = $("galleryImageButton");
    button.style.width = width + "px";
    button.style.height = height + "px";
    if (!zoomed) {
      canvas.scrollLeft = canvas.scrollTop = 0;
    } else {
      var current = lightboxImg.getBoundingClientRect();
      canvas.scrollLeft += current.left - frame.left + u * current.width - x;
      canvas.scrollTop += current.top - frame.top + v * current.height - y;
    }
  }

  function setSheet(open) {
    $("gallerySheet").hidden = !open;
    $("galleryIndex").setAttribute("aria-expanded", String(open));
    // Keep covered controls out of keyboard navigation.
    lightbox.querySelector(".lightbox__stage").inert = open;
    lightbox.querySelector(".lightbox__footer").inert = open;
    syncZoomControls();
  }

  function updateGallery() {
    var item = gallery[galleryIndex];
    if (!item) return;
    imageFailed = false;
    imageReady = false;
    $("galleryError").hidden = true;
    setSheet(false);
    setZoom(false);
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    $("galleryCaption").textContent = item.caption;
    $("galleryCount").textContent = galleryIndex + 1 + " / " + gallery.length;
    lightboxPrev.hidden = lightboxNext.hidden = gallery.length < 2;
    lightbox.querySelectorAll("[data-photo]").forEach(function (button) {
      button.setAttribute(
        "aria-current",
        String(Number(button.dataset.photo) === galleryIndex),
      );
    });
    var currentThumb = $("galleryThumbs").children[galleryIndex];
    if (currentThumb)
      currentThumb.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "instant",
      });
  }

  function openLightboxAt(index) {
    if (!gallery[index]) return;
    galleryIndex = index;
    if (!lightbox.open) {
      var route = window.location.hash.match(/^#\/p\/(.+)$/);
      $("galleryTitle").textContent = route
        ? projectText(decodeURIComponent(route[1])).title || ""
        : "";
      $("galleryIndex").textContent = $("gallerySheetTitle").textContent =
        ui("allPhotos");
      $("galleryError").textContent = ui("imageError");
      zoomRange.setAttribute("aria-label", ui("zoomLevel"));
      lightboxPrev.setAttribute("aria-label", ui("previous"));
      lightboxNext.setAttribute("aria-label", ui("nextPhoto"));
      lightbox.querySelector(".lightbox__close").textContent = ui("close");
      $("galleryThumbs").setAttribute("aria-label", ui("allPhotos"));
      $("galleryThumbs").setAttribute("role", "group");
      renderThumbnails($("galleryThumbs"), function (i) {
        openLightboxAt(i);
      });
      renderThumbnails($("gallerySheetImages"), function (i) {
        openLightboxAt(i);
        $("galleryIndex").focus();
      });
      lightbox.showModal();
      $("projectView").inert = true;
    }
    updateGallery();
  }

  function stepLightbox(delta) {
    if (gallery.length > 1)
      openLightboxAt((galleryIndex + delta + gallery.length) % gallery.length);
  }

  function closeLightbox() {
    if (!lightbox.open) return;
    $("projectView").inert = false;
    lightbox.close();
    setZoom(false);
    setSheet(false);
    lightboxImg.removeAttribute("src");
    imageReady = false;
    syncZoomControls();
    setProjectPhoto(galleryIndex);
  }

  lightboxImg.addEventListener("error", function () {
    if (!lightbox.open) return;
    imageFailed = true;
    imageReady = false;
    $("galleryError").hidden = false;
    setZoom(false);
    syncZoomControls();
  });
  lightboxImg.addEventListener("load", function () {
    if (!lightbox.open) return;
    imageFailed = false;
    imageReady = true;
    $("galleryError").hidden = true;
    setZoom(false);
    syncZoomControls();
  });
  $("galleryZoom").addEventListener("click", function () {
    setZoom(!zoomed);
  });
  $("galleryImageButton").addEventListener("click", function (event) {
    setZoom(
      !zoomed,
      event.detail ? { x: event.clientX, y: event.clientY } : null,
    );
  });
  zoomRange.addEventListener("input", function () {
    setZoom(Number(zoomRange.value) / 100);
  });
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(function () {
      if (lightbox.open && imageReady) setZoom(zoomScale);
    }).observe(canvas, { box: "border-box" });
  } else {
    window.addEventListener("resize", function () {
      if (lightbox.open && imageReady) setZoom(zoomScale);
    });
  }
  $("galleryIndex").addEventListener("click", function () {
    setZoom(false);
    setSheet($("gallerySheet").hidden);
  });
  lightbox
    .querySelector(".lightbox__close")
    .addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function () {
    stepLightbox(-1);
  });
  lightboxNext.addEventListener("click", function () {
    stepLightbox(1);
  });
  lightbox.addEventListener("cancel", function (event) {
    event.preventDefault();
    if (!$("gallerySheet").hidden) {
      setSheet(false);
      $("galleryIndex").focus();
    } else if (zoomed) setZoom(false);
    else closeLightbox();
  });
  document.addEventListener("keydown", function (event) {
    if (lightbox.open) {
      if (event.key === "Tab") {
        var controls = Array.prototype.filter.call(
          lightbox.querySelectorAll("button, input[type=range]"),
          function (button) {
            return (
              !button.disabled &&
              !button.closest("[inert]") &&
              button.getClientRects().length
            );
          },
        );
        var first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (
        (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
        event.target !== zoomRange
      ) {
        event.preventDefault();
        stepLightbox(event.key === "ArrowLeft" ? -1 : 1);
        // A contact-sheet button may have become hidden on navigation.
        if (document.activeElement.closest("#gallerySheet"))
          $("galleryIndex").focus();
      }
      return;
    }
    if (
      !$("projectView").hidden &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.target.closest(
        "input, textarea, select, [contenteditable], .pv__index",
      )
    ) {
      event.preventDefault();
      stepProject(event.key === "ArrowLeft" ? -1 : 1);
    }
    if (event.key === "Escape" && window.location.hash.indexOf("#/p/") === 0)
      window.location.hash = "";
  });

  // Drag to pan a zoomed image; touch users can also scroll the enlarged canvas.
  var drag = null;
  canvas.addEventListener("pointerdown", function (event) {
    if (!zoomed || event.pointerType !== "mouse" || event.button !== 0) return;
    drag = {
      x: event.clientX,
      y: event.clientY,
      left: canvas.scrollLeft,
      top: canvas.scrollTop,
      moved: false,
    };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", function (event) {
    if (!drag) return;
    if (Math.abs(event.clientX - drag.x) + Math.abs(event.clientY - drag.y) > 5)
      drag.moved = true;
    canvas.scrollLeft = drag.left + drag.x - event.clientX;
    canvas.scrollTop = drag.top + drag.y - event.clientY;
  });
  canvas.addEventListener("pointerup", function (event) {
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointercancel", function () {
    drag = null;
  });
  canvas.addEventListener(
    "click",
    function (event) {
      if (drag && drag.moved) {
        event.preventDefault();
        event.stopPropagation();
      } else if (drag && (event.target === canvas || event.target === surface))
        setZoom(false);
      drag = null;
    },
    true,
  );

  // ---- boot ---------------------------------------------------------------

  window.addEventListener("hashchange", handleRoute);
  renderAll();
})();
