/* ============================================================
   Portfolio Saad Benhaimer — interactions
   Vanilla JS, zéro dépendance. Tout réagit au clic sans délai :
   aucune animation ne retarde l'affichage.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- 1. THÈME (clair / sombre) ---------- */

  var themeBtn = document.getElementById('theme-btn');
  var metaThemeColor = { dark: '#121110', light: '#F3EFE6' };

  function applyTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      themeBtn.setAttribute('title', theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair');
    }
    // Barre d'URL mobile alignée sur le thème choisi
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', metaThemeColor[theme]);
    if (persist) store.set('sb-theme', theme);
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    });
  }

  // Suit le système tant que l'utilisateur n'a pas choisi explicitement
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  var onSystemChange = function (e) {
    if (!store.get('sb-theme')) applyTheme(e.matches ? 'light' : 'dark', false);
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  /* ---------- 2. LANGUE (FR / EN) ---------- */

  var langBtn = document.getElementById('lang-btn');
  var langLabel = document.getElementById('lang-label');

  // Textes figés par langue pour les éléments pilotés par le JS
  var UI = {
    fr: {
      htmlLang: 'fr',
      btnLabel: 'EN',
      btnAria: 'Switch to English',
      themeTitle: 'Changer de thème',
      burgerOpen: 'Ouvrir le menu',
      burgerClose: 'Fermer le menu',
      copied: 'Adresse copiée ✓',
      copyFail: 'Copie impossible — saadys018@gmail.com',
      formIncomplete: 'Merci de remplir les trois champs.',
      formBadEmail: 'Cet email ne semble pas valide.',
      formOpening: 'Votre messagerie s’ouvre avec le message prérempli…',
      copyBtn: 'Copier l’email'
    },
    en: {
      htmlLang: 'en',
      btnLabel: 'FR',
      btnAria: 'Passer en français',
      themeTitle: 'Toggle theme',
      burgerOpen: 'Open menu',
      burgerClose: 'Close menu',
      copied: 'Address copied ✓',
      copyFail: 'Copy failed — saadys018@gmail.com',
      formIncomplete: 'Please fill in all three fields.',
      formBadEmail: 'This email does not look valid.',
      formOpening: 'Your mail client is opening with the message prefilled…',
      copyBtn: 'Copy email'
    }
  };

  var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'fr';
  var swappables = document.querySelectorAll('[data-en]');

  // On mémorise le texte français d'origine une seule fois
  for (var s = 0; s < swappables.length; s++) {
    swappables[s].setAttribute('data-fr', swappables[s].innerHTML);
  }

  function applyLang(next, persist) {
    lang = next;
    root.setAttribute('lang', UI[next].htmlLang);
    root.setAttribute('data-lang', next);

    for (var i = 0; i < swappables.length; i++) {
      var el = swappables[i];
      var html = next === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-fr');
      if (html !== null && el.innerHTML !== html) el.innerHTML = html;
    }

    if (langLabel) langLabel.textContent = UI[next].btnLabel;
    if (langBtn) {
      langBtn.setAttribute('aria-label', UI[next].btnAria);
      langBtn.setAttribute('title', UI[next].btnAria);
    }
    if (themeBtn) themeBtn.setAttribute('aria-label', UI[next].themeTitle);
    if (burger) {
      burger.setAttribute('aria-label',
        header.classList.contains('menu-open') ? UI[next].burgerClose : UI[next].burgerOpen);
    }
    if (copyBtn && !copyBtn.dataset.busy) copyBtn.textContent = UI[next].copyBtn;
    if (formNote) formNote.textContent = '';

    if (persist) store.set('sb-lang', next);
  }

  /* ---------- 3. MENU MOBILE ---------- */

  var header = document.getElementById('site-header');
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!header || !burger || !mobileMenu) return;
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? UI[lang].burgerClose : UI[lang].burgerOpen);
    if (open) mobileMenu.removeAttribute('hidden');
    else mobileMenu.setAttribute('hidden', '');
  }

  if (burger) {
    mobileMenu.removeAttribute('hidden');
    mobileMenu.setAttribute('hidden', '');
    burger.addEventListener('click', function () {
      setMenu(!header.classList.contains('menu-open'));
    });
    // Le menu se ferme dès le clic : la navigation paraît instantanée
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('menu-open')) {
        setMenu(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && header.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------- 4. NAVIGATION : surlignage immédiat au clic ---------- */

  var navLinks = document.querySelectorAll('.nav-link, .mobile-menu a[href^="#"]');
  var sections = [];
  var idsInNav = {};

  for (var n = 0; n < navLinks.length; n++) {
    var href = navLinks[n].getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) idsInNav[href.slice(1)] = true;
  }
  for (var id in idsInNav) {
    var sec = document.getElementById(id);
    if (sec) sections.push(sec);
  }

  var lockUntil = 0; // fenêtre pendant laquelle l'observer ne contredit pas le clic

  function markActive(id) {
    for (var i = 0; i < navLinks.length; i++) {
      var match = navLinks[i].getAttribute('href') === '#' + id;
      navLinks[i].classList.toggle('is-active', match);
    }
  }

  for (var k = 0; k < navLinks.length; k++) {
    navLinks[k].addEventListener('click', function (e) {
      var target = this.getAttribute('href');
      if (!target || target.charAt(0) !== '#') return;
      var id = target.slice(1);
      // 1) état visuel appliqué avant tout scroll → ressenti instantané
      markActive(id);
      lockUntil = Date.now() + 700;
      // 2) l'URL reflète la section sans provoquer de second saut
      if (history.replaceState) {
        e.preventDefault();
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', target);
      }
    });
  }

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  if ('IntersectionObserver' in window && sections.length) {
    // Bande fine au centre de l'écran : la section qui la traverse est l'active.
    // On raisonne par ensemble de sections visibles plutôt que par ratio
    // d'intersection, qui avantagerait mécaniquement les sections courtes.
    var visible = Object.create(null);

    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var id = entries[i].target.id;
        if (entries[i].isIntersecting) visible[id] = true;
        else delete visible[id];
      }
      if (Date.now() < lockUntil) return;
      for (var j = 0; j < sections.length; j++) {
        if (visible[sections[j].id]) { markActive(sections[j].id); return; }
      }
    }, { rootMargin: '-48% 0px -48% 0px', threshold: 0 });

    for (var o = 0; o < sections.length; o++) observer.observe(sections[o]);
  }

  /* ---------- 5. HORLOGE (Maroc) ---------- */

  var clock = document.getElementById('clock');
  if (clock) {
    var tick = function () {
      var now = new Date();
      var txt;
      try {
        txt = new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Casablanca'
        }).format(now);
      } catch (e) {
        txt = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      }
      clock.textContent = txt;
      clock.setAttribute('datetime', now.toISOString());
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- 6. PHOTO : placeholder tant qu'il n'y a pas d'image ---------- */

  var photoImg = document.getElementById('hero-photo');
  if (photoImg) {
    var wrap = photoImg.parentNode;
    var reveal = function () {
      if (photoImg.naturalWidth > 1) wrap.classList.add('has-img');
    };
    photoImg.addEventListener('load', reveal);
    if (photoImg.complete) reveal();
  }

  /* ---------- 7. COPIER L'EMAIL ---------- */

  var copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var value = copyBtn.getAttribute('data-copy') || '';
      var done = function (ok) {
        copyBtn.dataset.busy = '1';
        copyBtn.textContent = ok ? UI[lang].copied : UI[lang].copyFail;
        setTimeout(function () {
          delete copyBtn.dataset.busy;
          copyBtn.textContent = UI[lang].copyBtn;
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(false); });
      } else {
        // Repli pour les navigateurs sans Clipboard API
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-100px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });
  }

  /* ---------- 8. FORMULAIRE (statique → mailto prérempli) ---------- */

  var form = document.getElementById('contact-form');
  var formNote = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('f-name');
      var email = document.getElementById('f-email');
      var message = document.getElementById('f-message');
      var fields = [name, email, message];
      var empty = false;

      for (var i = 0; i < fields.length; i++) {
        var isEmpty = !fields[i].value.trim();
        fields[i].classList.toggle('invalid', isEmpty);
        if (isEmpty) empty = true;
      }
      if (empty) {
        formNote.textContent = UI[lang].formIncomplete;
        for (var j = 0; j < fields.length; j++) {
          if (!fields[j].value.trim()) { fields[j].focus(); break; }
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        email.classList.add('invalid');
        formNote.textContent = UI[lang].formBadEmail;
        email.focus();
        return;
      }

      var subject = (lang === 'en' ? 'Contact from the portfolio — ' : 'Contact depuis le portfolio — ') + name.value.trim();
      var body = message.value.trim() + '\n\n—\n' + name.value.trim() + '\n' + email.value.trim();
      formNote.textContent = UI[lang].formOpening;
      window.location.href = 'mailto:saadys018@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });

    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('invalid');
    });
  }

  /* ---------- 9. Bascule de langue (après déclaration des dépendances) ---------- */

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(lang === 'fr' ? 'en' : 'fr', true);
    });
  }
  applyLang(lang, false);
})();
