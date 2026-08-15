// Geçici demo giriş sayfası — Ana Sayfa (Faz 2) hazır olana kadar
const { kabuk, kacis } = require('./parca/kabuk');
const { GRUP_AD } = require('./urun');

const GRUP_SIRA = ['cihaz', 'mezoeffect', 'mezocomplex'];
const GRUP_NOT = {
  cihaz: 'Mikroiğneleme, EMS ve LED destekli profesyonel bakım sistemleri.',
  mezoeffect: '2 ml ampul serisi — klinik protokollere yönelik serum çözümleri.',
  mezocomplex: '5 ml flakon serisi — kombine seans protokolleri için solüsyonlar.'
};

function demoIndex({ site, urunler }) {
  const gruplar = GRUP_SIRA.map(g => ({
    id: g,
    ad: GRUP_AD[g],
    not: GRUP_NOT[g],
    liste: urunler.filter(u => u.grup === g).sort((a, b) => a.sira - b.sira)
  })).filter(g => g.liste.length);

  const govde = `<section class="urun-hero koyu">
  <div class="kapsayici">
    <div style="max-width:780px">
      <span class="ust-etiket">Faz 1 · Önizleme</span>
      <h1>Ürün sayfası şablonu ve içerik altyapısı</h1>
      <p class="giris">Eski sitedeki 30 sayfa ve 16.100 kelime yapılandırılmış veriye çevrildi; 14 ürün sayfası tek şablondan üretiliyor. Aşağıdaki sayfaların tamamı çalışır durumda.</p>
      <div class="kunye">
        <div class="kunye__hucre"><div class="kunye__etiket">Üretilen sayfa</div><div class="kunye__deger">${urunler.length}</div></div>
        <div class="kunye__hucre"><div class="kunye__etiket">Düzeltilen içerik hatası</div><div class="kunye__deger">90</div></div>
        <div class="kunye__hucre"><div class="kunye__etiket">Görsel seti</div><div class="kunye__deger">Faz 5</div></div>
      </div>
    </div>
  </div>
</section>

<section class="bolum bolum--alt">
  <div class="kapsayici">
    <div class="not-kutu" style="margin-bottom:clamp(2.5rem,5vw,3.5rem)">
      <strong>Bu bir ara önizlemedir.</strong> Ana Sayfa, Protokol Seçici, Bayilik ve kurumsal sayfalar sonraki fazlarda geliyor;
      menüdeki o bağlantılar henüz boşa gider. Görseller Higgsfield ile üretilecek, şu an yer tutucu duruyor.
    </div>

    ${gruplar.map(g => `<div style="margin-bottom:clamp(3rem,6vw,4.5rem)">
      <div class="bolum-basi">
        <span class="ust-etiket">${kacis(g.ad)}</span>
        <h2 style="margin-bottom:.4rem">${kacis(g.ad)}</h2>
        <p style="color:var(--gri)">${kacis(g.not)}</p>
      </div>
      <div class="izgara izgara--3">
        ${g.liste.map(u => `<a class="kart kart--tiklanir urun-kart" href="/${u.slug}/">
          <div class="urun-kart__gorsel">Görsel hazırlanıyor</div>
          <div class="urun-kart__govde">
            <div class="urun-kart__etiket">${kacis(u.etiket || g.ad)}</div>
            <div class="urun-kart__ad">${kacis(u.ad)}</div>
            <p>${kacis((u.ozet || '').slice(0, 120))}${(u.ozet || '').length > 120 ? '…' : ''}</p>
            <span class="metin-link">Sayfayı aç</span>
          </div>
        </a>`).join('\n        ')}
      </div>
    </div>`).join('\n\n    ')}
  </div>
</section>

<section class="cta-serit koyu">
  <div class="kapsayici cta-serit__ic">
    <div>
      <span class="ust-etiket">Sıradaki</span>
      <h2 style="margin-bottom:.5rem">Faz 2 — Ana Sayfa</h2>
      <p style="color:#a9bed3;margin:0">Tasarım sistemi oturdu; sıradaki adım ana sayfa, cihaz karşılaştırma tablosu ve Protokol Seçici.</p>
    </div>
    <div class="cta-serit__eylem">
      <a class="dugme dugme--acik" href="/goldpen/">Gold Pen sayfası</a>
      <a class="dugme dugme--hayalet" href="/baby-skin-pen/">Baby Skin Pen</a>
    </div>
  </div>
</section>`;

  return kabuk({
    site,
    baslik: 'MediEst Group — Yeni Site Önizlemesi',
    aciklama: 'MediEst Group yeni kurumsal sitesinin Faz 1 önizlemesi: 14 ürün ve cihaz sayfası, yapılandırılmış içerik altyapısı ve tasarım sistemi.',
    yol: '/',
    govde,
    sinif: 'sayfa-demo'
  });
}

module.exports = { demoIndex };
