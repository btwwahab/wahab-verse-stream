// Serverless function to proxy TMDb API requests
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get endpoint from the request
    const { endpoint } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint parameter is required' });
    }

    // Build the TMDb API URL with the secret API key
    const apiKey = process.env.TMDB_API_KEY;
    const tmdbBaseUrl = 'https://api.themoviedb.org/3';
    const url = `${tmdbBaseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;

    // Make the request to TMDb
    const response = await axios.get(url);
    
    // Return the data
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('TMDb API Error:', error);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.status_message || 'Something went wrong'
    });
  }
};