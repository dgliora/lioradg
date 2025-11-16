# 🐛 E-posta Gönderme Debug Rehberi

## Durum: Toast "E-posta gönderildi" diyor ama Gmail'de yok

---

## 📋 **ÖNEMLİ: Console Hataları E-posta Hatasını Göstermiyor**

Gördüğün console hataları:
- `Download the React DevTools` → Önemsiz, geliştirme modu uyarısı
- `Function components cannot be given refs` → Toast component hatası (şimdi düzeltildi)
- `Fast Refresh rebuilding` → Next.js hot reload (normal)

**BU HATALAR E-POSTA GÖNDERMEYİ ETKİLEMİYOR!**

---

## 🔍 **GERÇEK SORUNU BULMAK İÇİN**

### **Adım 1: Terminal/PowerShell Console'a Bak**

`npm run dev` komutunu çalıştırdığın **terminal penceresine** git (tarayıcı console'u değil!).

Şifre sıfırlama isteği yaptıktan sonra orada şu hata mesajlarından birini arayacaksın:

#### **Senaryo A: SMTP Auth Hatası (App Password Yanlış)**
```
Reset email send error: { code: 'EAUTH', response: '535-5.7.8 Username and Password not accepted' }
```
**Çözüm**: App password yanlış. Tekrar al:
1. [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Eski "Lioradg" app password'ü revoke et (sil).
3. Yenisini oluştur (16 hane kopyala, boşluksuz).
4. `.env.local` dosyasında `SMTP_PASSWORD` değiştir.
5. Server'ı yeniden başlat (`Ctrl+C` → `npm run dev`).

#### **Senaryo B: Connection Timeout (İnternet/Firewall)**
```
Reset email send error: { code: 'ETIMEDOUT', errno: -4039 }
```
**Çözüm**: 
- İnternet bağlantısını kontrol et.
- Firewall/Antivirus Gmail SMTP (port 587) blokluyorsa kapat.
- VPN kullanıyorsan kapat.

#### **Senaryo C: Rate Limit (Çok Fazla İstek)**
```
Reset email send error: { code: 'ESMTP', response: '4.7.0 Too many requests' }
```
**Çözüm**: 10 dakika bekle, tekrar dene. Gmail saatte ~20 e-posta limiti var.

#### **Senaryo D: HİÇBİR HATA YOK (Terminal'de Error Log Yok)**
**Bu durumda e-posta GÖNDERİLDİ, ama:**
- Gmail **SPAM** klasöründe olabilir → Kontrol et!
- Gmail filters aktifse block etmiş olabilir → Settings > Filters kontrol et.
- Gecikme olabilir → 1-2 dakika bekle, refresh yap.

---

## 🧪 **TEST SENARYOSU (Adım Adım Debug)**

### **1. Terminal'i Kapat ve Yeniden Başlat (Temiz Log İçin)**
```bash
# PowerShell'de:
# Ctrl+C (server'ı durdur)
npm run dev
```
Şimdi terminal temiz, sadece yeni log'lar görünecek.

### **2. Tarayıcıda Şifre Sıfırlama İsteği Yap**
- [localhost:3000/sifremi-unuttum](http://localhost:3000/sifremi-unuttum)
- Email: `rboguz06@gmail.com`
- "Email Gönder" tıkla

### **3. Terminal'i İZLE (1-2 Saniye İçinde Log Gelir)**

**Eğer BAŞARILI ise göreceğin:**
```
📧 [DEV MODE] Şifre sıfırlama e-postası gönderildi: {
  to: 'rboguz06@gmail.com',
  token: 'abc123...',
  resetUrl: 'http://localhost:3000/sifre-sifirla?token=...'
}
```
**Bu varsa**: E-posta production'da giderdi, ama NODE_ENV=development olduğu için sadece log basıldı.
**Çözüm**: `.env.local`'de `NODE_ENV=production` yap (zaten öyle olmalı).

**Eğer HATA varsa göreceğin:**
```
Reset email send error: { code: '...', response: '...' }
```
Yukarıdaki senaryolara göre çöz.

---

## ⚙️ **CONFIG KONTROLÜ (Adım Adım)**

### **Kontrol 1: .env.local Doğru mu?**

PowerShell'de çalıştır:
```bash
Get-Content .env.local
```

**Olması gereken**:
```
DATABASE_URL="file:./prisma/dev.db"
SMTP_USER=rboguz06@gmail.com
SMTP_PASSWORD=awbmowfyuwwvmfbv
NEXTAUTH_SECRET=super-secret-random-key-change-in-production-327208468
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NODE_ENV=production
```

**Kontrol Et**:
- `SMTP_PASSWORD` boşluksuz 16 karakter mi? (örnek: `awbmowfyuwwvmfbv`)
- `NODE_ENV=production` mi? (development ise e-posta gitmez, log basılır)

### **Kontrol 2: lib/email.ts NODE_ENV Kontrolü**

`lib/email.ts` dosyasında şu satır var mı:
```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
```

Eğer varsa VE `.env.local`'de `NODE_ENV=production` ise e-posta GİTMELİ.

Eğer hala `isDevelopment = false` gibi hardcode varsa değiştir:
```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
```

### **Kontrol 3: Server Yeni Config'i Yükledi mi?**

`.env.local` değişikliklerinden sonra server'ı **mutlaka** yeniden başlat:
```bash
Ctrl+C
npm run dev
```

---

## 🚨 **ACİL ÇÖZÜM: Manual Test (E-posta Kesin Gidiyor mu Kontrol)**

Eğer terminal'de de hata göremiyorsan, manual test yap:

### **Test 1: Node REPL ile Direkt SMTP Test**

PowerShell'de çalıştır:
```bash
cd C:\Cursor\Lioradg
node
```

Node REPL açılınca:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'rboguz06@gmail.com',
    pass: 'awbmowfyuwwvmfbv' // App password'ünü buraya yapıştır
  }
});

transporter.sendMail({
  from: '"Test" <info@lioradg.com.tr>',
  to: 'rboguz06@gmail.com',
  subject: 'Test E-posta',
  text: 'Bu bir test e-postasıdır.'
}).then(() => {
  console.log('✅ E-POSTA GÖNDERİLDİ!');
}).catch((error) => {
  console.error('❌ HATA:', error);
});
```

**Sonuç**:
- Eğer "✅ E-POSTA GÖNDERİLDİ!" yazıyorsa → SMTP config doğru, Gmail kutunu kontrol et (spam dahil).
- Eğer "❌ HATA:" yazıyorsa → Error mesajını oku (EAUTH, ETIMEDOUT vs), yukarıdaki senaryolara göre çöz.

---

## 📧 **GMAIL KONTROL LİSTESİ**

E-posta gittiyse şu klasörlerde olabilir:

1. **Inbox (Ana Gelen Kutusu)**
   - Subject: "Şifre Sıfırlama Talebiniz"
   - From: Lioradg <info@lioradg.com.tr>

2. **Spam (İstenmeyen E-posta)**
   - İlk gönderimde buraya düşebilir (Gmail filtreleme).
   - Bul, "Not spam" tıkla.

3. **Promotions/Social Tabs**
   - Gmail tabs aktifse Promotions'a gitmiş olabilir.
   - "Primary" tab'ine sürükle.

4. **All Mail (Tüm E-postalar)**
   - Arama: `from:info@lioradg.com.tr`
   - Son 10 dakikadaki e-postaları göster.

5. **Filters (Filtreler)**
   - Gmail Settings > Filters and Blocked Addresses
   - Eğer `info@lioradg.com.tr` bloklanmışsa kaldır.

---

## 🔄 **SON ÇARE: Development Mode'da Test Et**

Eğer hala çözemediysen, geçici olarak development mode'a al (e-posta gitmez ama debug bilgisi verir):

1. `.env.local` dosyasında:
   ```
   NODE_ENV=development
   ```

2. Server'ı yeniden başlat:
   ```bash
   npm run dev
   ```

3. Şifre sıfırlama isteği yap.

4. Terminal'de şu log'u göreceksin:
   ```
   📧 [DEV MODE] Şifre sıfırlama e-postası gönderildi: {
     to: 'rboguz06@gmail.com',
     token: 'abc123-xyz456...',
     resetUrl: 'http://localhost:3000/sifre-sifirla?token=abc123-xyz456...'
   }
   ```

5. `resetUrl`'yi kopyala, tarayıcıya yapıştır → Manuel test yap (e-posta olmadan).

**Bu yöntemle en azından flow'un çalıştığını doğrularsın.**

---

## 📞 **HANGİ BİLGİLERİ PAYLAŞ (Hala Sorun Varsa)**

1. **Terminal Log'ları** (npm run dev çalıştırdığın pencere):
   - Şifre sıfırlama isteği yaptıktan sonraki 5-10 satır.
   - Error log varsa komple kopyala.

2. **.env.local SMTP Kısmı** (password'ü gizleyebilirsin):
   ```
   SMTP_USER=rboguz06@gmail.com
   SMTP_PASSWORD=awbm****mfbv (ilk 4 + son 4 karakter yeterli)
   NODE_ENV=production
   ```

3. **Tarayıcı Network Tab** (F12 > Network):
   - Şifre sıfırlama isteği yap.
   - `/api/auth/forgot-password` isteğini bul.
   - Response'u kopyala (Success mi? Error message ne?)

Bu bilgilerle kesin çözebilirim! 🚀

