// Hammadde tescilli marka işaretlerini geri koy (®), kendi markalarımızı tutarlı yap (™)
// Kaynak metinde bulunan işaretler ajan dönüşümünde düşmüştü.
const fs = require('fs');
const path = require('path');
const DIZIN = path.join(__dirname, '..', 'icerik', 'urun');

// Üçüncü taraf TESCİLLİ hammadde markaları — ® zorunlu
const TESCILLI = [
  { bul: /Pentavitin(?!®)/g, koy: 'Pentavitin®' },
  { bul: /Argireline(?!®)/g, koy: 'Argireline®' },
  { bul: /Seryl(?!®)/g, koy: 'Seryl®' },
  { bul: /Regu(?!®)(\s*-\s*|-)age/gi, koy: 'Regu®-age' },
  { bul: /Regu(?!®|-)(?=\s)/g, koy: 'Regu®' }
];

let toplam = 0;
const rapor = [];

for (const f of fs.readdirSync(DIZIN).filter(x => x.endsWith('.json'))) {
  const p = path.join(DIZIN, f);
  let metin = fs.readFileSync(p, 'utf8').replace(/^﻿/, '');
  const once = metin;
  const dosyaRapor = [];

  for (const { bul, koy } of TESCILLI) {
    const n = (metin.match(bul) || []).length;
    if (n) { metin = metin.replace(bul, koy); dosyaRapor.push(`${koy} ×${n}`); toplam += n; }
  }
  // çift işaret temizliği
  metin = metin.replace(/®+/g, '®').replace(/™+/g, '™');

  if (metin !== once) {
    JSON.parse(metin);                       // bozulmadığını doğrula
    fs.writeFileSync(p, metin, 'utf8');
    rapor.push(`  ${f.padEnd(42)} ${dosyaRapor.join(', ')}`);
  }
}

console.log('\n  Marka işareti onarımı');
console.log('  ' + '-'.repeat(64));
rapor.length ? rapor.forEach(r => console.log(r)) : console.log('  Değişiklik gerekmedi.');
console.log('  ' + '-'.repeat(64));
console.log(`  ${toplam} işaret geri kondu\n`);
