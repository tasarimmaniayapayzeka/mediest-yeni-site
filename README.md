# MediEst Group — Yeni Kurumsal Site

27. ayrı proje. [Baby Skin Pen](../08-BabySkinPen) ve [Gold Pen](../09-GoldPen) projelerinin **çatı markası**;
üçü ayrı klasör/port/repo — karıştırılmaz.

- **Port:** 8040
- **Kaynak site:** https://mediestgroup.com.tr (WordPress + Enfold)
- **Teslim yolu:** statik demo → onay → WordPress temasına giydirme
- **Telefon:** 0533 637 49 09 (teyitli)

## Çalıştırma

```bash
node build.js && node sunucu.js
```

→ http://localhost:8040/goldpen/

## Klasör yapısı

```
icerik/          Tüm metin buradan gelir; HTML'e hiçbir metin gömülmez
  _sema.md         Veri şeması + kesin kurallar
  site.json        Kurumsal bilgi, menü, footer, SEO varsayılanları
  urun/*.json      14 ürün (7 Mezoeffect + 5 Mezocomplex + 2 cihaz)
sablon/          JS şablonları (WP'de PHP karşılıkları olacak)
  parca/kabuk.js   → header.php + footer.php
  parca/header.js  → header.php + wp_nav_menu()
  parca/footer.js  → footer.php
  urun.js          → single-urun.php + ACF
varlik/          CSS, JS, yerel fontlar, görseller
build.js         Üretici (sıfır bağımlılık)
sunucu.js        Yerel önizleme sunucusu
dist/            Üretilen site (gitignore)
kaynak-icerik/   Eski siteden çekilen ham içerik + link haritası
kaynak-gorsel/   Eski sitedeki 54 görsel (Higgsfield referans girdisi)
notlar/          Analiz, plan, denetim betikleri
```

## Bakım betikleri

```bash
node notlar/denetle.js           # dist/ denetimi: link, meta, şema, içerik kuralları
node notlar/normalize.js         # ürün JSON'ları arası tutarlılık
node notlar/marka-isaretleri.js  # hammadde tescilli marka işaretleri (®)
node notlar/crawl.js             # eski siteyi yeniden tara
```

## WordPress'e giydirme kuralları

Demo baştan tema-uyumlu yazıldı:

- Metin HTML'e gömülmez → `icerik/*.json` ACF alanlarına birebir karşılık gelir
- `header` / `footer` ayrı parça dosyaları
- Menü tek yerden (`site.json` → `menu`) → `wp_nav_menu()`
- Varlık yolları değişken üzerinden → `get_template_directory_uri()`
- CSS/JS URL'lerinde içerik damgası (`?v=hash`) → `wp_enqueue_*` sürümlemesine denk

## Durum

| Faz | Durum |
|---|---|
| 0 — Analiz + link haritası | ✅ |
| 1 — Veri modeli + build + ürün şablonu | ✅ 14 sayfa üretiliyor |
| 2 — Tasarım sistemi + Ana Sayfa | ⏳ |
| 3 — Hub sayfaları + karşılaştırma | ⏳ |
| 4 — Protokol Seçici · Bayilik · Kurumsal | ⏳ |
| 5 — Higgsfield görsel seti | ⏳ |
| 6 — Blog · SSS · performans · EN iskeleti | ⏳ |
| 7 — Deploy / WP tema | ⏳ |
