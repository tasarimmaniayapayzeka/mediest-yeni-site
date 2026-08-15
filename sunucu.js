// Yerel önizleme sunucusu — port 8040
const http = require('http');
const fs = require('fs');
const path = require('path');

const KOK = path.join(__dirname, 'dist');
const PORT = 8040;

const TIP = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon'
};

http.createServer((istek, cevap) => {
  let yol = decodeURIComponent(istek.url.split('?')[0]);
  if (yol.endsWith('/')) yol += 'index.html';
  let dosya = path.join(KOK, yol);

  if (!dosya.startsWith(KOK)) { cevap.writeHead(403).end('Yasak'); return; }

  if (!fs.existsSync(dosya) && !path.extname(dosya)) {
    const alt = path.join(dosya, 'index.html');
    if (fs.existsSync(alt)) dosya = alt;
  }

  if (!fs.existsSync(dosya) || fs.statSync(dosya).isDirectory()) {
    cevap.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    cevap.end('<h1>404</h1><p>Sayfa bulunamadı: ' + yol + '</p><p><a href="/">Ana sayfa</a></p>');
    return;
  }

  const uzanti = path.extname(dosya).toLowerCase();
  cevap.writeHead(200, {
    'Content-Type': TIP[uzanti] || 'application/octet-stream',
    // Önizleme sunucusu: her istek taze gelsin, düzenlemeler anında görünsün
    'Cache-Control': 'no-store, must-revalidate'
  });
  fs.createReadStream(dosya).pipe(cevap);
}).listen(PORT, () => {
  console.log(`\n  MediEst Group önizleme → http://localhost:${PORT}\n`);
});
