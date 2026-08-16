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
<a class="wa-dugme" href="${site.teklifUrl || 'tel:' + site.iletisim.telefonHam}" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın: ${site.iletisim.telefon}">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.7.3a3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7a10 10 0 0 0 3.8 3.4c1.4.6 2 .6 2.7.5.4-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1l-.4-.2Z"/></svg>
  <span>WhatsApp</span>
</a>
<script src="/varlik/js/site.js${site.damga ? '?v=' + site.damga : ''}" defer></script>
</body>
</html>`;
}

module.exports = { kabuk, kacis };
