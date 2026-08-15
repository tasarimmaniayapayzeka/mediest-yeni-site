// wp-raw.json -> temiz markdown + gorsel envanteri
const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(BASE, 'kaynak-icerik', 'wp-raw.json'), 'utf8').replace(/^﻿/, ''));
const outDir = path.join(BASE, 'kaynak-icerik', 'metin');
fs.mkdirSync(outDir, { recursive: true });

const ent = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#8217;|&#039;|&#39;/g, "'").replace(/&#8211;/g, '–')
  .replace(/&#8220;|&#8221;/g, '"').replace(/&hellip;/g, '…').replace(/&#\d+;/g, '');

const images = [];
let index = [];

for (const item of raw) {
  let h = item.content.rendered || '';
  // gorselleri topla
  const re = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(h))) {
    const alt = (/alt=["']([^"']*)["']/i.exec(m[0]) || [])[1] || '';
    images.push({ page: item.slug, src: m[1], alt });
  }
  const bg = /background-image\s*:\s*url\(["']?([^"')]+)/gi;
  while ((m = bg.exec(h))) images.push({ page: item.slug, src: m[1], alt: '(arkaplan)' });

  h = h.replace(/<style[\s\S]*?<\/style>/gi, '')
       .replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/<svg[\s\S]*?<\/svg>/gi, '')
       .replace(/<h([1-6])[^>]*>/gi, (x, n) => '\n\n' + '#'.repeat(+n) + ' ')
       .replace(/<\/h[1-6]>/gi, '\n')
       .replace(/<li[^>]*>/gi, '\n- ')
       .replace(/<br\s*\/?>/gi, '\n')
       .replace(/<\/(p|div|section|tr|td)>/gi, '\n')
       .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (x, href, txt) => txt.replace(/<[^>]+>/g, '').trim() ? `${txt.replace(/<[^>]+>/g, '').trim()} [${href}]` : '')
       .replace(/<[^>]+>/g, ' ');
  h = ent(h).replace(/[ \t ]+/g, ' ').replace(/\n\s+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  const y = item.yoast_head_json || {};
  const front = [
    `# ${ent(item.title.rendered)}`,
    `- URL: ${item.link}`,
    `- Tip: ${item.type} | Slug: ${item.slug}`,
    `- SEO Başlık: ${y.title || '-'}`,
    `- SEO Açıklama: ${y.description || '-'}`,
    `- Kelime: ${h.split(/\s+/).length}`,
    '', '---', ''
  ].join('\n');
  fs.writeFileSync(path.join(outDir, `${item.type}--${item.slug}.md`), front + h, 'utf8');
  index.push({ type: item.type, slug: item.slug, title: ent(item.title.rendered), words: h.split(/\s+/).length, seoTitle: y.title || '', seoDesc: y.description || '' });
}

const uniq = [...new Map(images.map(i => [i.src, i])).values()];
fs.writeFileSync(path.join(BASE, 'kaynak-icerik', 'gorsel-envanteri.json'), JSON.stringify(uniq, null, 2), 'utf8');
fs.writeFileSync(path.join(BASE, 'kaynak-icerik', 'sayfa-indeksi.json'), JSON.stringify(index, null, 2), 'utf8');

console.log('SAYFA/YAZI:', index.length, '| BENZERSIZ GORSEL:', uniq.length, '| TOPLAM KELIME:', index.reduce((a, b) => a + b.words, 0));
console.log('\n--- Kelime sayilari ---');
index.sort((a, b) => b.words - a.words).forEach(i => console.log(String(i.words).padStart(6), i.type.padEnd(5), i.slug));
