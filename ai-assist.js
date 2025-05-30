// === AI Chat Assistant Integration ===
function setupAIChat() {
    const aiToggle = document.getElementById('aiAssistantToggle');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatMessages = document.getElementById('aiChatMessages');

    // Open AI Chat Modal when clicking the floating button
    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            // Show notification first
            showNotification('🚀 Initializing Neural Experience...', 'info');

            // Wait a moment then open AI modal
            setTimeout(() => {
                const modal = new bootstrap.Modal(document.getElementById('aiChatModal'));
                modal.show();

                // Focus on input and add welcome message
                setTimeout(() => {
                    if (aiChatInput) aiChatInput.focus();

                    if (aiChatMessages) {
                        aiChatMessages.innerHTML = `
              <div style="margin-bottom: 15px; padding: 12px; background: var(--bg-glass); border-radius: 15px; border-left: 4px solid var(--primary);">
                <div style="color: var(--primary); font-weight: 600; margin-bottom: 8px;">
                  <i class="fas fa-robot me-2"></i>WAHAB VERSE AI Experience
                </div>
                <div style="color: var(--text-primary); line-height: 1.6; font-size: 1rem;">
                  🎯 <strong style="color: var(--accent);">Neural Connection Established!</strong>
                  <br><br>
                  Welcome to your personalized entertainment universe! I'm your AI companion, trained on thousands of movies and shows to give you the perfect recommendations.
                  <br><br>
                  <strong style="color: var(--secondary);">Experience Features:</strong><br>
                  🎬 Smart movie recommendations<br>
                  📺 Personalized TV series suggestions<br>
                  🎭 Genre exploration and analysis<br>
                  ⭐ Ratings and reviews insights<br>
                  <br>
                  What type of entertainment experience are you looking for today?
                </div>
              </div>
            `;
                        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
                    }
                }, 500);

                // Update notification
                showNotification('🤖 WAHAB VERSE AI Assistant is ready! Start chatting.', 'success');
            }, 1000);
        });
    }

    // SOLID function to check if message is movie/TV related
    function isMovieRelated(message) {
        const lowerMessage = message.toLowerCase().trim();

        // BLOCKED TOPICS
        const strictlyBlocked = [
            'html', 'css', 'javascript', 'programming', 'code', 'coding', 'web', 'website', 'developer',
            'politics', 'politician', 'election', 'government', 'president', 'minister', 'vote',
            'health', 'medicine', 'doctor', 'disease', 'symptoms', 'treatment', 'medical', 'covid',
            'finance', 'money', 'investment', 'stock', 'crypto', 'bitcoin', 'loan', 'bank', 'salary',
            'weather', 'temperature', 'rain', 'snow', 'climate', 'forecast',
            'math', 'mathematics', 'calculation', 'equation', 'algebra', 'geometry',
            'science', 'physics', 'chemistry', 'biology', 'research', 'experiment',
            'history', 'historical', 'war', 'battle', 'ancient', 'civilization',
            'geography', 'country', 'capital', 'continent', 'mountain', 'river',
            'cooking', 'recipe', 'food', 'restaurant', 'meal', 'dinner', 'lunch',
            'travel', 'vacation', 'hotel', 'flight', 'tourist', 'destination',
            'sports', 'football', 'basketball', 'cricket', 'soccer', 'tennis', 'olympics',
            'news', 'breaking', 'current events', 'newspaper', 'journalist',
            'personal', 'relationship', 'dating', 'marriage', 'family', 'advice', 'help me',
            'technology', 'computer', 'software', 'hardware', 'tech', 'gadget', 'phone',
            'business', 'company', 'job', 'career', 'work', 'office', 'meeting',
            'education', 'school', 'university', 'college', 'study', 'exam', 'homework',
            'religion', 'god', 'church', 'temple', 'prayer', 'spiritual'
        ];

        // Check for blocked content first
        const hasBlockedContent = strictlyBlocked.some(blocked =>
            lowerMessage.includes(blocked) ||
            lowerMessage.split(' ').includes(blocked)
        );

        if (hasBlockedContent) {
            return false; // REJECT
        }

        // ALLOWED KEYWORDS
        const allowedKeywords = [
            'movie', 'movies', 'film', 'films', 'cinema', 'tv', 'television', 'series', 'show', 'shows',
            'actor', 'actress', 'director', 'producer', 'cast', 'star', 'celebrity',
            'drama', 'comedy', 'action', 'horror', 'thriller', 'sci-fi', 'science fiction',
            'romance', 'animation', 'documentary', 'fantasy', 'adventure', 'mystery',
            'crime', 'western', 'musical', 'biographical', 'historical drama',
            'recommend', 'recommendation', 'suggest', 'suggestion', 'watch', 'watching',
            'stream', 'streaming', 'download', 'episode', 'season', 'sequel', 'prequel',
            'plot', 'story', 'storyline', 'character', 'characters', 'ending',
            'trailer', 'review', 'rating', 'ratings', 'critics',
            'netflix', 'disney', 'marvel', 'dc', 'hbo', 'amazon prime', 'hulu',
            'oscar', 'academy award', 'golden globe', 'emmy', 'cannes', 'sundance',
            'award', 'nomination', 'winner',
            'hollywood', 'bollywood', 'box office', 'blockbuster', 'indie', 'independent',
            'remake', 'reboot', 'adaptation', 'franchise',
            'anime', 'cartoon', 'animated', 'sitcom', 'soap opera', 'miniseries',
            'web series', 'short film', 'feature film',
            'imdb', 'rotten tomatoes', 'metacritic', 'tmdb'
        ];

        // Check if message contains allowed keywords
        const hasMovieContent = allowedKeywords.some(keyword =>
            lowerMessage.includes(keyword)
        );

        return hasMovieContent;
    }

    function addMessage(sender, message) {
        if (!aiChatMessages) return;

        const isUser = sender === 'user';
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
      margin-bottom: 15px; 
      padding: 12px; 
      background: ${isUser ? 'var(--bg-glass-strong)' : 'var(--bg-glass)'}; 
      border-radius: 15px; 
      border-left: 4px solid ${isUser ? 'var(--secondary)' : 'var(--primary)'};
    `;

        messageDiv.innerHTML = `
      <div style="color: ${isUser ? 'var(--secondary)' : 'var(--primary)'}; font-weight: 600; margin-bottom: 8px;">
        <i class="fas fa-${isUser ? 'user' : 'robot'} me-2"></i>${isUser ? 'You' : 'WAHAB VERSE AI'}
      </div>
      <div style="color: var(--text-primary); line-height: 1.6; font-size: 1rem;">
        ${message}
      </div>
    `;

        aiChatMessages.appendChild(messageDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    async function sendToGrok(message) {
        if (!aiChatMessages) return;

        // STRICT CHECK - Block non-movie content immediately
        if (!isMovieRelated(message)) {
            addMessage('user', message);
            addMessage('ai', `🚫 I'm WAHAB VERSE AI - I only discuss movies and TV shows!

🎬 I can help you with:
• Movie recommendations
• TV series suggestions  
• Genre explanations
• Actor/Director information
• Plot summaries & reviews
• Streaming platform advice
• Entertainment ratings

Please ask me something about movies or TV shows! 🍿`);
            return; // STOP HERE
        }

        // Show user message
        addMessage('user', message);

        // Show AI typing indicator
        const typingId = 'ai-typing-' + Date.now();
        aiChatMessages.innerHTML += `
      <div id="${typingId}" style="margin-bottom: 15px; padding: 12px; background: var(--bg-glass); border-radius: 15px; border-left: 4px solid var(--primary);">
        <div style="color: var(--primary); font-weight: 600; margin-bottom: 5px;">
          <i class="fas fa-robot me-2"></i>WAHAB VERSE AI
        </div>
        <div style="color: var(--text-secondary);">
          <i class="fas fa-spinner fa-spin me-2"></i>Analyzing your request...
        </div>
      </div>
    `;
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        try {
            // Use our API proxy instead of direct Groq API call
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiReply = data.choices[0].message.content;

                // Enhanced formatting for better readability
                aiReply = formatAIResponse(aiReply);
                addMessage('ai', aiReply);
            } else {
                addMessage('ai', 'Sorry, I couldn\'t process that movie/TV request. Please try again! 🎬');
            }

        } catch (error) {
            console.error('AI API Error:', error);

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            addMessage('ai', 'Neural connection error! Please check your internet connection and try again. 🔌');
        }
    }

    // New function to format AI responses with better styling
    function formatAIResponse(text) {
        // Convert markdown-style **bold** to HTML bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--accent); font-weight: 700;">$1</strong>');

        // Make bullet points more visible
        text = text.replace(/•/g, '<span style="color: var(--primary); font-weight: bold;">•</span>');

        // Add spacing around line breaks for better readability
        text = text.replace(/\n/g, '<br><br>');

        // Style movie years with special color
        text = text.replace(/\((\d{4})\)/g, '<span style="color: var(--secondary); font-weight: 600;">($1)</span>');

        // Style ratings if present (like 8.5/10 or 4.5/5)
        text = text.replace(/(\d+\.?\d*\/\d+)/g, '<span style="color: var(--accent); font-weight: 600; background: var(--bg-glass); padding: 2px 6px; border-radius: 8px;">$1</span>');

        return text;
    }

    function handleSend() {
        if (!aiChatInput) return;

        const message = aiChatInput.value.trim();
        if (!message) return;

        aiChatInput.value = "";
        sendToGrok(message);
    }

    // Event listeners
    if (aiChatSend) {
        aiChatSend.addEventListener('click', handleSend);
    }

    if (aiChatInput) {
        aiChatInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
            }
        });
    }
}

// Rest of the code remains the same...
function startExperience() {
    // Show notification first
    showNotification('🚀 Initializing Neural Experience...', 'info');

    // Wait a moment then open AI modal
    setTimeout(() => {
        const aiChatModal = document.getElementById('aiChatModal');
        if (!aiChatModal) {
            console.error('AI Chat modal not found');
            return;
        }

        const modal = new bootstrap.Modal(aiChatModal);
        modal.show();

        // Focus on input and add welcome message
        setTimeout(() => {
            const aiChatInput = document.getElementById('aiChatInput');
            const aiChatMessages = document.getElementById('aiChatMessages');

            if (aiChatInput) aiChatInput.focus();

            if (aiChatMessages) {
                aiChatMessages.innerHTML = `
          <div style="margin-bottom: 15px; padding: 12px; background: var(--bg-glass); border-radius: 15px; border-left: 4px solid var(--primary);">
            <div style="color: var(--primary); font-weight: 600; margin-bottom: 8px;">
              <i class="fas fa-robot me-2"></i>WAHAB VERSE AI Experience
            </div>
            <div style="color: var(--text-primary); line-height: 1.6; font-size: 1rem;">
              🎯 <strong style="color: var(--accent);">Neural Connection Established!</strong>
              <br><br>
              Welcome to your personalized entertainment universe! I'm your AI companion, trained on thousands of movies and shows to give you the perfect recommendations.
              <br><br>
              <strong style="color: var(--secondary);">Experience Features:</strong><br>
              🎬 Smart movie recommendations<br>
              📺 Personalized TV series suggestions<br>
              🎭 Genre exploration and analysis<br>
              ⭐ Ratings and reviews insights<br>
              <br>
              What type of entertainment experience are you looking for today?
            </div>
          </div>
        `;
                aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
            }
        }, 500);

        // Update notification
        showNotification('🤖 WAHAB VERSE AI Assistant is ready! Start chatting.', 'success');
    }, 1000);
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAIChat();
});