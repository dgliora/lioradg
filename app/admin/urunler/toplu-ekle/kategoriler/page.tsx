import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button, Card } from '@/components/ui'

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function CategoriesListPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori ID Listesi</h1>
          <p className="text-gray-600">Excel dosyanızda kullanmak için kategori ID'lerini kopyalayın</p>
        </div>
        <Link href="/admin/urunler/toplu-ekle">
          <Button variant="outline">← Geri Dön</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kategori Adı</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kategori ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Slug</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {category.icon && <span className="text-xl">{category.icon}</span>}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">
                      {category.id}
                    </code>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {category.slug}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz kategori eklenmemiş</p>
            <Link href="/admin/kategoriler/yeni" className="mt-4 inline-block">
              <Button>Kategori Ekle</Button>
            </Link>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">💡 Nasıl Kullanılır?</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">1.</span>
            <span>Excel dosyanızdaki <strong>"Kategori"</strong> sütununa yukarıdaki tablodan <strong>Kategori ID</strong>'yi kopyalayın</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">2.</span>
            <span>Her ürün için doğru kategori ID'sini girdiğinizden emin olun</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage font-bold">3.</span>
            <span>Kategori ID'si olmayan ürünler eklenemez</span>
          </li>
        </ol>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>📋 Örnek:</strong> "Bitkisel Yağlar" kategorisine ürün eklemek için Excel'deki Kategori sütununa bu kategorinin ID'sini yazın.
          </p>
        </div>
      </Card>
    </div>
  )
}
