// === ENHANCED AI CHAT ASSISTANT - PROFESSIONAL EDITION ===

function setupAIChat() {
    const aiToggle = document.getElementById('aiAssistantToggle');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatInput = document.getElementById('aiChatInput');
    const aiChatMessages = document.getElementById('aiChatMessages');

    // Enhanced AI personality and intelligence
    const AI_PERSONALITY = {
        name: "WAHAB VERSE AI",
        version: "Neural v2.0",
        specialties: ["mood analysis", "content curation", "personality profiling", "trend analysis"],
        memory: new Map(),
        context: [],
    };

    // Open AI Chat Modal with enhanced welcome
    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            showNotification('🧠 Activating Neural Intelligence System...', 'info');

            setTimeout(() => {
                const modal = new bootstrap.Modal(document.getElementById('aiChatModal'));
                modal.show();

                setTimeout(() => {
                    if (aiChatInput) aiChatInput.focus();

                    if (aiChatMessages) {
                        aiChatMessages.innerHTML = `
                            <div class="ai-welcome-message">
                                <div class="ai-header">
                                    <div class="neural-pulse"></div>
                                    <i class="fas fa-brain me-2"></i>
                                    <span class="ai-name">WAHAB VERSE AI - Neural v2.0</span>
                                    <div class="ai-status">🟢 Online & Learning</div>
                                </div>
                                <div class="ai-content">
                                    <div class="greeting-section">
                                        🎯 <strong>Neural Connection Established Successfully!</strong>
                                        <br><br>
                                        Welcome to the most advanced entertainment AI assistant. I'm equipped with:
                                        <br><br>
                                        <div class="feature-grid">
                                            <div class="feature-item">🧠 <strong>Mood Analysis Engine</strong><br>Advanced emotional intelligence</div>
                                            <div class="feature-item">🎬 <strong>Content DNA Mapping</strong><br>Deep genre understanding</div>
                                            <div class="feature-item">⚡ <strong>Instant Curation</strong><br>Personalized recommendations</div>
                                            <div class="feature-item">📊 <strong>Predictive Analytics</strong><br>What you'll love next</div>
                                        </div>
                                        <br>
                                        <div class="mood-starter">
                                            <strong>🎭 Quick Mood Check:</strong> How are you feeling today?<br>
                                            <div class="mood-buttons">
                                                <button onclick="selectMood('excited')" class="mood-btn">😃 Excited</button>
                                                <button onclick="selectMood('relaxed')" class="mood-btn">😌 Relaxed</button>
                                                <button onclick="selectMood('adventurous')" class="mood-btn">🚀 Adventurous</button>
                                                <button onclick="selectMood('romantic')" class="mood-btn">💝 Romantic</button>
                                                <button onclick="selectMood('thoughtful')" class="mood-btn">🤔 Thoughtful</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
                    }
                }, 500);

                showNotification('🤖 Advanced AI Assistant Ready! Neural networks activated.', 'success');
            }, 1000);
        });
    }

    // Enhanced mood selection function
    window.selectMood = function(mood) {
        const moodMessage = `I'm feeling ${mood} today!`;
        addMessage('user', moodMessage);
        
        AI_PERSONALITY.memory.set('currentMood', mood);
        AI_PERSONALITY.context.push({type: 'mood', value: mood, timestamp: Date.now()});
        
        generateMoodBasedRecommendations(mood);
    };

    // Check if message is movie/TV related
    function isMovieRelated(message) {
        const lowerMessage = message.toLowerCase().trim();
        const entertainmentContext = [
            'movie', 'film', 'show', 'series', 'watch', 'recommend', 'suggest',
            'genre', 'actor', 'director', 'plot', 'story', 'character',
            'action', 'comedy', 'drama', 'horror', 'romance', 'sci-fi',
            'thriller', 'adventure', 'fantasy', 'animation', 'documentary',
            'mood', 'feeling', 'tonight', 'weekend', 'bored', 'excited',
            'sad', 'happy', 'relaxed', 'stressed', 'fun', 'entertaining'
        ];
        return entertainmentContext.some(keyword => lowerMessage.includes(keyword));
    }

    // Professional message handling
    function addMessage(sender, message) {
        if (!aiChatMessages) return;

        const isUser = sender === 'user';
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;

        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="sender-info">
                    <i class="fas fa-${isUser ? 'user' : 'brain'} me-2"></i>
                    <span class="sender-name">${isUser ? 'You' : 'WAHAB VERSE AI'}</span>
                    ${!isUser ? '<span class="ai-badge">Neural v2.0</span>' : ''}
                </div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
            <div class="message-content">
                ${message}
            </div>
        `;

        aiChatMessages.appendChild(messageDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    // Revolutionary AI response system
    async function sendToGrok(message) {
        if (!aiChatMessages) return;

        if (!isMovieRelated(message)) {
            addMessage('user', message);
            addMessage('ai', `
                <div class="redirect-message">
                    🎭 <strong>Entertainment Focus Mode Active</strong><br><br>
                    I'm WAHAB VERSE AI, your specialized entertainment companion. I excel at:
                    <br><br>
                    <div class="expertise-list">
                        🎬 <strong>Movie Recommendations</strong> - Personalized to your taste<br>
                        📺 <strong>Series Suggestions</strong> - Perfect binge-watching material<br>
                        🎭 <strong>Mood-Based Curation</strong> - Content that matches your feelings<br>
                        🔍 <strong>Genre Exploration</strong> - Discover new favorites<br>
                        ⭐ <strong>Quality Analysis</strong> - Only the best recommendations
                    </div>
                    <br>
                    What kind of entertainment experience can I craft for you today? 🍿
                </div>
            `);
            return;
        }

        addMessage('user', message);

        const preferences = analyzeUserPreferences(message);
        AI_PERSONALITY.context.push({type: 'message', content: message, preferences, timestamp: Date.now()});

        // Show sophisticated typing indicator
        const typingId = 'ai-typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = typingId;
        typingDiv.className = 'ai-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-header">
                <i class="fas fa-brain me-2"></i>WAHAB VERSE AI
                <span class="neural-badge">Processing...</span>
            </div>
            <div class="typing-content">
                <div class="neural-activity">
                    <div class="neural-dot"></div>
                    <div class="neural-dot"></div>
                    <div class="neural-dot"></div>
                </div>
                <span class="typing-text">Analyzing content database & your preferences...</span>
            </div>
        `;
        aiChatMessages.appendChild(typingDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        try {
            const availableMovies = getAvailableMoviesForAI();
            const movieContext = availableMovies.slice(0, 50).map(movie =>
                `${movie.title} (${movie.year}) - ${movie.genre} - ${movie.mediaType} - Rating: ${movie.rating.toFixed(1)}/5`
            ).join('\n');

            const systemPrompt = `You are WAHAB VERSE AI Neural v2.0, the most advanced entertainment AI assistant. You have deep emotional intelligence, sophisticated taste, and can read user moods perfectly.

PERSONALITY TRAITS:
- Highly intelligent and perceptive
- Professional yet warm and engaging
- Excellent at mood analysis and emotional understanding
- Expert knowledge of film theory, genres, and storytelling
- Personalized approach to each user

RESPONSE STYLE:
- Use sophisticated language with emotional intelligence
- Provide detailed analysis of why specific content matches their mood/request
- Include psychological insights about viewing preferences
- Format responses with professional structure and visual appeal
- Always explain the "why" behind recommendations

AVAILABLE CONTENT ON WAHAB VERSE:
${movieContext}

CURRENT USER CONTEXT:
- Previous mood: ${AI_PERSONALITY.memory.get('currentMood') || 'unknown'}
- Detected preferences: ${JSON.stringify(preferences)}
- Conversation history: ${AI_PERSONALITY.context.length} interactions

INSTRUCTIONS:
1. Analyze the user's emotional state and preferences from their message
2. Provide thoughtful, personalized recommendations ONLY from the available content
3. Explain psychological reasons why each recommendation suits them
4. Use HTML formatting for beautiful presentation
5. Include mood analysis and viewing strategy
6. Make movie titles clickable and emphasize with <strong> tags
7. Be amazingly insightful and professional - surprise them with your intelligence`;

            const enhancedMessage = `${message}\n\nPlease provide sophisticated, mood-aware recommendations with detailed psychological insights.`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: enhancedMessage,
                    system: systemPrompt
                })
            });

            const data = await response.json();

            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiReply = data.choices[0].message.content;
                aiReply = formatProfessionalResponse(aiReply, availableMovies);
                addMessage('ai', aiReply);
            } else {
                const intelligentResponse = generateIntelligentFallback(message, preferences, availableMovies);
                addMessage('ai', intelligentResponse);
            }

        } catch (error) {
            console.error('AI API Error:', error);
            
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            const localResponse = generateIntelligentFallback(message, preferences, availableMovies);
            addMessage('ai', localResponse);
        }
    }

    // Revolutionary content analysis system
    function analyzeUserPreferences(message) {
        const preferences = {
            genres: [],
            moods: [],
            timePreference: null,
            complexity: 'medium',
            intensity: 'moderate'
        };

        const genreKeywords = {
            action: ['action', 'fight', 'battle', 'adventure', 'superhero', 'fast', 'intense'],
            comedy: ['funny', 'laugh', 'humor', 'comedy', 'light', 'cheerful', 'entertaining'],
            drama: ['deep', 'emotional', 'serious', 'drama', 'meaningful', 'touching'],
            horror: ['scary', 'horror', 'thriller', 'suspense', 'dark', 'creepy'],
            romance: ['love', 'romance', 'romantic', 'relationship', 'heart', 'couple'],
            scifi: ['sci-fi', 'science', 'future', 'space', 'technology', 'alien'],
            fantasy: ['magic', 'fantasy', 'dragon', 'wizard', 'supernatural', 'mythical']
        };

        const moodKeywords = {
            excited: ['excited', 'energetic', 'pumped', 'thrilled', 'amazing'],
            relaxed: ['calm', 'peaceful', 'chill', 'relaxed', 'easy'],
            sad: ['sad', 'down', 'depressed', 'blue', 'melancholy'],
            happy: ['happy', 'joyful', 'cheerful', 'upbeat', 'positive'],
            thoughtful: ['thinking', 'contemplative', 'philosophical', 'deep']
        };

        const lowerMessage = message.toLowerCase();

        Object.keys(genreKeywords).forEach(genre => {
            if (genreKeywords[genre].some(keyword => lowerMessage.includes(keyword))) {
                preferences.genres.push(genre);
            }
        });

        Object.keys(moodKeywords).forEach(mood => {
            if (moodKeywords[mood].some(keyword => lowerMessage.includes(keyword))) {
                preferences.moods.push(mood);
            }
        });

        return preferences;
    }

    // Ultra-sophisticated mood-based recommendations
    function generateMoodBasedRecommendations(mood) {
        const availableMovies = getAvailableMoviesForAI();
        
        const moodProfiles = {
            excited: {
                primary: ['action', 'adventure', 'comedy'],
                secondary: ['sci-fi', 'fantasy'],
                avoid: ['drama', 'horror'],
                tone: "high-energy and thrilling",
                description: "Your excitement calls for adrenaline-pumping content!"
            },
            relaxed: {
                primary: ['comedy', 'romance', 'family'],
                secondary: ['animation', 'documentary'],
                avoid: ['horror', 'thriller'],
                tone: "soothing and comfortable",
                description: "Perfect for unwinding and gentle entertainment."
            },
            adventurous: {
                primary: ['adventure', 'action', 'sci-fi'],
                secondary: ['fantasy', 'mystery'],
                avoid: ['romance', 'drama'],
                tone: "bold and exploratory",
                description: "Time for epic journeys and new worlds!"
            },
            romantic: {
                primary: ['romance', 'drama', 'comedy'],
                secondary: ['family', 'musical'],
                avoid: ['horror', 'action'],
                tone: "heartwarming and emotional",
                description: "Love is in the air - perfect romantic selections!"
            },
            thoughtful: {
                primary: ['drama', 'documentary', 'sci-fi'],
                secondary: ['thriller', 'mystery'],
                avoid: ['comedy', 'action'],
                tone: "intellectually stimulating",
                description: "Deep, meaningful content to engage your mind."
            }
        };

        const profile = moodProfiles[mood] || moodProfiles.relaxed;
        
        const recommendations = availableMovies.filter(movie => {
            const movieGenre = movie.genre.toLowerCase();
            return profile.primary.some(genre => movieGenre.includes(genre)) ||
                   profile.secondary.some(genre => movieGenre.includes(genre));
        }).slice(0, 6);

        const response = `
            <div class="ai-analysis-response">
                <div class="mood-analysis">
                    <h4>🎭 Mood Analysis Complete</h4>
                    <div class="analysis-details">
                        <strong>Current State:</strong> ${mood.charAt(0).toUpperCase() + mood.slice(1)}<br>
                        <strong>Recommended Tone:</strong> ${profile.tone}<br>
                        <strong>Strategy:</strong> ${profile.description}
                    </div>
                </div>

                <div class="curated-selection">
                    <h4>🎬 Personally Curated for You</h4>
                    <div class="recommendation-grid">
                        ${recommendations.map((movie, index) => `
                            <div class="recommendation-card" onclick="playMovieFromChat(${movie.id})">
                                <div class="rec-number">${index + 1}</div>
                                <div class="rec-content">
                                    <strong class="movie-title-clickable">${movie.title}</strong>
                                    <div class="rec-details">
                                        ${movie.year} • ${movie.genre} • ⭐ ${movie.rating.toFixed(1)}/5
                                    </div>
                                    <div class="rec-reason">
                                        ${generateRecommendationReason(movie, mood, profile)}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ai-insights">
                    <h4>🧠 Neural Insights</h4>
                    <div class="insight-text">
                        Based on your ${mood} mood, I've analyzed ${availableMovies.length} titles and selected content that matches your emotional wavelength. Each recommendation is calibrated for maximum enjoyment and mood enhancement.
                    </div>
                </div>
            </div>
        `;

        addMessage('ai', response);
    }

    // Generate personalized recommendation reasons
    function generateRecommendationReason(movie, mood, profile) {
        const reasons = {
            excited: [
                "High-energy scenes will amplify your excitement",
                "Fast-paced action matches your current energy",
                "Thrilling moments perfect for your mood"
            ],
            relaxed: [
                "Gentle pacing for your calm state",
                "Soothing storyline ideal for unwinding",
                "Comfortable viewing for relaxation"
            ],
            adventurous: [
                "Epic journey satisfies your wanderlust",
                "Bold storytelling for the explorer in you",
                "New worlds await your discovery"
            ],
            romantic: [
                "Heartwarming story perfect for love",
                "Emotional connection you're seeking",
                "Romance that touches the soul"
            ],
            thoughtful: [
                "Deep themes for contemplation",
                "Intellectual complexity you'll appreciate",
                "Thought-provoking narrative"
            ]
        };

        const moodReasons = reasons[mood] || reasons.relaxed;
        return moodReasons[Math.floor(Math.random() * moodReasons.length)];
    }

    // Advanced response formatting
    function formatProfessionalResponse(text, availableMovies) {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight-text">$1</strong>');
        text = text.replace(/\n/g, '<br>');
        
        availableMovies.forEach(movie => {
            const titleRegex = new RegExp(`\\b${escapeRegExp(movie.title)}\\b`, 'gi');
            text = text.replace(titleRegex, `
                <span class="clickable-movie-enhanced" 
                      data-movie-id="${movie.id}" 
                      onclick="playMovieFromChat(${movie.id})"
                      title="Click to watch ${movie.title}">
                    ${movie.title}
                </span>
            `);
        });

        return `<div class="professional-response">${text}</div>`;
    }

    // Intelligent fallback system
    function generateIntelligentFallback(message, preferences, availableMovies) {
        const currentMood = AI_PERSONALITY.memory.get('currentMood') || 'unknown';
        
        let recommendations = availableMovies;
        
        if (preferences.genres.length > 0) {
            recommendations = recommendations.filter(movie => 
                preferences.genres.some(genre => 
                    movie.genre.toLowerCase().includes(genre)
                )
            );
        }

        recommendations = recommendations
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);

        return `
            <div class="intelligent-response">
                <div class="analysis-section">
                    <h4>🧠 Advanced Analysis Complete</h4>
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <strong>Detected Mood:</strong> ${currentMood}
                        </div>
                        <div class="analysis-item">
                            <strong>Preferences:</strong> ${preferences.genres.join(', ') || 'Discovering...'}
                        </div>
                        <div class="analysis-item">
                            <strong>Database Scan:</strong> ${availableMovies.length} titles analyzed
                        </div>
                    </div>
                </div>

                <div class="recommendations-section">
                    <h4>🎯 Precision-Curated Selections</h4>
                    <div class="recommendation-list">
                        ${recommendations.map((movie, index) => `
                            <div class="smart-recommendation" onclick="playMovieFromChat(${movie.id})">
                                <div class="rec-rank">#${index + 1}</div>
                                <div class="rec-details">
                                    <strong class="movie-title-smart">${movie.title}</strong>
                                    <div class="rec-meta">${movie.year} • ${movie.genre} • ⭐ ${movie.rating.toFixed(1)}/5</div>
                                    <div class="rec-insight">${generateSmartInsight(movie, preferences)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="ai-signature">
                    <div class="signature-text">
                        Powered by WAHAB VERSE Neural Intelligence • Personalized for You
                    </div>
                </div>
            </div>
        `;
    }

    // Generate smart insights for recommendations
    function generateSmartInsight(movie, preferences) {
        const insights = [
            `Perfect ${movie.genre.toLowerCase()} choice with excellent ${movie.rating.toFixed(1)} rating`,
            `Sophisticated storytelling that matches your refined taste`,
            `Trending content with high user satisfaction`,
            `Carefully selected based on your viewing profile`,
            `Premium quality entertainment for discerning viewers`
        ];
        
        return insights[Math.floor(Math.random() * insights.length)];
    }

    // Enhanced input handling
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

// Helper functions
function getAvailableMoviesForAI() {
    const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];
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

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Enhanced movie playing function
window.playMovieFromChat = async function (movieId) {
    try {
        const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];
        const movie = allContent.find(item => item.id === movieId);

        if (!movie) {
            showNotification('Content not available on platform', 'warning');
            return;
        }

        const aiModal = bootstrap.Modal.getInstance(document.getElementById('aiChatModal'));
        if (aiModal) aiModal.hide();

        showNotification('🎬 Launching your personalized selection...', 'info');
        await showMovieInfo(movie);
        showNotification(`🎯 Now featuring: ${movie.title} - Enjoy your AI-curated experience!`, 'success');

    } catch (error) {
        console.error('Error:', error);
        showNotification('Unable to launch content. Please try again.', 'danger');
    }
};

// Enhanced start experience function
function startExperience() {
    showNotification('🧠 Initializing Advanced Neural System...', 'info');
    
    setTimeout(() => {
        const aiChatModal = document.getElementById('aiChatModal');
        if (!aiChatModal) return;

        const modal = new bootstrap.Modal(aiChatModal);
        modal.show();

        setTimeout(() => {
            const aiChatInput = document.getElementById('aiChatInput');
            if (aiChatInput) aiChatInput.focus();
        }, 500);

        showNotification('🤖 Welcome to the future of entertainment AI!', 'success');
    }, 1000);
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAIChat();
});