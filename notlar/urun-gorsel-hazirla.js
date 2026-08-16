// Gerçek ürün fotoğraflarını siteye hazırlar.
// Kaynak: Gold Pen ve Baby Skin Pen projelerindeki stüdyo çekimleri + mediestgroup.com.tr görselleri
// Dikey/kare çekimler 3:2 tuvale, marka paletinde açık zemine yerleştirilir.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, '..');
const BSP = path.join(KOK, '..', '08-BabySkinPen', 'baby-skin-pen-web', 'assets', 'img');
const GP = path.join(KOK, '..', '09-GoldPen', 'goldpen-web', 'assets', 'gorseller');
const HAM = path.join(KOK, 'varlik', 'gorsel', 'urun-ham');
const CIKTI = path.join(KOK, 'varlik', 'gorsel');
fs.mkdirSync(HAM, { recursive: true });

// Stüdyo çekimlerinin zemini saf beyaz; tuval de beyaz olmalı ki dikiş görünmesin.
// (Beyazı şeffaflaştırmak Gold Pen'in beyaz gövdesini de yiyeceği için yapılmıyor.)
const ZEMIN = { r: 255, g: 255, b: 255, alpha: 1 };

// Beyaz zemini olan çekimlerde ürünün gerçek sınırlarını bul ve boşluğu kırp
async function urunuKirp(girdi, esik = 250) {
  const im = sharp(girdi).flatten({ background: '#ffffff' });
  const { data, info } = await im.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  let x1 = info.width, y1 = info.height, x2 = 0, y2 = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < esik) {
        if (x < x1) x1 = x; if (x > x2) x2 = x;
        if (y < y1) y1 = y; if (y > y2) y2 = y;
      }
    }
  }
  if (x2 <= x1 || y2 <= y1) return im;
  const pay = Math.round(Math.min(info.width, info.height) * 0.02);
  return im.extract({
    left: Math.max(0, x1 - pay), top: Math.max(0, y1 - pay),
    width: Math.min(info.width - Math.max(0, x1 - pay), x2 - x1 + pay * 2),
    height: Math.min(info.height - Math.max(0, y1 - pay), y2 - y1 + pay * 2)
  });
}

// Ürünü 3:2 tuvale ortalayarak yerleştir
async function tuvale(girdi, hedef, { en = 1400, boy = 933, doluluk = 0.78, kirp = true } = {}) {
  const kaynak = kirp ? await urunuKirp(girdi) : sharp(girdi).flatten({ background: '#ffffff' });
  const tampon = await kaynak.png().toBuffer();
  const m = await sharp(tampon).metadata();
  const olcek = Math.min((en * doluluk) / m.width, (boy * doluluk) / m.height);
  const yeniEn = Math.round(m.width * olcek);
  const yeniBoy = Math.round(m.height * olcek);
  const urun = await sharp(tampon).resize(yeniEn, yeniBoy).png().toBuffer();
  await sharp({ create: { width: en, height: boy, channels: 4, background: ZEMIN } })
    .composite([{ input: urun, left: Math.round((en - yeniEn) / 2), top: Math.round((boy - yeniBoy) / 2) }])
    .png().toFile(hedef);
  return { en: yeniEn, boy: yeniBoy };
}

const ISLER = [
  { ad: 'goldpen',        src: path.join(GP, 'REN_3741.jpg'),        doluluk: 0.86 },
  { ad: 'baby-skin-pen',  src: path.join(BSP, 'cihaz-duo.png'),      doluluk: 0.80 },
  { ad: 'bsp-set',        src: path.join(BSP, 'profesyonel-set.png'), doluluk: 0.92 },
  { ad: 'kapsuller',      src: path.join(BSP, 'tum-kutular.png'),    doluluk: 0.90 },
  { ad: 'mezoeffect',     src: path.join(HAM, 'mezoeffect-grup.png'), doluluk: 1.0, kirp: false }
];

(async () => {
  console.log('\n  Gerçek ürün görselleri hazırlanıyor');
  console.log('  ' + '-'.repeat(56));
  for (const is of ISLER) {
    if (!fs.existsSync(is.src)) { console.log(`  ! kaynak yok: ${is.ad}`); continue; }
    const hedef = path.join(HAM, is.ad + '.png');
    const r = await tuvale(is.src, hedef, { doluluk: is.doluluk, kirp: is.kirp !== false });
    console.log(`  ${is.ad.padEnd(16)} ürün ${r.en}x${r.boy} → 1400x933 tuval`);
  }
  console.log('  ' + '-'.repeat(56) + '\n');
})();
