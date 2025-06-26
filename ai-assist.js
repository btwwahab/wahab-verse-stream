// === ENHANCED AI CHAT ASSISTANT - PROFESSIONAL EDITION ===

// Global variables
let aiChatMessages = null;
let AI_PERSONALITY = null;

let aiChatModalInstance = null;
let clearChatModalInstance = null;

// Global functions moved outside of setupAIChat scope
function saveChatToStorage() {
    try {
        if (!AI_PERSONALITY || !aiChatMessages) return;

        const chatData = {
            messages: getChatMessagesData(),
            personality: {
                memory: Object.fromEntries(AI_PERSONALITY.memory),
                context: AI_PERSONALITY.context
            },
            timestamp: Date.now()
        };
        localStorage.setItem('wahab_verse_chat', JSON.stringify(chatData));
    } catch (error) {
        console.error('Error saving chat to storage:', error);
    }
}

function loadChatFromStorage() {
    try {
        const savedChat = localStorage.getItem('wahab_verse_chat');
        if (savedChat) {
            const chatData = JSON.parse(savedChat);

            // Restore AI personality data
            if (chatData.personality && AI_PERSONALITY) {
                if (chatData.personality.memory) {
                    AI_PERSONALITY.memory = new Map(Object.entries(chatData.personality.memory));
                }
                if (chatData.personality.context) {
                    AI_PERSONALITY.context = chatData.personality.context;
                }
            }

            return chatData.messages || [];
        }
    } catch (error) {
        console.error('Error loading chat from storage:', error);
    }
    return [];
}

function getChatMessagesData() {
    if (!aiChatMessages) return [];

    const messages = [];
    const messageElements = aiChatMessages.querySelectorAll('.chat-message');

    messageElements.forEach((element, index) => {
        const isUser = element.classList.contains('user-message');
        const messageContent = element.querySelector('.message-content');
        const messageTime = element.querySelector('.message-time');

        if (messageContent) {
            messages.push({
                id: index,
                sender: isUser ? 'user' : 'ai',
                content: messageContent.innerHTML,
                timestamp: messageTime ? messageTime.textContent : new Date().toLocaleTimeString(),
                isWelcome: element.querySelector('.ai-welcome-message') !== null
            });
        }
    });

    return messages;
}

function smoothScrollToBottom() {
    if (!aiChatMessages) {
        console.warn('Chat messages container not found for scrolling');
        return;
    }

    try {
        const isAtBottom = aiChatMessages.scrollTop + aiChatMessages.clientHeight >= aiChatMessages.scrollHeight - 10;

        // Force scroll to bottom
        const scrollToBottom = () => {
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        };

        // Immediate scroll
        scrollToBottom();

        // Also try smooth scroll if not already at bottom
        if (!isAtBottom) {
            aiChatMessages.scrollTo({
                top: aiChatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }

        // Force scroll again after delay
        setTimeout(scrollToBottom, 50);
        setTimeout(scrollToBottom, 150);

    } catch (error) {
        console.error('Error scrolling chat:', error);
    }
}

function addMessage(sender, message) {
    if (!aiChatMessages) {
        console.warn('aiChatMessages not found');
        return;
    }

    const isUser = sender === 'user';
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;

    const messageId = 'msg-' + Date.now();

    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="sender-info">
                <i class="fas fa-${isUser ? 'user' : 'brain'} me-2"></i>
                <span class="sender-name">${isUser ? 'You' : 'Aziona Steam AI'}</span>
                ${!isUser ? '<span class="ai-badge">Neural v2.0</span>' : ''}
            </div>
            <div class="message-actions">
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        </div>
        <div class="message-content" id="${messageId}">
            ${message}
        </div>
    `;

    aiChatMessages.appendChild(messageDiv);

    // Enhanced scrolling with multiple approaches and better timing
    const performScroll = () => {
        try {
            // Method 1: Direct scroll
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

            // Method 2: Smooth scroll
            aiChatMessages.scrollTo({
                top: aiChatMessages.scrollHeight,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('Scroll error:', error);
        }
    };

    // Multiple scroll attempts with different timings
    performScroll(); // Immediate

    requestAnimationFrame(() => {
        performScroll(); // Next frame
    });

    setTimeout(() => {
        performScroll(); // After 100ms
    }, 100);

    setTimeout(() => {
        performScroll(); // After 300ms
    }, 300);

    setTimeout(() => {
        performScroll(); // After 500ms (for complex content)
    }, 500);

    // Save chat to storage
    setTimeout(() => {
        saveChatToStorage();
    }, 200);
}

function setupAutoScroll() {
    if (!aiChatMessages) return;

    // Create a MutationObserver to watch for new messages
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // New content added, scroll to bottom
                setTimeout(() => {
                    smoothScrollToBottom();
                }, 100);
            }
        });
    });

    // Start observing
    observer.observe(aiChatMessages, {
        childList: true,
        subtree: true
    });

    // Also observe for content changes within messages
    const contentObserver = new MutationObserver(() => {
        setTimeout(() => smoothScrollToBottom(), 50);
    });

    contentObserver.observe(aiChatMessages, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function setupAIChat() {
    const aiToggle = document.getElementById('aiAssistantToggle');
    const aiChatSend = document.getElementById('aiChatSend');
    const aiChatInput = document.getElementById('aiChatInput');

    // Initialize global variables
    aiChatMessages = document.getElementById('aiChatMessages');

    // Enhanced AI personality and intelligence
    AI_PERSONALITY = {
        name: "Aziona Steam AI",
        version: "Neural v2.0",
        specialties: ["mood analysis", "content curation", "personality profiling", "trend analysis"],
        memory: new Map(),
        context: [],
    };

    function restoreChatMessages(messages) {
        if (!aiChatMessages || messages.length === 0) return;

        aiChatMessages.innerHTML = '';

        messages.forEach(message => {
            if (message.isWelcome) {
                // Skip welcome message as it will be recreated
                return;
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`;

            const messageId = 'msg-' + Date.now() + '-' + message.id;
            const isUser = message.sender === 'user';

            messageDiv.innerHTML = `
                <div class="message-header">
                    <div class="sender-info">
                        <i class="fas fa-${isUser ? 'user' : 'brain'} me-2"></i>
                        <span class="sender-name">${isUser ? 'You' : 'Aziona Steam AI'}</span>
                        ${!isUser ? '<span class="ai-badge">Neural v2.0</span>' : ''}
                    </div>
                    <div class="message-actions">
                        <div class="message-time">${message.timestamp}</div>
                    </div>
                </div>
                <div class="message-content" id="${messageId}">
                    ${message.content}
                </div>
            `;

            aiChatMessages.appendChild(messageDiv);
        });

        // Auto-scroll to show restored messages
        setTimeout(() => {
            smoothScrollToBottom();
        }, 100);
    }

    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            if (typeof showNotification === 'function') {
                showNotification('🧠 Activating Neural Intelligence System...', 'info');
            }

            setTimeout(() => {
                // Use the global modal instance
                if (aiChatModalInstance) {
                    aiChatModalInstance.show();
                } else {
                    // Fallback if instance not available
                    const modal = new bootstrap.Modal(document.getElementById('aiChatModal'));
                    modal.show();
                }

                setTimeout(() => {
                    if (aiChatInput) aiChatInput.focus();

                    if (aiChatMessages) {
                        showWelcomeMessage();
                    }
                }, 500);

                if (typeof showNotification === 'function') {
                    showNotification('🤖 Advanced AI Assistant Ready! Neural networks activated.', 'success');
                }
            }, 1000);
        });
    }

    // Update the clearChatStorage function
    function clearChatStorage() {
        try {
            localStorage.removeItem('wahab_verse_chat');
            AI_PERSONALITY.memory.clear();
            AI_PERSONALITY.context = [];

            // Close the clear chat modal first
            if (clearChatModalInstance) {
                clearChatModalInstance.hide();
            }

            // Show success notification with enhanced styling
            if (typeof showNotification === 'function') {
                showNotification('🗑️ Chat history successfully cleared. Starting fresh!', 'success');
            }

            // Wait for clear modal to close, then open fresh AI chat
            setTimeout(() => {
                if (aiChatMessages) {
                    showWelcomeMessage();
                }

                // Open the AI chat modal with fresh start
                if (aiChatModalInstance) {
                    aiChatModalInstance.show();

                    // Focus on input after modal opens
                    setTimeout(() => {
                        const aiChatInput = document.getElementById('aiChatInput');
                        if (aiChatInput) aiChatInput.focus();
                    }, 500);
                }
            }, 500);

        } catch (error) {
            console.error('Error clearing chat storage:', error);
            if (typeof showNotification === 'function') {
                showNotification('❌ Error clearing chat history. Please try again.', 'danger');
            }
        }
    }

    // Enhanced functions with better user feedback
    window.restorePreviousChat = function () {
        const savedMessages = loadChatFromStorage();
        if (savedMessages.length > 0) {
            restoreChatMessages(savedMessages);
            if (typeof showNotification === 'function') {
                showNotification(`📚 Successfully restored ${savedMessages.length} previous messages`, 'success');
            }
        } else {
            if (typeof showNotification === 'function') {
                showNotification('📭 No chat history found to restore', 'warning');
            }
        }
    };

    window.startFreshChat = function () {
        showWelcomeMessage();
        if (typeof showNotification === 'function') {
            showNotification('✨ Started fresh chat session. Let\'s explore!', 'info');
        }
    };

    // Update the cancelClearChat function
    window.cancelClearChat = function () {
        // Close the clear chat modal
        if (clearChatModalInstance) {
            clearChatModalInstance.hide();
        }

        // Wait for clear modal to close, then restore AI chat
        setTimeout(() => {
            // Restore the AI chat modal
            if (aiChatModalInstance) {
                aiChatModalInstance.show();

                // Show the welcome message with restore options
                setTimeout(() => {
                    if (aiChatMessages) {
                        showWelcomeMessage();
                    }

                    const aiChatInput = document.getElementById('aiChatInput');
                    if (aiChatInput) aiChatInput.focus();
                }, 500);
            }

            if (typeof showNotification === 'function') {
                showNotification('↩️ Chat clearing cancelled. Your history is safe!', 'info');
            }
        }, 300);
    };

    // Update the clearChatHistory function to use custom modal
    window.clearChatHistory = function () {
        // Close the AI chat modal first
        if (aiChatModalInstance) {
            aiChatModalInstance.hide();
        }

        // Wait for AI chat modal to close, then show clear chat modal
        setTimeout(() => {
            if (clearChatModalInstance) {
                clearChatModalInstance.show();
            }
        }, 300);
    };

    // Add new function for confirming chat clear
    window.confirmClearChat = function () {
        clearChatStorage();
    };

    // Enhanced welcome message with better history section styling
    function showWelcomeMessage() {
        if (!aiChatMessages) return;

        const savedMessages = loadChatFromStorage();
        const hasChatHistory = savedMessages.length > 0;

        aiChatMessages.innerHTML = `
        <div class="ai-welcome-message">
            <div class="ai-header">
                <div class="neural-pulse"></div>
                <i class="fas fa-brain me-2"></i>
                <span class="ai-name">Aziona Steam AI - Neural v2.0</span>
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
                    ${hasChatHistory ? `
                        <div class="chat-history-section">
                            <h5>💾 <strong>Chat History Detected</strong></h5>
                            <p>I found our previous conversation with <strong>${savedMessages.length} messages</strong>. Would you like to continue where we left off or start fresh?</p>
                            <div class="history-buttons">
                                <button onclick="restorePreviousChat()" class="btn btn-primary">
                                    <i class="fas fa-history"></i>
                                    Restore Chat
                                </button>
                                <button onclick="startFreshChat()" class="btn btn-outline-secondary">
                                    <i class="fas fa-plus"></i>
                                    Start Fresh
                                </button>
                                <button onclick="clearChatHistory()" class="btn btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                    Clear History
                                </button>
                            </div>
                        </div>
                        <br>
                    ` : ''}
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

        // Auto-scroll to show welcome message
        setTimeout(() => {
            smoothScrollToBottom();
        }, 100);
    }


    // Open AI Chat Modal with enhanced welcome
    if (aiToggle) {
        aiToggle.addEventListener('click', () => {
            if (typeof showNotification === 'function') {
                showNotification('🧠 Activating Neural Intelligence System...', 'info');
            }

            setTimeout(() => {
                const modal = new bootstrap.Modal(document.getElementById('aiChatModal'));
                modal.show();

                setTimeout(() => {
                    if (aiChatInput) aiChatInput.focus();

                    if (aiChatMessages) {
                        showWelcomeMessage();
                    }
                }, 500);

                if (typeof showNotification === 'function') {
                    showNotification('🤖 Advanced AI Assistant Ready! Neural networks activated.', 'success');
                }
            }, 1000);
        });
    }

    // Enhanced mood selection function
    window.selectMood = function (mood) {
        const moodMessage = `I'm feeling ${mood} today!`;
        addMessage('user', moodMessage);

        AI_PERSONALITY.memory.set('currentMood', mood);
        AI_PERSONALITY.context.push({ type: 'mood', value: mood, timestamp: Date.now() });

        // Save to storage after mood selection
        saveChatToStorage();

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

    // Revolutionary AI response system
    async function sendToGrok(message) {
        if (!aiChatMessages) {
            console.warn('aiChatMessages not initialized');
            return;
        }

        if (!isMovieRelated(message)) {
            addMessage('user', message);
            const redirectResponse = `
        <div class="redirect-message">
            🎭 <strong>Entertainment Focus Mode Active</strong><br><br>
            I'm Aziona Steam AI, your specialized entertainment companion. I excel at:
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
        `;

            addMessage('ai', redirectResponse);
            return;
        }

        addMessage('user', message);

        const preferences = analyzeUserPreferences(message);
        if (AI_PERSONALITY) {
            AI_PERSONALITY.context.push({ type: 'message', content: message, preferences, timestamp: Date.now() });
        }

        // Show typing indicator
        const typingId = 'ai-typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = typingId;
        typingDiv.className = 'ai-typing-indicator';
        typingDiv.innerHTML = `
        <div class="typing-header">
            <i class="fas fa-brain me-2"></i>Aziona Steam AI
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
        smoothScrollToBottom();

        try {
            const availableMovies = getAvailableMoviesForAI();
            const movieContext = availableMovies.slice(0, 50).map(movie =>
                `${movie.title} (${movie.year}) - ${movie.genre} - ${movie.mediaType} - Rating: ${movie.rating.toFixed(1)}/5`
            ).join('\n');

            const systemPrompt = `You are Aziona Steam AI Neural v2.0, the most advanced entertainment AI assistant. You have deep emotional intelligence, sophisticated taste, and can read user moods perfectly.

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

AVAILABLE CONTENT ON Aziona Steam:
${movieContext}

CURRENT USER CONTEXT:
- Previous mood: ${AI_PERSONALITY ? AI_PERSONALITY.memory.get('currentMood') || 'unknown' : 'unknown'}
- Detected preferences: ${JSON.stringify(preferences)}
- Conversation history: ${AI_PERSONALITY ? AI_PERSONALITY.context.length : 0} interactions

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

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiReply = data.choices[0].message.content;
                aiReply = formatProfessionalResponse(aiReply, availableMovies);
                addMessage('ai', aiReply);

                // Enhanced auto-scroll
                setTimeout(() => {
                    smoothScrollToBottom();
                }, 300);
            } else {
                const intelligentResponse = generateIntelligentFallback(message, preferences, availableMovies);
                addMessage('ai', intelligentResponse);

                setTimeout(() => {
                    smoothScrollToBottom();
                }, 300);
            }

        } catch (error) {
            console.error('AI API Error:', error);

            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            const localResponse = generateIntelligentFallback(message, preferences, getAvailableMoviesForAI());
            addMessage('ai', localResponse);

            setTimeout(() => {
                smoothScrollToBottom();
            }, 300);
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

        // Auto-scroll after mood-based recommendations
        setTimeout(() => {
            smoothScrollToBottom();
        }, 200);
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
        const currentMood = AI_PERSONALITY ? AI_PERSONALITY.memory.get('currentMood') || 'unknown' : 'unknown';

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
                        Powered by Aziona Steam Neural Intelligence • Personalized for You
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
        const aiChatInput = document.getElementById('aiChatInput');
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

// Add this function to properly handle modal closing
window.closeAIModal = function() {
    try {
        // Get the modal instance
        const modal = bootstrap.Modal.getInstance(document.getElementById('aiChatModal'));
        
        if (modal) {
            // Properly hide the modal
            modal.hide();
        } else {
            // Fallback method
            const modalElement = document.getElementById('aiChatModal');
            if (modalElement) {
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';
                modalElement.setAttribute('aria-hidden', 'true');
                
                // Remove backdrop manually
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                
                // Re-enable body scrolling
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        }
        
        // Save chat data
        saveChatToStorage();
        
    } catch (error) {
        console.error('Error closing modal:', error);
        
        // Force close as fallback
        forceCloseModal();
    }
};

// Force close modal function for emergencies
function forceCloseModal() {
    try {
        // Remove all modal elements
        const modalElement = document.getElementById('aiChatModal');
        if (modalElement) {
            modalElement.classList.remove('show', 'fade');
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
        }
        
        // Remove all backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Clean up body classes and styles
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Remove any lingering event listeners
        document.removeEventListener('keydown', escapeKeyHandler);
        
    } catch (error) {
        console.error('Force close failed:', error);
    }
}

// Add escape key handler
function escapeKeyHandler(event) {
    if (event.key === 'Escape') {
        closeAIModal();
    }
}

// Update the modal event listeners
const aiModal = document.getElementById('aiChatModal');
if (aiModal) {
    aiModal.addEventListener('shown.bs.modal', function () {
        // Remove aria-hidden when modal is shown to fix accessibility
        this.removeAttribute('aria-hidden');
        
        // Ensure aiChatMessages is properly referenced
        aiChatMessages = document.getElementById('aiChatMessages');
        
        // Set up auto-scroll
        setupAutoScroll();
        
        // Initial scroll to bottom
        setTimeout(() => {
            smoothScrollToBottom();
        }, 200);
        
        // Add escape key listener
        document.addEventListener('keydown', escapeKeyHandler);
    });

    aiModal.addEventListener('hidden.bs.modal', function () {
        // Add aria-hidden when modal is hidden
        this.setAttribute('aria-hidden', 'true');
        
        // Save chat data
        saveChatToStorage();
        
        // Clean up
        document.removeEventListener('keydown', escapeKeyHandler);
        
        // Ensure body is properly restored
        setTimeout(() => {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            
            // Remove any lingering backdrops
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
        }, 100);
    });
    
    // Handle modal hide failures
    aiModal.addEventListener('hide.bs.modal', function (event) {
        // Allow the modal to close
        return true;
    });
}

// Add event listeners for clear chat modal
const clearModal = document.getElementById('clearChatModal');
if (clearModal) {
    clearModal.addEventListener('shown.bs.modal', function () {
        this.removeAttribute('aria-hidden');

        // Disable body scrolling when clear modal is open
        document.body.style.overflow = 'hidden';
    });

    clearModal.addEventListener('hidden.bs.modal', function () {
        this.setAttribute('aria-hidden', 'true');

        // Re-enable body scrolling
        document.body.style.overflow = '';
    });
}

// Save chat periodically (every 30 seconds)
setInterval(() => {
    if (aiChatMessages && aiChatMessages.children.length > 1) {
        saveChatToStorage();
    }
}, 30000);

// Export/Import functions
window.exportChatHistory = function () {
    try {
        const savedChat = localStorage.getItem('wahab_verse_chat');
        if (!savedChat) {
            if (typeof showNotification === 'function') {
                showNotification('No chat history to export', 'warning');
            }
            return;
        }

        const chatData = JSON.parse(savedChat);
        const exportData = {
            ...chatData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `wahab-verse-chat-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        if (typeof showNotification === 'function') {
            showNotification('Chat history exported successfully', 'success');
        }
    } catch (error) {
        console.error('Error exporting chat:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error exporting chat history', 'danger');
        }
    }
};

window.importChatHistory = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importData = JSON.parse(e.target.result);

                if (importData.messages && Array.isArray(importData.messages)) {
                    localStorage.setItem('wahab_verse_chat', JSON.stringify(importData));
                    if (typeof showNotification === 'function') {
                        showNotification('Chat history imported successfully', 'success');
                    }

                    // Refresh the current chat if modal is open
                    const aiModal = document.getElementById('aiChatModal');
                    if (aiModal && aiModal.classList.contains('show')) {
                        window.restorePreviousChat();
                    }
                } else {
                    if (typeof showNotification === 'function') {
                        showNotification('Invalid chat history file', 'danger');
                    }
                }
            } catch (error) {
                console.error('Error importing chat:', error);
                if (typeof showNotification === 'function') {
                    showNotification('Error importing chat history', 'danger');
                }
            }
        };

        reader.readAsText(file);
    };

    input.click();
};

// Helper functions
function getAvailableMoviesForAI() {
    if (typeof moviesData === 'undefined') {
        console.warn('moviesData not available');
        return [];
    }

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
        if (typeof moviesData === 'undefined') {
            if (typeof showNotification === 'function') {
                showNotification('Movie data not available', 'warning');
            }
            return;
        }

        const allContent = [...moviesData.trending, ...moviesData.movies, ...moviesData.series];
        const movie = allContent.find(item => item.id === movieId);

        if (!movie) {
            if (typeof showNotification === 'function') {
                showNotification('Content not available on platform', 'warning');
            }
            return;
        }

        const aiModal = bootstrap.Modal.getInstance(document.getElementById('aiChatModal'));
        if (aiModal) aiModal.hide();

        if (typeof showNotification === 'function') {
            showNotification('🎬 Launching your personalized selection...', 'info');
        }

        if (typeof showMovieInfo === 'function') {
            await showMovieInfo(movie);
        }

        if (typeof showNotification === 'function') {
            showNotification(`🎯 Now featuring: ${movie.title} - Enjoy your AI-curated experience!`, 'success');
        }

    } catch (error) {
        console.error('Error:', error);
        if (typeof showNotification === 'function') {
            showNotification('Unable to launch content. Please try again.', 'danger');
        }
    }
};

// Enhanced start experience function
function startExperience() {
    if (typeof showNotification === 'function') {
        showNotification('🧠 Initializing Advanced Neural System...', 'info');
    }

    setTimeout(() => {
        // Use global modal instance
        if (aiChatModalInstance) {
            aiChatModalInstance.show();
        } else {
            const aiChatModal = document.getElementById('aiChatModal');
            if (aiChatModal) {
                const modal = new bootstrap.Modal(aiChatModal);
                modal.show();
            }
        }

        setTimeout(() => {
            const aiChatInput = document.getElementById('aiChatInput');
            if (aiChatInput) aiChatInput.focus();
        }, 500);

        if (typeof showNotification === 'function') {
            showNotification('🤖 Welcome to the future of entertainment AI!', 'success');
        }
    }, 1000);
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAIChat();

    // Initialize modal instances
    const aiChatModalElement = document.getElementById('aiChatModal');
    const clearChatModalElement = document.getElementById('clearChatModal');

    if (aiChatModalElement) {
        aiChatModalInstance = new bootstrap.Modal(aiChatModalElement);
    }

    if (clearChatModalElement) {
        clearChatModalInstance = new bootstrap.Modal(clearChatModalElement, {
            backdrop: 'static',
            keyboard: false
        });
    }
});