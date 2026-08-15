// Tam site tarayici: her sayfayi cek, TUM linkleri cikar, harita uret
const fs = require('fs');
const path = require('path');
const https = require('https');
const BASE = path.join(__dirname, '..');
const ORIGIN = 'https://mediestgroup.com.tr';

const get = url => new Promise(res => {
  const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 45000 }, r => {
    if ([301, 302, 307, 308].includes(r.statusCode) && r.headers.location) {
      r.resume();
      return res(get(r.headers.location).then(x => ({ ...x, redirectedFrom: url, status: r.statusCode })));
    }
    let b = '';
    r.setEncoding('utf8');
    r.on('data', d => b += d);
    r.on('end', () => res({ url, status: r.statusCode, html: b }));
  });
  req.on('error', e => res({ url, status: 0, html: '', err: e.message }));
  req.on('timeout', () => { req.destroy(); res({ url, status: 0, html: '', err: 'timeout' }); });
});

const norm = (href, from) => {
  try {
    const u = new URL(href, from);
    u.hash = '';
    return u.href;
  } catch { return null; }
};

// nav/footer/body bolgelerini ayir
function regions(html) {
  const head = html.indexOf('<header');
  const headEnd = html.indexOf('</header>');
  const foot = html.lastIndexOf('<footer');
  const footEnd = html.lastIndexOf('</footer>');
  const socket = html.indexOf("id='socket'") > -1 ? html.indexOf("id='socket'") : html.indexOf('id="socket"');
  return {
    header: head > -1 && headEnd > head ? html.slice(head, headEnd) : '',
    footer: (foot > -1 && footEnd > foot ? html.slice(foot, footEnd) : '') + (socket > -1 ? html.slice(socket, socket + 4000) : ''),
    body: html
  };
}

function links(chunk, from) {
  const out = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(chunk))) {
    const rawHref = m[1].trim();
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ raw: rawHref, abs: norm(rawHref, from), text, tag: m[0].slice(0, 400) });
  }
  return out;
}

(async () => {
  const seedList = [
    ORIGIN + '/',
    ...fs.readFileSync(path.join(BASE, 'kaynak-icerik', 'sayfa-indeksi.json'), 'utf8').replace(/^﻿/, '') ? [] : []
  ];
  const idx = JSON.parse(fs.readFileSync(path.join(BASE, 'kaynak-icerik', 'sayfa-indeksi.json'), 'utf8').replace(/^﻿/, ''));
  const raw = JSON.parse(fs.readFileSync(path.join(BASE, 'kaynak-icerik', 'wp-raw.json'), 'utf8').replace(/^﻿/, ''));
  const seeds = new Set([ORIGIN + '/']);
  raw.forEach(r => seeds.add(r.link));
  ['anti-aging', 'cilt-bakimi', 'sac-bakimi'].forEach(c => seeds.add(`${ORIGIN}/${c}/`));

  const visited = new Map();   // url -> {status, title}
  const edges = [];            // {from, to, raw, text, where}
  const external = [];
  const queue = [...seeds];

  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    const r = await get(url);
    const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(r.html) || [])[1] || '';
    visited.set(url, { status: r.status, title: title.replace(/\s+/g, ' ').trim(), bytes: (r.html || '').length });
    if (!r.html) continue;
    const reg = regions(r.html);
    const hdr = links(reg.header, url).map(l => ({ ...l, where: 'menu' }));
    const ftr = links(reg.footer, url).map(l => ({ ...l, where: 'footer' }));
    const seen = new Set([...hdr, ...ftr].map(l => l.raw + '|' + l.text));
    const bdy = links(reg.body, url)
      .filter(l => !seen.has(l.raw + '|' + l.text))
      .map(l => ({ ...l, where: 'icerik' }));

    for (const l of [...hdr, ...ftr, ...bdy]) {
      if (!l.abs) { edges.push({ from: url, to: null, raw: l.raw, text: l.text, where: l.where }); continue; }
      if (l.abs.startsWith(ORIGIN)) {
        edges.push({ from: url, to: l.abs, raw: l.raw, text: l.text, where: l.where });
        const clean = l.abs.split('?')[0];
        const skip = /\/wp-json|\/wp-content|\/wp-admin|xmlrpc|\/feed\/|\/comments\/feed|\.(jpg|png|gif|css|js|pdf|webp|svg|ico)$/i.test(clean);
        if (!skip && !visited.has(clean) && !queue.includes(clean)) queue.push(clean);
      } else {
        external.push({ from: url, to: l.abs, text: l.text, where: l.where });
        edges.push({ from: url, to: l.abs, raw: l.raw, text: l.text, where: l.where, ext: true });
      }
    }
  }

  // ic link sayimi
  const inbound = {};
  for (const e of edges) {
    if (!e.to || e.ext) continue;
    const t = e.to.split('?')[0];
    if (/\/wp-json|\/wp-content|xmlrpc|\/feed/.test(t)) continue;
    if (e.from.split('?')[0] === t) continue;
    (inbound[t] = inbound[t] || []).push({ from: e.from, text: e.text, where: e.where });
  }

  const report = { visited: [...visited].map(([u, v]) => ({ url: u, ...v, inbound: (inbound[u] || []).length })), edges, external, inbound };
  fs.writeFileSync(path.join(BASE, 'kaynak-icerik', 'link-haritasi.json'), JSON.stringify(report, null, 2), 'utf8');

  console.log('=== TARANAN URL:', visited.size, '| TOPLAM LINK KAYDI:', edges.length);
  console.log('\n=== MENU (header) ===');
  const menu = edges.filter(e => e.where === 'menu' && e.from === ORIGIN + '/');
  [...new Map(menu.map(m => [m.raw + m.text, m])).values()].forEach(m => console.log(` ${(m.text || '(metinsiz)').padEnd(34)} -> ${m.raw}`));
  console.log('\n=== FOOTER ===');
  const f = edges.filter(e => e.where === 'footer' && e.from === ORIGIN + '/');
  [...new Map(f.map(m => [m.raw + m.text, m])).values()].forEach(m => console.log(` ${(m.text || '(metinsiz)').padEnd(34)} -> ${m.raw}`));
  console.log('\n=== SAYFALAR: durum | ic link sayisi | url ===');
  [...visited].sort((a, b) => (inbound[a[0]] || []).length - (inbound[b[0]] || []).length)
    .forEach(([u, v]) => console.log(` ${v.status} | ${String((inbound[u] || []).length).padStart(3)} | ${u.replace(ORIGIN, '')}`));
  console.log('\n=== KIRIK / BOS LINKLER ===');
  edges.filter(e => !e.to || e.raw === '#' || e.raw === '' || (e.to && visited.get(e.to.split('?')[0]) && visited.get(e.to.split('?')[0]).status >= 400))
    .forEach(e => console.log(` ${e.from.replace(ORIGIN, '') || '/'} [${e.where}] "${e.text}" -> "${e.raw}"`));
  console.log('\n=== DIS LINKLER ===');
  [...new Map(external.map(e => [e.to, e])).values()].forEach(e => console.log(` ${e.to}   (${e.from.replace(ORIGIN, '')}, ${e.where})`));
})();
