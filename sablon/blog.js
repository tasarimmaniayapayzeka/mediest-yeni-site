// Blog yazısı, blog listesi ve kategori sayfaları
// WP'de single.php / archive.php / category.php
const { kabuk, kacis } = require('./parca/kabuk');

const G = '/varlik/gorsel/';
function resim(ad, alt, gorselVarMi, oncelik = false) {
  if (!ad || !gorselVarMi || !gorselVarMi(ad + '.webp')) return null;
  const iki = gorselVarMi(ad + '@2x.webp');
  return `<img src="${G}${ad}.webp"${iki ? ` srcset="${G}${ad}.webp 1x, ${G}${ad}@2x.webp 2x"` : ''}` +
    ` alt="${String(alt).replace(/"/g, '&quot;')}" loading="${oncelik ? 'eager' : 'lazy'}" decoding="async">`;
}

const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
function tarihYaz(iso) {
  if (!iso) return '';
  const [y, a, g] = String(iso).slice(0, 10).split('-');
  return `${Number(g)} ${AY[Number(a) - 1]} ${y}`;
}

// --- yazı gövdesi blokları ---
const govdeBloklari = {
  paragraf: b => `<p>${kacis(b.metin)}</p>`,
  baslik: b => `<h2>${kacis(b.metin)}</h2>`,
  altBaslik: b => `<h3>${kacis(b.metin)}</h3>`,
  liste: b => `<ul class="isaretli">${(b.maddeler || []).map(m => `<li>${kacis(m)}</li>`).join('')}</ul>`,
  notKutu: b => `<div class="not-kutu">${kacis(b.metin)}</div>`,
  urunKarti: (b, { urunler, gorselVarMi }) => {
    const liste = (b.sluglar || []).map(s => urunler.find(u => u.slug === s)).filter(Boolean);
    if (!liste.length) return '';
    return `<aside class="yazi-urun">
      <div class="yazi-urun__etiket">Bu yazıda geçen ürünler</div>
      <div class="izgara izgara--2">
        ${liste.map(u => `<a class="kart kart--tiklanir urun-kart" href="/${u.slug}/">
          <div class="urun-kart__gorsel">${resim((u.gorsel?.ana || '').replace(/\.webp$/, ''), u.ad, gorselVarMi) || 'Görsel hazırlanıyor'}</div>
          <div class="urun-kart__govde">
            <div class="urun-kart__etiket">${kacis(u.etiket || '')}</div>
            <div class="urun-kart__ad">${kacis(u.ad)}</div>
            <span class="metin-link">İncele</span>
          </div>
        </a>`).join('\n        ')}
      </div>
    </aside>`;
  }
};

function yaziKarti(y, gorselVarMi) {
  return `<a class="kart kart--tiklanir urun-kart" href="/${y.slug}/">
        <div class="urun-kart__gorsel">${resim(y.gorsel, y.baslik, gorselVarMi) || 'Görsel hazırlanıyor'}</div>
        <div class="urun-kart__govde">
          <div class="urun-kart__etiket">${kacis(y.kategori || '')}</div>
          <div class="urun-kart__ad">${kacis(y.baslik)}</div>
          <p>${kacis((y.ozet || '').slice(0, 140))}${(y.ozet || '').length > 140 ? '…' : ''}</p>
          <span class="metin-link">Yazıyı oku</span>
        </div>
      </a>`;
}

// ---------------------------------------------------------------- yazı
function blogYazisi({ site, yazi, tumYazilar, urunler, gorselVarMi = () => false }) {
  const yol = `/${yazi.slug}/`;
  const govde = (yazi.bloklar || []).map(b => {
    const f = govdeBloklari[b.tip];
    return f ? f(b, { urunler, gorselVarMi }) : '';
  }).filter(Boolean).join('\n      ');

  const ilgili = (yazi.ilgiliBlog || []).map(s => tumYazilar.find(y => y.slug === s)).filter(Boolean);
  const kapak = resim(yazi.gorsel, yazi.baslik, gorselVarMi, true);

  const icerik = `<article class="yazi">
  <header class="yazi-hero koyu">
    <div class="kapsayici">
      <nav class="kirinti" aria-label="Sayfa yolu">
        <a href="/">Ana Sayfa</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
        <a href="/blog/">Blog</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
        <a href="/${yazi.kategoriSlug}/">${kacis(yazi.kategori)}</a>
      </nav>
      <div class="yazi-hero__ic">
        <h1>${kacis(yazi.baslik)}</h1>
        <p class="giris">${kacis(yazi.ozet)}</p>
        <div class="yazi-kunye">
          <span>${kacis(yazi.kategori)}</span>
          ${yazi.okumaSuresi ? `<span>${kacis(yazi.okumaSuresi)}</span>` : ''}
          <span>Son güncelleme: <time datetime="${kacis(yazi.sonGuncelleme)}">${tarihYaz(yazi.sonGuncelleme)}</time></span>
        </div>
      </div>
    </div>
  </header>

  ${kapak ? `<div class="kapsayici"><div class="yazi-kapak">${kapak}</div></div>` : ''}

  <div class="bolum bolum--sik">
    <div class="kapsayici">
      <div class="yazi-govde">
      ${govde}
      ${yazi.editorNotu ? `<div class="yazi-editor">
        <strong>Editör notu</strong>
        <p>${kacis(yazi.editorNotu)}</p>
      </div>` : ''}
      </div>
    </div>
  </div>

  ${ilgili.length ? `<section class="bolum bolum--alt">
    <div class="kapsayici">
      <div class="bolum-basi">
        <span class="ust-etiket">Devamı</span>
        <h2>İlgili yazılar</h2>
      </div>
      <div class="izgara izgara--3">
        ${ilgili.map(y => yaziKarti(y, gorselVarMi)).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <section class="cta-serit koyu">
    <div class="kapsayici cta-serit__ic">
      <div>
        <span class="ust-etiket">Kliniğiniz için</span>
        <h2 style="margin-bottom:.5rem">Protokolü birlikte planlayalım</h2>
        <p style="color:#a9bed3;margin:0">Satış yalnızca güzellik merkezi ve kliniklere yapılır.</p>
      </div>
      <div class="cta-serit__eylem">
        <a class="dugme dugme--acik" href="${site.teklifUrl}">Teklif Al</a>
        <a class="dugme dugme--hayalet" href="/protokoller/">Protokol Seçici</a>
      </div>
    </div>
  </section>
</article>`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: yazi.baslik,
      description: yazi.ozet,
      datePublished: yazi.tarih,
      dateModified: yazi.sonGuncelleme,
      inLanguage: 'tr-TR',
      articleSection: yazi.kategori,
      publisher: { '@type': 'Organization', name: site.marka.ad },
      mainEntityOfPage: site.seo.baseUrl + yol
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: site.seo.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: site.seo.baseUrl + '/blog/' },
        { '@type': 'ListItem', position: 3, name: yazi.kategori, item: site.seo.baseUrl + '/' + yazi.kategoriSlug + '/' },
        { '@type': 'ListItem', position: 4, name: yazi.baslik, item: site.seo.baseUrl + yol }
      ]
    }
  ];

  return kabuk({ site, baslik: yazi.metaBaslik, aciklama: yazi.metaAciklama, yol, govde: icerik, schema, sinif: 'sayfa-yazi' });
}

// ---------------------------------------------------------------- liste
function blogListesi({ site, giris, yazilar, kategoriler, gorselVarMi = () => false, kategori = null }) {
  const yol = kategori ? `/${kategori.slug}/` : '/blog/';
  const liste = kategori ? yazilar.filter(y => y.kategoriSlug === kategori.slug) : yazilar;

  const govde = `<section class="hub-hero koyu">
  <div class="kapsayici">
    <nav class="kirinti" aria-label="Sayfa yolu">
      <a href="/">Ana Sayfa</a><span class="kirinti__ayrac" aria-hidden="true">/</span>
      ${kategori ? `<a href="/blog/">Blog</a><span class="kirinti__ayrac" aria-hidden="true">/</span><span aria-current="page">${kacis(kategori.ad)}</span>`
                 : `<span aria-current="page">Blog</span>`}
    </nav>
    <div class="hub-hero__ic">
      <span class="ust-etiket">${kacis(kategori ? kategori.ad : (giris.ustEtiket || 'Blog'))}</span>
      <h1>${kacis(kategori ? kategori.ad : giris.baslik)}</h1>
      <p class="giris">${kacis(kategori ? kategori.giris : giris.giris)}</p>
    </div>
  </div>
</section>

<section class="bolum">
  <div class="kapsayici">
    <div class="protokol-secim" style="border-bottom:1px solid var(--platin)">
      <a class="protokol-chip" href="/blog/"${!kategori ? ' aria-selected="true"' : ''}>Tümü</a>
      ${Object.entries(kategoriler).filter(([, k]) => k && typeof k.ad === 'string' && k.metaBaslik).map(([slug, k]) =>
        `<a class="protokol-chip" href="/${slug}/"${kategori && kategori.slug === slug ? ' aria-selected="true"' : ''}>${kacis(k.ad)}</a>`).join('\n      ')}
    </div>
    <div class="izgara izgara--3">
      ${liste.map(y => yaziKarti(y, gorselVarMi)).join('\n      ')}
    </div>
  </div>
</section>

<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Uygulayıcılar için</span>
      <h2 style="margin-bottom:.5rem">Kliniğinize uygun protokolü bulun</h2>
      <p style="color:#a9bed3;margin:0">Uygulama alanına göre cihaz ve ürün eşleşmelerini inceleyin.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="/protokoller/">Protokol Seçici</a>
      <a class="dugme dugme--hayalet" href="${site.teklifUrl}">Teklif Al</a>
    </div>
  </div>
</section>`;

  const schema = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: kategori ? kategori.ad : (giris.baslik || 'Blog'),
    url: site.seo.baseUrl + yol,
    inLanguage: 'tr-TR',
    hasPart: liste.map(y => ({ '@type': 'Article', headline: y.baslik, url: site.seo.baseUrl + '/' + y.slug + '/' }))
  }];

  return {
    html: kabuk({
      site,
      baslik: kategori ? kategori.metaBaslik : giris.metaBaslik,
      aciklama: kategori ? kategori.metaAciklama : giris.metaAciklama,
      yol, govde, schema, sinif: 'sayfa-blog'
    }),
    yol,
    adet: liste.length
  };
}

module.exports = { blogYazisi, blogListesi };
