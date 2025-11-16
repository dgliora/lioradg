# 🚨 HIZLI ÇÖZÜM: Gmail App Password Bulamıyorum

## Problem: 2 Adımlı Doğrulamayı açtım ama "App passwords" kısmını göremiyorum

---

## ✅ ÇÖZÜM (3 Yöntem)

### **Yöntem 1: Direkt Link (EN HIZLI)**

Tarayıcıda şu adresi aç (Gmail hesabınla giriş yapılı olmalı):

👉 **[https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**

- Eğer çalışmazsa veya "404" alırsan **Yöntem 2**'ye geç.

---

### **Yöntem 2: Manuel Adım Adım**

1. **Google Hesabına Git**: [https://myaccount.google.com](https://myaccount.google.com)

2. **Sol Menüden "Security" (Güvenlik) Tıkla**

3. **"How you sign in to Google" Bölümünü Bul**
   - Sayfayı aşağı kaydır.
   - "2-Step Verification" (2 Adımlı Doğrulama) göreceksin (zaten aktif olmalı).

4. **"2-Step Verification"a Tıkla**
   - Yeni bir sayfa açılacak (şifre isteyebilir, gir).

5. **Sayfayı EN ALTA Kaydır**
   - En altta **"App passwords"** linki olmalı.
   - Not: Bazı ekran boyutlarında gizlenebilir, tam aşağı in.

6. **"App passwords" Linki Tıkla**
   - Yeni sayfaya yönlenecek: `myaccount.google.com/apppasswords`

7. **App Password Oluştur**:
   - Ekranda "App name" kutusu var.
   - İçine **Lioradg** yaz.
   - "Create" veya "Generate" butonuna tıkla.
   - **16 haneli şifre çıkacak** (örnek: `abcd efgh ijkl mnop`).
   - Boşluksuz kopyala: `abcdefghijklmnop`

---

### **Yöntem 3: Google Arama ile Bul**

1. Google'da ara: **"google app passwords"**
2. İlk sonuç: "Sign in with App Passwords - Google Account Help"
3. Bu sayfada **"Go to App Passwords"** butonu var, tıkla.
4. Direkt `myaccount.google.com/apppasswords` açılacak.

---

## ⚠️ App Passwords Görmüyorsan (Sık Sorunlar)

### **Durum 1: "App passwords" Linki Yok**
**Sebep**: 2 Adımlı Doğrulama tam aktif olmamış olabilir.

**Çözüm**:
- [https://myaccount.google.com/signinoptions/two-step-verification](https://myaccount.google.com/signinoptions/two-step-verification) aç.
- "Turn on" (Aç) butonuna tıkla, telefon doğrulama yap.
- **Önemli**: Sadece SMS kodu değil, "Continue" diyerek tüm adımları tamamla.
- Aktif olduktan sonra tekrar dene.

### **Durum 2: "This setting is not available for your account"**
**Sebep**: Hesap şirket/okul hesabı ise veya yönetici kısıtlaması var.

**Çözüm**:
- **Kişisel Gmail hesabı kullan** (örneğin @gmail.com).
- Eğer @company.com gibi bir hesapsa, yöneticiden izin iste.

### **Durum 3: Sayfa Yüklenmiyor (404 veya Boş Ekran)**
**Sebep**: Tarayıcı cache veya oturum sorunu.

**Çözüm**:
1. Tarayıcıyı **Incognito/Private mode**'da aç.
2. Gmail hesabına giriş yap (rboguz06@gmail.com).
3. Şu linke git: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Tekrar dene.

### **Durum 4: "Advanced Protection" Aktif**
**Sebep**: Google Advanced Protection programına kayıtlıysan, app passwords devre dışıdır.

**Çözüm**:
- Advanced Protection'ı kaldır: [https://myaccount.google.com/advanced-protection](https://myaccount.google.com/advanced-protection)
- Veya OAuth kullan (bu zaten var, NextAuth Google OAuth).

---

## 🎯 BAŞARIYLA ALDIĞINDA NE YAPACAKSIN?

1. **16 Haneli Şifreyi Kopyala** (örnek: `abcd efgh ijkl mnop`)
   - Boşlukları kaldır: `abcdefghijklmnop`

2. **VS Code'da .env.local Aç**
   - Projenin root dizininde (C:\Cursor\Lioradg\.env.local)

3. **SMTP_PASSWORD Satırını Değiştir**:
   ```
   SMTP_PASSWORD=placeholder-16-karakter-app-password
   ```
   Değiştir:
   ```
   SMTP_PASSWORD=abcdefghijklmnop
   ```
   (Kopyaladığın şifreyi yapıştır, boşluksuz.)

4. **Kaydet** (Ctrl+S)

5. **Server'ı Yeniden Başlat**:
   ```bash
   npm run dev
   ```

6. **Test Et**:
   - [localhost:3000/sifremi-unuttum](http://localhost:3000/sifremi-unuttum) aç.
   - Email gir, "Email Gönder" tıkla.
   - Gmail kutunda e-posta olmalı (subject: "Şifre Sıfırlama Talebiniz").

---

## 📸 Ekran Görüntülü Yardım

### **App Passwords Sayfası Nasıl Görünür?**

Doğru sayfadaysan şunları göreceksin:
- Başlık: **"App passwords"** veya **"Uygulama şifreleri"**
- Alt başlık: "Sign in using App Passwords" veya "Uygulama şifreleriyle oturum açın"
- Bir input kutusu: "App name" veya "Uygulama adı"
- Bir buton: "Create" veya "Oluştur"

Görmüyorsan yanlış sayfadasın, yukarıdaki yöntemleri tekrar dene.

---

## 🔄 Alternatif Çözüm: Google OAuth Kullan (App Password Gerekmiyor)

Eğer App Password alamıyorsan, sadece **Google OAuth** kullanabilirsin (bu da çalışır, e-posta gitmez ama üye olma çalışır):

1. `.env.local` dosyasında:
   ```
   NODE_ENV=development
   ```
   Yap (production yerine). Bu sayede e-posta gönderme devre dışı, console'a log basılır.

2. Google OAuth kur (GOOGLE_OAUTH_SETUP.md'yi oku).

3. Kullanıcılar "Google ile Kayıt Ol" butonuyla üye olabilir (e-posta gitmez ama giriş çalışır).

---

Hala sorun varsa **screenshot** paylaş (hangi sayfadasın, ne görüyorsun), hemen yardım ederim! 🚀

