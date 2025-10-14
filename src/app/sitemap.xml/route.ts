export async function GET() {
  const base = process.env.APP_URL || 'http://localhost:3000';
  const urls = ['', '/policy', '/consent'].map((p) => `<url><loc>${base}${p}</loc></url>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

