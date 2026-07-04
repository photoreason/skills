/* =========================================================================
   Photo Reason — portfolio template runtime.
   Renders the page from the content globals defined in content/*.js:
     window.PORTFOLIO_SITE   — structure (projects, images, social)
     window.PORTFOLIO_I18N   — { en, ja, 'zh-hans' } text per language
   No framework, no build step, no fetch() (so it works from file:// too).
   ========================================================================= */

(function () {
  'use strict'

  var SITE = window.PORTFOLIO_SITE || { projects: [], social: [] }
  var I18N = window.PORTFOLIO_I18N || {}

  // Fixed display order + native labels for the language switch.
  var LOCALES = [
    { code: 'en', label: 'EN' },
    { code: 'ja', label: '日本語' },
    { code: 'zh-hans', label: '简体' },
  ].filter(function (l) {
    return I18N[l.code]
  })

  var STORAGE_KEY = 'pf-lang'

  // ---- helpers ------------------------------------------------------------

  function $(id) {
    return document.getElementById(id)
  }

  function el(tag, className, text) {
    var node = document.createElement(tag)
    if (className) node.className = className
    if (text != null) node.textContent = text
    return node
  }

  /** A labelled placeholder block (shown when an image is missing/absent). */
  function placeholder(aspect) {
    var ph = el('div', 'ph', 'Image')
    if (aspect) ph.style.aspectRatio = aspect
    return ph
  }

  /** An <img> that degrades to a labelled placeholder if the file is missing.
   *  If no src is given at all, returns the placeholder straight away. */
  function imgEl(src, alt, aspect) {
    if (!src) return placeholder(aspect)
    var img = document.createElement('img')
    img.src = src || ''
    img.alt = alt || ''
    img.loading = 'lazy'
    img.decoding = 'async'
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.replaceChild(placeholder(aspect), img)
    })
    return img
  }

  function resolveLocale() {
    var params = new URLSearchParams(window.location.search)
    var order = [
      params.get('lang'),
      localStorage.getItem(STORAGE_KEY),
      (navigator.language || 'en').toLowerCase(),
    ]
    for (var i = 0; i < order.length; i++) {
      var want = (order[i] || '').toLowerCase()
      if (!want) continue
      if (I18N[want]) return want
      if (want.indexOf('ja') === 0 && I18N['ja']) return 'ja'
      if (want.indexOf('zh') === 0 && I18N['zh-hans']) return 'zh-hans'
      if (want.indexOf('en') === 0 && I18N['en']) return 'en'
    }
    return LOCALES.length ? LOCALES[0].code : 'en'
  }

  // ---- state --------------------------------------------------------------

  var locale = resolveLocale()
  var t = I18N[locale] || {}

  function projectText(id) {
    return (t.projects && t.projects[id]) || {}
  }

  // ---- rendering ----------------------------------------------------------

  function renderLangSwitch() {
    var box = $('langSwitch')
    box.innerHTML = ''
    // With only one language there's nothing to switch — hide the control.
    // (display must be forced: .lang-switch's `display:flex` beats [hidden].)
    if (LOCALES.length <= 1) {
      box.style.display = 'none'
      return
    }
    box.style.display = ''
    LOCALES.forEach(function (l) {
      var b = el('button', null, l.label)
      b.type = 'button'
      b.setAttribute('aria-pressed', String(l.code === locale))
      b.addEventListener('click', function () {
        setLocale(l.code)
      })
      box.appendChild(b)
    })
  }

  function renderNav() {
    var nav = $('nav')
    nav.innerHTML = ''
    var items = t.nav || {}
    ;[
      ['#work', items.work],
      ['#about', items.about],
      ['#contact', items.contact],
    ].forEach(function (pair) {
      if (!pair[1]) return
      var a = el('a', null, pair[1])
      a.href = pair[0]
      nav.appendChild(a)
    })
  }

  function renderHero() {
    var heroImg = $('heroImg')
    if (SITE.heroImage && heroImg) {
      heroImg.src = SITE.heroImage
      heroImg.addEventListener('error', function () {
        heroImg.style.display = 'none' // keep the dark backdrop
      })
    } else if (heroImg) {
      heroImg.style.display = 'none'
    }
    var hero = t.hero || {}
    $('heroEyebrow').textContent = hero.eyebrow || ''
    $('heroName').textContent = hero.name || ''
    $('heroTagline').textContent = hero.tagline || ''
  }

  function projectMeta(p) {
    var bits = []
    if (p.year) bits.push(el('span', null, p.year))
    if (p.ongoing) {
      var ong = el('span', 'ongoing', (t.ui && t.ui.ongoing) || 'ongoing')
      bits.push(ong)
    }
    var wrap = el('span', 'project-row__meta')
    bits.forEach(function (b) {
      wrap.appendChild(b)
    })
    return wrap
  }

  function renderWork() {
    $('workLabel').textContent = (t.labels && t.labels.work) || ''
    var list = $('projects')
    list.innerHTML = ''
    ;(SITE.projects || []).forEach(function (p) {
      var text = projectText(p.id)
      var li = el('li', 'project-row')

      var a = el('a')
      a.href = '#/p/' + p.id

      a.appendChild(el('span', 'project-row__title', text.title || p.id))
      a.appendChild(projectMeta(p))

      // Hover/touch thumbnail strip: first few images.
      var thumbs = el('div', 'project-row__thumbs')
      ;(p.images || []).slice(0, 4).forEach(function (im) {
        thumbs.appendChild(imgEl(im.src, text.title || '', '4 / 3'))
      })
      if ((p.images || []).length) a.appendChild(thumbs)

      li.appendChild(a)
      list.appendChild(li)
    })
  }

  function renderAbout() {
    $('aboutLabel').textContent = (t.labels && t.labels.about) || ''
    if (SITE.portraitImage) {
      $('aboutPortrait').style.backgroundImage = 'url("' + SITE.portraitImage + '")'
    }
    var about = t.about || {}
    $('aboutStatement').textContent = about.statement || ''
    $('aboutBio').textContent = about.bio || ''
  }

  function renderContact() {
    $('contactLabel').textContent = (t.labels && t.labels.contact) || ''
    var email = SITE.email || ''
    var link = $('contactEmail')
    link.textContent = email
    link.href = email ? 'mailto:' + email : '#'

    var ul = $('social')
    ul.innerHTML = ''
    ;(SITE.social || []).forEach(function (s) {
      var li = document.createElement('li')
      var a = el('a', null, s.label)
      a.href = s.href
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      li.appendChild(a)
      ul.appendChild(li)
    })
  }

  function renderFooter() {
    var year = new Date().getFullYear()
    var rights = (t.footer && t.footer.rights) || ''
    rights = rights.replace('{year}', year)
    var f = $('footer')
    f.innerHTML = ''
    f.appendChild(el('span', null, rights))
    f.appendChild(el('span', null, 'Photo Reason'))
  }

  function renderMeta() {
    document.documentElement.lang = locale === 'zh-hans' ? 'zh-Hans' : locale
    var meta = t.meta || {}
    if (meta.title) document.title = meta.title
    setMeta('name', 'description', meta.description || '')
    setMeta('property', 'og:title', meta.title || '')
    setMeta('property', 'og:description', meta.description || '')
    if (SITE.heroImage) {
      // og:image must be an absolute URL to work when the link is shared.
      setMeta('property', 'og:image', new URL(SITE.heroImage, window.location.href).href)
    }
  }

  function setMeta(attr, key, value) {
    var node = document.head.querySelector('meta[' + attr + '="' + key + '"]')
    if (!node) {
      node = document.createElement('meta')
      node.setAttribute(attr, key)
      document.head.appendChild(node)
    }
    node.setAttribute('content', value)
  }

  function renderAll() {
    renderLangSwitch()
    renderNav()
    renderHero()
    renderWork()
    renderAbout()
    renderContact()
    renderFooter()
    renderMeta()
    // Re-render whatever route is active (e.g. an open project) in the new lang.
    handleRoute()
  }

  // ---- project detail (hash route: #/p/<id>) ------------------------------

  function findProject(id) {
    return (SITE.projects || []).filter(function (p) {
      return p.id === id
    })[0]
  }

  function renderProject(p) {
    var text = projectText(p.id)
    var view = $('projectView')
    view.innerHTML = ''

    var bar = el('div', 'pv__bar')
    var back = el('a', 'pv__back', '← ' + ((t.ui && t.ui.back) || 'Back'))
    back.href = '#'
    bar.appendChild(back)
    var metaBits = [p.year, p.ongoing ? (t.ui && t.ui.ongoing) || 'ongoing' : null]
      .filter(Boolean)
      .join(' · ')
    bar.appendChild(el('span', 'pv__meta', metaBits))
    view.appendChild(bar)

    var head = el('div', 'pv__head')
    head.appendChild(el('h2', 'pv__title', text.title || p.id))
    if (text.description) head.appendChild(el('p', 'pv__desc', text.description))
    view.appendChild(head)

    var images = el('div', 'pv__images ' + (p.layout === 'grid' ? '-grid' : '-stack'))
    gallery = []
    ;(p.images || []).forEach(function (im, i) {
      var alt = im.alt || (text.title || '') + ' — ' + (i + 1)
      var fig = document.createElement('figure')
      var image = imgEl(im.src, alt, p.layout === 'grid' ? '4 / 3' : null)
      if (image.tagName === 'IMG') {
        // Optional per-image aspect (e.g. '3 / 2') reserves space before load
        // so the page doesn't jump; the image is cropped, never distorted.
        if (im.aspect && p.layout !== 'grid') {
          image.style.aspectRatio = im.aspect
          image.style.objectFit = 'cover'
        }
        image.dataset.index = String(gallery.length)
        gallery.push({ src: im.src, alt: alt })
      }
      fig.appendChild(image)
      if (im.caption) fig.appendChild(el('figcaption', null, im.caption))
      images.appendChild(fig)
    })
    view.appendChild(images)

    // Quiet editorial handoff to the next body of work.
    var idx = (SITE.projects || []).indexOf(p)
    var next = (SITE.projects || [])[(idx + 1) % SITE.projects.length]
    if (next && next.id !== p.id) {
      var nextWrap = el('div', 'pv__next')
      var nextLink = el('a')
      nextLink.href = '#/p/' + next.id
      nextLink.appendChild(el('span', 'pv__next-label', (t.ui && t.ui.next) || 'Next'))
      nextLink.appendChild(
        el('span', 'pv__next-title', (projectText(next.id).title || next.id) + ' →'),
      )
      nextWrap.appendChild(nextLink)
      view.appendChild(nextWrap)
    }

    view.hidden = false
    view.scrollTop = 0
    document.body.style.overflow = 'hidden'
  }

  function closeProject() {
    var view = $('projectView')
    view.hidden = true
    view.innerHTML = ''
    document.body.style.overflow = ''
  }

  function handleRoute() {
    var m = window.location.hash.match(/^#\/p\/(.+)$/)
    if (m) {
      var p = findProject(decodeURIComponent(m[1]))
      if (p) {
        renderProject(p)
        return
      }
    }
    closeProject()
  }

  // ---- language switch ----------------------------------------------------

  function setLocale(code) {
    if (!I18N[code] || code === locale) return
    locale = code
    t = I18N[code]
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch (e) {
      /* private mode — ignore */
    }
    // Brief cross-fade of the page content.
    var main = $('main')
    main.style.transition = 'opacity .22s ease'
    main.style.opacity = '0'
    window.setTimeout(function () {
      renderAll()
      main.style.opacity = '1'
    }, 160)
  }

  // ---- lightbox (pages through the open project's images) ------------------

  var lightbox = $('lightbox')
  var lightboxImg = lightbox.querySelector('.lightbox__img')
  var lightboxPrev = lightbox.querySelector('.lightbox__nav.-prev')
  var lightboxNext = lightbox.querySelector('.lightbox__nav.-next')
  var gallery = [] // filled by renderProject: [{src, alt}]
  var galleryIndex = -1

  function openLightboxAt(index) {
    var item = gallery[index]
    if (!item) return
    galleryIndex = index
    lightboxImg.src = item.src
    lightboxImg.alt = item.alt || ''
    var showNav = gallery.length > 1 ? '' : 'none'
    lightboxPrev.style.display = showNav
    lightboxNext.style.display = showNav
    lightbox.hidden = false
  }
  function stepLightbox(delta) {
    if (gallery.length < 2) return
    openLightboxAt((galleryIndex + delta + gallery.length) % gallery.length)
  }
  function closeLightbox() {
    lightbox.hidden = true
    lightboxImg.removeAttribute('src')
  }

  document.addEventListener('click', function (e) {
    var img = e.target
    if (img && img.tagName === 'IMG' && img.closest('.pv__images')) {
      openLightboxAt(Number(img.dataset.index || 0))
    }
  })
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__close')) {
      closeLightbox()
    }
  })
  lightboxPrev.addEventListener('click', function () {
    stepLightbox(-1)
  })
  lightboxNext.addEventListener('click', function () {
    stepLightbox(1)
  })
  document.addEventListener('keydown', function (e) {
    if (!lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowLeft') stepLightbox(-1)
      else if (e.key === 'ArrowRight') stepLightbox(1)
      return
    }
    if (e.key === 'Escape' && window.location.hash.indexOf('#/p/') === 0) {
      window.location.hash = ''
    }
  })

  // ---- boot ---------------------------------------------------------------

  window.addEventListener('hashchange', handleRoute)
  renderAll()
})()
