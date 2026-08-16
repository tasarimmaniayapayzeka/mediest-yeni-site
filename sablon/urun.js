// Ürün / cihaz sayfası şablonu — WP'de single-urun.php + ACF
const { kabuk, kacis } = require('./parca/kabuk');

const GRUP_AD = {
  mezoeffect: 'Mezoeffect Serum Grubu',
  mezocomplex: 'Mezocomplex Solüsyonlar',
  cihaz: 'Cihazlar'
};
const GRUP_URL = {
  mezoeffect: '/urunler/mezoeffect/',
  mezocomplex: '/urunler/mezocomplex/',
  cihaz: '/cihazlar/'
};

const roman = n => ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n);

function kirinti(u) {
  const parcalar = [
    { ad: 'Ana Sayfa', url: '/' },
    { ad: GRUP_AD[u.grup], url: GRUP_URL[u.grup] },
    { ad: u.adKisa || u.ad, url: null }
  ];
  return `<nav class="kirinti" aria-label="Sayfa yolu">
    ${parcalar.map((p, n) => p.url
      ? `<a href="${p.url}">${kacis(p.ad)}</a><span class="kirinti__ayrac" aria-hidden="true">/</span>`
      : `<span aria-current="page">${kacis(p.ad)}</span>`).join('\n    ')}
  </nav>`;
}

function kunyeSerit(u) {
  const hucreler = [];
  if (u.ambalaj) {
    if (u.ambalaj.hacim) hucreler.push(['Hacim', u.ambalaj.hacim]);
    if (u.ambalaj.adet) hucreler.push(['Kutu İçeriği', `${u.ambalaj.adet} ${u.ambalaj.birim || 'adet'}`]);
  }
  if (u.seansPlani?.seansSayisi) hucreler.push(['Seans', u.seansPlani.seansSayisi]);
  if (u.seansPlani?.aralik) hucreler.push(['Seans Aralığı', u.seansPlani.aralik]);
  if (u.protokol?.kombinasyon?.length) {
    hucreler.push(['Kombinasyon', u.protokol.kombinasyon.map(k => k === 'gold-pen' ? 'Gold Pen' : k === 'baby-skin-pen' ? 'Baby Skin Pen' : k).join(' · ')]);
  }
  if (!hucreler.length) return '';
  return `<div class="kunye">
    ${hucreler.map(([e, d]) => `<div class="kunye__hucre">
      <div class="kunye__etiket">${kacis(e)}</div>
      <div class="kunye__deger">${kacis(d)}</div>
    </div>`).join('\n    ')}
  </div>`;
}

function bolumAktifIcerikler(u) {
  if (!u.aktifIcerikler?.length) return '';
  return `<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Formül</span>
      <h2>Etkin içerikler ve işlevleri</h2>
    </div>
    <div class="izgara izgara--2">
      ${u.aktifIcerikler.map((a, n) => `<div class="kart">
        <div class="icerik-kart">
          <span class="icerik-kart__isaret" aria-hidden="true">${roman(n + 1)}</span>
          <div>
            <div class="icerik-kart__ad">${kacis(a.ad)}</div>
            <p>${kacis(a.aciklama)}</p>
          </div>
        </div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumKimeNeden(u) {
  const sol = u.kimlerIcin?.length ? `<div>
      <span class="ust-etiket">Endikasyon</span>
      <h2>Kimler için uygundur?</h2>
      <ul class="isaretli">
        ${u.kimlerIcin.map(x => `<li>${kacis(x)}</li>`).join('\n        ')}
      </ul>
    </div>` : '';
  const sag = u.klinikAvantajlar?.length ? `<div>
      <span class="ust-etiket">Uygulayıcı için</span>
      <h2>Klinik avantajları</h2>
      <ul class="isaretli">
        ${u.klinikAvantajlar.map(x => `<li>${kacis(x)}</li>`).join('\n        ')}
      </ul>
    </div>` : '';
  if (!sol && !sag) return '';
  return `<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="izgara izgara--2" style="gap:clamp(2rem,5vw,4rem)">
      ${sol}
      ${sag}
    </div>
  </div>
</section>`;
}

function bolumTeknolojiler(u) {
  if (!u.teknolojiler?.length) return '';
  return `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Teknoloji</span>
      <h2>Cihazın çalışma prensibi</h2>
    </div>
    <div class="izgara izgara--2">
      ${u.teknolojiler.map(t => `<div>
        <h3>${kacis(t.ad)}${t.baslik ? ` <span style="display:block;font-size:.8em;color:var(--marka-acik);font-weight:400">${kacis(t.baslik)}</span>` : ''}</h3>
        <p style="color:#a9bed3">${kacis(t.aciklama)}</p>
        ${t.maddeler?.length ? `<ul class="isaretli" style="margin-top:1.15rem">${t.maddeler.map(m => `<li>${kacis(m)}</li>`).join('')}</ul>` : ''}
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumUygulamaAlanlari(u) {
  if (!u.uygulamaAlanlari?.length) return '';
  return `<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Endikasyon</span>
      <h2>Uygulama alanları</h2>
    </div>
    <div class="izgara izgara--3">
      ${u.uygulamaAlanlari.map((a, n) => `<article class="kart">
        <div class="kart__no">${String(n + 1).padStart(2, '0')}</div>
        <h3>${kacis(a.ad)}</h3>
        <p>${kacis(a.aciklama)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumLed(u) {
  if (!u.led?.length) return '';
  return `<section class="bolum bolum--buz">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">LED Fototerapi</span>
      <h2>Işık renkleri ve etkileri</h2>
    </div>
    <div class="izgara izgara--3">
      ${u.led.map(l => `<div class="kart">
        <div class="kart__no">${kacis(l.renk)}${l.dalgaBoyu ? ` · ${kacis(l.dalgaBoyu)}` : ''}</div>
        <p>${kacis(l.etki)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumKapsuller(u) {
  if (!u.kapsuller?.length) return '';
  return `<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Kapsül Serisi</span>
      <h2>Cilt ihtiyacına göre kapsül seçimi</h2>
    </div>
    <div class="izgara izgara--4">
      ${u.kapsuller.map(k => `<div class="kart">
        <h3 style="font-size:1.125rem">${kacis(k.ad)}</h3>
        <p>${kacis(k.etki)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumProtokol(u) {
  const p = u.protokol || {};
  const varMi = p.kullanim || p.evKullanimi || u.seansPlani || u.ambalaj?.not;
  if (!varMi) return '';
  return `<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="izgara izgara--2" style="gap:clamp(2rem,5vw,4rem)">
      <div>
        <span class="ust-etiket">Uygulama</span>
        <h2>Protokol ve kullanım</h2>
        ${p.kullanim ? `<p class="giris">${kacis(p.kullanim)}</p>` : ''}
        ${p.evKullanimi ? `<div class="not-kutu" style="margin-top:1.5rem"><strong>Ev kullanımı:</strong> ${kacis(p.evKullanimi)}</div>` : ''}
      </div>
      <div>
        ${u.seansPlani ? `<div class="kart">
          <h3 style="font-size:1.125rem">Seans planı</h3>
          <ul class="isaretli">
            ${u.seansPlani.seansSayisi ? `<li>Önerilen seans sayısı: ${kacis(u.seansPlani.seansSayisi)}</li>` : ''}
            ${u.seansPlani.aralik ? `<li>Seans aralığı: ${kacis(u.seansPlani.aralik)}</li>` : ''}
            ${u.seansPlani.not ? `<li>${kacis(u.seansPlani.not)}</li>` : ''}
          </ul>
        </div>` : ''}
        ${u.ambalaj?.not ? `<div class="not-kutu" style="margin-top:1.25rem">${kacis(u.ambalaj.not)}</div>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function bolumBayiDestegi(u) {
  if (!u.bayiDestegi?.length) return '';
  return `<section class="bolum koyu">
  <div class="kapsayici">
    <div class="izgara izgara--2" style="gap:clamp(2rem,5vw,4rem);align-items:center">
      <div>
        <span class="ust-etiket">İş Ortaklığı</span>
        <h2>Cihazı alan merkezlere sağlanan destek</h2>
        <p class="giris">MediEst Group yalnızca ürün tedarik etmez; uygulayıcıya eğitim, protokol danışmanlığı ve içerik desteği sunar.</p>
        <a class="dugme dugme--acik" href="/bayilik/" style="margin-top:1.75rem">Bayilik koşullarını görün</a>
      </div>
      <ul class="isaretli">
        ${u.bayiDestegi.map(b => `<li>${kacis(b)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>`;
}

function bolumSss(u) {
  if (!u.sss?.length) return '';
  return `<section class="bolum" id="sss">
  <div class="kapsayici">
    <div class="bolum-basi dar">
      <span class="ust-etiket">Sık Sorulan Sorular</span>
      <h2>${kacis(u.adKisa || u.ad)} hakkında merak edilenler</h2>
    </div>
    <div class="sss dar" data-sss>
      ${u.sss.map((q, n) => `<div class="sss__oge">
        <h3 style="margin:0">
          <button class="sss__dugme" type="button" aria-expanded="false" aria-controls="sss-${n}">
            <span>${kacis(q.s)}</span>
            <span class="sss__isaret" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="sss__govde" id="sss-${n}" data-acik="false"><div><p>${kacis(q.c)}</p></div></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function bolumIlgili(u, tumUrunler) {
  const ilgili = (u.ilgiliUrunler || []).map(s => tumUrunler.find(x => x.slug === s)).filter(Boolean);
  if (!ilgili.length) return '';
  return `<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Birlikte kullanılır</span>
      <h2>İlgili ürünler</h2>
    </div>
    <div class="izgara izgara--3">
      ${ilgili.map(r => `<a class="kart kart--tiklanir urun-kart" href="/${r.slug}/">
        <div class="urun-kart__gorsel">${r.gorsel?.ana ? `<img src="/varlik/gorsel/${r.gorsel.ana}" alt="${kacis(r.gorsel.altMetin || r.ad)}" loading="lazy" decoding="async">` : 'Görsel hazırlanıyor'}</div>
        <div class="urun-kart__govde">
          <div class="urun-kart__etiket">${kacis(r.etiket || GRUP_AD[r.grup])}</div>
          <div class="urun-kart__ad">${kacis(r.ad)}</div>
          <p>${kacis((r.ozet || '').slice(0, 130))}${(r.ozet || '').length > 130 ? '…' : ''}</p>
          <span class="metin-link">İncele</span>
        </div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function ctaSerit(site) {
  return `<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Teklif ve Bilgi</span>
      <h2 style="margin-bottom:.5rem">Kliniğiniz için protokol planlayalım</h2>
      <p style="color:#a9bed3;margin:0">Satış yalnızca güzellik merkezi ve kliniklere yapılır. Ürün ve cihazlarımızı Bakırköy showroom'da birebir deneyebilirsiniz.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="${site.teklifUrl}">Teklif Al</a>
      <a class="dugme dugme--hayalet" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>`;
}

function urunSayfasi({ site, urun: u, tumUrunler, gorselVarMi = () => false }) {
  const yol = `/${u.slug}/`;
  // Görsel dosyası fiilen üretilmediyse yer tutucu göster (404 basmayalım)
  const gorselYolu = u.gorsel?.ana && gorselVarMi(u.gorsel.ana) ? `/varlik/gorsel/${u.gorsel.ana}` : null;

  const hero = `<section class="urun-hero koyu">
  <div class="kapsayici">
    ${kirinti(u)}
    <div class="urun-hero__izgara">
      <div>
        <span class="ust-etiket">${kacis(u.etiket || GRUP_AD[u.grup])}</span>
        <h1>${kacis(u.ad)}</h1>
        <p class="giris">${kacis(u.ozet)}</p>
        <div class="urun-hero__eylem">
          <a class="dugme dugme--acik" href="${site.teklifUrl}">Teklif Al</a>
          <a class="dugme dugme--hayalet" href="#sss">Sık sorulan sorular</a>
        </div>
        ${kunyeSerit(u)}
      </div>
      <figure class="urun-hero__gorsel${gorselYolu ? '' : ' urun-hero__gorsel--yer-tutucu'}">
        <span class="urun-hero__rozet">${u.tip === 'cihaz' ? 'Cihaz' : 'UTS Kayıtlı'}</span>
        ${gorselYolu
          ? `<img src="${gorselYolu}" alt="${kacis(u.gorsel.altMetin || u.ad)}" width="900" height="1125" loading="eager">`
          : `<span>Görsel hazırlanıyor</span>`}
      </figure>
    </div>
  </div>
</section>`;

  const govde = [
    hero,
    bolumTeknolojiler(u),
    bolumAktifIcerikler(u),
    bolumUygulamaAlanlari(u),
    bolumLed(u),
    bolumKapsuller(u),
    bolumKimeNeden(u),
    bolumProtokol(u),
    bolumBayiDestegi(u),
    bolumSss(u),
    bolumIlgili(u, tumUrunler),
    ctaSerit(site)
  ].filter(Boolean).join('\n\n');

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: u.ad,
      description: u.ozet,
      brand: { '@type': 'Brand', name: u.grup === 'cihaz' ? u.ad : (u.grup === 'mezoeffect' ? 'Mezoeffect' : 'Mezocomplex') },
      manufacturer: { '@type': 'Organization', name: site.marka.ad },
      category: GRUP_AD[u.grup],
      url: site.seo.baseUrl + yol
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: GRUP_AD[u.grup], item: site.seo.baseUrl + GRUP_URL[u.grup] },
        { '@type': 'ListItem', position: 3, name: u.ad, item: site.seo.baseUrl + yol }
      ]
    }
  ];
  if (u.sss?.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: u.sss.map(q => ({
        '@type': 'Question',
        name: q.s,
        acceptedAnswer: { '@type': 'Answer', text: q.c }
      }))
    });
  }

  return kabuk({
    site,
    baslik: u.metaBaslik || u.ad,
    aciklama: u.metaAciklama,
    yol,
    govde,
    schema,
    sinif: 'sayfa-urun'
  });
}

module.exports = { urunSayfasi, GRUP_AD, GRUP_URL };
