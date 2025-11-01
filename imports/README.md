# Türkiye Adres Verisi İçe Aktarma

Bu klasör, Türkiye il/ilçe/mahalle/sokak verilerini içe aktarmak için kullanılır.

## Kullanım

1. **tr-addresses.json** veya **tr-addresses.csv** dosyasını bu klasöre yerleştirin

2. Dosya formatı (JSON - her satır bir kayıt):
```json
{"provinceCode":"06","province":"Ankara","districtCode":"0601","district":"Sincan","neighborhoodCode":"060101","neighborhood":"Atatürk Mahallesi","streetCode":"06010101","street":"Cumhuriyet Caddesi","postalCode":"06930"}
```

3. Import scriptini çalıştırın:
```bash
npm run import:tr
```

4. Script şunları yapacak:
   - Dosyayı okuyacak (stream ile, büyük dosyalar için optimize)
   - Duplicate kayıtları temizleyecek
   - İl/İlçe/Mahalle/Sokak hiyerarşisine göre ayıracak
   - `public/tr-addresses/` klasörüne JSON dosyalar oluşturacak

## Çıktı Yapısı

```
public/tr-addresses/
├── provinces.json           # Tüm iller
├── districts/
│   ├── 06.json             # Ankara ilçeleri
│   ├── 34.json             # İstanbul ilçeleri
│   └── ...
├── neighborhoods/
│   ├── 0601.json           # Sincan mahalleleri
│   ├── 3401.json           # Kadıköy mahalleleri
│   └── ...
└── streets/
    ├── 060101.json         # Atatürk Mah. sokakları
    └── ...
```

## Notlar

- Dosya yoksa script örnek verilerle devam eder
- API'ler 10 dakika cache'lenir
- Production için gerçek veri seti kullanılmalı

