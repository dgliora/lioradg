# Google OAuth Test Adımları

## Localhost Test:

1. Terminal'de `npm run dev` çalıştır
2. Tarayıcıda `http://localhost:3000/giris` aç
3. F12 bas (Developer Tools)
4. **Console** sekmesini aç
5. **Network** sekmesini aç
6. "Google ile Giriş Yap" butonuna tıkla
7. Google hesabını seç
8. Geri yönlendirildikten sonra:

### Console'da Kontrol Et:
- Kırmızı hata var mı?
- NextAuth ile ilgili log var mı?

### Network'te Kontrol Et:
- `/api/auth/callback/google` isteği var mı?
- Status code ne? (200, 302, 400?)
- Response ne döndü?

### Application/Storage'da Kontrol Et:
- Application sekmesi → Cookies → `http://localhost:3000`
- `next-auth.session-token` cookie'si var mı?
- Varsa içeriği ne?

## Sonuçları Buraya Yaz:

**Console Hataları:**
```
(buraya yapıştır)
```

**Network `/api/auth/callback/google` Response:**
```
(buraya yapıştır)
```

**Cookies:**
```
next-auth.session-token: VAR / YOK
```

**Terminal (npm run dev) Çıktısı:**
```
(buraya yapıştır)
```
