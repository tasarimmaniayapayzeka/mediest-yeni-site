// dist/ üzerinde son denetim: link, meta, şema, içerik kuralları
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');

const htmlDosyalari = [];
(function gez(d) {
  for (const o of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, o.name);
    if (o.isDirectory()) gez(p);
    else if (o.name.endsWith('.html')) htmlDosyalari.push(p);
  }
})(DIST);

const varOlanYollar = new Set(htmlDosyalari.map(p =>
  '/' + path.relative(DIST, p).replace(/\\/g, '/').replace(/index\.html$/, '')
));

// ™ ve ® bilinçli olarak korunuyor: Mezoeffect™/Mezocomplex™ marka adları,
// Pentavitin®/Argireline®/Seryl®/Regu®-age ise üçüncü taraf tescilli hammadde markaları.
const EMOJILER = ['✅','✔','📍','🔹','🔵','🔴','🌈','✨','💧','💫','⚖','🔄','🛡','1️⃣','2️⃣'];
const eksikHedefler = {};
const sorunlar = [];
let toplamLink = 0;

for (const p of htmlDosyalari) {
  const html = fs.readFileSync(p, 'utf8');
  const yol = '/' + path.relative(DIST, p).replace(/\\/g, '/').replace(/index\.html$/, '');
  const ad = yol;

  // metin gövdesi
  const metin = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');

  // 1) iç linkler
  const linkler = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1]);
  for (const l of linkler) {
    toplamLink++;
    if (/^\/varlik\//.test(l)) {
      if (!fs.existsSync(path.join(DIST, l))) sorunlar.push(`${ad}  varlık yok: ${l}`);
      continue;
    }
    if (!varOlanYollar.has(l)) (eksikHedefler[l] = eksikHedefler[l] || new Set()).add(ad);
  }

  // 2) meta
  const baslik = (/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1] || '';
  const aciklama = (/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || '';
  if (baslik.length > 62) sorunlar.push(`${ad}  title ${baslik.length} kr (>62)`);
  if (!aciklama) sorunlar.push(`${ad}  description YOK`);
  else if (aciklama.length < 120 || aciklama.length > 170) sorunlar.push(`${ad}  description ${aciklama.length} kr`);

  // 3) şema geçerliliği
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { sorunlar.push(`${ad}  bozuk JSON-LD: ${e.message}`); }
  }

  // 4) içerik kuralları
  const emoji = EMOJILER.filter(e => metin.includes(e));
  if (emoji.length) sorunlar.push(`${ad}  emoji/işaret kaldı: ${emoji.join(' ')}`);
  if (/\d[\d.]*\s*(₺|TL)\b/i.test(metin)) sorunlar.push(`${ad}  FİYAT ifadesi var`);
  ['Uygulamala', 'Mezoeffec ', 'İnfo@', 'Contur '].forEach(y => {
    if (metin.includes(y)) sorunlar.push(`${ad}  yazım hatası: "${y}"`);
  });

  // 5) erişilebilirlik temel
  if (!/<h1[\s>]/.test(html)) sorunlar.push(`${ad}  h1 YOK`);
  if ((html.match(/<h1[\s>]/g) || []).length > 1) sorunlar.push(`${ad}  birden fazla h1`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) sorunlar.push(`${ad}  alt'sız img`);
  }
}

// Veri boşlukları — gizlenmiyor, sayılıyor
const bosluklar = {};
for (const p of htmlDosyalari) {
  const metin = fs.readFileSync(p, 'utf8').replace(/<[^>]+>/g, ' ');
  const yol = '/' + path.relative(DIST, p).replace(/\\/g, '/').replace(/index\.html$/, '');
  for (const k of ['Belirtilmemiş', 'Müşteri teyidi bekliyor', 'Görsel hazırlanıyor']) {
    const n = (metin.match(new RegExp(k, 'g')) || []).length;
    if (n) (bosluklar[k] = bosluklar[k] || []).push(`${yol} ×${n}`);
  }
}

console.log(`\n  Denetim — ${htmlDosyalari.length} sayfa, ${toplamLink} link\n  ` + '-'.repeat(64));
if (sorunlar.length) sorunlar.forEach(s => console.log('  ✗ ' + s));
else console.log('  Kural ihlali yok.');

const bosAnahtarlar = Object.entries(bosluklar);
if (bosAnahtarlar.length) {
  console.log('\n  Veri boşlukları (bilerek işaretlendi, uydurulmadı):');
  bosAnahtarlar.forEach(([k, yerler]) => {
    const toplam = yerler.reduce((n, y) => n + Number(y.split('×')[1]), 0);
    console.log(`    ${k.padEnd(26)} ${String(toplam).padStart(3)} yerde  (${yerler.length} sayfa)`);
  });
}

const eksik = Object.entries(eksikHedefler).sort();
if (eksik.length) {
  console.log('\n  Henüz üretilmemiş sayfalara giden linkler (sonraki fazlar):');
  eksik.forEach(([yol, kaynak]) => console.log(`    ${yol.padEnd(34)} ${kaynak.size} sayfadan`));
}
console.log('');
