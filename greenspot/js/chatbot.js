// GreenSpot Gardens FAQ Chatbot
(function () {
    // FAQ Database
    const faqs = {
        greetings: {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'habari', 'sasa', 'niaje', 'mambo', 'vipi', 'hujambo', 'shikamoo', 'salamu'],
            response: "Karibu sana! 👋 Habari yako?\n\nPokea salamu kutoka GreenSpot Gardens! Niko hapa kukusaidia na booking, menu, events, na zaidi. Uliza chochote! 🌿"
        },
        hours: {
            keywords: ['hours', 'open', 'close', 'time', 'when', 'opening', 'closing'],
            response: "🕐 We're open:\n• Monday - Thursday: 10AM - 10PM\n• Friday - Saturday: 10AM - 2AM\n• Sunday: 10AM - 10PM\n\nWe recommend booking ahead for weekends!"
        },
        booking: {
            keywords: ['book', 'reserve', 'reservation', 'table', 'seat'],
            response: "📅 To book a table:\n1. Visit our Bookings page\n2. Or call us: 0110-057-300\n3. Or WhatsApp us directly!\n\nWe recommend booking in advance for weekends and events."
        },
        location: {
            keywords: ['where', 'location', 'address', 'direction', 'find', 'map', 'place', 'kamakis'],
            response: "📍 We're located in Kamakis, Ruiru along the Eastern Bypass.\n\nLook for the green signage on your left when coming from Nairobi. There's ample parking available!"
        },
        menu: {
            keywords: ['menu', 'food', 'eat', 'choma', 'nyama', 'drink', 'price', 'cost'],
            response: "🍖 Our specialties include:\n• Signature Nyama Choma (Mbuzi & Beef)\n• Traditional Kenyan dishes\n• Premium cocktails & wines\n• Ice cold beers\n\nCheck our full Menu page for details!"
        },
        events: {
            keywords: ['event', 'music', 'jazz', 'band', 'live', 'friday', 'saturday', 'sunday', 'entertainment'],
            response: "🎵 Weekly Events:\n• Friday: Jazz Night 🎷\n• Saturday: Live Band 🎸\n• Sunday: Love & Chill 💕\n\nVisit our Events page for the full calendar!"
        },
        parking: {
            keywords: ['parking', 'park', 'car', 'vehicle', 'security'],
            response: "🚗 Yes! We have spacious, secure parking available for all our guests. Our security team is on duty throughout operating hours."
        },
        payment: {
            keywords: ['pay', 'mpesa', 'card', 'cash', 'payment'],
            response: "💳 We accept:\n• M-Pesa\n• Cash\n• Visa/Mastercard\n\nPaybill and Till numbers available at the counter."
        },
        kids: {
            keywords: ['kid', 'child', 'children', 'family', 'playground'],
            response: "👨‍👩‍👧‍👦 Absolutely! GreenSpot Gardens is family-friendly. We have open green spaces where kids can play safely while you enjoy your meal."
        },
        contact: {
            keywords: ['contact', 'call', 'phone', 'number', 'reach', 'whatsapp'],
            response: "📞 Contact us:\n• Phone: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nWe'd love to hear from you!"
        },
        thanks: {
            keywords: ['thank', 'thanks', 'asante', 'appreciated', 'shukran'],
            response: "Karibu sana! 😊 Asante kwa kutembelea. Kuna kitu kingine naweza kukusaidia?"
        }
    };

    const quickReplies = [
        { text: "📅 Book a Table", query: "How do I book?" },
        { text: "🕐 Opening Hours", query: "What are your hours?" },
        { text: "📍 Location", query: "Where are you located?" },
        { text: "🍖 Menu", query: "What's on the menu?" },
        { text: "🎵 Events", query: "What events do you have?" }
    ];

    // Create Chat Widget HTML
    function createChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'gs-chatbot';
        widget.innerHTML = `
            <div class="gs-chat-button" id="gs-chat-toggle">
                <i class="fas fa-comment-dots"></i>
                <span class="chat-badge">1</span>
            </div>
            <div class="gs-chat-window" id="gs-chat-window">
                <div class="gs-chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">🌿</div>
                        <div>
                            <h4>GreenSpot Assistant</h4>
                            <span class="online-status">● Online</span>
                        </div>
                    </div>
                    <button class="chat-close" id="gs-chat-close">×</button>
                </div>
                <div class="gs-chat-messages" id="gs-chat-messages">
                    <div class="chat-message bot">
                        <div class="message-content">
                            Karibu sana! 👋 Habari yako? Mimi ni msaidizi wa GreenSpot Gardens. Naweza kukusaidia vipi leo?
                        </div>
                    </div>
                    <div class="quick-replies" id="gs-quick-replies"></div>
                </div>
                <div class="gs-chat-input">
                    <input type="text" id="gs-user-input" placeholder="Type your message..." autocomplete="off">
                    <button id="gs-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // Add Quick Replies
        const quickRepliesContainer = document.getElementById('gs-quick-replies');
        quickReplies.forEach(qr => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = qr.text;
            btn.onclick = () => handleUserMessage(qr.query);
            quickRepliesContainer.appendChild(btn);
        });

        // Event Listeners
        document.getElementById('gs-chat-toggle').onclick = toggleChat;
        document.getElementById('gs-chat-close').onclick = toggleChat;
        document.getElementById('gs-send-btn').onclick = () => {
            const input = document.getElementById('gs-user-input');
            if (input.value.trim()) {
                handleUserMessage(input.value);
                input.value = '';
            }
        };
        document.getElementById('gs-user-input').onkeypress = (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('gs-user-input');
                if (input.value.trim()) {
                    handleUserMessage(input.value);
                    input.value = '';
                }
            }
        };
    }

    function toggleChat() {
        const window = document.getElementById('gs-chat-window');
        const badge = document.querySelector('.chat-badge');
        window.classList.toggle('active');
        if (window.classList.contains('active')) {
            badge.style.display = 'none';
            document.getElementById('gs-user-input').focus();
        }
    }

    function addMessage(text, isBot = false) {
        const messagesContainer = document.getElementById('gs-chat-messages');
        const quickReplies = document.getElementById('gs-quick-replies');

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isBot ? 'bot' : 'user'}`;
        messageDiv.innerHTML = `<div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;

        messagesContainer.insertBefore(messageDiv, quickReplies);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function findResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        for (const category in faqs) {
            for (const keyword of faqs[category].keywords) {
                if (lowerMessage.includes(keyword)) {
                    return faqs[category].response;
                }
            }
        }

        // Fallback response
        return "I'm not sure about that, but I'd love to help! 😊\n\nYou can:\n• Ask about our menu, hours, or events\n• Or chat with us directly on WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>";
    }

    function handleUserMessage(message) {
        addMessage(message, false);

        // Hide quick replies after first message
        document.getElementById('gs-quick-replies').style.display = 'none';

        // Simulate typing delay
        setTimeout(() => {
            const response = findResponse(message);
            addMessage(response, true);
        }, 500);
    }

    // Inject Styles
    function injectStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            #gs-chatbot {
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
            }

            .gs-chat-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-green, #2d5a27) 0%, #1a3d17 100%);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(45, 90, 39, 0.4);
                transition: transform 0.3s, box-shadow 0.3s;
                font-size: 1.5rem;
                position: relative;
            }

            .gs-chat-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(45, 90, 39, 0.5);
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--accent-gold, #c9a227);
                color: #000;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                font-size: 0.75rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .gs-chat-window {
                position: absolute;
                bottom: 75px;
                right: 0;
                width: 350px;
                max-width: 90vw;
                height: 450px;
                background: var(--card-bg, #fff);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .gs-chat-window.active {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .gs-chat-header {
                background: linear-gradient(135deg, var(--primary-green, #2d5a27) 0%, #1a3d17 100%);
                color: white;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .chat-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .chat-header-info h4 {
                margin: 0;
                font-size: 0.95rem;
            }

            .online-status {
                font-size: 0.75rem;
                color: #90EE90;
            }

            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .gs-chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .chat-message {
                max-width: 85%;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .chat-message.bot {
                align-self: flex-start;
            }

            .chat-message.user {
                align-self: flex-end;
            }

            .message-content {
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .chat-message.bot .message-content {
                background: #f0f0f0;
                color: #333;
                border-bottom-left-radius: 4px;
            }

            .chat-message.user .message-content {
                background: linear-gradient(135deg, var(--primary-green, #2d5a27) 0%, #1a3d17 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }

            [data-theme="dark"] .chat-message.bot .message-content {
                background: #3a3a3a;
                color: #eee;
            }

            .quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .quick-reply-btn {
                background: transparent;
                border: 1px solid var(--primary-green, #2d5a27);
                color: var(--primary-green, #2d5a27);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .quick-reply-btn:hover {
                background: var(--primary-green, #2d5a27);
                color: white;
            }

            .gs-chat-input {
                display: flex;
                padding: 12px;
                border-top: 1px solid rgba(0,0,0,0.1);
                gap: 10px;
            }

            .gs-chat-input input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 24px;
                padding: 10px 16px;
                font-size: 0.9rem;
                outline: none;
                transition: border-color 0.2s;
            }

            .gs-chat-input input:focus {
                border-color: var(--primary-green, #2d5a27);
            }

            .gs-chat-input button {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                border: none;
                background: var(--primary-green, #2d5a27);
                color: white;
                cursor: pointer;
                transition: background 0.2s;
            }

            .gs-chat-input button:hover {
                background: #1a3d17;
            }

            .message-content a {
                color: var(--accent-gold, #c9a227);
                text-decoration: underline;
            }

            @media (max-width: 480px) {
                #gs-chatbot {
                    bottom: 80px;
                    right: 10px;
                }
                .gs-chat-window {
                    width: 300px;
                    height: 400px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                injectStyles();
                createChatWidget();
            });
        } else {
            injectStyles();
            createChatWidget();
        }
    }

    init();
})();
