export async function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: ${process.env.APP_URL || 'http://localhost:3000'}/sitemap.xml`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}

