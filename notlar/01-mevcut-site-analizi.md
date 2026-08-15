# Mediest Group — Mevcut Site Tam Analizi
Tarih: 15 Ağustos 2026 · Kaynak: https://mediestgroup.com.tr/

## Teknik künye
| | |
|---|---|
| Altyapı | WordPress + **Enfold (Avia Builder)** teması |
| Eklenti | LiteSpeed Cache, Yoast SEO |
| Sunucu | LiteSpeed, HTTP/3 açık |
| İçerik | 21 sayfa + 9 blog yazısı + 3 kategori = **30 URL** |
| Metin | ~**16.100 kelime** |
| Görsel | **52 benzersiz görsel** (hepsi indirildi → `kaynak-gorsel/`, 11,1 MB) |
| Logo | `/uploads/2025/10/Med-Logo-1.jpg` (934×747, JPEG — vektör yok) |
| Favicon | `mediest-fav.png` + `site-fav-*.jpg` |

## Kurumsal bilgiler
- **Adres:** Zuhuratbaba, İncirli Cd. No:21/4, 34147 Bakırköy/İstanbul (showroom)
- **Telefon:** 0533 637 49 09 — *ancak İletişim sayfasının SEO başlığında 0554 986 75 28 yazıyor (çelişki)*
- **E-posta:** info@mediestgroup.com.tr — *sayfada "İnfo@" (Türkçe İ) olarak yazılmış, tıklanınca çalışmaz*
- **Instagram:** instagram.com/babyskinpen (yalnızca cihaz hesabı; kurumsal hesap sitede yok)
- **Satış modeli:** B2B — "Sadece güzellik merkezi ve kliniklere satış yapılır"

## Ürün mimarisi (mevcut — karışık)
**Cihazlar (2)**
- Gold Pen — mikroiğneleme + EMS + LED, altın yalıtımlı iğne uçları, dijital ekran
- Baby Skin Pen — mikro titreşim + 360° döner başlık + 7 renk LED, 7 kapsül serisi (Illuminate, Detox, Revive, Balance, Glam, Retouch, Hydrate)

**Mezoeffect Serum/Ampul Grubu (7)**
Vitamin C Amino Acid · Somon DNA · Anti Hair Loss · Anti Spot · Hyaluronic Acid · Anti-Age · Eye Contour

**Mezocomplex Solüsyon Grubu (5)**
Antiaging · Hyaluronic Acid · Firming · Hair Revit · Brightening

**Blog (9 yazı)** — cilt tipleri, mezoterapi/saç, leke, anti-aging, kolajen, HA, brightening, hair revit, goldpen

## Tespit edilen sorunlar (yeni sitede düzeltilecek)

### A. Yapısal / bağlantı
1. **12 ürün sayfası "yetim"** — menüden ve ana sayfadan erişilemiyor. Ana sayfadan sadece 6 iç link çıkıyor (blog, goldpen, hakkımızda, iletişim, SSS, ürün grupları). Google bu sayfaları neredeyse hiç değerlendirmiyor.
2. **Yanlış link:** Ana sayfada ve Ürün Gruplarımız'da "Mezoeffect Ampul Grubu" başlığı **/goldpen/** sayfasına gidiyor.
3. **3 kırık katalog linki:** "Goldpen Katalog", "Baby Skin Pen Katalog", "Genel Katalog" → hepsi `#`. Katalog PDF'i yok.
4. Ana sayfadaki 3'lü değer bloğu numaralandırması bozuk: "Bilim & Teknoloji", "**2)** Güvenilir Protokoller", "**3)** Klinik İş Ortaklığı" — 1) eksik.
5. "Mezoeffect Serum Grubu" sayfası /mezocomplex-*/ sayfalarına link veriyor → marka adlandırması (Mezoeffect vs Mezocomplex) tutarsız.

### B. İçerik hataları (kopyala-yapıştır)
6. **Hyaluronic Acid Serum** sayfasının SSS'i **Somon DNA Serum**'u anlatıyor; "Klinik Avantajları" bloğu ise leke/melanin (Brightening'den kopyalanmış).
7. **Mezocomplex Firming**: "Öne Çıkan Etkiler" nem/kuruluk anlatıyor (HA'dan kopya). Ambalaj bilgisi kendi içinde çelişiyor: gövdede "5 ml × 5 flakon", SSS'te "5 flakon × 8 ml (40 ml)".
8. Yazım hataları: "**Uygulamala** Alanları" (2 sayfada), "**Mezoeffec** Eye **Contur**" (hem başlık hem URL), "protokol'dür", "İnfo@".

### C. SEO / dönüşüm
9. Ürün sayfalarının çoğunda **meta description yok**.
10. Site haritasında ürün sayfaları var ama iç link yok → indeksleme zayıf.
11. **Dönüşüm yolu yok**: bayilik başvuru formu, teklif talebi, katalog indirme, showroom randevusu — hiçbiri yok. Tek CTA "Bilgi Alınız".
12. **İngilizce yok** — B2B medikal cihaz/ampul ihracatı için en büyük kaçırılan fırsat.
13. Fiyat bilgisi SSS'te açıkta: "seans 2.000–2.500 ₺" — B2B sitede B2C fiyatı; ayrıca sağlık tanıtımı açısından riskli.
14. Yapılandırılmış veri (Organization, Product, FAQPage) yok.

## Güçlü yanlar (korunacak)
- İçerik hacmi ciddi: 16.100 kelime, teknik derinlik var (EMS, LED dalga boyları, aktif içerikler, protokol sıklıkları).
- SSS sayfası 2.872 kelime — 14 ürün × ~10 soru. Yeni sitenin ürün sayfalarına dağıtılacak altın değerinde kaynak.
- Bayilere eğitim + sosyal medya desteği vaadi — güçlü B2B farklılaştırıcı, sitede yeterince öne çıkarılmamış.
- UTS kayıtlı ürün vurgusu — güven unsuru.

## Çıkarılan dosyalar
- `kaynak-icerik/wp-raw.json` — REST API ham çıktısı (30 kayıt)
- `kaynak-icerik/metin/*.md` — 30 temiz markdown (SEO başlık/açıklama + tam metin)
- `kaynak-icerik/gorsel-envanteri.json` — 52 görsel + alt metinleri
- `kaynak-icerik/sayfa-indeksi.json` — sayfa/kelime/SEO tablosu
- `kaynak-gorsel/` — 54 orijinal görsel dosyası
