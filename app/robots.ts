import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
