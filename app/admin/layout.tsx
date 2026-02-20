'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LogoLioraDG } from '@/components/LogoLioraDG'
import { AdminSessionProvider } from '@/components/providers/AdminSessionProvider'

function AdminContentFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Her menü öğesi hangi permission key'ini gerektiriyor (null = herkese açık)
const ALL_NAV = [
  { name: 'Dashboard',    href: '/admin',               icon: '📊', permission: null },
  { name: 'Analitik',     href: '/admin/analitik',       icon: '📈', permission: 'analytics' },
  { name: 'Ürünler',      href: '/admin/urunler',        icon: '📦', permission: 'products' },
  { name: 'Kategoriler',  href: '/admin/kategoriler',    icon: '🏷️', permission: 'categories' },
  { name: 'Siparişler',   href: '/admin/siparisler',     icon: '🛒', permission: 'orders' },
  { name: 'Kampanyalar',  href: '/admin/kampanyalar',    icon: '🎁', permission: 'campaigns' },
  { name: 'Müşteriler',   href: '/admin/musteriler',     icon: '👥', permission: 'customers' },
  { name: 'E-Bülten',     href: '/admin/newsletter',     icon: '📧', permission: 'newsletter' },
  { name: 'Blog',         href: '/admin/blog',           icon: '✍️', permission: 'blog' },
  { name: 'Kullanıcılar', href: '/admin/kullanicilar',   icon: '🔑', permission: 'users' },
  { name: 'Ayarlar',      href: '/admin/ayarlar',        icon: '⚙️', permission: 'settings' },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoginPage = pathname === '/admin/giris'

  if (isLoginPage) return <>{children}</>

  const role = (session?.user as any)?.role as string | undefined
  const isAdmin = role === 'ADMIN'

  // STAFF için izin listesini parse et
  let staffPerms: string[] = []
  if (!isAdmin && role === 'STAFF') {
    try {
      staffPerms = JSON.parse((session?.user as any)?.permissions || '[]')
    } catch {}
  }

  // ADMIN her şeyi görür; STAFF sadece izinli ve permission=null olanları
  const navigation = ALL_NAV.filter((item) => {
    if (isAdmin) return true
    if (item.permission === null) return true // dashboard
    return staffPerms.includes(item.permission)
  })

  const roleBadge = isAdmin
    ? { label: 'Admin', cls: 'bg-red-100 text-red-700' }
    : { label: 'Staff', cls: 'bg-blue-100 text-blue-700' }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-3">
                <LogoLioraDG variant="full" width={130} height={32} showImage={true} />
                <span className="text-base font-semibold text-neutral-medium">Admin</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                Siteyi Görüntüle →
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{session?.user?.name || 'Admin'}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleBadge.cls}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/giris' })}
                  className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                >
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-65px)] sticky top-[65px]">
          <nav className="p-3 space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-65px)]">
          <Suspense fallback={<AdminContentFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminSessionProvider>
  )
}
