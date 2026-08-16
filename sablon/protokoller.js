// Protokol Seçici — JS'siz de çalışır (tüm paneller açık), JS varsa filtreye dönüşür
const { kabuk, kacis } = require('./parca/kabuk');

const CIHAZ_AD = { goldpen: 'Gold Pen', 'baby-skin-pen': 'Baby Skin Pen' };

function protokolSayfasi({ site, veri, urunler, gorselVarMi = () => false }) {
  const yol = '/protokoller/';
  const bulunmayan = [];
  const ur = s => {
    const u = urunler.find(x => x.slug === s);
    if (!u) bulunmayan.push(s);
    return u;
  };

  const kategoriler = veri.kategoriler.map(k => ({
    ...k,
    cihazListe: (k.cihazlar || []).map(c => ({ ...c, urun: ur(c.slug) })).filter(c => c.urun),
    urunListe: (k.urunler || []).map(u => ({ ...u, urun: ur(u.slug) })).filter(u => u.urun)
  }));

  const secimler = kategoriler.map((k, n) => `<button class="protokol-chip" type="button"
        role="tab" id="chip-${k.id}" aria-controls="panel-${k.id}" aria-selected="${n === 0}">
        ${kacis(k.ad)}
      </button>`).join('\n      ');

  const paneller = kategoriler.map((k, n) => `<section class="protokol-panel" id="panel-${k.id}"
      role="tabpanel" aria-labelledby="chip-${k.id}" data-ilk="${n === 0}">
      <h2 class="protokol-panel__baslik">${kacis(k.ad)}</h2>
      ${k.aciklama ? `<p class="giris">${kacis(k.aciklama)}</p>` : ''}

      ${k.cihazListe.length ? `<div class="protokol-blok">
        <h3 class="protokol-blok__baslik">Önerilen cihaz</h3>
        <div class="izgara izgara--2">
          ${k.cihazListe.map(c => `<a class="kart kart--tiklanir" href="/${c.slug}/">
            <div class="kart__no">${kacis(CIHAZ_AD[c.slug] || c.urun.ad)}</div>
            <p>${kacis(c.not || c.urun.ozet)}</p>
            <span class="metin-link" style="margin-top:1rem">Cihaz sayfası</span>
          </a>`).join('\n          ')}
        </div>
      </div>` : ''}

      ${k.urunListe.length ? `<div class="protokol-blok">
        <h3 class="protokol-blok__baslik">Kombine edilebilecek ürünler</h3>
        <div class="izgara izgara--3">
          ${k.urunListe.map(u => `<a class="kart kart--tiklanir urun-kart" href="/${u.slug}/">
            <div class="urun-kart__gorsel">${
              u.urun.gorsel?.ana && gorselVarMi(u.urun.gorsel.ana)
                ? `<img src="/varlik/gorsel/${u.urun.gorsel.ana}" alt="${kacis(u.urun.ad)}" loading="lazy" decoding="async">`
                : 'Görsel hazırlanıyor'}</div>
            <div class="urun-kart__govde">
              <div class="urun-kart__etiket">${kacis(u.urun.etiket || '')}</div>
              <div class="urun-kart__ad">${kacis(u.urun.ad)}</div>
              <p>${kacis(u.not || (u.urun.ozet || '').slice(0, 120))}</p>
              <span class="metin-link">İncele</span>
            </div>
          </a>`).join('\n          ')}
        </div>
      </div>` : `<div class="not-kutu">Bu başlık için ürün eşleşmesi üretici teyidi bekliyor.</div>`}

      ${k.seansNotu ? `<div class="not-kutu" style="margin-top:1.5rem">${kacis(k.seansNotu)}</div>` : ''}
    </section>`).join('\n\n    ');

  const govde = `<section class="hub-hero koyu">
  <div class="kapsayici">
    <nav class="kirinti" aria-label="Sayfa yolu">
      <a href="/">Ana Sayfa</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
      <span aria-current="page">Protokoller</span>
    </nav>
    <div class="hub-hero__ic">
      <span class="ust-etiket">${kacis(veri.ustEtiket)}</span>
      <h1>${kacis(veri.baslik)}</h1>
      <p class="giris">${kacis(veri.giris)}</p>
    </div>
  </div>
</section>

<section class="bolum" id="secici">
  <div class="kapsayici">
    <div class="protokol-secim" role="tablist" aria-label="Uygulama alanı seçin" data-protokol-secim>
      ${secimler}
    </div>

    <div class="protokol-paneller" data-protokol-paneller>
    ${paneller}
    </div>

    ${veri.not ? `<div class="not-kutu" style="margin-top:2.5rem">${kacis(veri.not)}</div>` : ''}
  </div>
</section>

<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Protokol danışmanlığı</span>
      <h2 style="margin-bottom:.5rem">Kliniğinize özel kombinasyonu birlikte kuralım</h2>
      <p style="color:#a9bed3;margin:0">Buradaki eşleşmeler başlangıç noktasıdır; nihai protokol uygulayıcının değerlendirmesiyle belirlenir.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="${site.teklifUrl}">Teklif Al</a>
      <a class="dugme dugme--hayalet" href="/cihazlar/karsilastirma/">Cihazları karşılaştır</a>
    </div>
  </div>
</section>`;

  const schema = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
      { '@type': 'ListItem', position: 2, name: 'Protokoller', item: site.seo.baseUrl + yol }
    ]
  }];

  return {
    html: kabuk({ site, baslik: veri.metaBaslik, aciklama: veri.metaAciklama, yol, govde, schema, sinif: 'sayfa-protokol' }),
    kategoriSayisi: kategoriler.length,
    bulunmayan
  };
}

module.exports = { protokolSayfasi };
