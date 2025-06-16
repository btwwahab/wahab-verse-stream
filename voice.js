class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.voices = [];
        this.currentVoice = null;
        
        this.initializeVoiceAssistant();
        this.loadVoices();
    }

    initializeVoiceAssistant() {
        if (!this.isSupported) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        // Event listeners
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceButton(true);
            this.showVoiceIndicator();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceButton(false);
            this.hideVoiceIndicator();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.handleVoiceInput(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateVoiceButton(false);
            this.hideVoiceIndicator();
            
            let errorMessage = '';
            switch(event.error) {
                case 'network':
                    errorMessage = 'Network error occurred';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied';
                    break;
                case 'no-speech':
                    errorMessage = 'No speech detected';
                    break;
                default:
                    errorMessage = 'Voice recognition error';
            }
            
            showNotification(errorMessage, 'warning');
        };
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // Find the best AI-like voice
        this.currentVoice = this.voices.find(voice => 
            voice.name.includes('Google') && voice.lang.startsWith('en')
        ) || this.voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || this.voices.find(voice => 
            voice.lang.startsWith('en')
        ) || this.voices[0];

        // Re-load voices when they change (some browsers load them asynchronously)
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    startListening() {
        if (!this.isSupported) {
            showNotification('Voice recognition not supported in this browser', 'warning');
            return;
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            showNotification('Error starting voice recognition', 'danger');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    handleVoiceInput(transcript) {
        const aiChatInput = document.getElementById('aiChatInput');
        if (aiChatInput) {
            aiChatInput.value = transcript;
            
            // Trigger the send function
            const sendButton = document.getElementById('aiChatSend');
            if (sendButton) {
                sendButton.click();
            }
        }
        
        showNotification(`Voice input: "${transcript}"`, 'info');
    }

    speak(text, callback = null) {
        if (!text) return;

        // Stop any ongoing speech
        this.synthesis.cancel();

        // Clean text for better speech
        const cleanText = this.cleanTextForSpeech(text);
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configure voice
        if (this.currentVoice) {
            utterance.voice = this.currentVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        // Event listeners
        utterance.onstart = () => {
            this.updateSpeakButton(true);
        };

        utterance.onend = () => {
            this.updateSpeakButton(false);
            if (callback) callback();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.updateSpeakButton(false);
            showNotification('Error speaking response', 'warning');
        };

        this.synthesis.speak(utterance);
    }

    cleanTextForSpeech(text) {
        // Remove HTML tags
        let cleanText = text.replace(/<[^>]*>/g, ' ');
        
        // Replace common symbols and formatting
        cleanText = cleanText
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, 'and')
            .replace(/&lt;/g, 'less than')
            .replace(/&gt;/g, 'greater than')
            .replace(/🎬|🎭|🎯|🧠|⭐|🚀|💝|😃|😌|🤔/g, '') // Remove emojis
            .replace(/\*\*/g, '') // Remove markdown bold
            .replace(/\n+/g, '. ') // Replace line breaks with periods
            .replace(/\s+/g, ' ') // Replace multiple spaces
            .trim();

        // Limit length for better speech
        if (cleanText.length > 500) {
            cleanText = cleanText.substring(0, 500) + '... and more details are available in the text.';
        }

        return cleanText;
    }

    stopSpeaking() {
        this.synthesis.cancel();
        this.updateSpeakButton(false);
    }

    updateVoiceButton(isListening) {
        const voiceBtn = document.getElementById('voiceInputBtn');
        if (!voiceBtn) return;

        if (isListening) {
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            voiceBtn.classList.add('listening');
            voiceBtn.title = 'Stop listening';
        } else {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.classList.remove('listening');
            voiceBtn.title = 'Start voice input';
        }
    }

    updateSpeakButton(isSpeaking) {
        const speakBtns = document.querySelectorAll('.speak-response-btn');
        speakBtns.forEach(btn => {
            if (isSpeaking) {
                btn.innerHTML = '<i class="fas fa-stop"></i>';
                btn.classList.add('speaking');
                btn.title = 'Stop speaking';
            } else {
                btn.innerHTML = '<i class="fas fa-volume-up"></i>';
                btn.classList.remove('speaking');
                btn.title = 'Read response aloud';
            }
        });
    }

    showVoiceIndicator() {
        const indicator = document.getElementById('voiceIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }

    hideVoiceIndicator() {
        const indicator = document.getElementById('voiceIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

// Initialize voice assistant
let voiceAssistant = null;

document.addEventListener('DOMContentLoaded', () => {
    voiceAssistant = new VoiceAssistant();
});

// Expose functions globally
window.startVoiceInput = function() {
    if (voiceAssistant) {
        voiceAssistant.startListening();
    }
};

window.speakResponse = function(text) {
    if (voiceAssistant) {
        voiceAssistant.speak(text);
    }
};

window.stopSpeaking = function() {
    if (voiceAssistant) {
        voiceAssistant.stopSpeaking();
    }
};