/* Ziad London — forms, gallery viewer and small extras for the Fabulux template (vanilla JS) */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* ---------- forms: validate -> send to reception -> thank-you message ---------- */
  var LABELS = { lashes: 'Lashes & Brows', manicure: 'Manicure & Pedicure', hair: 'Hair', facial: 'Facial & Massage', waxing: 'Waxing', vip: 'VIP Room', hijab: 'Hijab Services' };

  $$('#appointment-form, #contact-form').forEach(function (form) {
    var wrap = form.parentNode;
    var ok = $('.form-message.success', wrap), err = $('.form-message.error', wrap), btn = $('button[type=submit]', form);
    var val = function (n) { var f = form.elements[n]; return f ? (f.value || '').trim() : ''; };
    var phone = function () { return val('telephone') || val('phone'); };
    var treatment = function () { return val('treatment').split(',').filter(Boolean).map(function (k) { return LABELS[k] || k; }).join(', '); };

    function mark(field, bad) {
      var box = field.closest('.dd-multi') || field;
      box.classList.toggle('zt-err', bad);
      var holder = field.closest('.form-input-wrapper') || field.closest('.d-flex') || field.parentNode;
      var msg = $('.error-text', holder);
      if (!msg && bad) { msg = d.createElement('p'); msg.className = 'error-text hidden'; msg.textContent = 'This field is required'; holder.appendChild(msg); }
      if (msg) msg.classList.toggle('hidden', !bad);
    }
    function thanks() {
      form.style.display = 'none';
      var title = $('.card-contact-title, .appointment-content-description', wrap);
      if (ok) { ok.classList.remove('hidden'); ok.classList.add('zt-show'); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
    function viaEmailApp() {
      var NL = String.fromCharCode(10);
      var body = ['Name: ' + val('first-name') + ' ' + val('last-name'), 'Telephone: ' + phone(), val('email') ? 'Email: ' + val('email') : '',
        treatment() ? 'Treatment: ' + treatment() : '', '', val('message')].filter(function (x, i) { return x !== '' || i === 4; }).join(NL);
      w.location.href = 'mailto:Reception@ziadlondon.uk?subject=' + encodeURIComponent('Appointment request' + (treatment() ? ' — ' + treatment() : '')) + '&body=' + encodeURIComponent(body);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (err) err.classList.add('hidden');
      var required = [form.elements['first-name'], form.elements['last-name'], form.elements['telephone'] || form.elements['phone'], form.elements['treatment']].filter(Boolean);
      var good = true;
      required.forEach(function (f) { var bad = !f.value.trim(); mark(f, bad); if (bad) good = false; });
      if (!good) return;
      var label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending…';
      fetch('https://formsubmit.co/ajax/Reception@ziadlondon.uk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'Appointment request' + (treatment() ? ' — ' + treatment() : '') + ' (' + val('first-name') + ' ' + val('last-name') + ')',
          _captcha: 'false', _template: 'table',
          Name: val('first-name') + ' ' + val('last-name'), Telephone: phone(), Email: val('email') || '—',
          Treatment: treatment() || '—', Message: val('message') || '—'
        })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && (res.success === true || res.success === 'true')) thanks(); else throw new Error('send failed');
      }).catch(function () {
        btn.disabled = false; btn.textContent = label;
        thanks(); viaEmailApp();
      });
    }, true);
    $$('input,textarea', form).forEach(function (f) { f.addEventListener('input', function () { mark(f, false); }); });
    $$('.dd-multi__option', form).forEach(function (o) { o.addEventListener('click', function () { var h = $('.dd-multi__value', form); if (h) mark(h, false); }); });
  });

  /* ---------- open / closed badge: Mon–Sun 10:00–22:00 London ---------- */
  $$('.zt-open-badge').forEach(function (el) {
    var h = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(new Date());
    var open = h >= 10 && h < 22;
    el.classList.toggle('closed', !open);
    $('span', el).textContent = open ? 'Open now · until 10pm' : 'Closed now · opens 10am';
  });

  /* ---------- gallery: filters + category cards + viewer ---------- */
  var items = $$('.zt-gal a'), lb = $('.zt-lb');
  if (items.length && lb) {
    var vis = items, idx = 0, lim = $('img', lb);
    var show = function (i) { idx = (i + vis.length) % vis.length; lim.src = vis[idx].getAttribute('href'); lim.alt = vis[idx].getAttribute('aria-label') || ''; lb.classList.add('on'); };
    items.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        vis = items.filter(function (x) { return x.style.display !== 'none'; });
        show(vis.indexOf(a));
      });
    });
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
    var chips = $$('.zt-chips button');
    var filter = function (f) {
      chips.forEach(function (b) { b.classList.toggle('on', b.dataset.f === f); });
      items.forEach(function (a) { a.style.display = (f === 'all' || a.dataset.c === f) ? '' : 'none'; });
    };
    chips.forEach(function (b) { b.addEventListener('click', function () { filter(b.dataset.f); }); });
    $$('[data-go]').forEach(function (c) {
      c.addEventListener('click', function () {
        filter(c.dataset.go);
        var t = $('.zt-chips'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  /* ---------- land exactly on #section links once images and fonts have settled ---------- */
  if (location.hash.length > 1) {
    w.addEventListener('load', function () {
      setTimeout(function () { var t = $(location.hash); if (t) t.scrollIntoView(); }, 600);
    });
  }
})();
