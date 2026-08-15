// HTML kabuğu — WP'de header.php + footer.php'ye bölünecek
const { baslikParca } = require('./header');
const { altBilgiParca } = require('./footer');

const kacis = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function kabuk({ site, baslik, aciklama, yol = '/', govde, schema = [], sinif = '' }) {
  const s = site.seo;
  // Marka sonekini yalnızca başlık kısa kaldığında ekle (Yoast davranışı):
  // 60 karakteri aşan SERP başlıkları kırpılıyor.
  const sonekSigar = baslik.length + s.varsayilanBaslikSonEki.length <= 62;
  const tamBaslik = baslik.endsWith(s.siteAdi) || !sonekSigar ? baslik : baslik + s.varsayilanBaslikSonEki;
  const kanonik = s.baseUrl + yol;
  const aciklamaMetni = aciklama || s.varsayilanAciklama;

  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kacis(tamBaslik)}</title>
<meta name="description" content="${kacis(aciklamaMetni)}">
<link rel="canonical" href="${kacis(kanonik)}">
<meta name="robots" content="index, follow, max-image-preview:large">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${kacis(s.siteAdi)}">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="${kacis(tamBaslik)}">
<meta property="og:description" content="${kacis(aciklamaMetni)}">
<meta property="og:url" content="${kacis(kanonik)}">
<meta name="twitter:card" content="summary_large_image">

<link rel="preload" href="/varlik/font/SourceSerif4-600-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/varlik/font/Inter-400-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/varlik/css/site.css${site.damga ? '?v=' + site.damga : ''}">
<link rel="icon" href="/varlik/gorsel/favicon.svg" type="image/svg+xml">
${schema.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body${sinif ? ` class="${sinif}"` : ''}>
<a class="atla" href="#icerik">İçeriğe geç</a>
${baslikParca(site, yol)}
<main id="icerik">
${govde}
</main>
${altBilgiParca(site)}
<a class="wa-dugme" href="tel:${site.iletisim.telefonHam}" aria-label="Telefonla ara: ${site.iletisim.telefon}">
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
  <span>${kacis(site.iletisim.telefon)}</span>
</a>
<script src="/varlik/js/site.js${site.damga ? '?v=' + site.damga : ''}" defer></script>
</body>
</html>`;
}

module.exports = { kabuk, kacis };
