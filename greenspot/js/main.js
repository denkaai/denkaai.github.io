document.addEventListener('DOMContentLoaded', () => {
    // Inject Components
    const navHTML = `
        <div class="nav-container">
            <a href="index.html" class="logo">GREEN SPORTS <span>GARDENS</span></a>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="facilities.html">Facilities</a>
                <a href="events.html">Events</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
                <a href="#gigi" class="btn btn-primary" onclick="toggleGigi()">Talk to Gigi</a>
            </div>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
        </div>
        <div class="mobile-nav">
            <a href="index.html">Home</a>
            <a href="facilities.html">Facilities</a>
            <a href="events.html">Events</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="https://wa.me/254110057300" class="whatsapp-btn"><i class="fab fa-whatsapp"></i> 0110-057-300</a>
        </div>
    `;

    const footerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h3>GREEN SPORTS GARDENS</h3>
                <p>The premier garden dining and relaxation destination in Kamakis, Ruiru.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <a href="facilities.html">Our facilities</a><br>
                <a href="events.html">Events & Vibe</a><br>
                <a href="about.html">Our Legacy</a><br>
                <a href="contact.html">Contact Us</a>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p><i class="fas fa-phone"></i> +254 110 057 300</p>
                <p><i class="fas fa-envelope"></i> hello@greensportsgardens.co.ke</p>
                <div class="social-links">
                    <a href="#" target="_blank"><i class="fab fa-facebook"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Green Sports Gardens. All rights reserved.</p>
        </div>
    `;

    const nav = document.querySelector('nav');
    if (nav) nav.innerHTML = navHTML;

    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = footerHTML;

    // Floating WhatsApp Button
    const waFloat = document.createElement('a');
    waFloat.href = "https://wa.me/254110057300?text=Hello%20GreenSpot%20Gardens,%20I’d%20like%20to%20make%20a%20booking%20/%20inquire%20about%20your%20events.";
    waFloat.className = "whatsapp-float";
    waFloat.target = "_blank";
    waFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(waFloat);

    // Background Music
    const audio = new Audio('https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3');
    audio.loop = true;
    audio.volume = 0.5;

    const musicBtn = document.createElement('div');
    musicBtn.className = 'music-control';
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    document.body.appendChild(musicBtn);

    let isPlaying = false;
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.style.color = 'var(--primary-green)';
        } else {
            audio.play();
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.style.color = 'var(--accent-gold)';
        }
        isPlaying = !isPlaying;
    });

    // Active Link Highlight
    const currentLocation = location.pathname.split("/").slice(-1)[0] || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) {
            if (theme === 'dark') {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        }
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileBtn && mobileNav) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Virtual Tour Modal Implementation
    const tourBtn = document.querySelector('.tour-btn');
    if (tourBtn) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'tour-modal';
        modal.innerHTML = `
            <div class="tour-modal-content">
                <span class="close-tour">&times;</span>
                <div class="panorama-container" id="pano-container">
                    <div class="tour-overlay">
                        <div class="tour-info">
                            <h3 id="tour-title">360° Garden View</h3>
                            <p>Drag or move your mouse to explore our lush grounds</p>
                        </div>
                        <div class="tour-controls">
                            <button class="tour-nav-btn active" data-src="assets/image/virtual-tour/garden-360.jpg.jpg" data-title="360° Garden View">Garden</button>
                            <button class="tour-nav-btn" data-src="assets/image/virtual-tour/view-360.jpg.webp" data-title="360° Venue View">Venue View</button>
                            <button class="tour-nav-btn" data-src="assets/image/virtual-tour/fieled-360.jpg.webp" data-title="360° Signature Lounge">Signature Lounge</button>
                            <button class="tour-nav-btn" data-src="assets/image/virtual-tour/master-chef-360.jpg.webp" data-title="360° Master Chef's Area">Signature Grill</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-tour');
        const pano = modal.querySelector('#pano-container');
        const tourTitle = modal.querySelector('#tour-title');
        const navBtns = modal.querySelectorAll('.tour-nav-btn');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const src = btn.getAttribute('data-src');
                const title = btn.getAttribute('data-title');
                pano.style.backgroundImage = `url('${src}')`;
                tourTitle.textContent = title;
            });
        });

        tourBtn.onclick = (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Set initial image
            const activeBtn = modal.querySelector('.tour-nav-btn.active');
            pano.style.backgroundImage = `url('${activeBtn.getAttribute('data-src')}')`;

            const panEffect = (e) => {
                const moveX = (e.clientX / window.innerWidth) * 100;
                pano.style.backgroundPositionX = `${moveX}%`;
            };

            modal.addEventListener('mousemove', panEffect);
        };

        closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        window.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        };
    }

    // Form Validation Helpers
    window.GreenspotUtils = {
        showError: (input, message) => {
            const formGroup = input.parentElement;
            formGroup.className = 'form-group error';
            let errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
        },
        showSuccess: (input) => {
            const formGroup = input.parentElement;
            formGroup.className = 'form-group success';
        },
        isValidEmail: (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        isValidPhone: (phone) => {
            // Validating Kenyan phone numbers: 07XX..., 01XX..., +254...
            const cleanPhone = phone.replace(/\D/g, '');
            return (cleanPhone.length === 10 && (cleanPhone.startsWith('07') || cleanPhone.startsWith('01'))) ||
                (cleanPhone.length === 12 && cleanPhone.startsWith('254'));
        }
    };
});
