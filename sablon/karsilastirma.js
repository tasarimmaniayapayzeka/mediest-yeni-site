// Cihaz karşılaştırma sayfası — WP'de page-karsilastirma.php
const { kabuk, kacis } = require('./parca/kabuk');

// Kaynakta veri olmayan hücreler gizlenmez, işaretlenir
const BOS_DEGERLER = ['Belirtilmemiş', 'Belirtilmemis', 'Müşteri teyidi bekliyor', 'Musteri teyidi bekliyor'];
const bosMu = d => BOS_DEGERLER.includes(String(d || '').trim());

function hucre(deger, etiket, not) {
  const bos = bosMu(deger);
  return `<div class="kiyas__hucre">
        <span class="kiyas__etiket">${kacis(etiket)}</span>
        <div class="kiyas__deger${bos ? ' kiyas__bos' : ''}">${kacis(deger)}</div>
        ${not ? `<span class="kiyas__not">${kacis(not)}</span>` : ''}
      </div>`;
}

function karsilastirmaSayfasi({ site, veri, urunler }) {
  const [c1, c2] = veri.cihazlar;
  const yol = '/cihazlar/karsilastirma/';

  let bosSayisi = 0;
  const tablo = veri.gruplar.map(g => `<div class="kiyas__grup">${kacis(g.ad)}</div>
    ${g.satirlar.map(s => {
      if (bosMu(s.goldpen)) bosSayisi++;
      if (bosMu(s.babySkinPen)) bosSayisi++;
      return `<div class="kiyas__satir">
      <div class="kiyas__hucre"><div class="kiyas__ozellik">${kacis(s.ozellik)}</div></div>
      ${hucre(s.goldpen, c1.ad, null)}
      ${hucre(s.babySkinPen, c2.ad, null)}
      ${s.not ? `<div class="kiyas__hucre" style="grid-column:1/-1;padding-top:0"><span class="kiyas__not">${kacis(s.not)}</span></div>` : ''}
    </div>`;
    }).join('\n    ')}`).join('\n    ');

  const govde = `<section class="hub-hero koyu">
  <div class="kapsayici">
    <nav class="kirinti" aria-label="Sayfa yolu">
      <a href="/">Ana Sayfa</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
      <a href="/cihazlar/">Cihazlar</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
      <span aria-current="page">Karşılaştırma</span>
    </nav>
    <div class="hub-hero__ic">
      <span class="ust-etiket">${kacis(veri.ustEtiket)}</span>
      <h1>${kacis(veri.baslik)}</h1>
      <p class="giris">${kacis(veri.giris)}</p>
    </div>
  </div>
</section>

<section class="bolum">
  <div class="kapsayici">
    <div class="kiyas">
      <div class="kiyas__ust">
        <div class="kiyas__ust-hucre"><span class="kiyas__etiket" style="display:block;color:#9fb6cc">Özellik</span></div>
        ${[c1, c2].map(c => `<div class="kiyas__ust-hucre">
          <div class="kiyas__cihaz-ad">${kacis(c.ad)}</div>
          <p class="kiyas__cihaz-ozet">${kacis(c.ozet)}</p>
          <a class="metin-link" href="/${c.slug}/">Sayfasına git</a>
        </div>`).join('\n        ')}
      </div>
      ${tablo}
    </div>
    ${veri.not ? `<div class="not-kutu" style="margin-top:1.5rem">${kacis(veri.not)}</div>` : ''}
  </div>
</section>

<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Seçim</span>
      <h2>Hangi klinik hangisini tercih ediyor?</h2>
    </div>
    <div class="kiyas-sonuc">
      ${veri.hangisi.map(h => `<article class="kiyas-sonuc__kart">
        <h3>${kacis(h.baslik)}</h3>
        <ul class="isaretli">
          ${h.maddeler.map(m => `<li>${kacis(m)}</li>`).join('\n          ')}
        </ul>
        <div><a class="dugme dugme--birincil" href="/${h.slug}/">Cihaz sayfasını aç</a></div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Karar aşaması</span>
      <h2 style="margin-bottom:.5rem">İki cihazı da showroom'da deneyin</h2>
      <p style="color:#a9bed3;margin:0">${kacis(site.iletisim.showroom)}. Satış yalnızca güzellik merkezi ve kliniklere yapılır.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="/bayilik/#teklif">Teklif Al</a>
      <a class="dugme dugme--hayalet" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>`;

  const schema = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
      { '@type': 'ListItem', position: 2, name: 'Cihazlar', item: site.seo.baseUrl + '/cihazlar/' },
      { '@type': 'ListItem', position: 3, name: 'Karşılaştırma', item: site.seo.baseUrl + yol }
    ]
  }];

  return {
    html: kabuk({
      site,
      baslik: veri.metaBaslik,
      aciklama: veri.metaAciklama,
      yol,
      govde,
      schema,
      sinif: 'sayfa-kiyas'
    }),
    bosSayisi
  };
}

module.exports = { karsilastirmaSayfasi };
