// GreenSpot Gardens FAQ Chatbot - Multi-Language Edition
(function () {
    // Current language (default: English)
    let currentLang = 'en';

    // Available languages
    const languages = {
        en: { name: 'English', flag: '🇬🇧' },
        sw: { name: 'Kiswahili', flag: '🇰🇪' },
        ki: { name: 'Gĩkũyũ', flag: '🏔️' },
        ka: { name: 'Kĩkamba', flag: '🌄' },
        lu: { name: 'Dholuo', flag: '🐟' },
        lh: { name: 'Luhya', flag: '🌾' }
    };

    // Translations for all responses
    const translations = {
        // Welcome message
        welcome: {
            en: "Hello! 👋 Welcome to GreenSpot Gardens! I'm here to help you with bookings, menu info, events, and more. What would you like to know?",
            sw: "Habari! 👋 Karibu GreenSpot Gardens! Niko hapa kukusaidia na bookings, menu, events, na zaidi. Ungependa kujua nini?",
            ki: "Wĩ mwega! 👋 Karibu GreenSpot Gardens! Nĩ ngũteithia na bookings, menu, events, na ingĩ. Ũrenda kũmenya atĩa?",
            ka: "Wĩ mweu! 👋 Karibu GreenSpot Gardens! Nĩ ngũteithia na bookings, menu, events, na ingĩ. Wendaa kumanya kĩĩ?",
            lu: "Ber ahinya! 👋 Karibu GreenSpot Gardens! An kae mondo akonyi gi bookings, menu, events, kod mang'eny. Idwaro ng'eyo ang'o?",
            lh: "Mulembe! 👋 Karibu GreenSpot Gardens! Ndi hano okhukhwasaidia na bookings, menu, events, nende ebindi. Owenyanga okumania ki?"
        },

        // Greetings
        greetings: {
            en: "Hello! 👋 Welcome to GreenSpot Gardens! How can I help you today?",
            sw: "Habari! 👋 Karibu GreenSpot Gardens! Naweza kukusaidia vipi leo?",
            ki: "Wĩ mwega! 👋 Karibu GreenSpot Gardens! Ndĩngĩgũteithia atĩa ũmũthĩ?",
            ka: "Wĩ mweu! 👋 Karibu GreenSpot Gardens! Ndĩngĩkũteithia atĩa ũmũnthi?",
            lu: "Ber ahinya! 👋 Karibu GreenSpot Gardens! Anyalo konyi nade kawuono?",
            lh: "Mulembe! 👋 Karibu GreenSpot Gardens! Nanyala okhukhasaidia otia lero?"
        },

        // Hours
        hours: {
            en: "🕐 We're open:\n• Monday - Thursday: 10AM - 10PM\n• Friday - Saturday: 10AM - 2AM\n• Sunday: 10AM - 10PM\n\nWe recommend booking ahead for weekends!",
            sw: "🕐 Tunafungua:\n• Jumatatu - Alhamisi: 10AM - 10PM\n• Ijumaa - Jumamosi: 10AM - 2AM\n• Jumapili: 10AM - 10PM\n\nTunapendekeza booking mapema kwa weekends!",
            ki: "🕐 Tũhingũraga:\n• Mũthenya wa mbere - wa ĩna: 10AM - 10PM\n• Thũrũ - Kĩamemwe: 10AM - 2AM\n• Kĩumĩa: 10AM - 10PM\n\nTũkũhokeria booking mbere ya weekends!",
            ka: "🕐 Twĩhingũlaga:\n• Monday - Thursday: 10AM - 10PM\n• Friday - Saturday: 10AM - 2AM\n• Sunday: 10AM - 10PM\n\nTwĩkũhoya booking mbee ya weekends!",
            lu: "🕐 Wanyalo:\n• Wuok Tich - Tich Ariyo: 10AM - 10PM\n• Tich Abich - Ngeso: 10AM - 2AM\n• Jumapil: 10AM - 10PM\n\nWapwoyo booking motelo ne weekends!",
            lh: "🕐 Khufungula:\n• Jumatatu - Alhamisi: 10AM - 10PM\n• Ijumaa - Jumamosi: 10AM - 2AM\n• Jumapili: 10AM - 10PM\n\nKhusaba booking inza ne weekends!"
        },

        // Booking
        booking: {
            en: "📅 To book a table:\n1. Visit our Bookings page\n2. Or call us: 0110-057-300\n3. Or WhatsApp us directly!\n\nWe recommend booking in advance for weekends and events.",
            sw: "📅 Kufanya booking:\n1. Tembelea ukurasa wetu wa Bookings\n2. Au tupigie: 0110-057-300\n3. Au WhatsApp moja kwa moja!\n\nTunapendekeza booking mapema kwa weekends na events.",
            ki: "📅 Gũthondeka booking:\n1. Thĩĩ kũrĩ Bookings page\n2. Kana tũige: 0110-057-300\n3. Kana WhatsApp!\n\nTũkũhokeria booking mbere ya weekends na events.",
            ka: "📅 Kwĩka booking:\n1. Enda kwa Bookings page\n2. Kana tũithe: 0110-057-300\n3. Kana WhatsApp!\n\nTwĩkũhoya booking mbee ya weekends na events.",
            lu: "📅 Mondo ibook mesa:\n1. Lim Bookings page\n2. Kata gochwa: 0110-057-300\n3. Kata WhatsApp!\n\nWapwoyo booking motelo ne weekends kod events.",
            lh: "📅 Okukhola booking:\n1. Enda Bookings page\n2. Ama khupigira: 0110-057-300\n3. Ama WhatsApp!\n\nKhusaba booking inza ne weekends nende events."
        },

        // Location
        location: {
            en: "📍 We're located in Kamakis, Ruiru along the Eastern Bypass.\n\nLook for the green signage on your left when coming from Nairobi. There's ample parking available!",
            sw: "📍 Tuko Kamakis, Ruiru kando ya Eastern Bypass.\n\nTafuta alama ya kijani upande wa kushoto ukitoka Nairobi. Kuna parking ya kutosha!",
            ki: "📍 Tũrĩ Kamakis, Ruiru hakuhĩ na Eastern Bypass.\n\nCaria sign ya green rũo rwa ũmotho ũkĩũka kuuma Nairobi. Kũrĩ parking nyingĩ!",
            ka: "📍 Twĩ Kamakis, Ruiru hakuhĩ na Eastern Bypass.\n\nSyia sign ya green mwena wa ũmotho ũkĩũka kuuma Nairobi. Kwĩna parking nyingĩ!",
            lu: "📍 Wan Kamakis, Ruiru but Eastern Bypass.\n\nRang' sign makwar e bathi korachwich ka ibiro koa Nairobi. Nitie parking mathoth!",
            lh: "📍 Khuli Kamakis, Ruiru but Eastern Bypass.\n\nLoola sign ya green e mkono wa khushoto ukhumalila Nairobi. Hali parking nyingi!"
        },

        // Menu
        menu: {
            en: "🍖 Our specialties include:\n• Signature Nyama Choma (Mbuzi & Beef)\n• Traditional Kenyan dishes\n• Premium cocktails & wines\n• Ice cold beers\n\nCheck our full Menu page for details!",
            sw: "🍖 Specialties zetu:\n• Nyama Choma maalum (Mbuzi & Ng'ombe)\n• Vyakula vya kiasili\n• Cocktails na wines bora\n• Bia baridi\n\nAngalia Menu page kwa details!",
            ki: "🍖 Irio ciitũ njega:\n• Nyama Choma (Mbũri na Ng'ombe)\n• Mĩnanda ya gĩthaka\n• Cocktails na wines\n• Bia ithariri\n\nEka Menu page rĩu!",
            ka: "🍖 Ilyaũ syetũ nzeo:\n• Nyama Choma (Mbũi na Ng'ombe)\n• Maakũla ma kĩthakani\n• Cocktails na wines\n• Bia itharĩĩ\n\nEnga Menu page ndĩa!",
            lu: "🍖 Chiemb marwa:\n• Nyama Choma (Diel gi Dhiang')\n• Chiemo mag Kenya\n• Cocktails kod wines maber\n• Bia ma ng'ich\n\nNe Menu page mondo ing'e moloyo!",
            lh: "🍖 Ebyakulya byefu:\n• Nyama Choma (Embusi ne Eng'ombe)\n• Byakulya bya Kenya\n• Cocktails nende wines\n• Bia ya munyolo\n\nLola Menu page khu details!"
        },

        // Events
        events: {
            en: "🎵 Weekly Events:\n• Friday: Jazz Night 🎷\n• Saturday: Live Band 🎸\n• Sunday: Love & Chill 💕\n\nVisit our Events page for the full calendar!",
            sw: "🎵 Events za kila wiki:\n• Ijumaa: Jazz Night 🎷\n• Jumamosi: Live Band 🎸\n• Jumapili: Love & Chill 💕\n\nTembelea Events page kwa kalenda kamili!",
            ki: "🎵 Events cia kĩa wiki:\n• Thũrũ: Jazz Night 🎷\n• Kĩamemwe: Live Band 🎸\n• Kĩumĩa: Love & Chill 💕\n\nThĩĩ Events page kũona calendar!",
            ka: "🎵 Events sya kĩa muĩa:\n• Friday: Jazz Night 🎷\n• Saturday: Live Band 🎸\n• Sunday: Love & Chill 💕\n\nEnda Events page kũona calendar!",
            lu: "🎵 Events mag juma:\n• Tich Abich: Jazz Night 🎷\n• Ngeso: Live Band 🎸\n• Jumapil: Love & Chill 💕\n\nLim Events page ne calendar duto!",
            lh: "🎵 Events tsa buli juma:\n• Ijumaa: Jazz Night 🎷\n• Jumamosi: Live Band 🎸\n• Jumapili: Love & Chill 💕\n\nEnda Events page khu calendar yosi!"
        },

        // Parking
        parking: {
            en: "🚗 Yes! We have spacious, secure parking available for all our guests. Our security team is on duty throughout operating hours.",
            sw: "🚗 Ndio! Tuna parking kubwa na salama kwa wageni wote. Timu yetu ya ulinzi iko kazini wakati wote.",
            ki: "🚗 Ii! Tũrĩ na parking nene na thiũ kwa ageni othe. Timu yetu ya ũtungĩri ĩrĩ wĩra hĩndĩ ĩrĩa twahingũkĩte.",
            ka: "🚗 Ii! Twĩna parking nene na yĩ salama kwa ageni onthe. Timu yetu ya ulinzi ĩrĩ wĩra hĩndĩ yonthe.",
            lu: "🚗 Ee! Wan gi parking malach kendo mogeno ni welo duto. Jo security wa ni tich ndalo duto.",
            lh: "🚗 Ee! Khuli nende parking nene nende ya salama khu benyayi bosi. Timu yefu ya security ili e mulimo masaa kosi."
        },

        // Payment
        payment: {
            en: "💳 We accept:\n• M-Pesa\n• Cash\n• Visa/Mastercard\n\nPaybill and Till numbers available at the counter.",
            sw: "💳 Tunakubali:\n• M-Pesa\n• Pesa taslimu\n• Visa/Mastercard\n\nPaybill na Till numbers zipo kwa counter.",
            ki: "💳 Tũukĩrĩra:\n• M-Pesa\n• Mũcĩĩ\n• Visa/Mastercard\n\nPaybill na Till numbers nĩ irĩ kwa counter.",
            ka: "💳 Twĩũkĩĩa:\n• M-Pesa\n• Mbesa\n• Visa/Mastercard\n\nPaybill na Till numbers nĩ ĩla kwa counter.",
            lu: "💳 Warwako:\n• M-Pesa\n• Pesa\n• Visa/Mastercard\n\nPaybill gi Till numbers nitie e counter.",
            lh: "💳 Khukhubalila:\n• M-Pesa\n• Pesa\n• Visa/Mastercard\n\nPaybill nende Till numbers hali e counter."
        },

        // Kids
        kids: {
            en: "👨‍👩‍👧‍👦 Absolutely! GreenSpot Gardens is family-friendly. We have open green spaces where kids can play safely while you enjoy your meal.",
            sw: "👨‍👩‍👧‍👦 Kabisa! GreenSpot Gardens ni rafiki kwa familia. Tuna maeneo ya kijani ambapo watoto wanaweza kucheza salama ukifurahia chakula chako.",
            ki: "👨‍👩‍👧‍👦 Ii! GreenSpot Gardens nĩ mwega kũrĩa ciana. Tũrĩ na mahũndũ ma thayu kũrĩa ciana cingĩkinya thiĩ na wega.",
            ka: "👨‍👩‍👧‍👦 Ii! GreenSpot Gardens nĩ mweu kwa mwĩĩ. Twĩna mahala ma thayu kũla ciana syĩngĩkĩnya wĩa salama.",
            lu: "👨‍👩‍👧‍👦 Adier! GreenSpot Gardens ohero joot. Wan gi kuonde ma rawe ma nyithindo nyalo tugo ka gi kwe ka ichamoka.",
            lh: "👨‍👩‍👧‍👦 Ee! GreenSpot Gardens ni rafiki na bamilia. Khuli nende mahali ma green mala abana banyala okhutsiakila salama."
        },

        // Contact
        contact: {
            en: "📞 Contact us:\n• Phone: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nWe'd love to hear from you!",
            sw: "📞 Wasiliana nasi:\n• Simu: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nTunapenda kusikia kutoka kwako!",
            ki: "📞 Tũitĩĩrie:\n• Thĩmũ: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nTũkwenda kũiguua kuuma kwaku!",
            ka: "📞 Twĩthĩĩe:\n• Simu: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nTwendaa kwĩgua kuuma kwaku!",
            lu: "📞 Wuoruok kodwa:\n• Simu: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nDwaro winjo kodi!",
            lh: "📞 Piga simu:\n• Simu: 0110-057-300\n• WhatsApp: 0110-057-300\n• Email: contact.denkaai@gmail.com\n\nKhwenyanga okhuhulila kuwe!"
        },

        // Thanks
        thanks: {
            en: "You're welcome! 😊 Is there anything else I can help you with? Feel free to ask!",
            sw: "Karibu sana! 😊 Kuna kitu kingine naweza kukusaidia? Uliza tu!",
            ki: "Nĩ wega! 😊 Kũrĩ ũndũ ũngĩ ndĩngĩgũteithia? Ũria tu!",
            ka: "Nĩ mweu! 😊 Kwĩna kĩndũ kĩngĩ ndĩngĩkũteithia? Ũĩa tu!",
            lu: "Erokamano! 😊 Nitie gik moko manyalo konyi? Penj mana!",
            lh: "Wesanze! 😊 Hali ebindi nanyala okhukhasaidia? Lalumiala tu!"
        },

        // Fallback
        fallback: {
            en: "I'm not sure about that, but I'd love to help! 😊\n\nYou can:\n• Ask about our menu, hours, or events\n• Or chat with us directly on WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>",
            sw: "Sijui sana kuhusu hilo, lakini ningependa kusaidia! 😊\n\nUnaweza:\n• Uliza kuhusu menu, masaa, au events\n• Au ongea nasi moja kwa moja WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>",
            ki: "Ndiui mũno ũhoro ũcio, no ningĩenda gũteithia! 😊\n\nŨngĩhota:\n• Ũria ũhoro wa menu, mathaa, kana events\n• Kana arie natwĩ WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>",
            ka: "Ndĩsĩ mũno ũhoro ũsu, lakini ndĩkwenda kũteithia! 😊\n\nŨngĩhota:\n• Ũĩa ũhoro wa menu, masaa, kana events\n• Kana aĩe natwĩ WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>",
            lu: "Ok ang'eyo maber wachno, to daher konyi! 😊\n\nInyalo:\n• Penjo kuom menu, seche, kata events\n• Kata wuoyo kodwa e WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>",
            lh: "Sindimanyile sana ebyo, naye nyenyanga okhukhasaidia! 😊\n\nOnyala:\n• Olalumiala kuhusu menu, masaa, ama events\n• Ama okhulomela nasi e WhatsApp: <a href='https://wa.me/254110057300' target='_blank'>0110-057-300</a>"
        },

        // Quick replies
        quickReplies: {
            en: [
                { text: "📅 Book a Table", query: "How do I book?" },
                { text: "🕐 Opening Hours", query: "What are your hours?" },
                { text: "📍 Location", query: "Where are you located?" },
                { text: "🍖 Menu", query: "What's on the menu?" },
                { text: "🎵 Events", query: "What events do you have?" }
            ],
            sw: [
                { text: "📅 Book Meza", query: "Ninafanyaje booking?" },
                { text: "🕐 Masaa", query: "Mnafungua saa ngapi?" },
                { text: "📍 Mahali", query: "Mko wapi?" },
                { text: "🍖 Menu", query: "Mna nini kwa menu?" },
                { text: "🎵 Events", query: "Mna events gani?" }
            ],
            ki: [
                { text: "📅 Thondeka", query: "Ndĩthondeka atĩa?" },
                { text: "🕐 Mathaa", query: "Mũhingũraga rĩ?" },
                { text: "📍 Gũkũ", query: "Mũrĩ kũ?" },
                { text: "🍖 Irio", query: "Mũrĩ na mĩnanda ĩrĩkũ?" },
                { text: "🎵 Events", query: "Mũrĩ na events irĩkũ?" }
            ],
            ka: [
                { text: "📅 Thondeka", query: "Ndĩthondeka atĩa?" },
                { text: "🕐 Masaa", query: "Mũĩfungulaga ĩ?" },
                { text: "📍 Haha", query: "Mũĩ kũ?" },
                { text: "🍖 Ilyaũ", query: "Mũĩna maakũla mau?" },
                { text: "🎵 Events", query: "Mũĩna events syau?" }
            ],
            lu: [
                { text: "📅 Book Mesa", query: "Abooko nade?" },
                { text: "🕐 Seche", query: "Uyawo seche adi?" },
                { text: "📍 Kama", query: "Un kanye?" },
                { text: "🍖 Chiemo", query: "Un gi chiemo mane?" },
                { text: "🎵 Events", query: "Un gi events mage?" }
            ],
            lh: [
                { text: "📅 Book Mesa", query: "Ndikhola booking otia?" },
                { text: "🕐 Masaa", query: "Mufungula masaa kaki?" },
                { text: "📍 Mahali", query: "Muli hena?" },
                { text: "🍖 Ebyakulya", query: "Muli nende ebyakulya ki?" },
                { text: "🎵 Events", query: "Muli nende events ki?" }
            ]
        },

        // Language selector label
        langLabel: {
            en: "Language",
            sw: "Lugha",
            ki: "Rũthaaya",
            ka: "Lũkha",
            lu: "Dhok",
            lh: "Olulimi"
        }
    };

    // Keywords for matching (same across languages)
    const keywords = {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'habari', 'sasa', 'niaje', 'mambo', 'vipi', 'hujambo', 'shikamoo', 'salamu', 'mulembe', 'ber', 'wĩ mwega'],
        hours: ['hours', 'open', 'close', 'time', 'when', 'opening', 'closing', 'masaa', 'saa', 'mathaa', 'seche'],
        booking: ['book', 'reserve', 'reservation', 'table', 'seat', 'booking', 'meza', 'thondeka'],
        location: ['where', 'location', 'address', 'direction', 'find', 'map', 'place', 'kamakis', 'wapi', 'mahali', 'kũ', 'kanye', 'hena'],
        menu: ['menu', 'food', 'eat', 'choma', 'nyama', 'drink', 'price', 'cost', 'irio', 'chiemo', 'ebyakulya', 'maakũla'],
        events: ['event', 'music', 'jazz', 'band', 'live', 'friday', 'saturday', 'sunday', 'entertainment', 'sherehe'],
        parking: ['parking', 'park', 'car', 'vehicle', 'security', 'gari', 'motokaa'],
        payment: ['pay', 'mpesa', 'card', 'cash', 'payment', 'lipa', 'mbesa', 'pesa'],
        kids: ['kid', 'child', 'children', 'family', 'playground', 'ciana', 'watoto', 'nyithindo', 'abana'],
        contact: ['contact', 'call', 'phone', 'number', 'reach', 'whatsapp', 'simu', 'piga'],
        thanks: ['thank', 'thanks', 'asante', 'appreciated', 'shukran', 'erokamano', 'wesanze']
    };

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
                    <div class="lang-selector">
                        <select id="gs-lang-select" title="Select Language">
                            ${Object.entries(languages).map(([code, lang]) =>
            `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${lang.flag} ${lang.name}</option>`
        ).join('')}
                        </select>
                    </div>
                    <button class="chat-close" id="gs-chat-close">×</button>
                </div>
                <div class="gs-chat-messages" id="gs-chat-messages">
                    <div class="chat-message bot">
                        <div class="message-content">
                            ${translations.welcome[currentLang]}
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
        updateQuickReplies();

        // Event Listeners
        document.getElementById('gs-chat-toggle').onclick = toggleChat;
        document.getElementById('gs-chat-close').onclick = toggleChat;
        document.getElementById('gs-send-btn').onclick = sendMessage;
        document.getElementById('gs-user-input').onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };
        document.getElementById('gs-lang-select').onchange = (e) => {
            currentLang = e.target.value;
            updateQuickReplies();
            addMessage(translations.greetings[currentLang], true);
        };
    }

    function updateQuickReplies() {
        const container = document.getElementById('gs-quick-replies');
        if (!container) return;
        container.innerHTML = '';
        translations.quickReplies[currentLang].forEach(qr => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = qr.text;
            btn.onclick = () => handleUserMessage(qr.query);
            container.appendChild(btn);
        });
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

    function sendMessage() {
        const input = document.getElementById('gs-user-input');
        if (input.value.trim()) {
            handleUserMessage(input.value);
            input.value = '';
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

        for (const category in keywords) {
            for (const keyword of keywords[category]) {
                if (lowerMessage.includes(keyword)) {
                    return translations[category][currentLang];
                }
            }
        }

        return translations.fallback[currentLang];
    }

    function handleUserMessage(message) {
        addMessage(message, false);
        document.getElementById('gs-quick-replies').style.display = 'none';

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
                left: 20px;
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
                left: 0;
                width: 370px;
                max-width: 90vw;
                height: 480px;
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
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }

            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }

            .chat-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
            }

            .chat-header-info h4 {
                margin: 0;
                font-size: 0.9rem;
            }

            .online-status {
                font-size: 0.7rem;
                color: #90EE90;
            }

            .lang-selector select {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 5px 8px;
                border-radius: 8px;
                font-size: 0.75rem;
                cursor: pointer;
                outline: none;
            }

            .lang-selector select option {
                background: #1a3d17;
                color: white;
            }

            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                margin-left: 5px;
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

            .chat-message.bot { align-self: flex-start; }
            .chat-message.user { align-self: flex-end; }

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
                #gs-chatbot { bottom: 80px; left: 10px; }
                .gs-chat-window { width: 300px; height: 400px; }
                .chat-header-info h4 { font-size: 0.8rem; }
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
