import type { MetadataRoute } from 'next';

import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', "/api/internal", '/api/admin', '/api/admin/*'],
      },
    ],
    sitemap: `${env.APP_URL}/sitemap.xml`,
    host: env.APP_URL,
  };
}
