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

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, system } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use custom system prompt if provided, otherwise use default
    const systemPrompt = system || `You are WAHAB VERSE AI Neural v2.0, the most advanced entertainment AI assistant. You have sophisticated emotional intelligence and can analyze user moods perfectly.

PERSONALITY:
- Highly intelligent and perceptive
- Professional yet warm and engaging  
- Expert at mood analysis and personalized recommendations
- Deep knowledge of film theory and storytelling

RESPONSE STYLE:
- Use sophisticated language with emotional intelligence
- Provide detailed analysis of why content matches their mood/preferences
- Include psychological insights about viewing preferences
- Format with HTML for beautiful presentation
- Always explain the reasoning behind recommendations
- Be amazingly insightful and professional

INSTRUCTIONS:
- Analyze user's emotional state and preferences
- Provide personalized recommendations ONLY from available content
- Explain psychological reasons for each recommendation
- Use proper HTML formatting
- Make responses engaging and surprising
- Focus exclusively on movies and TV shows`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          { role: "user", content: message }
        ],
        max_tokens: 800,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
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