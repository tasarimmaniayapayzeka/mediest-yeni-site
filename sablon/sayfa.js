// Genel içerik sayfası — blok tipine göre render eder.
// WP'de page.php + esnek içerik (ACF flexible content) karşılığı.
const { kabuk, kacis } = require('./parca/kabuk');

const G = '/varlik/gorsel/';
function resim(ad, alt, gorselVarMi) {
  if (!ad || !gorselVarMi || !gorselVarMi(ad + '.webp')) return null;
  const iki = gorselVarMi(ad + '@2x.webp');
  return `<img src="${G}${ad}.webp"${iki ? ` srcset="${G}${ad}.webp 1x, ${G}${ad}@2x.webp 2x"` : ''}` +
    ` alt="${String(alt).replace(/"/g, '&quot;')}" loading="lazy" decoding="async">`;
}

const basi = (b, orta = false) => (b.ustEtiket || b.baslik || b.giris)
  ? `<div class="bolum-basi${orta ? ' bolum-basi--orta' : ''}">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      ${b.baslik ? `<h2>${kacis(b.baslik)}</h2>` : ''}
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
    </div>` : '';

const bloklar = {

  hero: (b, { sayfa, site }) => `<section class="hub-hero koyu">
  <div class="kapsayici">
    <nav class="kirinti" aria-label="Sayfa yolu">
      <a href="/">Ana Sayfa</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
      <span aria-current="page">${kacis(sayfa.kirintiAd || b.baslik)}</span>
    </nav>
    <div class="hub-hero__ic">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h1>${kacis(b.baslik)}</h1>
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
      ${(b.cta || b.ikincilCta) ? `<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem">
        ${b.cta ? `<a class="dugme dugme--acik" href="${b.cta.url}">${kacis(b.cta.ad)}</a>` : ''}
        ${b.ikincilCta ? `<a class="dugme dugme--hayalet" href="${b.ikincilCta.url}">${kacis(b.ikincilCta.ad)}</a>` : ''}
      </div>` : ''}
    </div>
  </div>
</section>`,

  metin: (b) => `<section class="bolum">
  <div class="kapsayici">
    <div class="dar">
      ${basi(b)}
      ${(b.paragraflar || []).map(p => `<p class="giris">${kacis(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>`,

  maddeler: (b) => `<section class="bolum bolum--alt">
  <div class="kapsayici">
    ${basi(b)}
    <ul class="isaretli${b.sutun === 2 ? ' isaretli--2' : ''}">
      ${(b.maddeler || []).map(m => `<li>${kacis(m)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`,

  kartlar: (b) => `<section class="bolum">
  <div class="kapsayici">
    ${basi(b)}
    <div class="izgara izgara--3">
      ${(b.kartlar || []).map((k, n) => {
        const ic = `<div class="kart__no">${String(n + 1).padStart(2, '0')}</div>
        <h3>${kacis(k.baslik)}</h3>
        <p${k.url ? ' style="flex:1"' : ''}>${kacis(k.aciklama)}</p>
        ${k.url ? `<span class="metin-link" style="margin-top:1.15rem">Ayrıntılar</span>` : ''}`;
        return k.url
          ? `<a class="kart kart--tiklanir" href="${k.url}" style="display:flex;flex-direction:column">${ic}</a>`
          : `<article class="kart">${ic}</article>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`,

  adimlar: (b) => `<section class="bolum bolum--buz">
  <div class="kapsayici">
    ${basi(b)}
    <ol class="adimlar">
      ${(b.adimlar || []).map((a, n) => `<li class="adim">
        <span class="adim__no" aria-hidden="true">${String(n + 1).padStart(2, '0')}</span>
        <div>
          <h3 class="adim__baslik">${kacis(a.baslik)}</h3>
          <p>${kacis(a.aciklama)}</p>
        </div>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`,

  gorselli: (b, { gorselVarMi }) => {
    const im = resim(b.gorsel, b.baslik, gorselVarMi);
    return `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="izgara izgara--2" style="gap:clamp(2rem,5vw,4rem);align-items:center">
      <div>
        ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
        <h2>${kacis(b.baslik)}</h2>
        ${(b.paragraflar || []).map(p => `<p class="giris">${kacis(p)}</p>`).join('\n        ')}
        ${b.maddeler?.length ? `<ul class="isaretli" style="margin-top:1.5rem">
          ${b.maddeler.map(m => `<li>${kacis(m)}</li>`).join('\n          ')}
        </ul>` : ''}
      </div>
      ${im ? `<div class="bolum-gorsel">${im}</div>` : ''}
    </div>
  </div>
</section>`;
  },

  sss: (b) => `<section class="bolum" id="sss">
  <div class="kapsayici">
    <div class="bolum-basi dar">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik || 'Sık sorulan sorular')}</h2>
    </div>
    <div class="sss dar" data-sss>
      ${(b.sorular || []).map((q, n) => `<div class="sss__oge">
        <h3 style="margin:0">
          <button class="sss__dugme" type="button" aria-expanded="false" aria-controls="s-sss-${n}">
            <span>${kacis(q.s)}</span>
            <span class="sss__isaret" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="sss__govde" id="s-sss-${n}" data-acik="false"><div><p>${kacis(q.c)}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`,

  iletisim: (b, { site }) => {
    const i = site.iletisim;
    const harita = `https://www.google.com/maps?q=${encodeURIComponent(i.adres.tam)}`;
    return `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="showroom">
      <div>
        ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
        <h2>${kacis(b.baslik || 'İletişim')}</h2>
        ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.75rem">
          <a class="dugme dugme--acik" href="${site.teklifUrl}" target="_blank" rel="noopener">WhatsApp ile yazın</a>
          <a class="dugme dugme--hayalet" href="tel:${i.telefonHam}">${kacis(i.telefon)}</a>
        </div>
      </div>
      <div class="showroom__kunye">
        <div class="showroom__oge">
          <span class="showroom__etiket">Adres</span>
          <span class="showroom__deger"><a href="${harita}" target="_blank" rel="noopener">${kacis(i.adres.tam)}</a></span>
        </div>
        <div class="showroom__oge">
          <span class="showroom__etiket">Telefon</span>
          <span class="showroom__deger"><a href="tel:${i.telefonHam}">${kacis(i.telefon)}</a></span>
        </div>
        <div class="showroom__oge">
          <span class="showroom__etiket">E-posta</span>
          <span class="showroom__deger"><a href="mailto:${i.eposta}">${kacis(i.eposta)}</a></span>
        </div>
        <div class="showroom__oge">
          <span class="showroom__etiket">Çalışma saatleri</span>
          <span class="showroom__deger">${kacis(i.calismaSaatleri)}</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
  },

  notKutu: (b) => `<section class="bolum--sik">
  <div class="kapsayici">
    <div class="not-kutu dar">${kacis(b.metin)}</div>
  </div>
</section>`,

  ctaSerit: (b) => `<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2 style="margin-bottom:.5rem">${kacis(b.baslik)}</h2>
      ${b.giris ? `<p style="color:#a9bed3;margin:0">${kacis(b.giris)}</p>` : ''}
    </div>
    <div class="cta-serit__eylem">
      ${b.birincilCta ? `<a class="dugme dugme--acik" href="${b.birincilCta.url}">${kacis(b.birincilCta.ad)}</a>` : ''}
      ${b.ikincilCta ? `<a class="dugme dugme--hayalet" href="${b.ikincilCta.url}">${kacis(b.ikincilCta.ad)}</a>` : ''}
    </div>
  </div>
</section>`
};

function sayfaUret({ site, sayfa, gorselVarMi = () => false }) {
  const yol = '/' + sayfa.slug + '/';
  const bilinmeyen = [];
  const govde = (sayfa.bloklar || []).map(b => {
    const f = bloklar[b.tip];
    if (!f) { bilinmeyen.push(b.tip); return ''; }
    return f(b, { site, sayfa, gorselVarMi });
  }).filter(Boolean).join('\n\n');

  const sssBlok = (sayfa.bloklar || []).find(b => b.tip === 'sss');
  const schema = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
      { '@type': 'ListItem', position: 2, name: sayfa.kirintiAd || sayfa.slug, item: site.seo.baseUrl + yol }
    ]
  }];
  if (sssBlok?.sorular?.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: sssBlok.sorular.map(q => ({
        '@type': 'Question', name: q.s,
        acceptedAnswer: { '@type': 'Answer', text: q.c }
      }))
    });
  }
  if (sayfa.slug === 'iletisim') {
    const i = site.iletisim;
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: site.marka.ad,
      telephone: i.telefonHam,
      email: i.eposta,
      url: site.seo.baseUrl + yol,
      address: {
        '@type': 'PostalAddress',
        streetAddress: i.adres.sokak, addressLocality: i.adres.ilce,
        addressRegion: i.adres.il, postalCode: i.adres.postaKodu, addressCountry: 'TR'
      }
    });
  }

  return {
    html: kabuk({ site, baslik: sayfa.metaBaslik, aciklama: sayfa.metaAciklama, yol, govde, schema, sinif: 'sayfa-icerik' }),
    yol,
    bilinmeyen,
    blokSayisi: (sayfa.bloklar || []).length
  };
}

module.exports = { sayfaUret };
