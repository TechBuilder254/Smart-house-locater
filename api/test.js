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
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    supabaseUrl: process.env.SUPABASE_URL ? 'Configured' : 'Missing',
    supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Configured' : 'Missing'
  });
}
