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

          CRITICAL INSTRUCTIONS:
          - ONLY recommend movies/shows from the provided AVAILABLE CONTENT list
          - Never suggest movies not in the available content list
          - When recommending, use the exact movie titles from the list
          - Format movie titles in **bold** markdown
          - Include brief descriptions and ratings when available
          - If asked about unavailable content, redirect to available alternatives

          IMPORTANT FORMATTING RULES:
          - Use **bold** markdown for movie titles
          - Use bullet points (•) for lists
          - Include year and genre information
          - Use emojis to make responses engaging
          - Keep recommendations concise but informative

          Example format for recommendations:
          **Movie Title** (Year) 🎬
          Brief description with genre and rating info.

          Always redirect to movies/TV if asked about other topics and remind users you only discuss content available on WAHAB VERSE platform.`
          },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
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