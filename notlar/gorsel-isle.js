// Higgsfield ham PNG -> siteye hazır WebP (2 boy: 1x ve 2x)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const HAM = path.join(__dirname, '..', 'varlik', 'gorsel', 'ham');
const CIKTI = path.join(__dirname, '..', 'varlik', 'gorsel');

// ad: [1x genişlik, 2x genişlik, kalite]
const BOYUT = {
  hero:            [1600, 2400, 78],
  goldpen:         [860, 1400, 82],
  'baby-skin-pen': [860, 1400, 82],
  kapsuller:       [860, 1400, 82],
  mezoeffect:      [860, 1400, 82],
  mezocomplex:     [860, 1400, 82],
  showroom:        [860, 1400, 80],
  bayilik:         [860, 1400, 80],
  protokol:        [860, 1400, 80],
  'blog-cilt':     [720, 1200, 80],
  'blog-sac':      [720, 1200, 80]
};

(async () => {
  const dosyalar = fs.readdirSync(HAM).filter(f => f.endsWith('.png'));
  const rapor = [];

  for (const f of dosyalar) {
    const ad = path.basename(f, '.png');
    const [w1, w2, q] = BOYUT[ad] || [860, 1400, 80];
    const girdi = path.join(HAM, f);
    const meta = await sharp(girdi).metadata();

    for (const [w, sonek] of [[w1, ''], [w2, '@2x']]) {
      // Kaynak yeterince büyük değilse @2x üretme — birebir kopya olur, boşa dosya
      if (sonek === '@2x' && meta.width < w1 * 1.5) continue;
      const hedef = path.join(CIKTI, `${ad}${sonek}.webp`);
      await sharp(girdi).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toFile(hedef);
      rapor.push({ ad: `${ad}${sonek}.webp`, w: Math.min(w, meta.width), kb: Math.round(fs.statSync(hedef).size / 1024) });
    }
    rapor.push({ ad: `  (kaynak ${meta.width}x${meta.height})`, w: '', kb: '' });
  }

  console.log('\n  Görsel işleme');
  console.log('  ' + '-'.repeat(52));
  rapor.forEach(r => console.log(`  ${String(r.ad).padEnd(30)} ${String(r.w).padStart(5)}px ${String(r.kb).padStart(5)}${r.kb ? ' KB' : ''}`));
  const toplam = rapor.filter(r => r.kb).reduce((n, r) => n + r.kb, 0);
  console.log('  ' + '-'.repeat(52));
  console.log(`  ${rapor.filter(r => r.kb).length} dosya · toplam ${Math.round(toplam / 1024 * 10) / 10} MB\n`);
})();
