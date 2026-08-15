// Ana sayfa — bölüm tipine göre render eder. WP'de front-page.php + esnek içerik alanları.
const { kabuk, kacis } = require('./parca/kabuk');
const { GRUP_AD, GRUP_URL } = require('./urun');

const GRUP_ETIKET = { mezoeffect: 'Mezoeffect', mezocomplex: 'Mezocomplex' };

// --- bölüm işleyicileri -----------------------------------------------------

const bolumler = {

  hero: (b) => `<section class="ana-hero koyu">
  <div class="kapsayici">
    <div class="ana-hero__ic">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h1>${kacis(b.baslik)}</h1>
      <p class="giris">${kacis(b.giris)}</p>
      <div class="ana-hero__eylem">
        ${b.birincilCta ? `<a class="dugme dugme--acik" href="${b.birincilCta.url}">${kacis(b.birincilCta.ad)}</a>` : ''}
        ${b.ikincilCta ? `<a class="dugme dugme--hayalet" href="${b.ikincilCta.url}">${kacis(b.ikincilCta.ad)}</a>` : ''}
      </div>
      ${b.rozetler?.length ? `<div class="kunye">
        ${b.rozetler.map(r => `<div class="kunye__hucre">
          <div class="kunye__etiket">${kacis(r.etiket)}</div>
          <div class="kunye__deger">${kacis(r.deger)}</div>
        </div>`).join('\n        ')}
      </div>` : ''}
    </div>
  </div>
</section>`,

  guvenSerit: (b) => `<section class="serit-guven">
  <div class="kapsayici" style="padding-inline:0">
    <div class="serit-guven__izgara">
      ${b.maddeler.map(m => `<div class="serit-guven__hucre">
        <div class="serit-guven__baslik">${kacis(m.baslik)}</div>
        <p>${kacis(m.aciklama)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`,

  ikiliSecim: (b, { gorselVarMi }) => `<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
    </div>
    <div class="secim">
      ${b.kartlar.map(k => `<article class="secim-kart">
        <div class="secim-kart__gorsel">Görsel hazırlanıyor</div>
        <div class="secim-kart__govde">
          ${k.vurgu ? `<span class="secim-kart__vurgu">${kacis(k.vurgu)}</span>` : ''}
          <h3>${kacis(k.ad)}</h3>
          <p>${kacis(k.aciklama)}</p>
          ${k.maddeler?.length ? `<ul class="isaretli">${k.maddeler.map(m => `<li>${kacis(m)}</li>`).join('')}</ul>` : ''}
          <div class="secim-kart__alt">
            <a class="dugme dugme--birincil" href="/${k.slug}/">${kacis(k.ad)} sayfası</a>
          </div>
        </div>
      </article>`).join('\n      ')}
    </div>
    ${b.karsilastirmaCta ? `<p style="margin-top:1.75rem"><a class="metin-link" href="${b.karsilastirmaCta.url}">${kacis(b.karsilastirmaCta.ad)}</a></p>` : ''}
  </div>
</section>`,

  urunGrubu: (b, { urunler }) => `<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="bolum-basi">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
    </div>
    <div class="izgara izgara--2">
      ${b.gruplar.map(g => {
        const liste = urunler.filter(u => u.grup === g.grup).sort((x, y) => x.sira - y.sira);
        return `<article class="grup-kart">
        <div class="grup-kart__sayi">${liste.length}<span>ürün</span></div>
        <h3>${kacis(g.ad || GRUP_AD[g.grup])}</h3>
        <p>${kacis(g.aciklama)}</p>
        <div class="grup-kart__urunler">
          ${liste.map(u => `<a class="grup-kart__etiket" href="/${u.slug}/">${kacis(u.adKisa || u.ad)}</a>`).join('\n          ')}
        </div>
        <div style="margin-top:auto"><a class="metin-link" href="${g.url || GRUP_URL[g.grup]}">Grubu incele</a></div>
      </article>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`,

  protokolSecici: (b) => `<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
    </div>
    <div class="protokol">
      <div class="protokol__baslik-satir">
        <span>${kacis(b.basliklar?.[0] || 'Uygulama alanı')}</span><span>${kacis(b.basliklar?.[1] || 'Cihaz')}</span><span>${kacis(b.basliklar?.[2] || 'Önerilen ürün')}</span>
      </div>
      ${b.satirlar.map(s => `<div class="protokol__satir">
        <div><span class="protokol__mobil-etiket">Uygulama alanı</span><div class="protokol__sorun">${kacis(s.sorun)}</div></div>
        <div><span class="protokol__mobil-etiket">Cihaz</span><div class="protokol__cihaz">${kacis(s.cihaz)}</div></div>
        <div><span class="protokol__mobil-etiket">Ürün</span><div class="protokol__urun">${
          s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)
        }</div></div>
      </div>`).join('\n      ')}
    </div>
    ${b.cta ? `<div style="margin-top:1.75rem"><a class="dugme dugme--ikincil" href="${b.cta.url}">${kacis(b.cta.ad)}</a></div>` : ''}
    ${b.not ? `<div class="not-kutu" style="margin-top:1.5rem">${kacis(b.not)}</div>` : ''}
  </div>
</section>`,

  nedenBiz: (b) => `<section class="bolum bolum--buz">
  <div class="kapsayici">
    <div class="bolum-basi">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
      ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
    </div>
    <div class="izgara izgara--3">
      ${b.kartlar.map((k, n) => k.url
        ? `<a class="kart kart--tiklanir" href="${k.url}" style="display:flex;flex-direction:column">
        <div class="kart__no">${String(n + 1).padStart(2, '0')}</div>
        <h3>${kacis(k.baslik)}</h3>
        <p style="flex:1">${kacis(k.aciklama)}</p>
        <span class="metin-link" style="margin-top:1.15rem">Ayrıntılar</span>
      </a>`
        : `<article class="kart">
        <div class="kart__no">${String(n + 1).padStart(2, '0')}</div>
        <h3>${kacis(k.baslik)}</h3>
        <p>${kacis(k.aciklama)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`,

  bayilik: (b) => `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="izgara izgara--2" style="gap:clamp(2rem,5vw,4rem);align-items:center">
      <div>
        ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
        <h2>${kacis(b.baslik)}</h2>
        ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
        ${b.cta ? `<a class="dugme dugme--acik" href="${b.cta.url}" style="margin-top:1.75rem">${kacis(b.cta.ad)}</a>` : ''}
      </div>
      <ul class="isaretli">
        ${b.maddeler.map(m => `<li>${kacis(m)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>`,

  showroom: (b, { site }) => {
    const i = site.iletisim;
    return `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="showroom">
      <div>
        ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
        <h2>${kacis(b.baslik)}</h2>
        ${b.giris ? `<p class="giris">${kacis(b.giris)}</p>` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.75rem">
          ${b.cta ? `<a class="dugme dugme--acik" href="${b.cta.url}">${kacis(b.cta.ad)}</a>` : ''}
          <a class="dugme dugme--hayalet" href="tel:${i.telefonHam}">${kacis(i.telefon)}</a>
        </div>
      </div>
      <div class="showroom__kunye">
        <div class="showroom__oge">
          <span class="showroom__etiket">Adres</span>
          <span class="showroom__deger">${kacis(i.adres.tam)}</span>
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

  blogTeaser: (b, { blog }) => {
    // Bölüm kendi listesini taşımıyorsa blog.json'dan al (özetler kaynaktan gelsin)
    const havuz = blog?.yazilar || [];
    const yazilar = (b.yazilar?.length ? b.yazilar : havuz.slice(0, 3)).map(y => {
      const k = havuz.find(h => h.slug === y.slug) || {};
      return { slug: y.slug, baslik: y.baslik || k.baslik, kategori: y.kategori || k.kategori, ozet: y.ozet || k.ozet };
    }).filter(y => y.slug && y.baslik);
    if (!yazilar.length) return '';
    return `<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="bolum-basi">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
    </div>
    <div class="izgara izgara--3">
      ${yazilar.map(y => `<a class="kart kart--tiklanir urun-kart" href="/${y.slug}/">
        <div class="urun-kart__gorsel">Görsel hazırlanıyor</div>
        <div class="urun-kart__govde">
          ${y.kategori ? `<div class="urun-kart__etiket">${kacis(y.kategori)}</div>` : ''}
          <div class="urun-kart__ad">${kacis(y.baslik)}</div>
          <p>${kacis(y.ozet || '')}</p>
          <span class="metin-link">Yazıyı oku</span>
        </div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;
  },

  sss: (b) => `<section class="bolum" id="sss">
  <div class="kapsayici">
    <div class="bolum-basi dar">
      ${b.ustEtiket ? `<span class="ust-etiket">${kacis(b.ustEtiket)}</span>` : ''}
      <h2>${kacis(b.baslik)}</h2>
    </div>
    <div class="sss dar" data-sss>
      ${b.sorular.map((q, n) => `<div class="sss__oge">
        <h3 style="margin:0">
          <button class="sss__dugme" type="button" aria-expanded="false" aria-controls="as-sss-${n}">
            <span>${kacis(q.s)}</span>
            <span class="sss__isaret" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="sss__govde" id="as-sss-${n}" data-acik="false"><div><p>${kacis(q.c)}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`,

  kapanisCta: (b, { site }) => `<section class="cta-serit koyu">
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

// --- sayfa ------------------------------------------------------------------

function anaSayfa({ site, veri, urunler, blog, gorselVarMi = () => false }) {
  const bilinmeyen = [];
  const govde = (veri.bolumler || []).map(b => {
    const isleyici = bolumler[b.tip];
    if (!isleyici) { bilinmeyen.push(b.tip); return ''; }
    return isleyici(b, { site, urunler, blog, gorselVarMi });
  }).filter(Boolean).join('\n\n');

  if (bilinmeyen.length) {
    console.warn('  ! bilinmeyen ana sayfa bölüm tipi:', [...new Set(bilinmeyen)].join(', '));
  }

  const sssBolum = (veri.bolumler || []).find(b => b.tip === 'sss');
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.marka.ad,
      description: site.marka.tanim,
      url: site.seo.baseUrl + '/',
      telephone: site.iletisim.telefonHam,
      email: site.iletisim.eposta,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.iletisim.adres.sokak,
        addressLocality: site.iletisim.adres.ilce,
        addressRegion: site.iletisim.adres.il,
        postalCode: site.iletisim.adres.postaKodu,
        addressCountry: 'TR'
      },
      sameAs: site.sosyal.map(s => s.url)
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.seo.siteAdi,
      url: site.seo.baseUrl + '/',
      inLanguage: 'tr-TR'
    }
  ];
  if (sssBolum?.sorular?.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: sssBolum.sorular.map(q => ({
        '@type': 'Question',
        name: q.s,
        acceptedAnswer: { '@type': 'Answer', text: q.c }
      }))
    });
  }

  return kabuk({
    site,
    baslik: veri.metaBaslik || site.seo.siteAdi,
    aciklama: veri.metaAciklama,
    yol: '/',
    govde,
    schema,
    sinif: 'sayfa-ana'
  });
}

module.exports = { anaSayfa };
