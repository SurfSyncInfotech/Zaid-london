/* Ziad London — site scripts (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- preloader (first page of a visit only) ---------- */
  var L = $('.loader');
  var seen = false;
  try { seen = sessionStorage.getItem('zl-seen') === '1'; sessionStorage.setItem('zl-seen', '1'); } catch (e) {}
  function start() { setTimeout(reveal, 80); }
  if (L && (seen || reduce)) { L.remove(); L = null; }
  if (L) {
    var b = $('b', L);
    b.innerHTML = b.textContent.split('').map(function (c, i) { return '<span style="animation-delay:' + (i * .08) + 's">' + c + '</span>'; }).join('');
    var go = function () { setTimeout(function () { L.classList.add('done'); setTimeout(function () { L.remove(); }, 1400); start(); }, 1700); };
    if (d.readyState === 'complete') go(); else w.addEventListener('load', go);
    setTimeout(function () { if (L && L.parentNode) { L.classList.add('done'); start(); } }, 5500);
  } else start();

  /* ---------- reveal on scroll ---------- */
  var io, revealed = false;
  function reveal() {
    if (revealed) return; revealed = true;
    if (!('IntersectionObserver' in w)) { $$('[data-r]').forEach(function (e) { e.classList.add('in', 'done'); }); return; }
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in'); io.unobserve(e.target);
        setTimeout(function () { e.target.classList.add('done'); }, 2200);
      });
    }, { threshold: 0, rootMargin: '0px 0px 320px 0px' });
    $$('[data-r]').forEach(function (e) {
      if (e.dataset.d) e.style.setProperty('--d', e.dataset.d + 's');
      io.observe(e);
    });
  }
  if (!L) start();

  /* ---------- header, progress, to-top ---------- */
  var hdr = $('.hdr'), bar = $('.progress'), top = $('.floaters .top');
  function onScroll() {
    var y = w.pageYOffset, h = d.documentElement.scrollHeight - w.innerHeight;
    if (hdr) hdr.classList.toggle('scrolled', y > 10);
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (top) top.classList.toggle('show', y > 600);
  }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- mobile drawer ---------- */
  var burger = $('.burger');
  function menu(open) { d.body.classList.toggle('menu-open', open); if (burger) burger.setAttribute('aria-expanded', open); }
  if (burger) burger.addEventListener('click', function () { menu(!d.body.classList.contains('menu-open')); });
  $$('.drawer-x,.drawer-bg').forEach(function (e) { e.addEventListener('click', function () { menu(false); }); });
  $$('.drawer a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });
  w.addEventListener('resize', function () { if (w.innerWidth > 1020) menu(false); });

  /* ---------- counters ---------- */
  if ('IntersectionObserver' in w) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', t0 = null;
        (function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 2000, 1), v = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(to * v) + suf;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  } else $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });

  /* ---------- hero dust ---------- */
  var cv = $('#dust');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), P = [], W, H;
    var size = function () { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    size(); w.addEventListener('resize', size);
    var mk = function (init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .5, s: Math.random() * .5 + .15, a: Math.random() * .5 + .2, p: Math.random() * 6 }; };
    for (var i = 0; i < 50; i++) P.push(mk(true));
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p, i) {
        p.y -= p.s; p.p += .02; p.x += Math.sin(p.p) * .3;
        if (p.y < -10) P[i] = mk(false);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(255,240,225,' + (p.a * (.6 + .4 * Math.sin(p.p * 2))) + ')';
        ctx.shadowColor = '#E7D3C5'; ctx.shadowBlur = 8; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- tilt on cards (desktop pointers only) ---------- */
  if (fine && !reduce) {
    $$('.scard').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
  }

  /* ---------- open / closed badge: Mon–Sun 10:00–22:00 London ---------- */
  $$('.open-now').forEach(function (el) {
    var h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date());
    var open = h >= 10 && h < 22;
    el.classList.toggle('closed', !open);
    $('span', el).textContent = open ? 'Open now · until 10pm' : 'Closed now · opens 10am';
  });

  /* ---------- gallery: filters + lightbox ---------- */
  var items = $$('.gal a');
  var lb = $('.lb');
  if (items.length && lb) {
    var vis = items, idx = 0, lim = $('img', lb);
    var show = function (i) { idx = (i + vis.length) % vis.length; lim.src = vis[idx].getAttribute('href'); lim.alt = vis[idx].getAttribute('aria-label') || ''; lb.classList.add('on'); };
    var rebuild = function () { vis = items.filter(function (a) { return a.style.display !== 'none'; }); };
    items.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); rebuild(); show(vis.indexOf(a)); }); });
    $('.x', lb).onclick = function () { lb.classList.remove('on'); };
    $('.p', lb).onclick = function () { show(idx - 1); };
    $('.n', lb).onclick = function () { show(idx + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('on'); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') lb.classList.remove('on');
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    $$('.chips button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.chips button').forEach(function (x) { x.classList.toggle('on', x === b); });
        var f = b.dataset.f;
        items.forEach(function (a) { a.style.display = (f === 'all' || a.dataset.c === f) ? '' : 'none'; });
      });
    });
  }

  /* ---------- gallery category cards: set the filter and scroll to the photos ---------- */
  $$('[data-go]').forEach(function (c) {
    c.addEventListener('click', function () {
      var chip = $('.chips button[data-f="' + c.dataset.go + '"]'); if (chip) chip.click();
      var tgt = $('#photos'); if (tgt) tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- land exactly on #section links once images and fonts have settled ---------- */
  if (location.hash.length > 1) {
    w.addEventListener('load', function () {
      setTimeout(function () { var t = $(location.hash); if (t) t.scrollIntoView(); }, 1900);
    });
  }

  /* ---------- booking form: validate, send to reception, then show the thank-you message ---------- */
  $$('form.form').forEach(function (form) {
    var okBox = $('.form-ok', form.parentNode), btn = $('button[type=submit]', form);
    var v = function (n) { return form.elements[n] ? (form.elements[n].value || '').trim() : ''; };
    function thanks() {
      form.style.display = 'none';
      if (okBox) { okBox.classList.add('show'); okBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    function viaEmailApp() {
      var NL = String.fromCharCode(10);
      var body = ['Name: ' + v('first') + ' ' + v('last'), 'Telephone: ' + v('phone'), v('email') ? 'Email: ' + v('email') : '',
        'Treatment: ' + v('treatment'), v('date') ? 'Preferred date: ' + v('date') : '', '', v('message')].filter(function (x, i) { return x !== '' || i === 5; }).join(NL);
      w.location.href = 'mailto:Reception@ziadlondon.uk?subject=' + encodeURIComponent('Appointment request — ' + v('treatment')) + '&body=' + encodeURIComponent(body);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = !f.value.trim(); f.closest('.field').classList.toggle('err', bad); if (bad) ok = false;
      });
      if (!ok) { var first = $('.field.err input,.field.err select', form); if (first) first.focus(); return; }
      var label = btn.innerHTML; btn.disabled = true; btn.textContent = 'Sending…';
      fetch('https://formsubmit.co/ajax/Reception@ziadlondon.uk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'Appointment request — ' + v('treatment') + ' (' + v('first') + ' ' + v('last') + ')',
          _captcha: 'false', _template: 'table',
          Name: v('first') + ' ' + v('last'), Telephone: v('phone'), Email: v('email') || '—',
          Treatment: v('treatment'), 'Preferred date': v('date') || '—', Message: v('message') || '—'
        })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && (d.success === true || d.success === 'true')) thanks();
        else throw new Error('send failed');
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = label;
        thanks(); viaEmailApp();
      });
    });
    $$('input,select,textarea', form).forEach(function (f) { f.addEventListener('input', function () { f.closest('.field').classList.remove('err'); }); });
  });

  /* ---------- preselect treatment from ?t= (links from the services page) ---------- */
  var sel = $('select[name=treatment]');
  if (sel) {
    var map = { lashes: 'Lashes & Brows', nails: 'Manicure & Pedicure', hair: 'Hair', facial: 'Facial & Massage', waxing: 'Waxing' };
    var q = new URLSearchParams(location.search).get('t');
    if (q && map[q]) { for (var k = 0; k < sel.options.length; k++) if (sel.options[k].text === map[q]) sel.selectedIndex = k; }
  }

  /* ---------- smooth page transition ---------- */
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || a.target === '_blank' || a.closest('.gal')) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;
      var u = new URL(a.href, location.href);
      if (u.pathname === location.pathname && u.hash) return;
      e.preventDefault(); d.body.classList.add('leave');
      setTimeout(function () { w.location.href = a.href; }, 300);
    });
  });
  w.addEventListener('pageshow', function (e) { if (e.persisted) d.body.classList.remove('leave'); });
})();
