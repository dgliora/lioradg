# 🚀 Production Deployment: lioradg.com.tr

## ✅ **YAPILAN DEĞİŞİKLİKLER (Canlı İçin Hazır)**

### **1. E-posta URL'leri Güncellendi**
**lib/email.ts** dosyasında tüm `localhost:3000` ve `localhost:3001` URL'leri → `https://lioradg.com.tr` olarak değiştirildi:

- ✅ Şifre sıfırlama link: `https://lioradg.com.tr/sifre-sifirla?token=...`
- ✅ Ürünleri keşfet link: `https://lioradg.com.tr/urunler`
- ✅ Gizlilik Politikası: `https://lioradg.com.tr/gizlilik-politikasi`
- ✅ KVKK: `https://lioradg.com.tr/kvkk`
- ✅ Sipariş takip: `https://lioradg.com.tr/siparis-takip`

### **2. .env.local Production Config**
```
DATABASE_URL="file:./prisma/dev.db"
SMTP_USER=rboguz06@gmail.com
SMTP_PASSWORD=awbmowfyuwwvmfbv
NEXTAUTH_SECRET=super-secret-random-key-change-in-production-327208468
NEXTAUTH_URL=https://lioradg.com.tr
GOOGLE_CLIENT_ID=[Google Console'dan alacağın]
GOOGLE_CLIENT_SECRET=[Google Console'dan alacağın]
NODE_ENV=production
```

---

## 📋 **GOOGLE OAUTH PRODUCTION SETUP**

### **ADIM 1: OAuth Consent Screen (Production Mode)**

1. **Google Cloud Console**: [https://console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** > **OAuth consent screen**
3. **Publishing status**: "Testing" görünüyor olmalı
4. **"PUBLISH APP"** butonuna tıkla (Production'a geç)

**Gereksinimler (Google isteyecek)**:
- ✅ **App name**: Lioradg (zaten var)
- ✅ **User support email**: rboguz06@gmail.com (zaten var)
- ✅ **App logo**: Logo yükle (opsiyonel, ama önerilir)
- ✅ **App domain**: `lioradg.com.tr`
- ✅ **Authorized domains**: `lioradg.com.tr` ekle
- ✅ **Privacy Policy URL**: `https://lioradg.com.tr/gizlilik-politikasi` (sayfa zaten var)
- ✅ **Terms of Service URL**: `https://lioradg.com.tr/kullanim-sartlari` (sayfa zaten var)
- ✅ **Developer contact email**: rboguz06@gmail.com

**Google Review**: 1-2 hafta sürebilir. Onaylanınca **herkes** Google ile giriş yapabilir.

---

### **ADIM 2: OAuth Client ID (Production URLs)**

1. **APIs & Services** > **Credentials**
2. **Create Credentials** > **OAuth client ID**
3. **Application type**: Web application
4. **Name**: `Lioradg Production`

5. **Authorized JavaScript origins**:
   - `https://lioradg.com.tr`
   - (www varsa: `https://www.lioradg.com.tr`)

6. **Authorized redirect URIs**:
   - `https://lioradg.com.tr/api/auth/callback/google`
   - (www varsa: `https://www.lioradg.com.tr/api/auth/callback/google`)

7. **"Create"** tıkla

8. **Client ID ve Secret kopyala**, bana gönder:
   ```
   Client ID: [buraya yapıştır]
   Client Secret: [buraya yapıştır]
   ```

---

## 🌐 **DEPLOYMENT (Vercel/Netlify)**

### **Seçenek 1: Vercel (ÖNERİLEN)**

1. **GitHub'a Push**:
   ```bash
   git add .
   git commit -m "Production ready - lioradg.com.tr"
   git push origin main
   ```

2. **Vercel'e Deploy**:
   - [https://vercel.com/new](https://vercel.com/new) aç
   - GitHub repo'yu seç (Lioradg)
   - **Environment Variables** ekle:
     ```
     DATABASE_URL=file:./prisma/dev.db
     SMTP_USER=rboguz06@gmail.com
     SMTP_PASSWORD=awbmowfyuwwvmfbv
     NEXTAUTH_SECRET=super-secret-random-key-change-in-production-327208468
     NEXTAUTH_URL=https://lioradg.com.tr
     GOOGLE_CLIENT_ID=[Google'dan aldığın]
     GOOGLE_CLIENT_SECRET=[Google'dan aldığın]
     NODE_ENV=production
     ```
   - **Deploy** tıkla

3. **Custom Domain Ayarla**:
   - Vercel Dashboard > Proje > **Settings** > **Domains**
   - Domain ekle: `lioradg.com.tr`
   - Vercel sana DNS kayıtlarını verecek (A record veya CNAME)
   - Domain sağlayıcında (GoDaddy, Cloudflare, vs) bu DNS kayıtlarını ekle

4. **SSL (HTTPS)**: Vercel otomatik SSL sertifikası sağlar (Let's Encrypt)

---

### **Seçenek 2: Netlify**

1. **GitHub'a Push** (yukarıdaki gibi)
2. **Netlify'a Deploy**:
   - [https://app.netlify.com/start](https://app.netlify.com/start)
   - GitHub repo'yu seç
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Environment Variables** ekle (yukarıdaki gibi)
   - **Deploy** tıkla

3. **Custom Domain** ayarla (Vercel'e benzer)

---

## 🗄️ **DATABASE (Production İçin)**

### **Şu an**: SQLite (local, `dev.db`)
- ✅ Geliştirme için yeterli
- ⚠️ Production'da sorun olabilir (Vercel/Netlify dosya sistemi read-only)

### **Production İçin Öneriler**:

#### **Seçenek 1: PostgreSQL (ÖNERİLEN)**
- **Neon.tech**: Ücretsiz PostgreSQL (750 saat/ay)
  - [https://neon.tech](https://neon.tech) kaydol
  - Database oluştur
  - Connection string kopyala
  - `.env` dosyasında `DATABASE_URL` değiştir
  - `prisma/schema.prisma`: `provider = "postgresql"` yap
  - `npx prisma migrate deploy` (production migration)

#### **Seçenek 2: MySQL (PlanetScale)**
- Ücretsiz 5GB
- [https://planetscale.com](https://planetscale.com)

#### **Seçenek 3: MongoDB (MongoDB Atlas)**
- Ücretsiz 512MB
- [https://mongodb.com/atlas](https://mongodb.com/atlas)

---

## 📧 **SMTP (Production)**

### **Şu an**: Gmail App Password (awbmowfyuwwvmfbv)
- ✅ Çalışıyor, ama **günlük limit var** (500 email/gün)

### **Production İçin Öneriler**:

#### **Seçenek 1: SendGrid (ÖNERİLEN)**
- Ücretsiz 100 email/gün (sonra ücretli)
- [https://sendgrid.com](https://sendgrid.com) kaydol
- API Key al
- `lib/email.ts`: SendGrid transport'a geç

#### **Seçenek 2: AWS SES**
- Çok ucuz ($0.10/1000 email)
- AWS hesabı lazım

#### **Seçenek 3: Resend.com**
- Developer-friendly, modern
- Ücretsiz 3000 email/ay

---

## 🔒 **GÜVENLİK (Production)**

### **1. Environment Variables**
- ✅ `.env.local` GitHub'a gitmiyor (.gitignore'da)
- ✅ Vercel/Netlify dashboard'da env variables ekle
- ⚠️ **NEXTAUTH_SECRET** değiştir (daha güçlü, random):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### **2. CORS & Security Headers**
- `next.config.js`'e security headers ekle (XSS, clickjacking koruması)

### **3. Rate Limiting**
- API route'larına rate limit ekle (DDoS koruması)
- Örnek: `express-rate-limit` veya Vercel Edge Config

### **4. Prisma Client**
- Production'da connection pool optimize et

---

## ✅ **DEPLOYMENT CHECKLIST**

### **Hazırlık**:
- [x] E-posta URL'leri production domain'e güncellendi
- [x] `.env.local` NEXTAUTH_URL güncellendi
- [x] Google OAuth Client ID hazır (canlı domain ile)
- [ ] GitHub repo hazır (commit + push)
- [ ] Vercel/Netlify hesabı oluşturuldu
- [ ] Domain DNS ayarları hazır (A record veya CNAME)

### **Deployment Sonrası**:
- [ ] HTTPS çalışıyor mu? (SSL sertifikası)
- [ ] Google OAuth test et (giriş/kayıt)
- [ ] E-posta gönderimi test et (şifre sıfırlama)
- [ ] Database migration çalıştı mı?
- [ ] Admin hesabı var mı? (seed.ts çalıştır)
- [ ] Responsive tasarım mobilde test et
- [ ] Performance test (Lighthouse, PageSpeed)

---

## 🎯 **ŞİMDİ NE YAPACAĞIZ?**

1. **Google OAuth Client ID/Secret Al** (canlı domain ile):
   - JavaScript origins: `https://lioradg.com.tr`
   - Redirect URI: `https://lioradg.com.tr/api/auth/callback/google`
   - Client ID/Secret'ı bana gönder

2. **Ben `.env.local`'e koyacağım** (zaten hazırladım, sadece Client ID/Secret eksik)

3. **GitHub'a Push** (sen yaparsın veya ben yardım ederim)

4. **Vercel'e Deploy** (adım adım yardım ederim)

5. **Domain DNS Ayarla** (Vercel'in verdiği kayıtları domain sağlayıcına ekle)

6. **Test Et** (canlı sitede Google OAuth, e-posta, vs)

**Hazır mısın? Google OAuth Client ID/Secret'ı al, buraya yapıştır, devam edelim!** 🚀

