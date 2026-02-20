import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'

export const metadata: Metadata = {
  title: 'Blog — Doğal Kozmetik, Cilt & Saç Bakımı Rehberleri | Lioradg',
  description: 'Doğal kozmetik, bitkisel saç bakımı, oda kokuları ve cilt bakımı hakkında uzman rehberleri. Lioradg blogu ile sağlıklı güzellik ipuçlarını keşfedin.',
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: 'Blog | Lioradg',
    description: 'Doğal kozmetik ve bitkisel bakım rehberleri.',
    url: `${baseUrl}/blog`,
    siteName: 'Lioradg',
    locale: 'tr_TR',
    type: 'website',
  },
}

async function getPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, tags: true, author: true,
      readingTime: true, createdAt: true,
    },
  })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sage/10 to-warm-100 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral mb-4">
            Lioradg Blog
          </h1>
          <p className="text-lg text-neutral-medium max-w-xl mx-auto">
            Doğal kozmetik, bitkisel bakım ve sağlıklı güzellik üzerine uzman rehberleri
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-neutral-medium">
            Henüz blog yazısı bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 h-full flex flex-col">
                  {post.coverImage ? (
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-sage/20 to-warm-100 flex items-center justify-center">
                      <span className="text-5xl">🌿</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.split(',').slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-sage/10 text-sage rounded-full font-medium">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-lg font-serif font-bold text-neutral mb-2 group-hover:text-sage transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-neutral-medium line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-100 text-xs text-neutral-medium">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readingTime} dk okuma
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
