// NextAuth v5 için basit auth helper
// API route'larında kullanım için
export async function checkAdminAuth() {
  // Şimdilik basit bir kontrol, production'da daha güvenli olmalı
  // NextAuth session kontrolü header'dan veya cookie'den yapılabilir
  return { isAdmin: true } // Geliştirme aşamasında bypass
}

