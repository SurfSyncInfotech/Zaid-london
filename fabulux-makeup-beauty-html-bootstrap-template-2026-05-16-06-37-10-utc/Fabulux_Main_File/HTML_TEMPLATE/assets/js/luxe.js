/* Ziad London — Luxe interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- split text into animated words ---------- */
  function split(el) {
    var n = 0;
    function wrapText(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = d.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(' ')); return; }
            var s = d.createElement('span'); s.className = 'w';
            var i = d.createElement('i'); i.style.setProperty('--i', n++); i.textContent = t;
            s.appendChild(i); frag.appendChild(s);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') wrapText(c);
      });
    }
    wrapText(el);
    el.classList.add('splitted');
  }
  $$('[data-split]').forEach(split);

  /* ---------- preloader ---------- */
  var loader = $('.loader');
  function startPage() {
    if (loader) loader.classList.add('done');
    setTimeout(function () { d.body.classList.add('ready'); observe(); }, loader ? 500 : 0);
  }
  if (loader) {
    var mark = $('.loader-mark');
    if (mark) mark.innerHTML = mark.textContent.split('').map(function (c, i) {
      return '<span style="animation-delay:' + (i * .07) + 's">' + c + '</span>';
    }).join('');
    var minWait = new Promise(function (r) { setTimeout(r, 1900); });
    var loaded = new Promise(function (r) { if (d.readyState === 'complete') r(); else w.addEventListener('load', r); });
    Promise.race([Promise.all([minWait, loaded]), new Promise(function (r) { setTimeout(r, 4500); })]).then(startPage);
  } else startPage();

  /* ---------- reveal on scroll ---------- */
  var io;
  function observe() {
    if (!('IntersectionObserver' in w)) { $$('[data-reveal],[data-split]').forEach(function (e) { e.classList.add('in'); }); return; }
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal],[data-split]').forEach(function (e) {
      if (e.dataset.delay) e.style.setProperty('--d', e.dataset.delay + 's');
      io.observe(e);
    });
  }

  /* ---------- header, progress, back-to-top ---------- */
  var hdr = $('.hdr'), prog = $('.progress'), topBtn = $('.fab .top'), lastY = 0;
  var par = $$('[data-parallax]');
  function onScroll() {
    var y = w.pageYOffset, h = d.documentElement.scrollHeight - w.innerHeight;
    if (hdr) {
      hdr.classList.toggle('scrolled', y > 40);
      hdr.classList.toggle('hide', y > 500 && y > lastY + 4 && !d.body.classList.contains('menu-open'));
      if (y < lastY - 4) hdr.classList.remove('hide');
    }
    lastY = y;
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (topBtn) topBtn.classList.toggle('show', y > 700);
    if (!reduce) par.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > w.innerHeight + 200) return;
      var sp = parseFloat(el.dataset.parallax) || .15;
      el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - w.innerHeight / 2) * -sp) + 'px,0)';
    });
  }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- mobile menu ---------- */
  var burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var o = d.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', o);
    });
    $$('.mmenu a').forEach(function (a) { a.addEventListener('click', function () { d.body.classList.remove('menu-open'); }); });
  }

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    var c = $('.cursor'), dot = $('.cursor-dot');
    if (c && dot) {
      d.body.classList.add('has-cursor');
      var mx = 0, my = 0, cx = 0, cy = 0;
      d.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; });
      (function loop() { cx += (mx - cx) * .16; cy += (my - cy) * .16; c.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
      d.addEventListener('mouseover', function (e) { c.classList.toggle('hover', !!e.target.closest('a,button,.col,.g,input,select,textarea,.ritual')); });
    }
  }

  /* ---------- magnetic buttons & 3D tilt ---------- */
  if (fine && !reduce) {
    $$('.btn,.socials a,.fab a,.fab button').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
    $$('.ritual').forEach(function (t) {
      t.addEventListener('mousemove', function (e) {
        var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = 'perspective(900px) rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 9) + 'deg) translateY(-6px)';
      });
      t.addEventListener('mouseleave', function () { t.style.transform = ''; });
    });
  }

  /* ---------- counters ---------- */
  var cio = 'IntersectionObserver' in w && new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', t0 = null;
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 2200, 1), v = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * v) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(function (el) { if (cio) cio.observe(el); else el.textContent = el.dataset.count + (el.dataset.suffix || ''); });

  /* ---------- hero slider ---------- */
  var slides = $$('.hero-slide'), dots = $$('.hero-dots button');
  if (slides.length) {
    var cur = 0, timer;
    var go = function (i) {
      slides[cur].classList.remove('on'); dots[cur] && dots[cur].classList.remove('on');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('on');
      if (dots[cur]) { void dots[cur].offsetWidth; dots[cur].classList.add('on'); }
    };
    var run = function () { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6000); };
    go(0); run();
    dots.forEach(function (b, i) { b.addEventListener('click', function () { go(i); run(); }); });
  }

  /* ---------- gold dust particles ---------- */
  var cv = $('#dust');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), P = [], W, H, N;
    var size = function () { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; N = Math.min(70, Math.round(W / 22)); };
    size(); w.addEventListener('resize', size);
    var mk = function (init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .4, s: Math.random() * .5 + .15, a: Math.random() * .6 + .2, p: Math.random() * 6 }; };
    for (var i = 0; i < 70; i++) P.push(mk(true));
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < Math.min(N, P.length); i++) {
        var p = P[i]; p.y -= p.s; p.p += .02; p.x += Math.sin(p.p) * .3;
        if (p.y < -10) P[i] = mk(false);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = 'rgba(233,213,166,' + (p.a * (.6 + .4 * Math.sin(p.p * 2))) + ')';
        ctx.shadowColor = '#c9a96a'; ctx.shadowBlur = 8; ctx.fill();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- collections: tap to open on touch ---------- */
  var cols = $$('.col');
  cols.forEach(function (c) {
    c.addEventListener('click', function (e) {
      if (!fine) { if (!c.classList.contains('on')) { e.preventDefault(); cols.forEach(function (x) { x.classList.remove('on'); }); c.classList.add('on'); } }
    });
  });
  if (cols[0] && !fine) cols[0].classList.add('on');

  /* ---------- services category nav highlight ---------- */
  var cats = $$('.cat'), cnav = $$('.cat-nav a');
  if (cats.length) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) cnav.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    cats.forEach(function (c) { sio.observe(c); });
  }

  /* ---------- lightbox ---------- */
  var items = $$('.g'), lb = $('.lb');
  if (items.length && lb) {
    var li = 0, lim = $('img', lb);
    var show = function (i) { li = (i + items.length) % items.length; lim.src = items[li].dataset.full; lb.classList.add('on'); };
    items.forEach(function (g, i) { g.addEventListener('click', function () { show(i); }); });
    $('.x', lb).onclick = function () { lb.classList.remove('on'); };
    $('.p', lb).onclick = function () { show(li - 1); };
    $('.n', lb).onclick = function () { show(li + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('on'); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') lb.classList.remove('on');
      if (e.key === 'ArrowLeft') show(li - 1);
      if (e.key === 'ArrowRight') show(li + 1);
    });
  }

  /* ---------- open / closed badge (Mon–Sun 10:00–22:00, London time) ---------- */
  $$('.open-now').forEach(function (el) {
    var h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date());
    var open = h >= 10 && h < 22;
    el.classList.toggle('closed', !open);
    $('span', el).textContent = open ? 'Open now — until 10pm' : 'Closed now — opens 10am';
  });

  /* ---------- enquiry form (opens the visitor's email app, addressed to reception) ---------- */
  var form = $('#enquiry');
  if (form) {
    $$('select', form).forEach(function (s) { s.addEventListener('change', function () { s.classList.toggle('has', !!s.value); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = !f.value.trim(); f.parentNode.classList.toggle('err', bad); if (bad) ok = false;
      });
      if (!ok) return;
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var body = 'Name: ' + v('name') + '\nPhone: ' + v('phone') + '\nTreatment: ' + v('treatment') + '\nPreferred date: ' + (v('date') || '—') + '\n\n' + v('message');
      var href = 'mailto:Reception@ziadlondon.uk?subject=' + encodeURIComponent('Appointment request — ' + v('treatment')) + '&body=' + encodeURIComponent(body);
      $('.form-msg', form.parentNode).classList.add('show');
      w.location.href = href;
    });
  }

  /* ---------- smooth anchor offset ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = $(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
