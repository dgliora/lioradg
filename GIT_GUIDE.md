# 🎯 LIORADG - GIT KULLANIM KILAVUZU

## 📦 Git Repository Bilgileri

**Proje:** Lioradg E-Commerce Platform  
**Branch:** master  
**Son Commit:** 1ab3f5b  
**Toplam Dosya:** 178 files  
**Toplam Satır:** 19,093 insertions  

---

## 🚀 TEMEL GIT KOMUTLARI

### 1️⃣ Durum Kontrolü
```bash
git status
```
Çalışma dizinindeki değişiklikleri gösterir.

### 2️⃣ Değişiklikleri Görüntüleme
```bash
git diff                    # Henüz stage edilmemiş değişiklikler
git diff --staged          # Stage edilmiş değişiklikler
git diff HEAD              # Tüm değişiklikler
```

### 3️⃣ Dosya Ekleme
```bash
git add .                  # Tüm değişiklikleri ekle
git add app/              # Sadece app klasörünü ekle
git add *.tsx             # Sadece .tsx dosyalarını ekle
```

### 4️⃣ Commit Yapma
```bash
# Basit commit
git commit -m "Sepet sayfası düzeltildi"

# Detaylı commit
git commit -m "feat: Sepet sayfası ürün görselleri eklendi" -m "- Product.images kullanıldı
- Next.js Image optimize edildi
- Mini cart ile tutarlılık sağlandı"
```

### 5️⃣ Commit Geçmişi
```bash
git log                           # Detaylı log
git log --oneline                # Kısa log
git log --oneline --graph --all  # Görsel log
git log -5                        # Son 5 commit
```

### 6️⃣ Geri Alma İşlemleri
```bash
# Çalışma dizinindeki değişiklikleri geri al
git restore app/sepet/page.tsx

# Stage'den çıkar (ama değişiklikleri koru)
git restore --staged app/sepet/page.tsx

# Son commit'i geri al (değişiklikler korunur)
git reset --soft HEAD~1

# Son commit'i tamamen sil (DİKKAT!)
git reset --hard HEAD~1
```

---

## 🌿 BRANCH YÖNETİMİ

### Yeni Branch Oluşturma
```bash
# Yeni branch oluştur ve geç
git checkout -b feature/admin-panel

# Veya modern syntax
git switch -c feature/admin-panel
```

### Branch Değiştirme
```bash
git checkout master
# veya
git switch master
```

### Branch Listeleme
```bash
git branch              # Lokal branch'ler
git branch -a           # Tüm branch'ler
git branch -v           # Detaylı liste
```

### Branch Silme
```bash
git branch -d feature/old-feature     # Güvenli silme
git branch -D feature/old-feature     # Zorla silme
```

### Branch Birleştirme
```bash
# master'a geç
git checkout master

# Feature branch'ini birleştir
git merge feature/admin-panel
```

---

## 🎨 ÖNERİLEN WORKFLOW

### Günlük Çalışma Akışı:

**1. Yeni Özellik Başlat**
```bash
git checkout -b feature/kampanya-yonetimi
```

**2. Çalış & Test Et**
```bash
# Kodları yaz...
npm run dev
npm run lint
```

**3. Commit Et**
```bash
git add .
git commit -m "feat: Kampanya yönetimi eklendi"
```

**4. Master'a Birleştir**
```bash
git checkout master
git merge feature/kampanya-yonetimi
git branch -d feature/kampanya-yonetimi
```

---

## 📝 COMMIT MESAJ STANDARTLARI

### Conventional Commits Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Örnekleri:
- **feat:** Yeni özellik
- **fix:** Bug düzeltme
- **refactor:** Kod iyileştirme
- **style:** Tasarım değişikliği
- **docs:** Dokümantasyon
- **test:** Test ekleme
- **chore:** Genel işler

### Örnekler:
```bash
# Yeni özellik
git commit -m "feat(sepet): Ürün görselleri eklendi"

# Bug fix
git commit -m "fix(header): Mini cart hover düzeltildi"

# Refactoring
git commit -m "refactor(cart): CartStore optimize edildi"

# Stil değişikliği
git commit -m "style(button): Hover efekti iyileştirildi"

# Dokümantasyon
git commit -m "docs: README güncellendi"
```

---

## 🔍 KULLANIŞLI KOMUTLAR

### Dosya Arama
```bash
# Hangi commit'te değişti?
git log --follow app/sepet/page.tsx

# Kim değiştirdi?
git blame app/sepet/page.tsx

# Kelime ara
git grep "useCartStore"
```

### Temizlik
```bash
# Untracked dosyaları sil (DİKKAT!)
git clean -n              # Önizleme
git clean -f              # Silme

# Tüm değişiklikleri geri al
git reset --hard HEAD
```

### Stash (Geçici Kayıt)
```bash
# Değişiklikleri sakla
git stash

# Saklananları listele
git stash list

# Geri getir
git stash pop

# Son saklanı uygula (stash'te bırak)
git stash apply
```

---

## 🎯 PROJE-SPESİFİK WORKFLOW

### Yeni Özellik Eklerken:
```bash
# 1. Feature branch oluştur
git checkout -b feature/yeni-ozellik

# 2. Değişiklikleri yap
# ... kod yaz ...

# 3. Test et
npm run dev
npm run lint

# 4. Commit et
git add .
git commit -m "feat: Yeni özellik eklendi"

# 5. Master'a geç
git checkout master

# 6. Birleştir
git merge feature/yeni-ozellik

# 7. Branch'i temizle
git branch -d feature/yeni-ozellik

# 8. Yedek al (opsiyonel)
# PowerShell'de zip oluştur
```

### Bug Düzeltirken:
```bash
# 1. Hotfix branch
git checkout -b hotfix/sepet-resim-hatasi

# 2. Düzelt
# ... bug fix ...

# 3. Test
npm run dev

# 4. Commit
git commit -m "fix(sepet): Ürün resimleri düzeltildi"

# 5. Master'a merge
git checkout master
git merge hotfix/sepet-resim-hatasi
git branch -d hotfix/sepet-resim-hatasi
```

---

## 📊 PROJE İSTATİSTİKLERİ

### İstatistik Komutları:
```bash
# Toplam commit sayısı
git rev-list --count HEAD

# Contributor istatistikleri
git shortlog -sn

# Dosya değişim sayısı
git log --stat

# En çok değişen dosyalar
git log --format=format: --name-only | egrep -v '^$' | sort | uniq -c | sort -r | head -10
```

---

## 🛡️ ALINAN TEDBİRLER

### .gitignore İçeriği:
```
✅ node_modules/      - Bağımlılıklar (390MB+)
✅ .next/             - Build dosyaları
✅ .env*              - Hassas bilgiler
✅ prisma/*.db        - Veritabanı (dev)
✅ *.log              - Log dosyaları
```

### Commit Edilen:
```
✅ Tüm kaynak kodlar
✅ Public assets (images)
✅ Prisma schema & migrations
✅ Config dosyaları
✅ TypeScript definitions
✅ Documentation
```

---

## 🚨 UYARILAR

### ❌ YAPMAYIN:
- **node_modules/** commit etmeyin
- **.env** dosyalarını commit etmeyin
- **Büyük binary dosyalar** eklemeyin (>10MB)
- **force push** yapmayın: `git push --force`
- **master'da direkt çalışmayın** (feature branch kullanın)

### ✅ YAPIN:
- **Sık sık commit** edin
- **Açıklayıcı mesajlar** yazın
- **Feature branch** kullanın
- **Test ettikten sonra** commit edin
- **Küçük, anlamlı** commit'ler yapın

---

## 🔗 REMOTE REPOSITORY (GitHub/GitLab)

### Gelecekte Remote Eklemek İçin:

**GitHub:**
```bash
git remote add origin https://github.com/kullaniciadi/lioradg.git
git branch -M main
git push -u origin main
```

**GitLab:**
```bash
git remote add origin https://gitlab.com/kullaniciadi/lioradg.git
git push -u origin master
```

**Remote Kontrol:**
```bash
git remote -v
git remote show origin
```

---

## 📚 KAYNAKLAR

- **Git Documentation:** https://git-scm.com/doc
- **Conventional Commits:** https://www.conventionalcommits.org/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Interactive Tutorial:** https://learngitbranching.js.org/

---

## 🎉 GIT HAZIR!

**Repository Durumu:**
```
✅ Git initialized
✅ .gitignore configured
✅ Initial commit created
✅ 178 files tracked
✅ Ready for development
```

**Sonraki Adımlar:**
1. Feature branch'leri ile çalışın
2. Düzenli commit yapın
3. İhtiyaç halinde GitHub/GitLab'a push edin
4. Backup'ları hem Git hem ZIP olarak tutun

**Happy Coding! 🚀**

