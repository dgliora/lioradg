# Gmail App Password Alma Rehberi

## 🚨 ÖNEMLİ: SMTP Şifre Sorunu Çözümü

`.env.local` dosyasındaki `SMTP_PASSWORD` değeri şu an **placeholder** (sahte). Gerçek e-posta göndermek için Gmail App Password almanız gerekiyor.

---

## 📝 Adım Adım Gmail App Password Alma

### 1. Google Hesabı Güvenlik Ayarlarına Git
- Tarayıcıda şu adresi aç: [https://myaccount.google.com/security](https://myaccount.google.com/security)
- Gmail hesabınla giriş yap: **rboguz06@gmail.com**

### 2. 2 Adımlı Doğrulamayı Aktif Et (Zorunlu)
- Sayfayı aşağı kaydır, "2-Step Verification" (2 Adımlı Doğrulama) bölümünü bul.
- Eğer devre dışıysa:
  - "Get started" veya "Turn on" butonuna tıkla.
  - Telefon numaranı gir, doğrulama kodunu al.
  - İkinci faktör olarak SMS veya Google Authenticator seç.
  - Aktif et.

### 3. Uygulama Şifresi Oluştur

⚠️ **ÖNEMLİ**: App Passwords bölümü 2 Adımlı Doğrulama sayfasında değil, AYRI BİR LİNKTE!

**Direkt Adres**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

**Veya Manuel Yol**:
1. [https://myaccount.google.com](https://myaccount.google.com) ana sayfasına git.
2. Sol menüden **"Security"** (Güvenlik) tıkla.
3. Sayfayı aşağı kaydır, **"How you sign in to Google"** (Google'a nasıl giriş yaparsınız) bölümünü bul.
4. **"2-Step Verification"** tıkla (zaten aktif olmalı).
5. Tekrar aşağı kaydır, sayfanın EN ALTINDA **"App passwords"** linki var.
   - Not: Eğer görmüyorsan, tarayıcı genişliğini kontrol et (bazen responsive'de gizlenir).
6. "App passwords" tıkla → Yeni sayfaya yönlenecek.

**App Password Oluştur**:
1. Ekranda "Select app" ve "Select device" dropdown'ları var.
2. **App name** kutusuna: **Lioradg** yaz (veya "Mail" seç).
3. "Generate" butonuna tıkla.

### 4. Şifreyi Kopyala
- Ekranda **16 haneli şifre** çıkacak (örnek: `abcd efgh ijkl mnop`).
- **Boşlukları kaldırarak** kopyala: `abcdefghijklmnop` (16 karakter, boşluksuz).
- Bu şifreyi güvenli bir yere not al (bir daha göremeyebilirsin).

### 5. .env.local Dosyasına Yapıştır
1. VS Code'da projeyi aç.
2. Root dizinde `.env.local` dosyasını aç (eğer görmüyorsan Ctrl+P > `.env.local` yaz).
3. Şu satırı bul:
   ```
   SMTP_PASSWORD=placeholder-16-karakter-app-password
   ```
4. Değiştir:
   ```
   SMTP_PASSWORD=abcdefghijklmnop
   ```
   (Yukarıda kopyaladığın 16 haneli şifreyi yapıştır, boşluksuz.)
5. Kaydet (Ctrl+S).

### 6. Server'ı Yeniden Başlat
- Terminal'de çalışan server'ı durdur (Ctrl+C).
- Tekrar başlat:
  ```bash
  npm run dev
  ```
- Yeni `.env.local` değerlerini okuyacak.

---

## ✅ Test Et

1. **Şifre Sıfırlama Test**:
   - [localhost:3000/sifremi-unuttum](http://localhost:3000/sifremi-unuttum) aç.
   - Email: `rboguz06@gmail.com` gir, "Email Gönder" tıkla.
   - **Gerçek e-posta gidecek** (Gmail kutunu kontrol et, spam de olabilir).
   - Subject: "Şifre Sıfırlama Talebiniz"
   - E-postadaki butona tıkla, yeni şifre belirle.

2. **Kayıt Test**:
   - [localhost:3000/kayit](http://localhost:3000/kayit) aç.
   - Yeni bir email ile kayıt ol (örneğin test@example.com).
   - **Welcome email gidecek** (Gmail kutunu kontrol et).

---

## 🔍 Sorun Giderme

### E-posta Hala Gitmiyorsa:

1. **Console Kontrol**:
   - Terminal'de şu hatayı ara:
     ```
     Reset email send error: { code: 'EAUTH', response: '535-5.7.8 Username and Password not accepted' }
     ```
   - Bu, app password'ün yanlış olduğunu gösterir. Tekrar al ve yapıştır.

2. **NODE_ENV Kontrol**:
   - `.env.local` dosyasında:
     ```
     NODE_ENV=production
     ```
   - olmalı (development ise e-posta gitmez, sadece console'a log basılır).

3. **Gmail Güvenlik Uyarısı**:
   - Gmail'e giriş yap, "Security alerts" kontrol et.
   - Eğer "Suspicious sign-in prevented" gibi bir uyarı varsa, izin ver.

4. **Spam Klasörü**:
   - E-posta geldi ama görmüyorsan, Gmail'de Spam/Junk klasörünü kontrol et.

---

## 🔐 Güvenlik Notları

- **App password'ü kimseyle paylaşma**.
- **.env.local dosyası GitHub'a gitmez** (.gitignore'da var).
- Production'da farklı bir SMTP servisi (SendGrid, AWS SES) kullanabilirsin.
- App password'ü iptal etmek için: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) > İlgili şifreyi sil.

---

## 📧 E-posta Özellikleri

- **From**: "Lioradg" <info@lioradg.com.tr>
- **To**: Kullanıcının email'i
- **Subject**: "Şifre Sıfırlama Talebiniz" / "Lioradg'e Hoş Geldiniz!"
- **Design**: HTML template'li, responsive (Tailwind benzeri inline CSS)
- **Link**: `http://localhost:3000/sifre-sifirla?token=...` (1 saat expire)

---

Şimdi gerçek Gmail app password al ve test et! 🚀

