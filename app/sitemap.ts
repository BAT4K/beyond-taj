import { MetadataRoute } from 'next';
import { getAllBlogs } from '@/lib/blogs';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = getAllBlogs();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyondtaj.in';

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/journal/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const destinations = await prisma.destination.findMany({ select: { id: true } });
  const destinationEntries: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${baseUrl}/destinations/${dest.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/review`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
    ...destinationEntries,
  ];
}
