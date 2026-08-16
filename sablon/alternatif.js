// Üç tasarım alternatifi — aynı içerik, üç ayrı sanat yönü.
// Karar verildikten sonra kazanan yön ana şablonlara taşınacak.
const kacis = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const G = '/varlik/gorsel/';
const gr = (ad, alt, varMi, sinif = '') => {
  if (!ad || !varMi || !varMi(ad + '.webp')) return '';
  const iki = varMi(ad + '@2x.webp');
  return `<img src="${G}${ad}.webp"${iki ? ` srcset="${G}${ad}.webp 1x, ${G}${ad}@2x.webp 2x"` : ''} alt="${kacis(alt)}"${sinif ? ` class="${sinif}"` : ''} loading="lazy" decoding="async">`;
};
const urunGorsel = (u, varMi) => {
  const ad = (u.gorsel?.ana || '').replace(/\.webp$/, '');
  return gr(ad, u.gorsel?.altMetin || u.ad, varMi);
};

function veriTopla({ veri, urunler }) {
  const bul = t => (veri.bolumler || []).find(b => b.tip === t) || {};
  return {
    hero: bul('hero'),
    guven: bul('guvenSerit'),
    secim: bul('ikiliSecim'),
    grup: bul('urunGrubu'),
    protokol: bul('protokolSecici'),
    neden: bul('nedenBiz'),
    kapanis: bul('kapanisCta'),
    cihazlar: ['goldpen', 'baby-skin-pen'].map(s => urunler.find(u => u.slug === s)).filter(Boolean),
    mezoeffect: urunler.filter(u => u.grup === 'mezoeffect').sort((a, b) => a.sira - b.sira),
    mezocomplex: urunler.filter(u => u.grup === 'mezocomplex').sort((a, b) => a.sira - b.sira)
  };
}

function kabuk({ tema, ad, aciklama, govde, site }) {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kacis(ad)} — MediEst Group tasarım alternatifi</title>
<meta name="description" content="${kacis(aciklama)}">
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/varlik/css/site.css">
<link rel="stylesheet" href="/varlik/css/tema-${tema}.css">
<link rel="icon" href="/varlik/gorsel/favicon.svg" type="image/svg+xml">
<style>
  .alt-serit { position: sticky; top: 0; z-index: 90; display: flex; flex-wrap: wrap; gap: .5rem 1rem;
    align-items: center; justify-content: space-between; padding: .6rem clamp(1rem,3vw,2rem);
    background: #10131a; color: #cfd8e3; font-size: .8125rem; font-family: var(--f-govde); }
  .alt-serit a { color: #cfd8e3; padding: .35rem .8rem; border: 1px solid rgba(207,216,227,.28); border-radius: 40px; }
  .alt-serit a:hover { border-color: #6fa3d6; color: #fff; }
  .alt-serit a[aria-current] { background: #6fa3d6; border-color: #6fa3d6; color: #0b1724; font-weight: 600; }
  .alt-serit__grup { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
  .alt-serit__ayrac { width: 1px; height: 1.25rem; background: rgba(207,216,227,.3); }
</style>
</head>
<body class="tema-${tema}">
<div class="alt-serit">
  <strong style="color:#fff">Tasarım alternatifi: ${kacis(ad)}</strong>
  <div class="alt-serit__grup">
    <a href="/tasarim/a/"${tema === 'a' ? ' aria-current="page"' : ''}>A</a>
    <a href="/tasarim/b/"${tema === 'b' ? ' aria-current="page"' : ''}>B</a>
    <a href="/tasarim/c/"${tema === 'c' ? ' aria-current="page"' : ''}>C</a>
    <span class="alt-serit__ayrac"></span>
    <a href="/tasarim/d/"${tema === 'd' ? ' aria-current="page"' : ''}>D · Grafit</a>
    <a href="/tasarim/e/"${tema === 'e' ? ' aria-current="page"' : ''}>E · Çift Ton</a>
    <a href="/tasarim/f/"${tema === 'f' ? ' aria-current="page"' : ''}>F · Vitrin</a>
    <span class="alt-serit__ayrac"></span>
    <a href="/tasarim/">Tümü</a>
    <a href="/">Mevcut</a>
  </div>
</div>
${govde}
<script src="/varlik/js/site.js" defer></script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ TEMA A */
function temaA({ d, site, varMi }) {
  const cihaz = (u, n) => `<div class="a-cihaz${n % 2 ? ' a-cihaz--ters' : ''}">
      <div class="a-cihaz__gorsel">${urunGorsel(u, varMi)}</div>
      <div>
        <div class="a-etiket">${kacis(u.etiket || 'Cihaz')}</div>
        <h3>${kacis(u.ad)}</h3>
        <p>${kacis(u.ozet)}</p>
        ${u.uygulamaAlanlari?.length ? `<ul class="a-liste">${u.uygulamaAlanlari.slice(0, 4).map(a => `<li>${kacis(a.ad)}</li>`).join('')}</ul>` : ''}
        <a class="a-dugme a-dugme--bos" href="/${u.slug}/">${kacis(u.ad)} sayfası</a>
      </div>
    </div>`;

  const urun = u => `<a class="a-kart" href="/${u.slug}/">
        <div class="a-kart__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="a-kart__ust">${kacis(u.etiket || '')}</div>
        <h3>${kacis(u.adKisa || u.ad)}</h3>
        <p>${kacis((u.ozet || '').slice(0, 95))}…</p>
        <span class="a-kart__link">İncele</span>
      </a>`;

  return `<main>
<section class="a-hero">
  <div class="a-kap">
    <div class="a-hero__izgara">
      <div>
        <div class="a-etiket">${kacis(d.hero.ustEtiket || '')}</div>
        <h1>${kacis(d.hero.baslik)}</h1>
        <p>${kacis(d.hero.giris)}</p>
        <div class="a-dugmeler">
          <a class="a-dugme" href="${site.teklifUrl}">Teklif Al</a>
          <a class="a-dugme a-dugme--bos" href="/cihazlar/karsilastirma/">Cihazları karşılaştır</a>
        </div>
      </div>
      <div class="a-hero__gorsel">${gr('goldpen', 'Gold Pen cihazı', varMi)}</div>
    </div>
  </div>
</section>

<dl class="a-sayilar">
  ${(d.guven.maddeler || []).map(m => `<div><dt>${kacis(m.baslik)}</dt><dd>${kacis(m.aciklama)}</dd></div>`).join('')}
</dl>

<section class="a-bolum">
  <div class="a-kap">
    <div class="a-basi">
      <div class="a-etiket">${kacis(d.secim.ustEtiket || 'Cihazlar')}</div>
      <h2>${kacis(d.secim.baslik)}</h2>
      <p>${kacis(d.secim.giris || '')}</p>
    </div>
    ${d.cihazlar.map(cihaz).join('\n    ')}
  </div>
</section>

<section class="a-bolum a-bolum--gri">
  <div class="a-kap">
    <div class="a-basi">
      <div class="a-etiket">${kacis(d.grup.ustEtiket || 'Ürünler')}</div>
      <h2>${kacis(d.grup.baslik)}</h2>
      <p>${kacis(d.grup.giris || '')}</p>
    </div>
    <div class="a-izgara a-izgara--4">${d.mezoeffect.map(urun).join('')}</div>
    <div style="height:clamp(2.5rem,5vw,4rem)"></div>
    <div class="a-izgara a-izgara--4">${d.mezocomplex.map(urun).join('')}</div>
  </div>
</section>

<section class="a-bolum">
  <div class="a-kap">
    <div class="a-basi">
      <div class="a-etiket">${kacis(d.protokol.ustEtiket || 'Protokol')}</div>
      <h2>${kacis(d.protokol.baslik)}</h2>
    </div>
    <table class="a-tablo">
      <thead><tr><th>Uygulama alanı</th><th>Cihaz</th><th>Önerilen ürün</th></tr></thead>
      <tbody>
        ${(d.protokol.satirlar || []).map(s => `<tr>
          <td>${kacis(s.sorun)}</td><td>${kacis(s.cihaz)}</td>
          <td>${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>

<section class="a-kapanis">
  <div class="a-kap">
    <h2>${kacis(d.kapanis.baslik)}</h2>
    <p>${kacis(d.kapanis.giris || '')}</p>
    <div class="a-dugmeler"><a class="a-dugme" href="${site.teklifUrl}">Teklif Al</a>
    <a class="a-dugme a-dugme--bos" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a></div>
  </div>
</section>
</main>`;
}

/* ------------------------------------------------------------------ TEMA B */
function temaB({ d, site, varMi }) {
  const cihaz = (u, n) => `<div class="b-cihaz${n % 2 ? ' b-cihaz--ters' : ''}">
      <div class="b-cihaz__gorsel">${urunGorsel(u, varMi)}</div>
      <div>
        <div class="b-oge__no">${String(n + 1).padStart(2, '0')} — ${kacis(u.etiket || 'Cihaz')}</div>
        <h3>${kacis(u.ad)}</h3>
        <p>${kacis(u.ozet)}</p>
        ${u.uygulamaAlanlari?.length ? `<ul class="b-liste">${u.uygulamaAlanlari.slice(0, 4).map(a => `<li>${kacis(a.ad)}</li>`).join('')}</ul>` : ''}
        <a class="b-link" href="/${u.slug}/">Cihaz sayfasına git</a>
      </div>
    </div>`;

  const urun = (u, n) => `<a class="b-oge" href="/${u.slug}/">
        <div class="b-oge__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="b-oge__no">${String(n + 1).padStart(2, '0')}</div>
        <h3>${kacis(u.adKisa || u.ad)}</h3>
        <p>${kacis((u.ozet || '').slice(0, 110))}…</p>
      </a>`;

  return `<main>
<section class="b-hero">
  <div class="b-kap">
    <div class="b-hero__ust">${kacis(d.hero.ustEtiket || '')}</div>
    <h1>${kacis(d.hero.baslik)}</h1>
    <div class="b-hero__alt">
      <div>
        <p>${kacis(d.hero.giris)}</p>
        <div class="b-dugmeler">
          <a class="b-dugme" href="${site.teklifUrl}">Teklif Al</a>
          <a class="b-link" href="/protokoller/">Protokol Seçici</a>
        </div>
      </div>
      <div class="b-hero__gorsel">${gr('mezoeffect', 'Mezoeffect ampul serisi', varMi)}</div>
    </div>
  </div>
</section>

<div class="b-genis">
  <div class="b-genis__gorsel">${gr('showroom', 'Bakırköy showroom', varMi)}</div>
  <div class="b-genis__kutu">
    <h3>Bakırköy showroom</h3>
    <p>${kacis(site.iletisim.showroom)}. Karar vermeden önce iki cihazı da elinize alabilirsiniz.</p>
  </div>
</div>

<section class="b-bolum">
  <div class="b-kap">
    <div class="b-basi">
      <div class="b-no">01</div>
      <div><h2>${kacis(d.secim.baslik)}</h2><p>${kacis(d.secim.giris || '')}</p></div>
    </div>
    ${d.cihazlar.map(cihaz).join('\n    ')}
  </div>
</section>

<section class="b-bolum">
  <div class="b-kap">
    <div class="b-basi">
      <div class="b-no">02</div>
      <div><h2>${kacis(d.grup.baslik)}</h2><p>${kacis(d.grup.giris || '')}</p></div>
    </div>
    <div class="b-katalog">${[...d.mezoeffect, ...d.mezocomplex].map(urun).join('')}</div>
  </div>
</section>

<section class="b-bolum">
  <div class="b-kap">
    <div class="b-basi">
      <div class="b-no">03</div>
      <div><h2>${kacis(d.protokol.baslik)}</h2><p>${kacis(d.protokol.giris || '')}</p></div>
    </div>
    <div class="b-protokol">
      ${(d.protokol.satirlar || []).map(s => `<div class="b-satir">
        <div class="b-satir__sorun">${kacis(s.sorun)}</div>
        <div class="b-satir__cihaz">${kacis(s.cihaz)}</div>
        <div class="b-satir__urun">${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="b-kapanis">
  <div class="b-kap">
    <h2>${kacis(d.kapanis.baslik)}</h2>
    <p>${kacis(d.kapanis.giris || '')}</p>
    <div class="b-dugmeler"><a class="b-dugme" href="${site.teklifUrl}">Teklif Al</a></div>
  </div>
</section>
</main>`;
}

/* ------------------------------------------------------------------ TEMA C */
function temaC({ d, site, varMi }) {
  const cihaz = (u, n) => `<div class="c-cihaz${n % 2 ? ' c-cihaz--ters' : ''}" style="margin-top:${n ? 'clamp(3rem,6vw,5rem)' : '0'}">
      <div class="c-isik c-isik--kare">${urunGorsel(u, varMi)}</div>
      <div>
        <div class="c-etiket">${kacis(u.etiket || 'Cihaz')}</div>
        <h3>${kacis(u.ad)}</h3>
        <p>${kacis(u.ozet)}</p>
        ${u.uygulamaAlanlari?.length ? `<ul class="c-liste">${u.uygulamaAlanlari.slice(0, 4).map(a => `<li>${kacis(a.ad)}</li>`).join('')}</ul>` : ''}
        <a class="c-dugme c-dugme--bos" href="/${u.slug}/">Cihaz sayfası</a>
      </div>
    </div>`;

  const urun = u => `<a class="c-kart" href="/${u.slug}/">
        <div class="c-isik c-isik--yatay">${urunGorsel(u, varMi)}</div>
        <div class="c-kart__govde">
          <div class="c-kart__ust">${kacis(u.etiket || '')}</div>
          <h3>${kacis(u.adKisa || u.ad)}</h3>
          <p>${kacis((u.ozet || '').slice(0, 95))}…</p>
          <span class="c-kart__link">İncele</span>
        </div>
      </a>`;

  return `<main>
<section class="c-hero">
  <div class="c-kap c-hero__izgara">
    <div>
      <div class="c-etiket">${kacis(d.hero.ustEtiket || '')}</div>
      <h1>${kacis(d.hero.baslik)}</h1>
      <p>${kacis(d.hero.giris)}</p>
      <div class="c-dugmeler">
        <a class="c-dugme" href="${site.teklifUrl}">Teklif Al</a>
        <a class="c-dugme c-dugme--bos" href="/cihazlar/karsilastirma/">Cihazları karşılaştır</a>
      </div>
      <dl class="c-kunye">
        ${(d.hero.rozetler || []).map(r => `<div><dt>${kacis(r.etiket)}</dt><dd>${kacis(r.deger)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="c-isik c-isik--kare">${gr('goldpen', 'Gold Pen cihazı', varMi)}</div>
  </div>
</section>

<section class="c-bolum">
  <div class="c-kap">
    <div class="c-basi">
      <div class="c-etiket">${kacis(d.secim.ustEtiket || 'Cihazlar')}</div>
      <h2>${kacis(d.secim.baslik)}</h2>
      <p>${kacis(d.secim.giris || '')}</p>
    </div>
    ${d.cihazlar.map(cihaz).join('\n    ')}
  </div>
</section>

<section class="c-bolum">
  <div class="c-kap">
    <div class="c-basi">
      <div class="c-etiket">${kacis(d.grup.ustEtiket || 'Ürünler')}</div>
      <h2>${kacis(d.grup.baslik)}</h2>
      <p>${kacis(d.grup.giris || '')}</p>
    </div>
    <div class="c-izgara c-izgara--3">${[...d.mezoeffect, ...d.mezocomplex].map(urun).join('')}</div>
  </div>
</section>

<section class="c-bolum">
  <div class="c-kap">
    <div class="c-basi">
      <div class="c-etiket">${kacis(d.protokol.ustEtiket || 'Protokol')}</div>
      <h2>${kacis(d.protokol.baslik)}</h2>
    </div>
    <div class="c-protokol">
      ${(d.protokol.satirlar || []).map(s => `<div class="c-satir">
        <div class="c-satir__sorun">${kacis(s.sorun)}</div>
        <div class="c-satir__cihaz">${kacis(s.cihaz)}</div>
        <div class="c-satir__urun">${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="c-kapanis">
  <div class="c-kap">
    <div class="c-etiket">${kacis(d.kapanis.ustEtiket || 'Teklif')}</div>
    <h2>${kacis(d.kapanis.baslik)}</h2>
    <p>${kacis(d.kapanis.giris || '')}</p>
    <div class="c-dugmeler">
      <a class="c-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="c-dugme c-dugme--bos" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>
</main>`;
}

/* ------------------------------------------------------- TEMA D — Grafit */
function temaD({ d, site, varMi }) {
  const oge = u => `<a class="d-oge" href="/${u.slug}/">
        <div class="d-oge__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="d-oge__govde">
          <div class="d-oge__ust">${kacis(u.etiket || '')}</div>
          <h3>${kacis(u.adKisa || u.ad)}</h3>
          <p>${kacis((u.ozet || '').slice(0, 72))}…</p>
        </div>
      </a>`;

  const cihaz = (u, n) => `<div class="d-cihaz${n % 2 ? ' d-cihaz--ters' : ''}">
      <div class="d-isik d-isik--kare">${urunGorsel(u, varMi)}</div>
      <div>
        <div class="d-etiket">${kacis(u.etiket || 'Cihaz')}</div>
        <h3>${kacis(u.ad)}</h3>
        <p>${kacis(u.ozet)}</p>
        ${u.uygulamaAlanlari?.length ? `<div class="d-etiketler">${u.uygulamaAlanlari.slice(0, 5).map(a => `<span class="d-cip">${kacis(a.ad)}</span>`).join('')}</div>` : ''}
        <a class="d-dugme d-dugme--bos" href="/${u.slug}/">Cihaz sayfası</a>
      </div>
    </div>`;

  return `<main>
<section class="d-hero">
  <div class="d-kap d-hero__izgara">
    <div>
      <div class="d-etiket">${kacis(d.hero.ustEtiket || '')}</div>
      <h1>${kacis(d.hero.baslik)}</h1>
      <p>${kacis(d.hero.giris)}</p>
    </div>
    <div class="d-dugmeler">
      <a class="d-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="d-dugme d-dugme--bos" href="/cihazlar/karsilastirma/">Karşılaştır</a>
    </div>
  </div>
</section>

<section class="d-bolum d-bolum--yuzey">
  <div class="d-kap">
    <div class="d-basi">
      <div class="d-etiket">Katalog</div>
      <h2>${kacis(d.grup.baslik)}</h2>
      <p>${kacis(d.grup.giris || '')}</p>
    </div>
    <div class="d-katalog">${[...d.mezoeffect, ...d.mezocomplex].map(oge).join('')}</div>
  </div>
</section>

<section class="d-bolum">
  <div class="d-kap">
    <div class="d-basi">
      <div class="d-etiket">${kacis(d.secim.ustEtiket || 'Cihazlar')}</div>
      <h2>${kacis(d.secim.baslik)}</h2>
      <p>${kacis(d.secim.giris || '')}</p>
    </div>
    ${d.cihazlar.map(cihaz).join('\n    ')}
  </div>
</section>

<section class="d-bolum d-bolum--yuzey">
  <div class="d-kap">
    <div class="d-basi">
      <div class="d-etiket">${kacis(d.protokol.ustEtiket || 'Protokol')}</div>
      <h2>${kacis(d.protokol.baslik)}</h2>
    </div>
    <div class="d-protokol">
      ${(d.protokol.satirlar || []).map(s => `<article class="d-pkart">
        <h3>${kacis(s.sorun)}</h3>
        <dl>
          <dt>Cihaz</dt><dd>${kacis(s.cihaz)}</dd>
          <dt>Önerilen ürün</dt><dd>${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</dd>
        </dl>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="d-bolum">
  <div class="d-kap d-showroom">
    <div class="d-showroom__gorsel">${gr('showroom', 'Bakırköy showroom', varMi)}</div>
    <div>
      <div class="d-etiket">Showroom</div>
      <h2 style="font-size:clamp(1.5rem,2.8vw,2.1rem);margin:0 0 1.25rem">Cihazı elinize alın</h2>
      <dl class="d-kunye">
        <div><dt>Adres</dt><dd>${kacis(site.iletisim.adres.tam)}</dd></div>
        <div><dt>Telefon</dt><dd><a href="tel:${site.iletisim.telefonHam}" style="color:inherit">${kacis(site.iletisim.telefon)}</a></dd></div>
        <div><dt>Çalışma saatleri</dt><dd>${kacis(site.iletisim.calismaSaatleri)}</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="d-kapanis">
  <div class="d-kap">
    <h2>${kacis(d.kapanis.baslik)}</h2>
    <p>${kacis(d.kapanis.giris || '')}</p>
    <div class="d-dugmeler">
      <a class="d-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="d-dugme d-dugme--bos" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>
</main>`;
}

/* ---------------------------------------------------- TEMA E — Çift Ton */
function temaE({ d, site, varMi }) {
  const split = (u, n) => `<section class="e-split${n % 2 ? ' e-split--ters' : ''} ${n % 2 ? 'e-acik-2' : 'e-koyu'}">
    <div class="e-split__gorsel">${urunGorsel(u, varMi)}</div>
    <div class="e-split__metin">
      <div class="e-etiket">${kacis(u.etiket || 'Cihaz')}</div>
      <h2>${kacis(u.ad)}</h2>
      <p>${kacis(u.ozet)}</p>
      ${u.uygulamaAlanlari?.length ? `<ul class="e-liste">${u.uygulamaAlanlari.slice(0, 4).map(a => `<li>${kacis(a.ad)}</li>`).join('')}</ul>` : ''}
      <div><a class="e-dugme e-dugme--bos" href="/${u.slug}/">Cihaz sayfası</a></div>
    </div>
  </section>`;

  const oge = u => `<a class="e-oge" href="/${u.slug}/">
        <div class="e-oge__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="e-oge__ust">${kacis(u.etiket || '')}</div>
        <h3>${kacis(u.adKisa || u.ad)}</h3>
        <p>${kacis((u.ozet || '').slice(0, 70))}…</p>
      </a>`;

  return `<main>
<section class="e-hero e-koyu">
  <div class="e-kap">
    <div class="e-etiket">${kacis(d.hero.ustEtiket || '')}</div>
    <h1>${kacis(d.hero.baslik)}</h1>
    <p>${kacis(d.hero.giris)}</p>
    <div class="e-dugmeler">
      <a class="e-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="e-dugme e-dugme--bos" href="/protokoller/">Protokol Seçici</a>
    </div>
  </div>
</section>

${d.cihazlar.map(split).join('\n')}

<section class="e-bolum e-acik">
  <div class="e-kap">
    <div class="e-basi">
      <div class="e-etiket">Katalog</div>
      <h2>${kacis(d.grup.baslik)}</h2>
      <p>${kacis(d.grup.giris || '')}</p>
    </div>
    <div class="e-katalog">${[...d.mezoeffect, ...d.mezocomplex].map(oge).join('')}</div>
  </div>
</section>

<section class="e-bolum e-koyu">
  <div class="e-kap">
    <div class="e-basi">
      <div class="e-etiket">${kacis(d.protokol.ustEtiket || 'Protokol')}</div>
      <h2>${kacis(d.protokol.baslik)}</h2>
    </div>
    <div class="e-protokol">
      ${(d.protokol.satirlar || []).map(s => `<div class="e-psatir">
        <h3>${kacis(s.sorun)}</h3>
        <p>${kacis(s.cihaz)} · ${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="e-split e-acik-2">
  <div class="e-split__gorsel" style="padding:0"><img src="/varlik/gorsel/showroom.webp" alt="Bakırköy showroom" style="width:100%;height:100%;object-fit:cover;max-width:none" loading="lazy" decoding="async"></div>
  <div class="e-split__metin">
    <div class="e-etiket">Showroom</div>
    <h2>Karar vermeden önce deneyin</h2>
    <p>${kacis(site.iletisim.showroom)}.</p>
    <ul class="e-liste">
      <li>${kacis(site.iletisim.adres.tam)}</li>
      <li>${kacis(site.iletisim.telefon)}</li>
      <li>${kacis(site.iletisim.calismaSaatleri)}</li>
    </ul>
  </div>
</section>

<section class="e-kapanis e-koyu">
  <div class="e-kap">
    <h2>${kacis(d.kapanis.baslik)}</h2>
    <p>${kacis(d.kapanis.giris || '')}</p>
    <div class="e-dugmeler"><a class="e-dugme" href="${site.teklifUrl}">Teklif Al</a></div>
  </div>
</section>
</main>`;
}

/* ------------------------------------------------------- TEMA F — Vitrin */
function temaF({ d, site, varMi }) {
  const vitrin = u => `<a class="f-vitrin-kart" href="/${u.slug}/">
        <div class="f-vitrin-kart__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="f-vitrin-kart__govde">
          <div class="f-vitrin-kart__ust">${kacis(u.etiket || '')}</div>
          <h3>${kacis(u.adKisa || u.ad)}</h3>
          <p>${kacis((u.ozet || '').slice(0, 58))}…</p>
        </div>
      </a>`;

  const sahne = u => `<article class="f-sahne">
      <div class="f-sahne__ust">
        <div class="f-sahne__gorsel">${urunGorsel(u, varMi)}</div>
        <div class="f-sahne__metin">
          <div class="f-etiket">${kacis(u.etiket || 'Cihaz')}</div>
          <h3>${kacis(u.ad)}</h3>
          <p>${kacis(u.ozet)}</p>
          <a class="f-dugme f-dugme--bos" href="/${u.slug}/">Cihaz sayfası</a>
        </div>
      </div>
      ${u.uygulamaAlanlari?.length ? `<dl class="f-ozet">
        ${u.uygulamaAlanlari.slice(0, 4).map(a => `<div><dt>Uygulama</dt><dd>${kacis(a.ad)}</dd></div>`).join('')}
      </dl>` : ''}
    </article>`;

  return `<main>
<section class="f-hero">
  <div class="f-kap">
    <div class="f-etiket">${kacis(d.hero.ustEtiket || '')}</div>
    <h1>${kacis(d.hero.baslik)}</h1>
    <p>${kacis(d.hero.giris)}</p>
    <div class="f-dugmeler">
      <a class="f-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="f-dugme f-dugme--bos" href="/cihazlar/karsilastirma/">Cihazları karşılaştır</a>
    </div>

    <div class="f-vitrin">
      <div class="f-vitrin__ust">
        <h2>Katalog · ${d.mezoeffect.length + d.mezocomplex.length} ürün</h2>
        <span class="f-vitrin__not">Yana kaydırın →</span>
      </div>
      <div class="f-ray">${[...d.mezoeffect, ...d.mezocomplex].map(vitrin).join('')}</div>
    </div>
  </div>
</section>

<section class="f-bolum">
  <div class="f-kap">
    <div style="max-width:660px;margin-bottom:clamp(2rem,4vw,3rem)">
      <div class="f-etiket">${kacis(d.secim.ustEtiket || 'Cihazlar')}</div>
      <h2 style="font-size:clamp(1.7rem,3.2vw,2.5rem);margin:0 0 .8rem">${kacis(d.secim.baslik)}</h2>
      <p style="color:var(--f-ikincil);margin:0;line-height:1.7">${kacis(d.secim.giris || '')}</p>
    </div>
    ${d.cihazlar.map(sahne).join('\n    ')}
  </div>
</section>

<section class="f-bolum">
  <div class="f-kap f-protokol">
    <div class="f-protokol__basi">
      <div class="f-etiket">${kacis(d.protokol.ustEtiket || 'Protokol')}</div>
      <h2>${kacis(d.protokol.baslik)}</h2>
      <p>${kacis(d.protokol.giris || '')}</p>
      <a class="f-dugme f-dugme--bos" href="/protokoller/">Protokol Seçici</a>
    </div>
    <div class="f-akis">
      ${(d.protokol.satirlar || []).map(s => `<div class="f-akis__oge">
        <div class="f-akis__sorun">${kacis(s.sorun)}</div>
        <div class="f-akis__cihaz">${kacis(s.cihaz)}</div>
        <div class="f-akis__urun">${s.urunSlug ? `<a href="/${s.urunSlug}/">${kacis(s.urun)}</a>` : kacis(s.urun)}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="f-bolum">
  <div class="f-kap">
    <dl class="f-sayilar">
      ${(d.guven.maddeler || []).map(m => `<div><dt>${kacis(m.baslik)}</dt><dd>${kacis(m.aciklama)}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="f-kapanis">
  <div class="f-kap f-kapanis__ic">
    <div>
      <div class="f-etiket">${kacis(d.kapanis.ustEtiket || 'Teklif')}</div>
      <h2>${kacis(d.kapanis.baslik)}</h2>
      <p>${kacis(d.kapanis.giris || '')}</p>
    </div>
    <div class="f-dugmeler">
      <a class="f-dugme" href="${site.teklifUrl}">Teklif Al</a>
      <a class="f-dugme f-dugme--bos" href="tel:${site.iletisim.telefonHam}">${kacis(site.iletisim.telefon)}</a>
    </div>
  </div>
</section>
</main>`;
}

const TEMALAR = {
  a: { ad: 'A · Klinik Minimal', aciklama: 'Beyaz zemin, ince ayraçlar, ürün odaklı sakin düzen.', ciz: temaA },
  b: { ad: 'B · Editoryal', aciklama: 'Katalog düzeni, büyük serif tipografi, numaralı bölümler.', ciz: temaB },
  c: { ad: 'C · Koyu Premium', aciklama: 'Baştan sona koyu zemin, altın aksan, ışık kutusunda ürünler.', ciz: temaC },
  d: { ad: 'D · Grafit', aciklama: 'C\'nin açılmış hâli: arduvaz zemin, yumuşak kontrast. Akış katalogla başlar.', ciz: temaD },
  e: { ad: 'E · Çift Ton', aciklama: 'Koyu ve fildişi bölümler dönüşümlü, tam genişlik 50/50 bölünmüş ekranlar.', ciz: temaE },
  f: { ad: 'F · Vitrin', aciklama: 'Mavi-gri açık zemin, yana kaydırmalı ürün şeridi, yapışkan protokol paneli.', ciz: temaF }
};

function alternatifSayfasi({ tema, site, veri, urunler, gorselVarMi = () => false }) {
  const t = TEMALAR[tema];
  const d = veriTopla({ veri, urunler });
  return kabuk({ tema, ad: t.ad, aciklama: t.aciklama, site, govde: t.ciz({ d, site, varMi: gorselVarMi }) });
}

function alternatifDizini({ site }) {
  const kartlar = Object.entries(TEMALAR).map(([k, t]) => `<a class="kart kart--tiklanir" href="/tasarim/${k}/" style="display:flex;flex-direction:column">
      <div class="kart__no">${k.toUpperCase()}</div>
      <h3>${kacis(t.ad)}</h3>
      <p style="flex:1">${kacis(t.aciklama)}</p>
      <span class="metin-link" style="margin-top:1.15rem">Aç</span>
    </a>`).join('\n    ');

  return `<!doctype html>
<html lang="tr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tasarım alternatifleri — MediEst Group</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="/varlik/css/site.css">
<link rel="icon" href="/varlik/gorsel/favicon.svg" type="image/svg+xml">
</head><body>
<section class="hub-hero koyu"><div class="kapsayici"><div class="hub-hero__ic">
  <span class="ust-etiket">Karar</span>
  <h1>Altı tasarım yönü</h1>
  <p class="giris">Hepsi aynı içerikle, aynı gerçek ürün fotoğraflarıyla kuruldu. Sadece sanat yönü ve bölüm akışı farklı. D, E ve F koyu yönün (C) daha açık varyasyonlarıdır; üçünün de bölüm sırası birbirinden farklıdır.</p>
</div></div></section>
<section class="bolum"><div class="kapsayici">
  <div class="izgara izgara--3">${kartlar}</div>
  <div class="not-kutu" style="margin-top:2.5rem">Bu sayfalar yalnızca ana sayfa kurgusunu gösterir; iç sayfalar hâlâ mevcut tasarımda. Arama motorlarına kapalıdır.</div>
  <p style="margin-top:1.5rem"><a class="metin-link" href="/">Mevcut tasarıma dön</a></p>
</div></section>
</body></html>`;
}

module.exports = { alternatifSayfasi, alternatifDizini, TEMALAR };
