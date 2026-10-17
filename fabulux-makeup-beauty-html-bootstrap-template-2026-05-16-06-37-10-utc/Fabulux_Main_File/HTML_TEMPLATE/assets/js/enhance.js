/* Ziad London — enhancement layer (vanilla JS, works alongside the template's script.js) */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var PHONE = '+44(0)74 1555 5531', TEL = '+447415555531';

  /* ---------- preloader (first visit per session only) ---------- */
  var seen = false;
  try { seen = sessionStorage.getItem('zl-seen') === '1'; sessionStorage.setItem('zl-seen', '1'); } catch (e) {}
  if (!seen && !reduce) {
    var L = d.createElement('div');
    L.className = 'zl-loader';
    L.innerHTML = '<span class="text-logo"><b style="font-weight:inherit">' +
      'ZIAD'.split('').map(function (c, i) { return '<span style="animation-delay:' + (i * .08) + 's">' + c + '</span>'; }).join('') +
      '</b><small>LONDON</small></span><i></i>';
    d.body.appendChild(L);
    var hide = function () { setTimeout(function () { L.classList.add('done'); setTimeout(function () { L.remove(); }, 1400); }, 1700); };
    if (d.readyState === 'complete') hide(); else w.addEventListener('load', hide);
    setTimeout(function () { L.classList.add('done'); }, 5000);
  }

  /* ---------- progress bar, back-to-top, call button ---------- */
  var bar = d.createElement('div'); bar.className = 'zl-progress'; d.body.appendChild(bar);
  var top = d.createElement('button'); top.className = 'zl-top'; top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<i class="fa-solid fa-arrow-up"></i>'; d.body.appendChild(top);
  top.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });
  var call = d.createElement('a'); call.className = 'zl-call'; call.href = 'tel:' + TEL;
  call.innerHTML = '<i class="fa-solid fa-phone-volume"></i><span>Call us</span>'; d.body.appendChild(call);

  var hdr = $('header'), par = [];
  function onScroll() {
    var y = w.pageYOffset, h = d.documentElement.scrollHeight - w.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    top.classList.toggle('show', y > 700);
    if (hdr) hdr.classList.toggle('zl-scrolled', y > 30);
    if (!reduce) par.forEach(function (p) {
      var r = p.box.getBoundingClientRect();
      if (r.bottom < -100 || r.top > w.innerHeight + 100) return;
      var off = (r.top + r.height / 2 - w.innerHeight / 2) * -0.08;
      p.img.style.transform = 'scale(1.12) translate3d(0,' + off + 'px,0)';
    });
  }

  /* ---------- masked image reveals + parallax ---------- */
  var imgs = $$('main .image-container');
  var rio = 'IntersectionObserver' in w && new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target; t.classList.add('in'); rio.unobserve(t);
      setTimeout(function () { t.classList.add('settled'); }, 2300);
    });
  }, { threshold: .15 });
  imgs.forEach(function (box) {
    var img = $('img', box); if (!img) return;
    if (!reduce && rio) { box.classList.add('zl-img'); rio.observe(box); }
    par.push({ box: box, img: img });
  });

  /* ---------- staggered service lists ---------- */
  var lio = 'IntersectionObserver' in w && new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('zl-in'); lio.unobserve(e.target); } });
  }, { threshold: .1 });
  $$('.service-list').forEach(function (ul) {
    $$('li', ul).forEach(function (li, i) { li.style.setProperty('--n', Math.min(i, 14)); });
    if (lio) lio.observe(ul); else ul.classList.add('zl-in');
  });

  /* ---------- service cards: 3D tilt + glow ---------- */
  if (fine && !reduce) {
    $$('.service-container').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
        c.style.transform = 'perspective(900px) rotateY(' + ((x - .5) * 10) + 'deg) rotateX(' + ((.5 - y) * 10) + 'deg) translateY(-6px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
    $$('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * .15) + 'px ' + ((e.clientY - r.top - r.height / 2) * .25) + 'px';
      });
      b.addEventListener('mouseleave', function () { b.style.translate = ''; });
    });
  }

  /* ---------- marquee strip after the home hero ---------- */
  var hero = $('.banner-home');
  if (hero) {
    var items = ['Lashes & Brows', 'Manicure & Pedicure', 'Hair', 'Balayage', 'HydraFacial', 'Massage', 'Waxing', 'VIP Room', 'Hijab Services'];
    var html = items.concat(items).concat(items).concat(items).map(function (t) { return '<span>' + t + '</span>'; }).join('');
    var m = d.createElement('div'); m.className = 'zl-marquee';
    m.innerHTML = '<div class="zl-marquee-track">' + html + '</div>';
    hero.parentNode.insertBefore(m, hero.nextSibling);

    /* gold dust in the hero */
    if (!reduce) {
      var cv = d.createElement('canvas'); cv.id = 'zlDust'; hero.insertBefore(cv, hero.firstChild);
      var ctx = cv.getContext('2d'), P = [], W, H;
      var size = function () { W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight; };
      size(); w.addEventListener('resize', size);
      var mk = function (init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 1.8 + .5, s: Math.random() * .5 + .15, a: Math.random() * .5 + .2, p: Math.random() * 6 }; };
      for (var i = 0; i < 55; i++) P.push(mk(true));
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
  }

  /* ---------- fade out when following internal links ---------- */
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || a.target === '_blank') return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault(); d.body.classList.add('zl-leave');
      setTimeout(function () { w.location.href = a.href; }, 330);
    });
  });
  w.addEventListener('pageshow', function (e) { if (e.persisted) d.body.classList.remove('zl-leave'); });

  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
