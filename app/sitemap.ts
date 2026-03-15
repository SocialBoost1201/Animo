import type { MetadataRoute } from 'next';
import { getPublicCasts, getPublicContents } from '@/lib/actions/public/data';

const BASE_URL = 'https://club-animo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [casts, news] = await Promise.all([
    getPublicCasts().catch(() => []),
    getPublicContents('news').catch(() => []),
  ]);

  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/shift', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/cast', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/system', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/guide', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/concept', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/news', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/access', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/recruit/cast', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/recruit/staff', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // SEO / GEO New Pages
    { path: '/guide/first-time', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/guide/price', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about/kannai-cabaret', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about/bashamichi-lounge', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/area/kannai-nightlife', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/area/kannai-compare', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/area/kannai-lounge-recommend', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/area/yokohama-cabaret-guide', priority: 0.7, changeFrequency: 'monthly' as const },
    
    // Blog / Content SEO Pages
    { path: '/blog/how-to-choose-cabaret', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/kannai-nightspots', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/yokohama-lounge-ranking', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/cabaret-beginner', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog/business-entertainment', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const castEntries: MetadataRoute.Sitemap = (casts || []).map((cast: { slug: string; updated_at?: string; created_at?: string }) => ({
    url: `${BASE_URL}/cast/${cast.slug}`,
    lastModified: new Date(cast.updated_at || cast.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const newsEntries: MetadataRoute.Sitemap = (news || []).map((post: { id: string; updated_at?: string; created_at?: string }) => ({
    url: `${BASE_URL}/news/${post.id}`,
    lastModified: new Date(post.updated_at || post.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...castEntries, ...newsEntries];
}
