require('dotenv').config();
function firewalls(req, res, next) {
  const apiKey = req.headers['japri-key'];
  const allowedApiKeys = process.env.API_KEYS;

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = { firewalls };