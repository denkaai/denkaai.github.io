const GIGI_CONFIG = {
    name: "Gigi",
    role: "Garden Concierge",
    avatar: "🌿",
    systemPrompt: "You are Gigi, the friendly Garden Concierge at Green Sports Gardens. Your goal is to guide guests through exploring our menu, making table reservations, and inquiring about private events. You are warm, professional, and helpful. Do not mention sports or the football/basketball facilities as they have been discontinued. Focus on our premium garden atmosphere and artisanal dining.",
    facilities: [
        { id: 'lounge', name: 'Garden Lounge Reservation', description: 'Experience our serene outdoor lounge.' },
        { id: 'dining', name: 'Signature Dining Table', description: 'Enjoy our master-chef grilled delicacies.' },
        { id: 'events', name: 'Private Event Inquiry', description: 'Host your special moments in our gardens.' },
        { id: 'drinks', name: 'Mixology Experience', description: 'Curated cocktails and premium sips.' }
    ],
    whatsappNumber: "254110057300"
};

class GigiAssistant {
    constructor() {
        this.isOpen = false;
        this.state = 'GREETING'; // GREETING -> DATE -> TIME -> PEOPLE -> CONTACT -> CONFIRM
        this.bookingData = {
            facility: null,
            date: null,
            time: null,
            people: null,
            contact: null
        };
        this.messages = [];
        this.init();
    }

    init() {
        this.renderChatWidget();
        this.addBotMessage("Hi there! I'm Gigi. Welcome to Green Sports Gardens. How can I help you enjoy our garden today?");
    }

    renderChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'gigi-chat-widget';
        widget.innerHTML = `
            <div id="gigi-bubble" class="gigi-bubble">
                <div class="gigi-avatar">${GIGI_CONFIG.avatar}</div>
                <span class="gigi-status">Talk to Gigi</span>
            </div>
            <div id="gigi-window" class="gigi-window">
                <div class="gigi-header">
                    <div class="gigi-info">
                        <div class="avatar">${GIGI_CONFIG.avatar}</div>
                        <div>
                            <h4>${GIGI_CONFIG.name}</h4>
                            <small>${GIGI_CONFIG.role}</small>
                        </div>
                    </div>
                    <button id="close-gigi">&times;</button>
                </div>
                <div id="gigi-messages" class="gigi-messages"></div>
                <div class="gigi-input-area">
                    <input type="text" id="gigi-input" placeholder="Message Gigi..." autocomplete="off">
                    <button id="send-gigi"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('gigi-bubble').onclick = () => this.toggleWindow();
        document.getElementById('close-gigi').onclick = () => this.toggleWindow();
        document.getElementById('send-gigi').onclick = () => this.handleUserInput();
        document.getElementById('gigi-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        };
    }

    toggleWindow() {
        const win = document.getElementById('gigi-window');
        win.classList.toggle('active');
        if (win.classList.contains('active')) {
            document.getElementById('gigi-input').focus();
        }
    }

    addBotMessage(text) {
        this.addMessage(text, 'bot');
    }

    addUserMessage(text) {
        this.addMessage(text, 'user');
    }

    addMessage(text, side) {
        const container = document.getElementById('gigi-messages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${side}`;
        msgDiv.innerHTML = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
        this.messages.push({ text, side });
    }

    handleUserInput() {
        const input = document.getElementById('gigi-input');
        const text = input.value.trim();
        if (!text) return;

        this.addUserMessage(text);
        input.value = '';

        setTimeout(() => this.processResponse(text), 600);
    }

    processResponse(text) {
        const lower = text.toLowerCase();

        if (this.state === 'GREETING' && (lower.includes('book') || lower.includes('reserve') || lower.includes('table'))) {
            this.state = 'FACILITY';
            let options = GIGI_CONFIG.facilities.map(f => f.name).join(', ');
            this.addBotMessage(`I'd love to help you with a reservation! What are you looking for? We have: ${options}.`);
            return;
        }

        switch (this.state) {
            case 'FACILITY':
                this.bookingData.facility = text;
                this.state = 'DATE';
                this.addBotMessage(`Perfect. What date would you like to visit us?`);
                break;
            case 'DATE':
                this.bookingData.date = text;
                this.state = 'TIME';
                this.addBotMessage("Great! And what time should we expect you?");
                break;
            case 'TIME':
                this.bookingData.time = text;
                this.state = 'PEOPLE';
                this.addBotMessage("Excellent. How many guests will be in your party?");
                break;
            case 'PEOPLE':
                this.bookingData.people = text;
                this.state = 'CONTACT';
                this.addBotMessage("Lastly, may I have your name and phone number to finalize the request?");
                break;
            case 'CONTACT':
                this.bookingData.contact = text;
                this.state = 'CONFIRM';
                const summary = `Fantastic! I've noted your request:<br>
                - **Space**: ${this.bookingData.facility}<br>
                - **Date**: ${this.bookingData.date}<br>
                - **Time**: ${this.bookingData.time}<br>
                - **Guests**: ${this.bookingData.people}<br><br>
                I'll hand this over to our team on WhatsApp to finalize everything. Click below!`;
                this.addBotMessage(summary);
                this.addWhatsAppButton();
                break;
            default:
                this.addBotMessage("I'm here to help you experience the best of Green Sports Gardens. Would you like to see our menu or make a garden reservation?");
        }
    }

    addWhatsAppButton() {
        const container = document.getElementById('gigi-messages');
        const btn = document.createElement('a');
        btn.className = 'whatsapp-handoff';
        btn.style.marginTop = '15px';
        const msg = `Hi, I'd like to book ${this.bookingData.facility} for ${this.bookingData.people} people on ${this.bookingData.date} at ${this.bookingData.time}. (Ref: Gigi Assistant)`;
        btn.href = `https://wa.me/${GIGI_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        btn.target = "_blank";
        btn.innerHTML = `<i class="fab fa-whatsapp"></i> Finalize on WhatsApp`;
        container.appendChild(btn);
        container.scrollTop = container.scrollHeight;
    }
}

function openGigi(intent) {
    if (!window.gigiAssistant) return;
    const assistant = window.gigiAssistant;

    if (!document.getElementById('gigi-window').classList.contains('active')) {
        assistant.toggleWindow();
    }

    if (intent === 'dining' || intent === 'lounge' || intent === 'events' || intent === 'drinks') {
        assistant.state = 'DATE';
        const facility = GIGI_CONFIG.facilities.find(f => f.id === intent);
        assistant.bookingData.facility = facility ? facility.name : intent;
        assistant.addBotMessage(`I'll help you book the ${assistant.bookingData.facility}. What date are you thinking of?`);
    } else {
        assistant.state = 'GREETING';
        assistant.addBotMessage("How can I help you today? We have beautiful garden spaces and an amazing menu to explore!");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gigiAssistant = new GigiAssistant();
});
