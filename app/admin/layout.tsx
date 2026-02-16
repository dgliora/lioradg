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

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoginPage = pathname === '/admin/giris'

  if (isLoginPage) {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Ürünler', href: '/admin/urunler', icon: '📦' },
    { name: 'Kategoriler', href: '/admin/kategoriler', icon: '🏷️' },
    { name: 'Siparişler', href: '/admin/siparisler', icon: '🛒' },
    { name: 'Kampanyalar', href: '/admin/kampanyalar', icon: '🎁' },
    { name: 'Müşteriler', href: '/admin/musteriler', icon: '👥' },
    { name: 'Ayarlar', href: '/admin/ayarlar', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-3">
                <LogoLioraDG 
                  variant="full"
                  width={140}
                  height={35}
                  className="text-sage"
                  showImage={true}
                />
                <span className="text-lg font-semibold text-neutral-medium">Admin</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Siteyi Görüntüle →
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="text-sm font-medium">{session?.user?.name || 'Admin'}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/giris' })}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
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
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-[calc(100vh-73px)]">
          <Suspense fallback={<AdminContentFallback />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminSessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminSessionProvider>
  )
}

