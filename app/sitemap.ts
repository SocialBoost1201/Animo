import type { MetadataRoute } from 'next';

const BASE_URL = 'https://club-animo.com';

export default function sitemap(): MetadataRoute.Sitemap {
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
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/reserve', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/recruit/cast', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/recruit/staff', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
