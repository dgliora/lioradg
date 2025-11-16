# Google OAuth Entegrasyonu Rehberi

## 🚀 "Google ile Giriş Yap" Özelliği Kurulumu

Artık kayıt ve giriş sayfalarında **"Google ile Giriş Yap"** butonu var! Kullanıcılar Gmail hesaplarıyla tek tıkla üye olabilir/giriş yapabilir.

---

## 📝 Adım Adım Google OAuth Setup

### 1. Google Cloud Console'a Git
- Tarayıcıda aç: [https://console.cloud.google.com](https://console.cloud.google.com)
- Gmail hesabınla giriş yap (**rboguz06@gmail.com**)

### 2. Yeni Proje Oluştur
- Sol üst köşede proje seçiciyi tıkla.
- "New Project" (Yeni Proje) seç.
- Proje adı: **Lioradg E-commerce**
- "Create" tıkla.
- Oluşturulduktan sonra sol üst menüden bu projeyi seç.

### 3. OAuth Consent Screen (Onay Ekranı) Ayarla
- Sol menüden: **APIs & Services** > **OAuth consent screen**
- User Type: **External** seç (herkese açık) → "Create"
- Form doldur:
  - **App name**: Lioradg
  - **User support email**: rboguz06@gmail.com
  - **App logo** (opsiyonel): Logo yükle
  - **App domain** (opsiyonel): localhost:3000 (geliştirme için)
  - **Developer contact**: rboguz06@gmail.com
- "Save and Continue" tıkla.
- **Scopes** ekranında: "Add or Remove Scopes" → `email`, `profile`, `openid` seç → "Save and Continue"
- **Test users** ekranında: rboguz06@gmail.com ekle (geliştirme için) → "Save and Continue"
- "Back to Dashboard" tıkla.

### 4. OAuth Client ID Oluştur
- Sol menüden: **Credentials** (Kimlik Bilgileri)
- Üstte "Create Credentials" → **OAuth client ID** seç
- Application type: **Web application**
- Name: **Lioradg Web Client**
- **Authorized JavaScript origins** ekle:
  - `http://localhost:3000`
  - (Production'da: `https://yourdomain.com`)
- **Authorized redirect URIs** ekle:
  - `http://localhost:3000/api/auth/callback/google`
  - (Production'da: `https://yourdomain.com/api/auth/callback/google`)
- "Create" tıkla.

### 5. Client ID ve Secret'ı Kopyala
- Ekranda **Client ID** ve **Client Secret** çıkacak.
- Her ikisini de kopyala (sonra bulamayabilirsin).
  - **Client ID**: `1234567890-abcdefghijklmnop.apps.googleusercontent.com` gibi
  - **Client Secret**: `GOCSPX-abcdefghijk12345` gibi

### 6. .env.local Dosyasına Yapıştır
1. VS Code'da `.env.local` dosyasını aç.
2. Şu satırları bul:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```
3. Değiştir:
   ```
   GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijk12345
   ```
   (Yukarıda kopyaladığın değerleri yapıştır.)
4. Kaydet (Ctrl+S).

### 7. Server'ı Yeniden Başlat
- Terminal'de Ctrl+C (server'ı durdur).
- Tekrar başlat:
  ```bash
  npm run dev
  ```

---

## ✅ Test Et

### 1. Google ile Kayıt Ol
1. Tarayıcıda [localhost:3000/kayit](http://localhost:3000/kayit) aç.
2. Sayfanın altında "Google ile Kayıt Ol" butonu var (Google logosu ile).
3. Butona tıkla.
4. Google OAuth ekranı açılacak → Gmail hesabını seç (rboguz06@gmail.com).
5. "Allow" (İzin Ver) tıkla.
6. Otomatik olarak Lioradg'ye yönlenecek, giriş yapılmış olacak.
7. **DB'ye otomatik eklendi** (Prisma User tablosunda email, name kaydedildi).

### 2. Google ile Giriş Yap
1. Çıkış yap (hesap sayfasından veya session temizle).
2. [localhost:3000/giris](http://localhost:3000/giris) aç.
3. "Google ile Giriş Yap" butonu var.
4. Tıkla → Gmail seç → otomatik giriş.

---

## 🛠️ Nasıl Çalışıyor?

### Flow (Akış):
1. Kullanıcı "Google ile Giriş Yap" butonuna tıklar.
2. NextAuth `/api/auth/signin/google` route'una yönlendirir.
3. Google OAuth ekranı açılır, kullanıcı hesap seçer.
4. Google, kullanıcı bilgilerini (email, name, profile) geri gönderir.
5. NextAuth callback (`lib/auth-config.ts`):
   - Eğer kullanıcı DB'de yoksa → Prisma ile yeni User oluştur (password boş, emailVerified=now).
   - Eğer varsa → Session başlat.
6. Kullanıcı `/account` sayfasına yönlendiriliyor (giriş yapılmış).

### Dosyalar:
- **NextAuth Config**: `lib/auth-config.ts` (Google provider + signIn callback)
- **API Route**: `app/api/auth/[...nextauth]/route.ts` (NextAuth handler)
- **Login/Register Pages**: Google butonu eklendi (SVG logo ile)
- **Prisma Schema**: User tablosu zaten var (email unique, password opsiyonel - Google için boş)

---

## 🔍 Sorun Giderme

### "redirect_uri_mismatch" Hatası:
- Google Console > Credentials > OAuth Client'ında redirect URI'yi kontrol et:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- Port numarası doğru olmalı (3000 veya çalışan port).
- Tam URL yapıştır (boşluk veya typo yok).

### "Invalid client" Hatası:
- `.env.local` dosyasında Client ID ve Secret doğru kopyalanmış mı kontrol et.
- Server'ı yeniden başlat (env değişiklikleri yüklenmesi için).

### Google OAuth Ekranı Açılmıyor:
- Console'da JavaScript hatası var mı kontrol et (F12 > Console).
- NextAuth yüklü mü kontrol et:
  ```bash
  npm list next-auth
  ```
  (Zaten `package.json`'da var: `^5.0.0-beta.30`)

### Kullanıcı DB'ye Eklenmiyor:
- `lib/auth-config.ts` signIn callback'inde Prisma create çalışıyor mu?
- Terminal console'a "User created: ..." log bak (ekleyebiliriz).
- Prisma Studio aç: `npx prisma studio` → User tablosunda Google'dan gelen email'i kontrol et.

---

## 🔐 Güvenlik Notları

- **Client Secret'ı kimseyle paylaşma**.
- **.env.local GitHub'a gitmez** (.gitignore'da).
- Production'da:
  - OAuth consent screen'i "In production" moduna al (Google review gerekir).
  - Redirect URI'yi production domain'e değiştir: `https://yourdomain.com/api/auth/callback/google`
- Google, user data'ya (email, name) erişimi sınırlar – sadece OAuth consent'te belirtilen scope'lar kullanılır.

---

## 🎨 Google Butonu Tasarımı

- **SVG Logo**: Gerçek Google marka renkleri (Blue, Red, Yellow, Green)
- **Tailwind Style**: `variant="outline"` (beyaz bg, border), hover efekti var
- **Responsive**: Mobil'de de düzgün görünür (gap-3, flex center)
- **Seperator**: "veya" yazısı ile form ile ayrılmış (border-t divider)

---

Şimdi Google OAuth kurulumunu yap ve test et! Kullanıcılar tek tıkla Gmail ile üye olabilecek. 🎉

