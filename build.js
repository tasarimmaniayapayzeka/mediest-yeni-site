#!/usr/bin/env node
/**
 * MediEst Group — statik site üreticisi (sıfır bağımlılık)
 *   node build.js
 * icerik/*.json  +  sablon/*.js  ->  dist/
 */
const fs = require('fs');
const path = require('path');

const KOK = __dirname;
const ICERIK = path.join(KOK, 'icerik');
const VARLIK = path.join(KOK, 'varlik');
// GitHub Pages alt klasörde sunulduğu için kök-mutlak yolların önüne ek gerekiyor:
//   node build.js --taban=/mediest-yeni-site --cikti=docs
const TABAN = (process.argv.find(a => a.startsWith('--taban=')) || '').split('=')[1] || '';
const CIKTI = path.join(KOK, (process.argv.find(a => a.startsWith('--cikti=')) || '').split('=')[1] || 'dist');

// href="/x" ve src="/x" yollarını taban ile öne ekle. Protokol-göreli (//) ve
// zaten tabanla başlayanlar atlanır; mutlak URL'ler (canonical, og:url) dokunulmaz.
function tabanUygula(html) {
  if (!TABAN) return html;
  return html.replace(/(\b(?:href|src)=")\/(?!\/)/g, (tam, on) => `${on}${TABAN}/`);
}

const oku = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));

function yaz(gorecelYol, icerik) {
  const tam = path.join(CIKTI, gorecelYol);
  fs.mkdirSync(path.dirname(tam), { recursive: true });
  fs.writeFileSync(tam, icerik, 'utf8');
  return tam;
}

function kopyala(kaynak, hedef) {
  if (!fs.existsSync(kaynak)) return 0;
  let n = 0;
  for (const oge of fs.readdirSync(kaynak, { withFileTypes: true })) {
    const k = path.join(kaynak, oge.name);
    const h = path.join(hedef, oge.name);
    if (oge.isDirectory()) { n += kopyala(k, h); continue; }
    if (oge.name.startsWith('_')) continue;          // _google-raw.css gibi ara dosyalar
    fs.mkdirSync(path.dirname(h), { recursive: true });
    fs.copyFileSync(k, h);
    n++;
  }
  return n;
}

// ---------- Veri ----------
const site = oku(path.join(ICERIK, 'site.json'));

// CSS/JS için içerik damgası — sadece dosya değişince yenilenir (tarayıcı önbelleği kırılır)
site.damga = require('crypto')
  .createHash('sha1')
  .update(fs.readFileSync(path.join(VARLIK, 'css', 'site.css')))
  .update(fs.readFileSync(path.join(VARLIK, 'css', 'font.css')))
  .update(fs.readFileSync(path.join(VARLIK, 'js', 'site.js')))
  .digest('hex').slice(0, 8);

const urunDizin = path.join(ICERIK, 'urun');
const urunler = fs.existsSync(urunDizin)
  ? fs.readdirSync(urunDizin).filter(f => f.endsWith('.json')).map(f => oku(path.join(urunDizin, f)))
  : [];
urunler.sort((a, b) => (a.grup || '').localeCompare(b.grup || '') || (a.sira || 99) - (b.sira || 99));

// ---------- Şablonlar ----------
const { urunSayfasi } = require('./sablon/urun');
const { demoIndex } = require('./sablon/demo-index');
const { hata404 } = require('./sablon/hata404');

// ---------- Üretim ----------
if (fs.existsSync(CIKTI)) fs.rmSync(CIKTI, { recursive: true, force: true });
fs.mkdirSync(CIKTI, { recursive: true });

const uretilen = [];

// Görsel seti henüz üretilmediği için dosya var mı diye bakıyoruz (Faz 5'te dolacak)
const gorselVarMi = rel => fs.existsSync(path.join(VARLIK, 'gorsel', rel));

for (const u of urunler) {
  if (!u.slug) { console.warn('  ! slug yok, atlandı:', JSON.stringify(u).slice(0, 80)); continue; }
  const html = tabanUygula(urunSayfasi({ site, urun: u, tumUrunler: urunler, gorselVarMi }));
  yaz(path.join(u.slug, 'index.html'), html);
  uretilen.push({ yol: `/${u.slug}/`, ad: u.ad, bayt: Buffer.byteLength(html) });
}

// Ana sayfa — anasayfa.json varsa gerçek ana sayfa, yoksa geçici önizleme girişi
if (urunler.length) {
  const anaVeriYolu = path.join(ICERIK, 'anasayfa.json');
  let html, ad;
  if (fs.existsSync(anaVeriYolu)) {
    const { anaSayfa } = require('./sablon/anasayfa');
    const blogYolu = path.join(ICERIK, 'blog.json');
    const blog = fs.existsSync(blogYolu) ? oku(blogYolu) : null;
    html = tabanUygula(anaSayfa({ site, veri: oku(anaVeriYolu), urunler, blog, gorselVarMi }));
    ad = 'Ana Sayfa';
    // Önizleme girişi ayrı bir adreste kalsın
    const dHtml = tabanUygula(demoIndex({ site, urunler }));
    yaz(path.join('onizleme', 'index.html'), dHtml);
    uretilen.push({ yol: '/onizleme/', ad: 'Sayfa dizini (önizleme)', bayt: Buffer.byteLength(dHtml) });
  } else {
    html = tabanUygula(demoIndex({ site, urunler }));
    ad = 'Önizleme girişi (geçici)';
  }
  yaz('index.html', html);
  uretilen.unshift({ yol: '/', ad, bayt: Buffer.byteLength(html) });

  // Kendi tasarımımızda 404 (GitHub Pages ve cPanel ikisi de 404.html'i kullanır)
  yaz('404.html', tabanUygula(hata404({ site, urunler })));
  uretilen.push({ yol: '/404.html', ad: '404 sayfası', bayt: 0 });
}

// ---------- Hub sayfaları ----------
const hubYolu = path.join(ICERIK, 'hub.json');
if (fs.existsSync(hubYolu) && urunler.length) {
  const { hubSayfasi } = require('./sablon/hub');
  const hublar = oku(hubYolu);
  // uygulamaNotlari gibi kayıt amaçlı bloklar sayfaya basılmaz — slug'ı olan girdiler hub'dır
  for (const anahtar of Object.keys(hublar)) {
    const hub = hublar[anahtar];
    if (!hub || typeof hub.slug !== 'string') continue;
    const { html, yol, toplamUrun, bulunmayan } = hubSayfasi({ site, hub, urunler });
    if (bulunmayan.length) console.warn(`  ! ${yol} — bulunamayan slug: ${bulunmayan.join(', ')}`);
    yaz(path.join(hub.slug, 'index.html'), tabanUygula(html));
    uretilen.push({ yol, ad: `Hub: ${hub.baslik} (${toplamUrun} ürün)`, bayt: Buffer.byteLength(html) });
  }
}

// ---------- Cihaz karşılaştırma ----------
const kiyasYolu = path.join(ICERIK, 'karsilastirma.json');
if (fs.existsSync(kiyasYolu) && urunler.length) {
  const { karsilastirmaSayfasi } = require('./sablon/karsilastirma');
  const { html, bosSayisi } = karsilastirmaSayfasi({ site, veri: oku(kiyasYolu), urunler });
  yaz(path.join('cihazlar', 'karsilastirma', 'index.html'), tabanUygula(html));
  uretilen.push({ yol: '/cihazlar/karsilastirma/', ad: `Karşılaştırma (${bosSayisi} hücre veri bekliyor)`, bayt: Buffer.byteLength(html) });
}

// GitHub Pages: alt çizgiyle başlayan dosyaları Jekyll'in yutmaması için
yaz('.nojekyll', '');

// ---------- Varlıklar ----------
const varlikSayi = kopyala(VARLIK, path.join(CIKTI, 'varlik'));

// ---------- Yönlendirme haritası (WP/.htaccess için) ----------
const yonlendirmeler = urunler
  .filter(u => u.eskiUrl && u.eskiUrl !== `/${u.slug}/`)
  .map(u => `Redirect 301 ${u.eskiUrl} /${u.slug}/`);
if (yonlendirmeler.length) {
  yaz('_yonlendirmeler.txt', yonlendirmeler.join('\n') + '\n');
}

// ---------- Site haritası ----------
const bugun = '2026-08-15';
const siteHaritasi = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uretilen.map(u => `  <url><loc>${site.seo.baseUrl}${u.yol}</loc><lastmod>${bugun}</lastmod></url>`).join('\n')}
</urlset>
`;
yaz('sitemap.xml', siteHaritasi);
yaz('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.seo.baseUrl}/sitemap.xml\n`);

// ---------- Rapor ----------
console.log('\n  MediEst Group — build');
console.log('  ' + '-'.repeat(58));
if (!uretilen.length) {
  console.log('  Hiç ürün JSON\'u bulunamadı: icerik/urun/*.json');
} else {
  uretilen.forEach(u => console.log(`  ${String(Math.round(u.bayt / 1024)).padStart(3)} KB  ${u.yol.padEnd(42)} ${u.ad}`));
}
console.log('  ' + '-'.repeat(58));
console.log(`  ${uretilen.length} sayfa · ${varlikSayi} varlık dosyası · ${yonlendirmeler.length} yönlendirme`);
console.log(`  Çıktı: ${CIKTI}\n`);
