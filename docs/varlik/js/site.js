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
