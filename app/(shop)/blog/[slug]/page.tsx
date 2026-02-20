import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lioradg.com.tr'

interface Props { params: { slug: string } }

async function getPost(slug: string) {
  return await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Yazı Bulunamadı' }

  const title = post.metaTitle ? `${post.metaTitle} | Lioradg` : `${post.title} | Lioradg`
  const description = post.metaDescription || post.excerpt
  const canonical = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`)
    : undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lioradg',
      locale: 'tr_TR',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'Lioradg', logo: { '@type': 'ImageObject', url: `${baseUrl}/images/logo/logo.jpg` } },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${baseUrl}/blog/${post.slug}`,
    ...(post.coverImage && { image: post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}` }),
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Geri */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-neutral-medium hover:text-sage mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Blog'a Dön
        </Link>

        {/* Etiketler */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.split(',').map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-sage/10 text-sage rounded-full font-medium">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Başlık */}
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-neutral-medium mb-8 pb-6 border-b border-warm-200">
          <span className="font-medium text-sage">{post.author}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {post.readingTime} dk okuma
          </span>
        </div>

        {/* Kapak Görseli */}
        {post.coverImage && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* İçerik */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-neutral prose-p:text-neutral-medium prose-p:leading-relaxed prose-a:text-sage prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral prose-li:text-neutral-medium prose-h2:text-2xl prose-h3:text-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-sage/10 to-warm-100 rounded-2xl border border-sage/20 text-center">
          <p className="text-lg font-serif font-semibold text-neutral mb-2">Ürünlerimizi Keşfedin</p>
          <p className="text-sm text-neutral-medium mb-4">Doğal ve bitkisel kozmetik ürünlerimizi inceleyin</p>
          <Link
            href="/urunler"
            className="inline-block bg-sage hover:bg-sage-dark text-white font-medium px-8 py-3 rounded-xl transition-colors"
          >
            Tüm Ürünler
          </Link>
        </div>
      </article>
    </div>
  )
}
