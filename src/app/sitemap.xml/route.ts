export async function GET() {
  const base = process.env.APP_URL || 'http://localhost:3000';
  const now = new Date().toISOString();
  
  const urls = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/policy', priority: '0.3', changefreq: 'monthly' },
    { url: '/consent', priority: '0.3', changefreq: 'monthly' }
  ].map(({ url, priority, changefreq }) => 
    `<url>
      <loc>${base}${url}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`
  ).join('');
  
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
  
  return new Response(body, { 
    headers: { 
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400'
    } 
  });
}

