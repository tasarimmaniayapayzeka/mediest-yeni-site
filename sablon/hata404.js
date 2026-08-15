// 404 sayfası — demo sırasında henüz üretilmemiş sayfalara tıklanınca görünür
const { kabuk, kacis } = require('./parca/kabuk');

const SIRADAKILER = [
  { yol: '/', ad: 'Ana Sayfa', faz: 'Faz 2' },
  { yol: '/cihazlar/karsilastirma/', ad: 'Gold Pen ↔ Baby Skin Pen karşılaştırması', faz: 'Faz 3' },
  { yol: '/urunler/mezoeffect/', ad: 'Mezoeffect Serum Grubu hub sayfası', faz: 'Faz 3' },
  { yol: '/urunler/mezocomplex/', ad: 'Mezocomplex Solüsyonlar hub sayfası', faz: 'Faz 3' },
  { yol: '/protokoller/', ad: 'Protokol Seçici', faz: 'Faz 4' },
  { yol: '/bayilik/', ad: 'Bayilik & İş Ortaklığı', faz: 'Faz 4' },
  { yol: '/egitim-destek/', ad: 'Eğitim & Destek', faz: 'Faz 4' },
  { yol: '/hakkimizda/', ad: 'Hakkımızda · Kalite & UTS · İletişim', faz: 'Faz 4' },
  { yol: '/blog/', ad: 'Blog ve Sık Sorulan Sorular', faz: 'Faz 6' }
];

function hata404({ site, urunler }) {
  const ornekler = urunler.slice(0, 3);

  const govde = `<section class="urun-hero koyu">
  <div class="kapsayici">
    <div style="max-width:720px">
      <span class="ust-etiket">404 · Bu sayfa henüz üretilmedi</span>
      <h1>Bu bölüm sonraki fazda geliyor</h1>
      <p class="giris">Şu an Faz 1 önizlemesindesiniz: 14 ürün ve cihaz sayfası hazır, kurumsal bölümler sırada.</p>
      <div class="urun-hero__eylem">
        <a class="dugme dugme--acik" href="/">Önizleme girişine dön</a>
        <a class="dugme dugme--hayalet" href="/goldpen/">Örnek ürün sayfası</a>
      </div>
    </div>
  </div>
</section>

<section class="bolum">
  <div class="kapsayici">
    <div class="bolum-basi dar">
      <span class="ust-etiket">Yol haritası</span>
      <h2>Sırada ne var</h2>
    </div>
    <div class="dar">
      <div class="sss">
        ${SIRADAKILER.map(s => `<div class="sss__oge" style="display:flex;justify-content:space-between;gap:1.5rem;padding:1.1rem 0;align-items:baseline">
          <span style="font-weight:600;color:var(--komur)">${kacis(s.ad)}</span>
          <span style="flex:0 0 auto;font-size:.8125rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mavi-500)">${kacis(s.faz)}</span>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="bolum-basi">
      <span class="ust-etiket">Hazır sayfalar</span>
      <h2>Şimdi bakabileceğiniz sayfalar</h2>
    </div>
    <div class="izgara izgara--3">
      ${ornekler.map(u => `<a class="kart kart--tiklanir urun-kart" href="/${u.slug}/">
        <div class="urun-kart__gorsel">Görsel hazırlanıyor</div>
        <div class="urun-kart__govde">
          <div class="urun-kart__etiket">${kacis(u.etiket || '')}</div>
          <div class="urun-kart__ad">${kacis(u.ad)}</div>
          <p>${kacis((u.ozet || '').slice(0, 110))}…</p>
          <span class="metin-link">Sayfayı aç</span>
        </div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

  return kabuk({
    site,
    baslik: 'Bu sayfa henüz üretilmedi',
    aciklama: 'MediEst Group yeni kurumsal site önizlemesi. Aradığınız bölüm henüz üretilmedi; hazır olan 14 cihaz ve ürün sayfasına buradan ulaşabilirsiniz.',
    yol: '/404.html',
    govde,
    sinif: 'sayfa-404'
  });
}

module.exports = { hata404 };
