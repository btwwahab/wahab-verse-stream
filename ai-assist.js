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
• Movie recommendations from our platform
• TV series suggestions available here
• Genre explanations
• Plot summaries & reviews
• Platform content ratings

Please ask me something about movies or TV shows available on our platform! 🍿`);
            return;
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
          <i class="fas fa-spinner fa-spin me-2"></i>Analyzing our platform content...
        </div>
      </div>
    `;
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        // Get available movies from our platform
        const availableMovies = getAvailableMoviesForAI();

        // Create a context string with available movies
        const movieContext = availableMovies.slice(0, 50).map(movie =>
            `${movie.title} (${movie.year}) - ${movie.genre} - ${movie.mediaType}`
        ).join('\n');

        try {
            // Enhanced message with platform context
            const enhancedMessage = `${message}

IMPORTANT: Only recommend movies/shows from this available content list. Do not suggest anything not in this list:

AVAILABLE CONTENT:
${movieContext}

Only suggest from the above list. Make movie titles clickable by formatting them as: [MOVIE_TITLE](${movie.id})`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: enhancedMessage })
            });

            const data = await response.json();

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiReply = data.choices[0].message.content;

                // Enhanced formatting with clickable movie titles
                aiReply = formatAIResponseWithClickableMovies(aiReply, availableMovies);
                addMessage('ai', aiReply);
            } else {
                addMessage('ai', 'Sorry, I couldn\'t process that movie/TV request. Please try again! 🎬');
            }

        } catch (error) {
            console.error('AI API Error:', error);

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            // Fallback to local recommendations
            const localRecommendation = generateLocalRecommendation(message, availableMovies);
            addMessage('ai', localRecommendation);
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

function getAvailableMoviesForAI() {
    const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];

    // Remove duplicates and format for AI
    const uniqueContent = allContent.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
    );

    return uniqueContent.map(item => ({
        id: item.id,
        title: item.title,
        genre: item.genre,
        year: item.year,
        rating: item.rating,
        overview: item.overview,
        mediaType: item.mediaType
    }));
}

function formatAIResponseWithClickableMovies(text, availableMovies) {
    // First apply existing formatting
    text = formatAIResponse(text);

    // Make movie titles clickable
    availableMovies.forEach(movie => {
        const titleRegex = new RegExp(`\\b${escapeRegExp(movie.title)}\\b`, 'gi');
        text = text.replace(titleRegex,
            `<span class="clickable-movie" 
                   data-movie-id="${movie.id}" 
                   style="color: var(--accent); font-weight: 700; cursor: pointer; text-decoration: underline; border-bottom: 2px solid var(--primary);"
                   onclick="playMovieFromChat(${movie.id})"
                   onmouseover="this.style.color='var(--primary)'"
                   onmouseout="this.style.color='var(--accent)'">
                ${movie.title}
            </span>`
        );
    });

    return text;
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Generate local recommendation when API fails
function generateLocalRecommendation(query, availableMovies) {
    const lowerQuery = query.toLowerCase();
    let recommendations = [];

    // Genre-based recommendations
    if (lowerQuery.includes('action')) {
        recommendations = availableMovies.filter(m => m.genre.toLowerCase().includes('action')).slice(0, 5);
    } else if (lowerQuery.includes('comedy')) {
        recommendations = availableMovies.filter(m => m.genre.toLowerCase().includes('comedy')).slice(0, 5);
    } else if (lowerQuery.includes('horror')) {
        recommendations = availableMovies.filter(m => m.genre.toLowerCase().includes('horror')).slice(0, 5);
    } else if (lowerQuery.includes('drama')) {
        recommendations = availableMovies.filter(m => m.genre.toLowerCase().includes('drama')).slice(0, 5);
    } else {
        // Default to top rated available movies
        recommendations = availableMovies
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
    }

    if (recommendations.length === 0) {
        return 'Sorry, no movies found matching your criteria on our platform. Try a different genre or search term! 🎬';
    }

    let response = `🎬 <strong>Available on WAHAB VERSE Platform:</strong><br><br>`;

    recommendations.forEach((movie, index) => {
        response += `${index + 1}. <span class="clickable-movie" 
                                    data-movie-id="${movie.id}" 
                                    style="color: var(--accent); font-weight: 700; cursor: pointer; text-decoration: underline; border-bottom: 2px solid var(--primary);"
                                    onclick="playMovieFromChat(${movie.id})"
                                    onmouseover="this.style.color='var(--primary)'"
                                    onmouseout="this.style.color='var(--accent)'">
                        ${movie.title}
                     </span> (${movie.year}) - ${movie.genre}<br>
                     ⭐ ${movie.rating.toFixed(1)}/5<br><br>`;
    });

    response += `<br>🎯 Click on any movie title to watch it instantly!`;

    return response;
}

// Add this function to handle movie clicks from chat
window.playMovieFromChat = async function (movieId) {
    try {
        // Find the movie in our data
        const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];
        const movie = allContent.find(item => item.id === movieId);

        if (!movie) {
            showNotification('Movie not found on platform', 'warning');
            return;
        }

        // Close AI chat modal
        const aiModal = bootstrap.Modal.getInstance(document.getElementById('aiChatModal'));
        if (aiModal) {
            aiModal.hide();
        }

        // Show loading notification
        showNotification('🎬 Loading movie details...', 'info');

        // Open movie modal
        await showMovieInfo(movie);

        // Show success notification
        showNotification(`🎯 Now showing: ${movie.title}`, 'success');

    } catch (error) {
        console.error('Error playing movie from chat:', error);
        showNotification('Failed to load movie. Please try again.', 'danger');
    }
};

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAIChat();
});