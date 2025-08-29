module.exports = function handler(req, res) {
  res.json({ 
    message: 'Hello from Vercel API!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
