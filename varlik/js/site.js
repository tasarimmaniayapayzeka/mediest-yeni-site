// MediEst Group — arayüz davranışları (bağımlılık yok)
(function () {
  'use strict';

  // --- Sticky başlık gölgesi ---
  var baslik = document.getElementById('baslik');
  if (baslik) {
    document.documentElement.style.setProperty('--baslik-yuksekligi', baslik.offsetHeight + 'px');
    var kaydirmaKontrol = function () {
      baslik.classList.toggle('baslik--kaydirildi', window.scrollY > 8);
    };
    kaydirmaKontrol();
    window.addEventListener('scroll', kaydirmaKontrol, { passive: true });
  }

  // --- Mobil menü ---
  var dugme = document.getElementById('menuDugme');
  var menu = document.getElementById('anamenu');
  if (dugme && menu) {
    dugme.addEventListener('click', function () {
      var acik = menu.classList.toggle('menu--acik');
      dugme.setAttribute('aria-expanded', String(acik));
      dugme.setAttribute('aria-label', acik ? 'Menüyü kapat' : 'Menüyü aç');
      document.body.style.overflow = acik ? 'hidden' : '';
    });
  }

  // --- Açılır alt menüler ---
  var mobilMi = function () { return window.matchMedia('(max-width: 1040px)').matches; };
  Array.prototype.forEach.call(document.querySelectorAll('[data-acilir]'), function (oge) {
    var tetik = oge.querySelector('.menu__link');
    if (!tetik) return;
    tetik.addEventListener('click', function (e) {
      if (!mobilMi()) return;             // masaüstünde hover ile açılır, link çalışsın
      e.preventDefault();
      var acik = oge.classList.toggle('menu__oge--acik');
      tetik.setAttribute('aria-expanded', String(acik));
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    Array.prototype.forEach.call(document.querySelectorAll('.menu__oge--acik'), function (o) {
      o.classList.remove('menu__oge--acik');
      var t = o.querySelector('.menu__link');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    if (menu && menu.classList.contains('menu--acik') && dugme) dugme.click();
  });

  // --- Protokol Seçici ---
  // JS yoksa tüm paneller açık kalır (içerik erişilebilir); JS varsa sekmeye dönüşür
  var secim = document.querySelector('[data-protokol-secim]');
  var paneller = secim ? Array.prototype.slice.call(document.querySelectorAll('.protokol-panel')) : [];
  if (secim && paneller.length) {
    document.documentElement.classList.add('js-var');
    var chipler = Array.prototype.slice.call(secim.querySelectorAll('.protokol-chip'));

    var goster = function (id, odakla) {
      paneller.forEach(function (p) { p.hidden = p.id !== 'panel-' + id; });
      chipler.forEach(function (c) {
        var secili = c.id === 'chip-' + id;
        c.setAttribute('aria-selected', String(secili));
        c.tabIndex = secili ? 0 : -1;
      });
      if (odakla) {
        var c = document.getElementById('chip-' + id);
        if (c) c.focus();
      }
    };

    chipler.forEach(function (c, i) {
      c.tabIndex = i === 0 ? 0 : -1;
      c.addEventListener('click', function () { goster(c.id.replace('chip-', '')); });
      c.addEventListener('keydown', function (e) {
        var yon = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!yon) return;
        e.preventDefault();
        var yeni = chipler[(i + yon + chipler.length) % chipler.length];
        goster(yeni.id.replace('chip-', ''), true);
      });
    });

    // Adres satırında #panel-xxx varsa onu aç
    var hedef = (location.hash || '').replace('#panel-', '');
    var baslangic = hedef && document.getElementById('panel-' + hedef)
      ? hedef
      : chipler[0].id.replace('chip-', '');
    goster(baslangic);
  }

  // --- SSS akordeonu ---
  Array.prototype.forEach.call(document.querySelectorAll('[data-sss] .sss__dugme'), function (btn) {
    btn.addEventListener('click', function () {
      var govde = document.getElementById(btn.getAttribute('aria-controls'));
      if (!govde) return;
      var acik = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!acik));
      govde.setAttribute('data-acik', String(!acik));
    });
  });
})();
