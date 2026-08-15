// Alt bilgi — WP'de footer.php
const kacis = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function altBilgiParca(site) {
  const f = site.footer;
  const i = site.iletisim;
  const yil = 2026;

  return `<footer class="alt-bilgi">
  <div class="kapsayici">
    <div class="alt-bilgi__ust">
      <div>
        <a class="logo" href="/">
          <span class="logo__isaret" aria-hidden="true">MEG</span>
          <span>
            <span class="logo__ad">${kacis(site.marka.ad)}</span>
            <span class="logo__alt">${kacis(site.marka.slogan)}</span>
          </span>
        </a>
        <p class="alt-bilgi__tanim">${kacis(f.tanim)}</p>
        <div class="alt-bilgi__kunye">
          <a href="tel:${i.telefonHam}">${kacis(i.telefon)}</a>
          <a href="mailto:${i.eposta}">${kacis(i.eposta)}</a>
          <address style="font-style:normal">${kacis(i.adres.tam)}</address>
          <span>${kacis(i.calismaSaatleri)}</span>
        </div>
        <div class="alt-bilgi__sosyal">
          ${site.sosyal.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${kacis(s.kullanici)}</a>`).join('\n          ')}
        </div>
      </div>

      ${f.sutunlar.map(s => `<div>
        <h4>${kacis(s.baslik)}</h4>
        <ul class="alt-bilgi__liste">
          ${s.linkler.map(l => `<li><a href="${l.url}">${kacis(l.ad)}</a></li>`).join('\n          ')}
        </ul>
      </div>`).join('\n      ')}
    </div>

    <div class="alt-bilgi__cizgi">
      <p class="alt-bilgi__uyari">${kacis(f.telifNotu)}</p>
      <div class="alt-bilgi__satir">
        <span>© ${yil} ${kacis(site.marka.ad)}. Tüm hakları saklıdır.</span>
        <ul class="alt-bilgi__yasal">
          ${f.yasal.map(l => `<li><a href="${l.url}">${kacis(l.ad)}</a></li>`).join('\n          ')}
        </ul>
        <span>${kacis(f.tasarim)}</span>
      </div>
    </div>
  </div>
</footer>`;
}

module.exports = { altBilgiParca, kacis };
