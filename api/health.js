export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.json({ 
    status: 'OK', 
    message: 'Smart House Locator API is running on Vercel',
    database: 'Supabase',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
