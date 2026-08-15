# Veri Şeması — Mediest Group

Tüm site içeriği `icerik/` altındaki JSON dosyalarından üretilir. HTML'e hiçbir metin gömülmez.
WordPress'e giydirilirken bu alanlar ACF alan adlarına birebir karşılık gelecek.

## Dosyalar
```
icerik/
  site.json        Kurumsal bilgi, menü, footer, iletişim, SEO varsayılanları
  urunler.json     14 ürün (7 Mezoeffect + 5 Mezocomplex + 2 cihaz)
  protokoller.json Protokol Seçici verisi (sorun → cihaz + ampul)
  blog.json        9 yazı
  sayfalar.json    Kurumsal sayfalar (hakkımızda, bayilik, eğitim-destek, kalite-uts, kvkk...)
```

## urunler.json — tek ürün nesnesi

```jsonc
{
  "slug": "mezoeffect-hyaluronic-acid-serum",   // yeni URL slug'ı
  "eskiUrl": "/mezoeffect-hyaluronic-acid-serum/", // 301 için; değişmediyse aynısı
  "tip": "serum",                  // "serum" | "solusyon" | "cihaz"
  "grup": "mezoeffect",            // "mezoeffect" | "mezocomplex" | "cihaz"
  "sira": 5,                       // listelerde gösterim sırası

  "ad": "Mezoeffect Hyaluronic Acid Serum",
  "adKisa": "Hyaluronic Acid",     // kart/menü için
  "etiket": "Nem & Elastikiyet",   // 2-3 kelimelik konumlandırma rozeti
  "ozet": "…",                     // 1-2 cümle, hero altı giriş

  "metaBaslik": "…",               // 55-60 karakter
  "metaAciklama": "…",             // 150-160 karakter, ORİJİNALDE YOKSA YENİ YAZ

  "kimlerIcin": ["Kuru ve nemsiz ciltler", "…"],   // "Öne Çıkan Etkiler" bölümünden

  "aktifIcerikler": [
    { "ad": "Sodium Hyaluronate", "aciklama": "…" }
  ],

  "klinikAvantajlar": ["…"],       // uygulayıcıya/kliniğe fayda

  "ambalaj": {
    "hacim": "2 ml",
    "adet": 7,
    "birim": "ampul",              // "ampul" | "flakon" | "kapsül"
    "not": "Steril koşullarda üretilmiştir."
  },

  "protokol": {
    "kullanim": "…",               // profesyonel uygulama
    "evKullanimi": "…",            // varsa, yoksa null
    "kombinasyon": ["gold-pen", "baby-skin-pen"]   // hangi cihazlarla
  },

  "sss": [ { "s": "Soru?", "c": "Cevap." } ],

  "ilgiliUrunler": ["mezocomplex-hyaluronic-acid"],
  "ilgiliBlog": ["mezoeffect-hyaluronic-acid-ile-cilt-nemi-ve-elastikiyet-destegi"],

  "gorsel": {
    "ana": "urun/mezoeffect-hyaluronic-acid-serum.webp",
    "kaynakFoto": "Mezoeffect-Hyaluronic-Acid-Serum.jpg",  // Higgsfield referans girdisi
    "altMetin": "…"
  },

  "dogrulama": {
    "kaynakDosya": "page--mezoeffect-hyaluronic-acid-serum.md",
    "tespitEdilenHatalar": ["…"],  // orijinaldeki kopya-yapıştır/çelişki notları
    "eklenenIcerik": ["metaAciklama"]  // orijinalde olmayıp yeni yazılan alanlar
  }
}
```

## Cihaz nesnesi — ek alanlar
```jsonc
{
  "tip": "cihaz",
  "teknolojiler": [ { "ad": "EMS", "baslik": "…", "aciklama": "…", "maddeler": ["…"] } ],
  "uygulamaAlanlari": [ { "ad": "Akne Skarları", "aciklama": "…" } ],
  "led": [ { "renk": "Kırmızı", "dalgaBoyu": "620-650 nm", "etki": "…" } ],
  "kapsuller": [ { "ad": "Illuminate", "etki": "…" } ],   // sadece Baby Skin Pen
  "seansPlani": { "seansSayisi": "4-6", "aralik": "15-20 gün", "not": "…" },
  "bayiDestegi": ["Birebir eğitim", "Sosyal medya görsel & Reels desteği", "…"]
}
```

## Kesin kurallar
1. **Uydurma yok.** Her cümlenin karşılığı `kaynak-icerik/metin/*.md` içinde olmalı. Tek istisna: `metaAciklama` ve `etiket` (yeni yazılır, `dogrulama.eklenenIcerik` içine kaydedilir).
2. **Fiyat yazılmaz.** Orijinaldeki "2.000–2.500 ₺" gibi ifadeler taşınmaz.
3. **Kopya hataları düzeltilir.** Örn. Hyaluronic Acid Serum sayfasının SSS'i Somon DNA'yı anlatıyor → doğru ürüne taşınır, `tespitEdilenHatalar` içine not düşülür.
4. **Çelişki varsa uydurma, işaretle.** Örn. Firming ambalajı gövdede "5 ml × 5", SSS'te "8 ml × 5" → `ambalaj.not` alanına "müşteri teyidi bekliyor" yazılır ve hata olarak kaydedilir.
5. **Yazım düzeltilir**: "Uygulamala" → "Uygulama", "Mezoeffec" → "Mezoeffect", "Contur" → "Contour".
6. **Emoji temizlenir.** Orijinaldeki ✅ ✔ 📍 🔹 gibi işaretler veriye taşınmaz; liste olarak yapılandırılır, ikonlar tasarımdan gelir.
7. **Türkçe karakterler doğru**: "İnfo@" → "info@".
