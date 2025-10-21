export const dynamic = 'force-static';

export async function GET() {
  const base = 'https://banemzi.ru';
  const body = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages
Allow: /policy
Allow: /consent

# Sitemap location
Sitemap: ${base}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;
  
  return new Response(body, { 
    headers: { 
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    } 
  });
}

