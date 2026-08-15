// Üst şerit + başlık/menü — WP'de header.php + wp_nav_menu()
const kacis = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const okSvg = `<svg class="menu__ok" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>`;

function menuOge(oge, aktifYol) {
  const aktif = oge.url === aktifYol || (oge.alt || []).some(a => a.url === aktifYol);
  if (!oge.alt) {
    return `<li class="menu__oge">
      <a class="menu__link" href="${oge.url}"${aktif ? ' aria-current="page"' : ''}>${kacis(oge.ad)}</a>
    </li>`;
  }
  const id = 'altmenu-' + oge.ad.toLowerCase().replace(/[^a-z]/g, '');
  return `<li class="menu__oge" data-acilir>
    <a class="menu__link" href="${oge.url}" aria-expanded="false" aria-controls="${id}"${aktif ? ' aria-current="page"' : ''}>${kacis(oge.ad)}${okSvg}</a>
    <ul class="alt-menu" id="${id}">
      ${oge.alt.map(a => `<li><a class="alt-menu__link" href="${a.url}">
        <span class="alt-menu__ad">${kacis(a.ad)}</span>
        ${a.not ? `<span class="alt-menu__not">${kacis(a.not)}</span>` : ''}
      </a></li>`).join('\n      ')}
    </ul>
  </li>`;
}

function baslikParca(site, aktifYol = '/') {
  const i = site.iletisim;
  return `<div class="ust-serit">
  <div class="kapsayici">
    <div class="ust-serit__sol">
      <span class="ust-serit__rozet">Sadece klinik ve güzellik merkezlerine satış</span>
    </div>
    <div class="ust-serit__sag">
      <a href="tel:${i.telefonHam}">${kacis(i.telefon)}</a>
      <a href="mailto:${i.eposta}">${kacis(i.eposta)}</a>
    </div>
  </div>
</div>

<header class="baslik" id="baslik">
  <div class="kapsayici baslik__ic">
    <a class="logo" href="/" aria-label="${kacis(site.marka.ad)} ana sayfa">
      <span class="logo__isaret" aria-hidden="true">MEG</span>
      <span>
        <span class="logo__ad">${kacis(site.marka.ad)}</span>
        <span class="logo__alt">${kacis(site.marka.slogan)}</span>
      </span>
    </a>

    <nav aria-label="Ana menü">
      <ul class="menu" id="anamenu">
        ${site.menu.map(o => menuOge(o, aktifYol)).join('\n        ')}
        <li class="menu__mobil-cta"><a class="dugme dugme--birincil" href="${site.cta.url}">${kacis(site.cta.ad)}</a></li>
      </ul>
    </nav>

    <div class="baslik__eylem">
      <a class="dugme dugme--birincil dugme--kucuk" href="${site.cta.url}">${kacis(site.cta.ad)}</a>
      <button class="menu-dugme" id="menuDugme" type="button" aria-expanded="false" aria-controls="anamenu" aria-label="Menüyü aç">
        <span class="menu-dugme__cizgi"></span>
      </button>
    </div>
  </div>
</header>`;
}

module.exports = { baslikParca, kacis };
