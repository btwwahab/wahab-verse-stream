// Serverless function to proxy AI chat requests
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const message = req.body.message;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Make request to Groq API with the secret API key
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are WAHAB VERSE AI, specialized in movies and TV shows ONLY. Never discuss non-entertainment topics.

IMPORTANT FORMATTING RULES:
- When recommending movies/shows, format titles with **bold** markdown
- Use bullet points (•) for lists
- Separate each recommendation with line breaks
- Include brief descriptions after titles
- Use emojis to make responses engaging

Example format:
**The Dark Knight** (2008) 🦇
A masterpiece superhero film with incredible performances.

**Inception** (2010) 🌀  
Mind-bending sci-fi thriller about dreams within dreams.

Always redirect to movies/TV if asked about other topics.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 400,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Something went wrong'
    });
  }
};