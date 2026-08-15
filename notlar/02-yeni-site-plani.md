# Mediest Group — Yeni Site Planı
Karar tarihi: 15 Ağustos 2026

## Onaylanan kararlar
| Konu | Karar |
|---|---|
| Altyapı | **Statik HTML + veri dosyası** (JSON → build.js → dist/) |
| Görsel | **%100 Higgsfield AI** (gerçek fotoğraflar yalnızca referans girdi olarak) |
| Dil | **Önce TR**, EN altyapısı hazır (`icerik/en.json` iskeleti + `/en/` klasörü) |
| Palet | **Logo renklerinden** türetilecek (MEG mavisi #6FA3D6 ailesi) |
| Klasör | `Desktop\Claude-Projeler\27-MediestGroup` · Yedek: `E:\Claude-Projeler-Yedek` |
| Port | **8040** |
| Teslim yolu | **Önce statik demo** (localhost:8040) → onay → **WordPress temasına giydirme** |
| Telefon | **0533 637 49 09** (teyit edildi, 15 Ağu) — 0554'lü numara kullanılmayacak |
| Logo | Vektörü sonra gelecek; şimdilik mevcut JPEG'den temizlenmiş sürüm kullanılacak |
| Kapsam | **Birebir tüm içerik** — 33 URL'nin tamamı, 16.100 kelimenin tamamı taşınacak |

### WP'ye giydirme için baştan alınacak önlemler
Statik demo, sonradan tema haline getirilebilsin diye şu kurallarla yazılacak:
- `header` / `footer` / `sidebar` ayrı parça dosyaları (WP'de `header.php`, `footer.php` olacak)
- Ürün sayfaları tek şablon + JSON veri → WP'de `single-urun.php` + ACF alanları
- Blog listesi/detayı ayrı şablon → `archive.php` / `single.php`
- Menü tek yerden (`icerik/menu.json`) → WP'de `wp_nav_menu()`
- Hiçbir metin HTML'e gömülmeyecek; hepsi `icerik/tr.json` içinden gelecek
- Görsel yolları değişken üzerinden → WP'de `get_template_directory_uri()`

## Renk sistemi (logodan türetilmiş)
Logo ölçümü: MEG rozeti **#6FA3D6** (HSL 209°, 55%, 63%), metin **#2B2B2B**, zemin beyaz.
Aynı hue (209°) ekseninde kurumsal bir ölçek:

| Rol | Hex | Kullanım |
|---|---|---|
| Derin Lacivert | `#0D1B2A` | Koyu bölümler, footer, hero zemini |
| Kurumsal Mavi | `#16324C` | Kartlar, koyu yüzeyler |
| Orta Mavi | `#2C5C8A` | Butonlar, vurgular |
| **Marka Mavisi** | **`#6FA3D6`** | **Logo rengi — aksan, ikon, çizgi, link** |
| Açık Mavi | `#B9D3EC` | Yumuşak zeminler, rozetler |
| Klinik Beyaz | `#F5F8FB` | Ana zemin |
| Kömür | `#101820` | Gövde metni |
| Gri Mavi | `#6B7C8E` | İkincil metin |
| Platin | `#C7CDD4` | Ayraç, kenarlık |

Tipografi önerisi: Başlık **ince/orta serif** (marka logosundaki serif ile uyumlu) · Gövde **geometric sans**.

## Bilgi mimarisi (~32 sayfa)
```
Ana Sayfa
├── Cihazlar
│   ├── Gold Pen
│   ├── Baby Skin Pen
│   └── Karşılaştırma (Gold Pen vs Baby Skin Pen)
├── Ürünler
│   ├── Mezoeffect Serum Grubu (7 sayfa)
│   │   Vitamin C Amino Acid · Somon DNA · Anti Hair Loss
│   │   Anti Spot · Hyaluronic Acid · Anti-Age · Eye Contour
│   └── Mezocomplex Solüsyon Grubu (5 sayfa)
│       Antiaging · Hyaluronic Acid · Firming · Hair Revit · Brightening
├── Protokoller  ← YENİ
│   Protokol Seçici: cilt sorunu → cihaz + ampul kombinasyonu
│   (leke · akne izi · anti-aging · saç dökülmesi · nem kaybı · gözenek)
├── Bayilik & İş Ortaklığı  ← YENİ
│   Başvuru formu · avantajlar · eğitim · sosyal medya desteği · showroom randevusu
├── Eğitim & Destek  ← YENİ
│   Garanti · teknik servis · protokol danışmanlığı · katalog indirme
├── Kurumsal
│   Hakkımızda · Kalite & UTS · Showroom
├── Blog (9 mevcut yazı + yeni)
├── SSS
└── İletişim
```

## Mevcut siteden farklar (neden daha kurumsal olacak)
1. **12 yetim sayfa** menüye ve ana sayfaya bağlanacak → indekslenebilir hale gelecek.
2. **Dönüşüm yolu** kurulacak: bayilik başvurusu, teklif talebi, katalog PDF, showroom randevusu, WhatsApp.
3. **Protokol Seçici** — sitede olmayan, satın alma kararını hızlandıran B2B aracı.
4. **Karşılaştırma tablosu** — iki cihaz arasında karar veremeyen klinik için.
5. **Kopya-yapıştır içerik hataları** temizlenecek (HA sayfasındaki Somon DNA SSS'i, Firming ambalaj çelişkisi vb.).
6. **Schema.org**: Organization, Product, FAQPage, BreadcrumbList.
7. **Fiyat ifadeleri kaldırılacak** (B2B site + sağlık tanıtımı mevzuatı riski).
8. **Performans**: tek CSS, AVIF/WebP, lazy-load; hedef LCP < 1,5 sn.

## Görsel üretim planı (~45 görsel, %100 AI)
| Set | Adet | Not |
|---|---|---|
| Ana hero + bölüm heroları | 9 | Sinematik, klinik ambiyans |
| Cihaz görselleri | 8 | Gold Pen + Baby Skin Pen × 4 açı |
| Ürün paketleri | 12 | Gerçek foto **referans girdi** olarak verilecek |
| Protokol/uygulama sahneleri | 6 | El, cihaz, klinik |
| Blog görselleri | 9 | Mevcut 9 yazı için |
| Doku / arka plan | 4 | Soyut, marka mavisi |

Hat: `nano_banana_pro` 2k (çalışan hat) · ambalaj etiketi metinleri AI'da bozulacağı için **SVG ile üstüne temiz tipografi bindirilecek**.
Akış: 3 örnek kare (hero + ürün + klinik sahnesi) → onay → tam set.

## Aşamalar
- **Faz 0** — Analiz ✔ · palet + tipografi onayı ✔
- **Faz 1** — Veri modeli + build sistemi + ürün şablonu ✔ **(15 Ağu tamamlandı)**
  - `icerik/urun/*.json` — 14 ürün yapılandırıldı, 90 içerik hatası bulunup düzeltildi
  - `build.js` + `sablon/` — 14 sayfa üretiliyor, denetimden 0 ihlalle geçiyor
  - Tipografi: Source Serif 4 (başlık) + Inter (gövde), **yerel barındırılan** woff2
  - Düzeltilen gerçek hatalar: mobil menüde 375 px yatay taşma; hammadde
    tescilli marka işaretlerinin (®) veri dönüşümünde düşmesi
- **Faz 2** — Tasarım sistemi + Ana Sayfa
- **Faz 3** — 12 ürün + 2 cihaz + karşılaştırma sayfası
- **Faz 4** — Protokol Seçici · Bayilik · Eğitim & Destek · Kurumsal
- **Faz 5** — Higgsfield görsel seti (3 örnek → tam set)
- **Faz 6** — Blog · SSS · schema · performans · EN iskeleti
- **Faz 7** — cPanel deploy

## Beklenen bilgiler (iş engelleyici değil, ama gerekli)
1. **Logo vektörü** (AI/EPS/SVG) var mı? Elimizde yalnızca 934 px JPEG var.
2. **Doğru telefon**: sayfada 0533 637 49 09, SEO başlığında 0554 986 75 28 — hangisi?
3. **Katalog PDF'leri** (Goldpen / Baby Skin Pen / Genel) elde var mı? Sitedeki 3 link boşa gidiyor.
4. **Kurumsal sosyal hesaplar** (Instagram/LinkedIn) — şu an sadece @babyskinpen var.
5. Yeni site **mediestgroup.com.tr'nin yerine mi geçecek**, yoksa önce ayrı adreste mi gösterilecek?
6. Bayilik başvurusu formu nereye düşsün — e-posta mı, WhatsApp mı, ikisi de mi?
