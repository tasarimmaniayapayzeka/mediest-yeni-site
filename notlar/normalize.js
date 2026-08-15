// Ürün JSON'larında dosyalar-arası tutarlılık denetimi ve düzeltmesi
const fs = require('fs');
const path = require('path');
const DIZIN = path.join(__dirname, '..', 'icerik', 'urun');
const SONEK = ' | MediEst Group';

const dosyalar = fs.readdirSync(DIZIN).filter(f => f.endsWith('.json'));
const veri = dosyalar.map(f => ({ f, j: JSON.parse(fs.readFileSync(path.join(DIZIN, f), 'utf8').replace(/^﻿/, '')) }));
const sluglar = new Set(veri.map(v => v.j.slug));
const degisim = [];

for (const { f, j } of veri) {
  const not = m => degisim.push(`${f}: ${m}`);

  // 1) kombinasyon slug'ları gerçek ürün slug'ı olmalı
  if (j.protokol?.kombinasyon) {
    j.protokol.kombinasyon = j.protokol.kombinasyon.map(k => {
      const d = String(k).toLowerCase().replace(/\s+/g, '-');
      const eslesme = d === 'gold-pen' ? 'goldpen' : d === 'babyskinpen' ? 'baby-skin-pen' : d;
      if (eslesme !== k) not(`kombinasyon "${k}" -> "${eslesme}"`);
      if (!sluglar.has(eslesme)) not(`! kombinasyon "${eslesme}" hiçbir ürüne karşılık gelmiyor`);
      return eslesme;
    });
  }

  // 2) metaBaslik veride marka soneki TAŞIMAZ; soneki kabuk.js ekler
  //    (Yoast mantığı: başlık zaten uzunsa marka eklenmez)
  if (j.metaBaslik) {
    const temiz = j.metaBaslik.replace(/\s*[-–|]\s*medi\s*est group\s*$/i, '').trim();
    if (temiz !== j.metaBaslik) { not(`metaBaslik marka soneki kaldırıldı (${j.metaBaslik.length} -> ${temiz.length} kr)`); j.metaBaslik = temiz; }
    if (temiz.length > 60) not(`! metaBaslik ${temiz.length} kr — 60'ı aşıyor`);
  }

  // 3) ilgili slug'lar gerçek mi
  for (const alan of ['ilgiliUrunler']) {
    if (!Array.isArray(j[alan])) continue;
    const gecerli = j[alan].filter(s => sluglar.has(s));
    if (gecerli.length !== j[alan].length) {
      not(`! ${alan}: geçersiz slug atıldı -> ${j[alan].filter(s => !sluglar.has(s)).join(', ')}`);
      j[alan] = gecerli;
    }
  }

  fs.writeFileSync(path.join(DIZIN, f), JSON.stringify(j, null, 2) + '\n', 'utf8');
}

// 4) grup içi sıra çakışması
const gruplar = {};
veri.forEach(v => (gruplar[v.j.grup] = gruplar[v.j.grup] || []).push(v));
for (const [g, liste] of Object.entries(gruplar)) {
  const sayac = {};
  liste.forEach(v => (sayac[v.j.sira] = (sayac[v.j.sira] || 0) + 1));
  const cakisan = Object.entries(sayac).filter(([, n]) => n > 1);
  if (cakisan.length) {
    liste.sort((a, b) => (a.j.sira - b.j.sira) || a.j.slug.localeCompare(b.j.slug));
    liste.forEach((v, i) => {
      if (v.j.sira !== i + 1) { degisim.push(`${v.f}: sira ${v.j.sira} -> ${i + 1} (${g} grubunda çakışma)`); v.j.sira = i + 1; }
      fs.writeFileSync(path.join(DIZIN, v.f), JSON.stringify(v.j, null, 2) + '\n', 'utf8');
    });
  }
}

// 5) rapor
console.log('\n  Normalizasyon');
console.log('  ' + '-'.repeat(60));
if (!degisim.length) console.log('  Değişiklik gerekmedi.');
else degisim.forEach(d => console.log('  ' + d));
console.log('  ' + '-'.repeat(60));
console.log(`  ${veri.length} ürün · gruplar: ${Object.entries(gruplar).map(([g, l]) => `${g}=${l.length}`).join(', ')}`);

// 6) kalite tablosu
console.log('\n  slug                                    grup         sıra  SSS  içerik  başlık  açıklama');
veri.sort((a, b) => a.j.grup.localeCompare(b.j.grup) || a.j.sira - b.j.sira).forEach(({ j }) => {
  console.log('  ' + j.slug.padEnd(40) + String(j.grup).padEnd(13) + String(j.sira).padEnd(6) +
    String((j.sss || []).length).padEnd(5) + String((j.aktifIcerikler || []).length).padEnd(8) +
    String((j.metaBaslik || '').length).padEnd(8) + String((j.metaAciklama || '').length));
});
