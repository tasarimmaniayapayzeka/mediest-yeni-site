// Hub sayfaları (cihazlar, urunler, urunler/mezoeffect, urunler/mezocomplex)
// WP'de page-hub.php / archive-urun.php
const { kabuk, kacis } = require('./parca/kabuk');
const { GRUP_AD } = require('./urun');

function kirinti(hub) {
  const parcalar = [{ ad: 'Ana Sayfa', url: '/' }];
  if (hub.slug.startsWith('urunler/')) parcalar.push({ ad: 'Ürünler', url: '/urunler/' });
  parcalar.push({ ad: hub.kirintiAd || hub.baslik, url: null });
  return `<nav class="kirinti" aria-label="Sayfa yolu">
      ${parcalar.map(p => p.url
        ? `<a href="${p.url}">${kacis(p.ad)}</a><span class="kirinti__ayrac" aria-hidden="true">/</span>`
        : `<span aria-current="page">${kacis(p.ad)}</span>`).join('\n      ')}
    </nav>`;
}

function urunKarti(u) {
  return `<a class="kart kart--tiklanir urun-kart" href="/${u.slug}/">
        <div class="urun-kart__gorsel">Görsel hazırlanıyor</div>
        <div class="urun-kart__govde">
          <div class="urun-kart__etiket">${kacis(u.etiket || GRUP_AD[u.grup])}</div>
          <div class="urun-kart__ad">${kacis(u.ad)}</div>
          <p>${kacis((u.ozet || '').slice(0, 125))}${(u.ozet || '').length > 125 ? '…' : ''}</p>
          <span class="metin-link">İncele</span>
        </div>
      </a>`;
}

function cihazKarti(u) {
  return `<article class="secim-kart">
        <div class="secim-kart__gorsel">Görsel hazırlanıyor</div>
        <div class="secim-kart__govde">
          ${u.etiket ? `<span class="secim-kart__vurgu">${kacis(u.etiket)}</span>` : ''}
          <h3>${kacis(u.ad)}</h3>
          <p>${kacis(u.ozet)}</p>
          ${u.uygulamaAlanlari?.length ? `<ul class="isaretli">
            ${u.uygulamaAlanlari.slice(0, 4).map(a => `<li>${kacis(a.ad)}</li>`).join('\n            ')}
          </ul>` : ''}
          <div class="secim-kart__alt">
            <a class="dugme dugme--birincil" href="/${u.slug}/">${kacis(u.ad)} sayfası</a>
          </div>
        </div>
      </article>`;
}

function hubSayfasi({ site, hub, urunler }) {
  const yol = '/' + hub.slug + '/';
  const cihazHub = hub.slug === 'cihazlar';

  const bulunmayan = [];
  const gruplar = (hub.gruplama || []).map(g => {
    const liste = g.sluglar.map(s => {
      const u = urunler.find(x => x.slug === s);
      if (!u) bulunmayan.push(s);
      return u;
    }).filter(Boolean);
    return { ...g, liste };
  }).filter(g => g.liste.length);

  const toplamUrun = gruplar.reduce((n, g) => n + g.liste.length, 0);

  const govde = `<section class="hub-hero koyu">
  <div class="kapsayici">
    ${kirinti(hub)}
    <div class="hub-hero__ic">
      <span class="ust-etiket">${kacis(hub.ustEtiket)}</span>
      <h1>${kacis(hub.baslik)}</h1>
      <p class="giris">${kacis(hub.giris)}</p>
      ${cihazHub ? `<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem">
        <a class="dugme dugme--acik" href="/cihazlar/karsilastirma/">İki cihazı karşılaştır</a>
        <a class="dugme dugme--hayalet" href="/bayilik/#teklif">Teklif Al</a>
      </div>` : ''}
      ${hub.konumlandirma?.length ? `<div class="hub-konum">
        ${hub.konumlandirma.map(k => `<div class="hub-konum__hucre">${kacis(k)}</div>`).join('\n        ')}
      </div>` : ''}
    </div>
  </div>
</section>

<section class="bolum">
  <div class="kapsayici">
    ${gruplar.map(g => `<div class="hub-grup">
      <div class="hub-grup__basi">
        <h2 class="hub-grup__ad">${kacis(g.ad)}</h2>
        ${g.aciklama ? `<p class="hub-grup__aciklama">${kacis(g.aciklama)}</p>` : ''}
        <span class="hub-grup__sayi">${g.liste.length} ürün</span>
      </div>
      <div class="${cihazHub ? 'secim' : 'izgara izgara--3'}">
        ${g.liste.map(u => cihazHub ? cihazKarti(u) : urunKarti(u)).join('\n        ')}
      </div>
    </div>`).join('\n\n    ')}
  </div>
</section>

${hub.kapanisNotu ? `<section class="bolum--sik bolum--alt">
  <div class="kapsayici">
    <div class="not-kutu">${kacis(hub.kapanisNotu)}</div>
  </div>
</section>` : ''}

<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Teklif ve bilgi</span>
      <h2 style="margin-bottom:.5rem">Kliniğiniz için protokol planlayalım</h2>
      <p style="color:#a9bed3;margin:0">Satış yalnızca güzellik merkezi ve kliniklere yapılır.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="/bayilik/#teklif">Teklif Al</a>
      <a class="dugme dugme--hayalet" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
        ...(hub.slug.startsWith('urunler/')
          ? [{ '@type': 'ListItem', position: 2, name: 'Ürünler', item: site.seo.baseUrl + '/urunler/' },
             { '@type': 'ListItem', position: 3, name: hub.kirintiAd || hub.baslik, item: site.seo.baseUrl + yol }]
          : [{ '@type': 'ListItem', position: 2, name: hub.kirintiAd || hub.baslik, item: site.seo.baseUrl + yol }])
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: hub.baslik,
      numberOfItems: toplamUrun,
      itemListElement: gruplar.flatMap(g => g.liste).map((u, n) => ({
        '@type': 'ListItem', position: n + 1, name: u.ad, url: site.seo.baseUrl + '/' + u.slug + '/'
      }))
    }
  ];

  return {
    html: kabuk({ site, baslik: hub.metaBaslik, aciklama: hub.metaAciklama, yol, govde, schema, sinif: 'sayfa-hub' }),
    yol,
    toplamUrun,
    bulunmayan
  };
}

module.exports = { hubSayfasi };
