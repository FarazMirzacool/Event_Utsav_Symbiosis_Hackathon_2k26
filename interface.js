// ========== CONFIGURATION ==========
const API_BASE_URL = 'http://localhost:5000/api';

// ========== GLOBAL STATE ==========
let authToken = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

// ========== DATA CONSTANTS ==========
const decorations = [
    {
        id: 1,
        name: "Red & Silver Flowers Anniversary Arch",
        category: "Anniversary",
        originalPrice: 3500,
        discountedPrice: 2800,
        discount: 20,
        rating: 4.8,
        reviews: 24,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop",
        description: "Beautiful arch decoration with red and silver flowers perfect for anniversaries",
        vendorId: 101,
        vendorName: "Elegant Events"
    },
    {
        id: 2,
        name: "Unicorn Pastel Birthday Photo Ring",
        category: "Birthday",
        originalPrice: 2699,
        discountedPrice: 2000,
        discount: 26,
        rating: 4.5,
        reviews: 18,
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop",
        description: "Magical unicorn themed photo ring with pastel colors for birthday celebrations",
        vendorId: 102,
        vendorName: "Party Planners"
    },
    {
        id: 3,
        name: "Festive Floral Canopy Mehendi Stage",
        category: "Mehendi",
        originalPrice: 10000,
        discountedPrice: 5500,
        discount: 45,
        rating: 4.9,
        reviews: 32,
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop",
        description: "Beautiful floral canopy stage for mehendi ceremonies with gold accents",
        vendorId: 103,
        vendorName: "Wedding Decorators"
    },
    {
        id: 4,
        name: "Playful Lime Green & Yellow Haldi Decor",
        category: "Haldi",
        originalPrice: 6000,
        discountedPrice: 4000,
        discount: 33,
        rating: 4.7,
        reviews: 15,
        image: "https://images.unsplash.com/photo-1766100366837-9644a22ec120?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFsZGklMjBkZWNvcnxlbnwwfHwwfHx8MA%3D%3D",
        description: "Vibrant Haldi decoration with lime green and yellow floral arrangements",
        vendorId: 104,
        vendorName: "Traditional Decor"
    },
    {
        id: 5,
        name: "Red, White & Silver Floating Ceiling Decor",
        category: "Birthday",
        originalPrice: 2999,
        discountedPrice: 2250,
        discount: 25,
        rating: 5.0,
        reviews: 41,
        image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500&auto=format&fit=crop",
        description: "Stunning ceiling decoration with floating red, white and silver elements",
        vendorId: 105,
        vendorName: "Creative Decor"
    },
    {
        id: 6,
        name: "Vibrant Pink & Green Mehendi Stage",
        category: "Mehendi",
        originalPrice: 11999,
        discountedPrice: 7599,
        discount: 37,
        rating: 4.6,
        reviews: 27,
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop",
        description: "Pink and green themed mehendi stage with semi-circular arch design",
        vendorId: 106,
        vendorName: "StageCraft"
    },
    {
        id: 7,
        name: "Red Silver 25th Anniversary Balloon Ring",
        category: "Anniversary",
        originalPrice: 4500,
        discountedPrice: 3500,
        discount: 22,
        rating: 4.8,
        reviews: 19,
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop",
        description: "Elegant red and silver balloon ring for 25th anniversary celebrations",
        vendorId: 107,
        vendorName: "Balloon Experts"
    },
    {
        id: 8,
        name: "Pastel Rainbow Birthday Balloon Arch",
        category: "Birthday",
        originalPrice: 3500,
        discountedPrice: 2700,
        discount: 23,
        rating: 4.4,
        reviews: 22,
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop",
        description: "Colorful pastel rainbow balloon arch perfect for birthday parties",
        vendorId: 108,
        vendorName: "Party Experts"
    },
    {
        id: 9,
        name: "High Glossary Party Arch",
        category: "Ceremony",
        originalPrice: 3500,
        discountedPrice: 2700,
        discount: 23,
        rating: 4.4,
        reviews: 1,
        image: "https://images.unsplash.com/photo-1604668915840-580c30026e5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFydHklMjBkZWNvcmF0aW9ufGVufDB8fDB8fHww",
        description: "Colorful pastel rainbow balloon arch perfect for birthday parties",
        vendorId: 109,
        vendorName: "Party Experts Pro"
    }
];

const categories = [
    { name: "Anniversary", icon: "fa-heart", price: "₹2,999" },
    { name: "Birthday", icon: "fa-birthday-cake", price: "₹1,999" },
    { name: "Baby Shower", icon: "fa-baby", price: "₹3,499" },
    { name: "Wedding", icon: "fa-ring", price: "₹9,999" },
    { name: "Haldi", icon: "fa-sun", price: "₹4,999" },
    { name: "Mehendi", icon: "fa-hand-peace", price: "₹3,999" },
    { name: "Balloon", icon: "fa-balloon", price: "₹999" },
    { name: "Car Decoration", icon: "fa-car", price: "₹1,499" },
    { name: "Ring Ceremony", icon: "fa-camera-retro", price: "₹2,499" },
    { name: "Farewell", icon: "fa-star", price: "₹5,499" }
];

const services = [
    { name: "Anchor", icon: "fa-microphone" },
    { name: "DJ Services", icon: "fa-music" },
    { name: "Makeup Artists", icon: "fa-paint-brush" },
    { name: "Mehendi Artists", icon: "fa-hand-paper" },
    { name: "Photography", icon: "fa-camera" }
];

const testimonials = [
    {
        name: "Suhel Shehla",
        avatar: "S",
        rating: 5,
        text: "Decoration bilkul same tha jaise website par dikhaya gaya tha. Baby birthday setup bahut hi beautiful tha."
    },
    {
        name: "Adil Khan",
        avatar: "A",
        rating: 4,
        text: "Booking process kaafi smooth tha. Team on time aayi aur setup perfect kiya."
    },
    {
        name: "Khushi",
        avatar: "K",
        rating: 5,
        text: "Very easy booking experience. Service team professional thi aur sab kuch time par complete hua."
    },
    {
        name: "Namrata Sharma",
        avatar: "N",
        rating: 4,
        text: "Everything perfectly managed tha. Stress-free experience mila."
    },
    {
        name: "Vedika Sharma",
        avatar: "V",
        rating: 5,
        text: "Birthday decoration ke liye best platform laga mujhe. Kaafi professional kaam kiya."
    },
    {
        name: "Deshna Kochar",
        avatar: "D",
        rating: 4,
        text: "Last moment booking thi phir bhi decoration perfect mila. Thanks EventUtsav team!"
    }
];

// ========== VENDOR PROFILES DATA ==========
const vendorProfiles = {
    101: {
        id: 101,
        name: "Elegant Events",
        owner: "Priya Sharma",
        experience: 8,
        rating: 4.8,
        totalBookings: 342,
        phone: "+91 98765 43210",
        email: "contact@elegantevents.com",
        address: "Mumbai, Maharashtra",
        description: "Specializing in elegant and luxurious event decorations with a modern touch.",
        services: ["Wedding Decoration", "Anniversary", "Corporate Events"],
        completedProjects: 289,
        verified: true,
        responseTime: "< 1 hour",
        languages: ["Hindi", "English", "Marathi"],
        portfolio: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=500",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
            "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500"
        ],
        reviews: [
            {
                user: "Rajesh K.",
                rating: 5,
                comment: "Absolutely stunning decoration! Highly recommended.",
                date: "2024-01-15"
            },
            {
                user: "Neha M.",
                rating: 5,
                comment: "Very professional team. They understood exactly what we wanted.",
                date: "2024-01-10"
            }
        ]
    },
    102: {
        id: 102,
        name: "Party Planners",
        owner: "Amit Verma",
        experience: 5,
        rating: 4.5,
        totalBookings: 189,
        phone: "+91 87654 32109",
        email: "hello@partyplanners.com",
        address: "Delhi NCR",
        description: "Making your celebrations memorable with creative and fun decorations.",
        services: ["Birthday Parties", "Baby Showers", "Theme Parties"],
        completedProjects: 156,
        verified: true,
        responseTime: "< 2 hours",
        languages: ["Hindi", "English", "Punjabi"],
        portfolio: [
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500"
        ],
        reviews: [
            {
                user: "Vikram S.",
                rating: 4,
                comment: "Great work on my daughter's birthday. Very creative!",
                date: "2024-01-05"
            }
        ]
    },
    103: {
        id: 103,
        name: "Wedding Decorators",
        owner: "Sneha Reddy",
        experience: 12,
        rating: 4.9,
        totalBookings: 567,
        phone: "+91 76543 21098",
        email: "info@weddingdecorators.com",
        address: "Hyderabad, Telangana",
        description: "Premium wedding decorations with traditional and contemporary styles.",
        services: ["Wedding Decoration", "Mehendi", "Sangeet", "Reception"],
        completedProjects: 523,
        verified: true,
        responseTime: "< 30 mins",
        languages: ["Hindi", "English", "Telugu", "Tamil"],
        portfolio: [
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=500"
        ],
        reviews: [
            {
                user: "Anjali P.",
                rating: 5,
                comment: "Best wedding decorators in town! Made our day special.",
                date: "2024-01-20"
            },
            {
                user: "Rahul M.",
                rating: 5,
                comment: "Exceeded all expectations. Very professional team.",
                date: "2024-01-12"
            }
        ]
    },
    104: {
        id: 104,
        name: "Traditional Decor",
        owner: "Lakshmi Nair",
        experience: 15,
        rating: 4.7,
        totalBookings: 423,
        phone: "+91 65432 10987",
        email: "lakshmi@traditionaldecor.com",
        address: "Chennai, Tamil Nadu",
        description: "Authentic traditional decorations for all ceremonies and festivals.",
        services: ["Haldi", "Mehendi", "Pooja", "Traditional Weddings"],
        completedProjects: 398,
        verified: true,
        responseTime: "< 1 hour",
        languages: ["Hindi", "English", "Tamil", "Malayalam"],
        portfolio: [
            "https://images.unsplash.com/photo-1558030135-5c0b5e7c3b7f?w=500",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500"
        ],
        reviews: [
            {
                user: "Priya K.",
                rating: 5,
                comment: "Beautiful traditional setup for our Haldi ceremony.",
                date: "2024-01-18"
            }
        ]
    },
    105: {
        id: 105,
        name: "Creative Decor",
        owner: "Raj Malhotra",
        experience: 6,
        rating: 5.0,
        totalBookings: 234,
        phone: "+91 54321 09876",
        email: "raj@creativedecor.com",
        address: "Bangalore, Karnataka",
        description: "Innovative and modern decoration ideas for contemporary events.",
        services: ["Modern Decor", "Floating Decorations", "Lighting Setup"],
        completedProjects: 210,
        verified: true,
        responseTime: "< 45 mins",
        languages: ["Hindi", "English", "Kannada"],
        portfolio: [
            "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500",
            "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500"
        ],
        reviews: [
            {
                user: "Arjun N.",
                rating: 5,
                comment: "Very creative and unique designs. Loved it!",
                date: "2024-01-08"
            }
        ]
    }
};

// ========== ENHANCEMENT: ADVANCED ANIMATIONS ==========

// Confetti effect for celebrations
function showConfetti() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

// Progress bar for scroll
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Particle background effect
function initParticles() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particles.appendChild(particle);
    }
    
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.appendChild(particles);
    }
}

// Dark mode toggle
function initDarkMode() {
    const toggle = document.createElement('div');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.setAttribute('data-tooltip', 'Toggle Dark Mode');
    document.body.appendChild(toggle);
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = toggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        toggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Floating action button
function initFAB() {
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = '<i class="fas fa-plus"></i>';
    fab.setAttribute('data-tooltip', 'Quick Actions');
    document.body.appendChild(fab);
    
    fab.addEventListener('click', () => {
        const actions = [
            { icon: 'fa-calendar-plus', text: 'Quick Book', action: () => openModal('booking') },
            { icon: 'fa-star', text: 'Special Offers', action: () => showSpecialOffers() },
            { icon: 'fa-headset', text: '24/7 Support', action: () => showSupport() }
        ];
        
        showQuickActions(actions);
    });
}

// Quick actions menu
function showQuickActions(actions) {
    const menu = document.createElement('div');
    menu.className = 'quick-actions-menu';
    menu.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: white;
        border-radius: 10px;
        box-shadow: var(--shadow);
        padding: 10px;
        z-index: 1000;
        animation: slideInUp 0.3s ease-out;
    `;
    
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'quick-action-btn';
        btn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 20px;
            border: none;
            background: none;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1rem;
        `;
        btn.innerHTML = `<i class="fas ${action.icon}" style="width: 20px;"></i> ${action.text}`;
        btn.addEventListener('click', () => {
            action.action();
            menu.remove();
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#f0f0f0';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'none';
        });
        menu.appendChild(btn);
    });
    
    document.body.appendChild(menu);
    
    // Remove on click outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target) && !document.querySelector('.fab').contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

// Special offers modal
function showSpecialOffers() {
    const offers = [
        { title: 'Weekend Special', discount: '20%', valid: 'This Weekend' },
        { title: 'Wedding Package', discount: '30%', valid: 'Limited Time' },
        { title: 'Birthday Bash', discount: '25%', valid: 'Book Now' }
    ];
    
    const offersHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('offers')">&times;</span>
            <h2>🔥 Special Offers</h2>
            <div style="display: grid; gap: 15px; margin-top: 20px;">
                ${offers.map(offer => `
                    <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="color: white; margin-bottom: 5px;">${offer.title}</h3>
                            <p>${offer.discount} OFF • ${offer.valid}</p>
                        </div>
                        <button class="btn btn-primary" style="background: white; color: var(--primary);" onclick="openModal('booking'); closeModal('offers')">Claim</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    let offersModal = document.getElementById('offersModal');
    if (!offersModal) {
        offersModal = document.createElement('div');
        offersModal.id = 'offersModal';
        offersModal.className = 'modal';
        document.body.appendChild(offersModal);
    }
    
    offersModal.innerHTML = offersHTML;
    offersModal.classList.add('active');
}

// Support chat
function showSupport() {
    const supportHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('support')">&times;</span>
            <h2>💬 24/7 Support</h2>
            <div style="margin: 20px 0;">
                <div class="chat-messages" style="height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 15px; border-radius: 10px; background: #f9f9f9;">
                    <div style="margin-bottom: 15px;">
                        <strong style="color: var(--primary);">Support Team:</strong>
                        <p style="margin-top: 5px;">Hello! How can we help you today?</p>
                        <small style="color: gray;">Just now</small>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <input type="text" id="chatInput" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <button onclick="sendMessage()" class="btn btn-primary" style="padding: 10px 20px;">Send</button>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-outline" onclick="startCall()">📞 Call Now</button>
                <button class="btn btn-outline" onclick="startVideo()">📹 Video Call</button>
            </div>
        </div>
    `;
    
    let supportModal = document.getElementById('supportModal');
    if (!supportModal) {
        supportModal = document.createElement('div');
        supportModal.id = 'supportModal';
        supportModal.className = 'modal';
        document.body.appendChild(supportModal);
    }
    
    supportModal.innerHTML = supportHTML;
    supportModal.classList.add('active');
}

// Send chat message
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messages = document.querySelector('.chat-messages');
    messages.innerHTML += `
        <div style="margin-bottom: 15px; text-align: right;">
            <strong style="color: var(--primary);">You:</strong>
            <p style="margin-top: 5px;">${message}</p>
            <small style="color: gray;">Just now</small>
        </div>
    `;
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    // Simulate response
    setTimeout(() => {
        messages.innerHTML += `
            <div style="margin-bottom: 15px;">
                <strong style="color: var(--primary);">Support Team:</strong>
                <p style="margin-top: 5px;">Thanks for your message! A support agent will respond shortly.</p>
                <small style="color: gray;">Just now</small>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
}

// Voice search
function initVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-search-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.style.cssText = `
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            margin-left: 5px;
            cursor: pointer;
        `;
        voiceBtn.setAttribute('data-tooltip', 'Voice Search');
        
        voiceBtn.addEventListener('click', () => {
            voiceBtn.style.animation = 'pulse 1s infinite';
            recognition.start();
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            performSearch();
            voiceBtn.style.animation = '';
        };
        
        recognition.onerror = () => {
            voiceBtn.style.animation = '';
            showToast('Voice search failed. Please try again.', 'error');
        };
        
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.appendChild(voiceBtn);
        }
    }
}

// Share functionality
function initShareButtons() {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: var(--shadow);
        z-index: 1000;
    `;
    shareBtn.setAttribute('data-tooltip', 'Share this page');
    
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'EventUtsav',
                text: 'Plan your perfect event with EventUtsav!',
                url: window.location.href
            }).catch(() => {
                showToast('Share cancelled', 'error');
            });
        } else {
            // Fallback
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    });
    
    document.body.appendChild(shareBtn);
}

// Offline detection
function initOfflineDetection() {
    window.addEventListener('online', () => {
        showToast('You are back online!', 'success');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
        showToast('You are offline. Some features may be limited.', 'error');
        document.body.classList.add('offline');
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+B - Book now
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            openModal('booking');
        }
        
        // Ctrl+L - Login
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            openModal('login');
        }
        
        // Ctrl+R - Register
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            openModal('register');
        }
        
        // Ctrl+D - Dashboard
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            if (currentUser) {
                if (currentUser.user_type === 'vendor') {
                    showVendorDashboard();
                } else {
                    showDashboard();
                }
            }
        }
        
        // Esc - Close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // ? - Show help
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            showKeyboardHelp();
        }
    });
}

// Show keyboard shortcuts help
function showKeyboardHelp() {
    const shortcuts = [
        { key: 'Ctrl + B', description: 'Quick Book' },
        { key: 'Ctrl + L', description: 'Login' },
        { key: 'Ctrl + R', description: 'Register' },
        { key: 'Ctrl + D', description: 'Dashboard' },
        { key: 'Ctrl + K', description: 'Search' },
        { key: 'Ctrl + /', description: 'Show Shortcuts' },
        { key: 'Esc', description: 'Close Modals' }
    ];
    
    const helpHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('help')">&times;</span>
            <h2>⌨️ Keyboard Shortcuts</h2>
            <div style="margin: 20px 0;">
                ${shortcuts.map(s => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
                        <strong>${s.key}</strong>
                        <span>${s.description}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    let helpModal = document.getElementById('helpModal');
    if (!helpModal) {
        helpModal = document.createElement('div');
        helpModal.id = 'helpModal';
        helpModal.className = 'modal';
        document.body.appendChild(helpModal);
    }
    
    helpModal.innerHTML = helpHTML;
    helpModal.classList.add('active');
}

// ========== ENHANCEMENT: PAYMENT SYSTEM ==========

// Payment processing function
async function processPayment(bookingData, paymentType) {
    return new Promise((resolve) => {
        showToast(`Processing ${paymentType} payment...`, 'info');
        
        setTimeout(() => {
            const paymentId = 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase();
            resolve({
                success: true,
                paymentId: paymentId,
                amount: paymentType === 'advance' ? Math.round(bookingData.total_amount * 0.4) : bookingData.total_amount,
                type: paymentType,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
}

// Show payment modal
function showPaymentModal(bookingData) {
    const advanceAmount = Math.round(bookingData.total_amount * 0.4);
    
    const paymentHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close-modal" onclick="closeModal('payment')">&times;</span>
            <h2>💳 Complete Your Booking</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="color: white;">Booking Summary</h3>
                <p><strong>Service:</strong> ${bookingData.service_type} Decoration</p>
                <p><strong>Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> ${bookingData.guests}</p>
                <p><strong>Total Amount:</strong> ₹${bookingData.total_amount}</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Payment Options</h3>
                <div style="display: grid; gap: 15px;">
                    <div class="payment-card" onclick="selectPaymentOption('advance', ${advanceAmount}, ${bookingData.total_amount})" style="border: 2px solid #ddd; padding: 20px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <i class="fas fa-clock" style="font-size: 2rem; color: var(--primary);"></i>
                            <div>
                                <h4>Pay 40% Advance</h4>
                                <p style="font-size: 1.5rem; color: var(--primary);">₹${advanceAmount}</p>
                                <small>Pay now, remaining 60% after service completion</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-card" onclick="selectPaymentOption('full', ${bookingData.total_amount})" style="border: 2px solid #ddd; padding: 20px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <i class="fas fa-check-circle" style="font-size: 2rem; color: #28a745;"></i>
                            <div>
                                <h4>Pay Full Amount</h4>
                                <p style="font-size: 1.5rem; color: #28a745;">₹${bookingData.total_amount}</p>
                                <small>Get 5% discount on full payment</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="paymentMethods" style="display: none; margin: 20px 0;">
                <h3>Select Payment Method</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div class="payment-method" onclick="processSelectedPayment('card')" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                        <i class="fas fa-credit-card" style="font-size: 2rem; color: var(--primary);"></i>
                        <p>Credit/Debit Card</p>
                    </div>
                    <div class="payment-method" onclick="processSelectedPayment('upi')" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                        <i class="fas fa-mobile-alt" style="font-size: 2rem; color: var(--primary);"></i>
                        <p>UPI (GPay/PhonePe)</p>
                    </div>
                    <div class="payment-method" onclick="processSelectedPayment('netbanking')" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                        <i class="fas fa-university" style="font-size: 2rem; color: var(--primary);"></i>
                        <p>Net Banking</p>
                    </div>
                    <div class="payment-method" onclick="processSelectedPayment('wallet')" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; cursor: pointer;">
                        <i class="fas fa-wallet" style="font-size: 2rem; color: var(--primary);"></i>
                        <p>Digital Wallet</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    let paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) {
        paymentModal = document.createElement('div');
        paymentModal.id = 'paymentModal';
        paymentModal.className = 'modal';
        document.body.appendChild(paymentModal);
    }
    
    paymentModal.innerHTML = paymentHTML;
    paymentModal.classList.add('active');
    
    window.currentBookingData = bookingData;
}

// Select payment option
function selectPaymentOption(type, amount) {
    document.querySelectorAll('.payment-card').forEach(card => {
        card.style.borderColor = '#ddd';
        card.style.background = 'white';
    });
    
    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.style.background = '#f0f0ff';
    
    document.getElementById('paymentMethods').style.display = 'block';
    window.selectedPaymentType = type;
    window.paymentAmount = amount;
}

// Process selected payment
async function processSelectedPayment(method) {
    if (!window.selectedPaymentType || !window.currentBookingData) {
        showToast('Please select a payment option first', 'error');
        return;
    }
    
    const bookingData = window.currentBookingData;
    const paymentType = window.selectedPaymentType;
    const amount = window.paymentAmount;
    
    showToast(`Processing payment via ${method}...`, 'info');
    
    const paymentResult = await processPayment(bookingData, paymentType);
    
    if (paymentResult.success) {
        bookingData.payment = {
            type: paymentType,
            amount: amount,
            paymentId: paymentResult.paymentId,
            method: method,
            status: 'completed',
            timestamp: paymentResult.timestamp
        };
        
        const result = await createBooking(bookingData);
        
        if (result.success) {
            closeModal('payment');
            showPaymentSuccess(bookingData, paymentResult);
            showConfetti();
        }
    }
}

// Show payment success
function showPaymentSuccess(bookingData, paymentResult) {
    const successHTML = `
        <div class="modal-content" style="text-align: center;">
            <span class="close-modal" onclick="closeModal('success')">&times;</span>
            <i class="fas fa-check-circle" style="font-size: 5rem; color: #28a745; margin: 20px 0;"></i>
            <h2>Booking Confirmed! 🎉</h2>
            
            <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${paymentResult.paymentId}</p>
                <p><strong>Service:</strong> ${bookingData.service_type} Decoration</p>
                <p><strong>Date:</strong> ${new Date(bookingData.event_date).toLocaleDateString()}</p>
                <p><strong>Amount Paid:</strong> ₹${paymentResult.amount}</p>
                <p><strong>Payment Type:</strong> ${paymentResult.type === 'advance' ? '40% Advance' : 'Full Payment'}</p>
                <p><strong>Payment Method:</strong> ${paymentResult.method || 'Card'}</p>
                ${paymentResult.type === 'advance' ? 
                    `<p><strong>Remaining Amount:</strong> ₹${bookingData.total_amount - paymentResult.amount} (due after service)</p>` : 
                    ''}
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-primary" onclick="window.print()">Print Receipt</button>
                <button class="btn btn-outline" onclick="closeModal('success'); showDashboard()">View Bookings</button>
            </div>
        </div>
    `;
    
    let successModal = document.getElementById('successModal');
    if (!successModal) {
        successModal = document.createElement('div');
        successModal.id = 'successModal';
        successModal.className = 'modal';
        document.body.appendChild(successModal);
    }
    
    successModal.innerHTML = successHTML;
    successModal.classList.add('active');
}

// ========== ENHANCEMENT: VIEW VENDOR FUNCTION ==========

function viewVendor(vendorId) {
    const vendor = vendorProfiles[vendorId];
    if (!vendor) {
        showToast('Vendor details not found', 'error');
        return;
    }
    
    const vendorHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <span class="close-modal" onclick="closeModal('vendor')">&times;</span>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-store" style="font-size: 2.5rem; color: var(--primary);"></i>
                    </div>
                    <div>
                        <h2 style="color: white;">${vendor.name}</h2>
                        <p style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-star" style="color: #ffc107;"></i>
                            ${vendor.rating} (${vendor.totalBookings}+ bookings)
                            ${vendor.verified ? '<span style="background: #28a745; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">✓ Verified</span>' : ''}
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                    <i class="fas fa-user-tie" style="color: var(--primary);"></i>
                    <h4>Owner</h4>
                    <p>${vendor.owner}</p>
                </div>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                    <i class="fas fa-calendar-alt" style="color: var(--primary);"></i>
                    <h4>Experience</h4>
                    <p>${vendor.experience} years</p>
                </div>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                    <i class="fas fa-check-circle" style="color: var(--primary);"></i>
                    <h4>Projects</h4>
                    <p>${vendor.completedProjects} completed</p>
                </div>
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                    <i class="fas fa-clock" style="color: var(--primary);"></i>
                    <h4>Response Time</h4>
                    <p>${vendor.responseTime}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>About</h3>
                <p>${vendor.description}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Services Offered</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${vendor.services.map(service => `
                        <span style="background: #f0f0f0; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                            ${service}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Contact Information</h3>
                <div style="display: grid; gap: 10px;">
                    <p><i class="fas fa-phone" style="color: var(--primary); width: 25px;"></i> ${vendor.phone}</p>
                    <p><i class="fas fa-envelope" style="color: var(--primary); width: 25px;"></i> ${vendor.email}</p>
                    <p><i class="fas fa-map-marker-alt" style="color: var(--primary); width: 25px;"></i> ${vendor.address}</p>
                    <p><i class="fas fa-language" style="color: var(--primary); width: 25px;"></i> ${vendor.languages.join(', ')}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Portfolio</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    ${vendor.portfolio.map(img => `
                        <img src="${img}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 5px; cursor: pointer;" onclick="viewImage('${img}')">
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Customer Reviews</h3>
                ${vendor.reviews.map(review => `
                    <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${review.user}</strong>
                            <span>${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                        </div>
                        <p>${review.comment}</p>
                        <small style="color: gray;">${new Date(review.date).toLocaleDateString()}</small>
                    </div>
                `).join('')}
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-primary" onclick="contactVendor('${vendor.id}')">
                    <i class="fas fa-comment"></i> Contact Vendor
                </button>
                <button class="btn btn-outline" onclick="viewVendorServices('${vendor.id}')">
                    <i class="fas fa-list"></i> View Services
                </button>
            </div>
        </div>
    `;
    
    let vendorModal = document.getElementById('vendorModal');
    if (!vendorModal) {
        vendorModal = document.createElement('div');
        vendorModal.id = 'vendorModal';
        vendorModal.className = 'modal';
        document.body.appendChild(vendorModal);
    }
    
    vendorModal.innerHTML = vendorHTML;
    vendorModal.classList.add('active');
}

// Contact vendor
function contactVendor(vendorId) {
    const vendor = vendorProfiles[vendorId];
    if (!vendor) return;
    
    const contactHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close-modal" onclick="closeModal('contact')">&times;</span>
            <h2>Contact ${vendor.name}</h2>
            
            <div style="margin: 20px 0;">
                <p><i class="fas fa-phone" style="color: var(--primary);"></i> ${vendor.phone}</p>
                <p><i class="fas fa-envelope" style="color: var(--primary);"></i> ${vendor.email}</p>
                <p><i class="fas fa-clock" style="color: var(--primary);"></i> Response: ${vendor.responseTime}</p>
            </div>
            
            <form id="contactForm" onsubmit="sendVendorMessage(event, '${vendorId}')">
                <div class="form-group">
                    <label>Your Message</label>
                    <textarea id="contactMessage" rows="4" required placeholder="Write your message..."></textarea>
                </div>
                <button type="submit" class="btn-submit">Send Message</button>
            </form>
        </div>
    `;
    
    let contactModal = document.getElementById('contactModal');
    if (!contactModal) {
        contactModal = document.createElement('div');
        contactModal.id = 'contactModal';
        contactModal.className = 'modal';
        document.body.appendChild(contactModal);
    }
    
    contactModal.innerHTML = contactHTML;
    contactModal.classList.add('active');
}

// Send message to vendor
function sendVendorMessage(event, vendorId) {
    event.preventDefault();
    const message = document.getElementById('contactMessage').value;
    const vendor = vendorProfiles[vendorId];
    
    showToast(`Message sent to ${vendor.name}! They will respond soon.`, 'success');
    closeModal('contact');
}

// View vendor services
function viewVendorServices(vendorId) {
    const vendor = vendorProfiles[vendorId];
    const vendorServices = decorations.filter(d => d.vendorId === vendorId);
    
    const servicesHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close-modal" onclick="closeModal('services')">&times;</span>
            <h2>${vendor.name} - Services</h2>
            
            <div class="explore-grid" style="margin-top: 20px;">
                ${vendorServices.map(service => createDecorationCard(service).outerHTML).join('')}
            </div>
        </div>
    `;
    
    let servicesModal = document.getElementById('servicesModal');
    if (!servicesModal) {
        servicesModal = document.createElement('div');
        servicesModal.id = 'servicesModal';
        servicesModal.className = 'modal';
        document.body.appendChild(servicesModal);
    }
    
    servicesModal.innerHTML = servicesHTML;
    servicesModal.classList.add('active');
}

// View image in fullscreen
function viewImage(imgUrl) {
    const imageHTML = `
        <div class="modal-content" style="background: transparent; box-shadow: none; max-width: 90%;">
            <span class="close-modal" onclick="closeModal('image')" style="color: white;">&times;</span>
            <img src="${imgUrl}" style="width: 100%; max-height: 80vh; object-fit: contain;">
        </div>
    `;
    
    let imageModal = document.getElementById('imageModal');
    if (!imageModal) {
        imageModal = document.createElement('div');
        imageModal.id = 'imageModal';
        imageModal.className = 'modal';
        document.body.appendChild(imageModal);
    }
    
    imageModal.innerHTML = imageHTML;
    imageModal.classList.add('active');
}

// ========== ENHANCEMENT: BOOKING WITH PRE-SELECTED SERVICE ==========

// Open booking modal with pre-selected service
function openBookingModalWithService(serviceCategory, serviceName, vendorId, vendorName) {
    window.selectedService = {
        category: serviceCategory,
        name: serviceName,
        vendorId: vendorId,
        vendorName: vendorName
    };
    
    openModal('booking');
    
    setTimeout(() => {
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            for (let option of serviceSelect.options) {
                if (option.value.toLowerCase() === serviceCategory.toLowerCase()) {
                    option.selected = true;
                    break;
                }
            }
            
            const event = new Event('change', { bubbles: true });
            serviceSelect.dispatchEvent(event);
        }
        
        document.getElementById('selectedServiceName').value = serviceName;
        document.getElementById('selectedVendorId').value = vendorId;
        document.getElementById('selectedVendorName').value = vendorName;
        
        const bookingForm = document.getElementById('bookingForm');
        const existingNote = document.getElementById('selectedServiceNote');
        if (existingNote) {
            existingNote.remove();
        }
        
        const serviceNote = document.createElement('div');
        serviceNote.id = 'selectedServiceNote';
        serviceNote.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        `;
        serviceNote.innerHTML = `
            <i class="fas fa-check-circle" style="margin-right: 5px;"></i>
            You're booking: <strong>${serviceName}</strong> from <strong>${vendorName}</strong>
        `;
        
        bookingForm.insertBefore(serviceNote, bookingForm.firstChild);
    }, 100);
}

// Show service details before booking
function showServiceDetails(item) {
    const vendor = vendorProfiles[item.vendorId];
    
    const detailsHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close-modal" onclick="closeModal('details')">&times;</span>
            <img src="${item.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
            <h2>${item.name}</h2>
            
            <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                <img src="https://ui-avatars.com/api/?name=${vendor?.name}&background=8B5CF6&color=fff&size=32" style="width: 32px; height: 32px; border-radius: 50%;">
                <div>
                    <strong>${vendor?.name}</strong>
                    ${vendor?.verified ? '<i class="fas fa-check-circle" style="color: #28a745;"></i>' : ''}
                </div>
                <span style="margin-left: auto;">⭐ ${item.rating} (${item.reviews})</span>
            </div>
            
            <p style="margin: 15px 0; color: var(--gray);">${item.description}</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Original Price:</span>
                    <span style="text-decoration: line-through;">₹${item.originalPrice}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem;">
                    <span>Discounted Price:</span>
                    <span style="color: var(--primary); font-weight: 700;">₹${item.discountedPrice}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #28a745;">
                    <span>You Save:</span>
                    <span>₹${item.originalPrice - item.discountedPrice} (${item.discount}%)</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button class="btn-book" style="flex: 1;" onclick="closeModal('details'); openBookingModalWithService('${item.category}', '${item.name}', ${item.vendorId}, '${vendor?.name}')">
                    Book Now
                </button>
                <button class="btn-book" style="flex: 1; background: var(--primary);" onclick="closeModal('details'); viewVendor(${item.vendorId})">
                    View Vendor
                </button>
            </div>
        </div>
    `;
    
    let detailsModal = document.getElementById('detailsModal');
    if (!detailsModal) {
        detailsModal = document.createElement('div');
        detailsModal.id = 'detailsModal';
        detailsModal.className = 'modal';
        document.body.appendChild(detailsModal);
    }
    
    detailsModal.innerHTML = detailsHTML;
    detailsModal.classList.add('active');
}

// Pay remaining amount
function payRemainingAmount(bookingId, amount) {
    const paymentData = {
        booking_id: bookingId,
        total_amount: amount,
        service_type: 'Remaining Payment',
        event_date: new Date().toISOString().split('T')[0],
        guests: 0,
        venue_address: 'Online Payment'
    };
    
    showPaymentModal(paymentData);
}

// Retry payment
function retryPayment(bookingId) {
    showToast('Redirecting to payment...', 'info');
}

// Export bookings to CSV
function exportBookings() {
    if (!authToken || !currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    getUserBookings().then(bookings => {
        const headers = ['Booking ID', 'Service', 'Date', 'Guests', 'Venue', 'Total Amount', 'Status'];
        const csvRows = [];
        
        csvRows.push(headers.join(','));
        
        bookings.forEach(booking => {
            const row = [
                booking._id,
                booking.service_type,
                new Date(booking.event_date).toLocaleDateString(),
                booking.guests,
                `"${booking.venue_address}"`,
                booking.total_amount,
                booking.status
            ];
            csvRows.push(row.join(','));
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `eventutsav-bookings-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showToast('Bookings exported successfully!', 'success');
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load all UI components
    loadCategories();
    loadExploreTabs();
    loadDecorations('all');
    loadServices();
    loadTestimonials();
    
    // Setup UI features
    updateAuthUI();
    setupVendorFormToggle();
    addSearchToNav();
    setMinEventDate();
    
    // Setup advanced features
    initProgressBar();
    initParticles();
    initDarkMode();
    initFAB();
    initVoiceSearch();
    initShareButtons();
    initOfflineDetection();
    initKeyboardShortcuts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Verify auth token
    if (authToken) {
        verifyAuthToken();
    }
}

function setupEventListeners() {
    window.addEventListener('scroll', toggleBackToTop);
    
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ========== API: AUTHENTICATION ==========

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        if (data.access_token) {
            saveAuthData(data, userData);
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify({
                id: data.user_id,
                user_type: data.user_type,
                name: data.name,
                email: email
            }));
            authToken = data.access_token;
            currentUser = JSON.parse(localStorage.getItem('user'));
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authToken = null;
    currentUser = null;
    showToast('Logged out successfully', 'success');
    updateAuthUI();
    closeModal('dashboard');
    closeModal('vendorDashboard');
}

async function verifyAuthToken() {
    try {
        const profile = await getUserProfile();
        if (!profile) {
            logoutUser();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
    }
}

function saveAuthData(data, userData) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        user_type: data.user_type,
        name: userData.name,
        email: userData.email
    }));
    authToken = data.access_token;
    currentUser = JSON.parse(localStorage.getItem('user'));
}

// ========== API: BOOKINGS ==========

async function createBooking(bookingData) {
    if (!authToken) {
        showToast('Please login to book', 'error');
        openModal('login');
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Booking failed');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserBookings() {
    if (!authToken) return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch bookings');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

async function cancelBooking(bookingId) {
    if (!authToken) return false;
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to cancel booking');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== API: USER PROFILE ==========

async function getUserProfile() {
    if (!authToken) return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch profile');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

// ========== API: VENDOR OPERATIONS ==========

async function getVendorBookings() {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/bookings`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch vendor bookings');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching vendor bookings:', error);
        return [];
    }
}

async function createVendorService(serviceData) {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') {
        showToast('Please register as a vendor first', 'error');
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(serviceData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create service');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getVendorServices() {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return [];
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/services`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch services');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching vendor services:', error);
        return [];
    }
}

async function updateVendorService(serviceId, serviceData) {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/services/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(serviceData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update service');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteVendorService(serviceId) {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/services/${serviceId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete service');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getVendorEarnings() {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/earnings`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch earnings');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching earnings:', error);
        return null;
    }
}

async function updateBookingStatus(bookingId, status) {
    if (!authToken || !currentUser || currentUser.user_type !== 'vendor') return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/vendor/bookings/${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update booking');
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== FORM HANDLERS ==========

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    const result = await loginUser(email, password);
    
    if (result.success) {
        showToast('Login successful!', 'success');
        closeModal('login');
        updateAuthUI();
        document.getElementById('loginForm').reset();
    } else {
        showToast(result.error, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        password: document.getElementById('regPassword').value,
        phone: document.getElementById('regPhone').value.trim(),
        user_type: document.getElementById('regType').value
    };
    
    if (!userData.name || !userData.email || !userData.password || !userData.phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (userData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (userData.user_type === 'vendor') {
        const businessName = document.getElementById('vendorBusinessName')?.value.trim();
        const serviceSelect = document.getElementById('vendorServiceCategory');
        
        if (!businessName || !serviceSelect || serviceSelect.selectedOptions.length === 0) {
            showToast('Please fill in all vendor fields', 'error');
            return;
        }
        
        userData.business_name = businessName;
        userData.business_description = document.getElementById('vendorBusinessDesc')?.value.trim() || '';
        userData.gst_number = document.getElementById('vendorGstNumber')?.value.trim() || '';
        userData.experience = document.getElementById('vendorExperience')?.value || 0;
        userData.services = Array.from(serviceSelect.selectedOptions).map(opt => opt.value);
    }
    
    const result = await registerUser(userData);
    
    if (result.success) {
        showToast('Registration successful!', 'success');
        closeModal('register');
        updateAuthUI();
        document.getElementById('registerForm').reset();
        
        if (userData.user_type === 'vendor') {
            setTimeout(() => showVendorDashboard(), 500);
        }
    } else {
        showToast(result.error, 'error');
    }
}

async function handleBooking(event) {
    event.preventDefault();
    
    if (!authToken) {
        showToast('Please login to book', 'error');
        closeModal('booking');
        openModal('login');
        return;
    }
    
    const serviceType = document.getElementById('serviceType').value;
    const serviceName = document.getElementById('selectedServiceName')?.value || serviceType;
    const vendorId = document.getElementById('selectedVendorId')?.value || '101';
    const vendorName = document.getElementById('selectedVendorName')?.value || 'Elegant Events';
    
    if (!serviceType) {
        showToast('Please select a service type', 'error');
        return;
    }
    
    const bookingData = {
        service_type: serviceType,
        service_name: serviceName,
        event_date: document.getElementById('eventDate').value,
        guests: parseInt(document.getElementById('guestCount').value),
        venue_address: document.getElementById('venueAddress').value.trim(),
        special_requests: document.getElementById('specialRequest').value.trim(),
        total_amount: calculateTotal(),
        vendor_id: vendorId,
        vendor_name: vendorName
    };
    
    const selectedDate = new Date(bookingData.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showToast('Please select a future date', 'error');
        return;
    }
    
    closeModal('booking');
    showPaymentModal(bookingData);
}

async function handleAddService(event) {
    event.preventDefault();
    
    const serviceData = {
        name: document.getElementById('serviceName').value.trim(),
        category: document.getElementById('serviceCategory').value,
        description: document.getElementById('serviceDescription').value.trim(),
        price: parseInt(document.getElementById('servicePrice').value),
        discount: parseInt(document.getElementById('serviceDiscount').value) || 0,
        image: document.getElementById('serviceImage').value.trim() || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop'
    };
    
    if (!serviceData.name || !serviceData.category || !serviceData.description || !serviceData.price) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const result = await createVendorService(serviceData);
    
    if (result.success) {
        showToast('Service added successfully!', 'success');
        closeModal('vendorDashboard');
        document.getElementById('addServiceForm').reset();
        showVendorDashboard();
    } else {
        showToast(result.error || 'Failed to add service', 'error');
    }
}

// ========== DASHBOARD FUNCTIONS ==========

async function showDashboard() {
    if (!currentUser) {
        openModal('login');
        return;
    }
    
    const bookings = await getUserBookings();
    const profile = await getUserProfile();
    
    const dashboardHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <span class="close-modal" onclick="closeModal('dashboard')">&times;</span>
            <h2>My Dashboard</h2>
            
            <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
                <h3 style="color: white; margin-bottom: 15px;">Profile Info</h3>
                <p><strong>Name:</strong> ${currentUser.name}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Phone:</strong> ${profile?.phone || 'Not provided'}</p>
                <p><strong>Account Type:</strong> Customer</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>My Bookings</h3>
                ${bookings.length === 0 ? '<p style="text-align: center; padding: 20px;">No bookings yet. <a href="#" onclick="closeModal(\'dashboard\'); openModal(\'booking\')" style="color: var(--primary); text-decoration: none;">Book now!</a></p>' : ''}
                ${bookings.map(booking => {
                    const paymentStatus = booking.payment?.status || 'pending';
                    const paymentType = booking.payment?.type || 'none';
                    const paidAmount = booking.payment?.amount || 0;
                    const remainingAmount = booking.total_amount - paidAmount;
                    
                    return `
                        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: white;">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div>
                                    <h4 style="color: var(--primary); margin-bottom: 10px;">${booking.service_type} Decoration</h4>
                                    <p><strong>Vendor:</strong> ${booking.vendor_name || 'Elegant Events'}</p>
                                    <p><strong>Date:</strong> ${new Date(booking.event_date).toLocaleDateString()}</p>
                                    <p><strong>Guests:</strong> ${booking.guests}</p>
                                    <p><strong>Venue:</strong> ${booking.venue_address}</p>
                                    <p><strong>Total Amount:</strong> ₹${booking.total_amount || 5000}</p>
                                    
                                    <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                                        <p><strong>Payment Status:</strong> 
                                            <span style="color: ${paymentStatus === 'completed' ? '#28a745' : '#ffc107'};">
                                                ${paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                                            </span>
                                        </p>
                                        ${paymentType === 'advance' ? `
                                            <p><strong>Paid (40% Advance):</strong> ₹${paidAmount}</p>
                                            <p><strong>Remaining (60%):</strong> ₹${remainingAmount}</p>
                                            ${booking.status === 'completed' ? 
                                                `<button onclick="payRemainingAmount('${booking._id}', ${remainingAmount})" class="btn-book" style="background: #28a745; margin-top: 5px; padding: 5px 10px; font-size: 0.9rem;">
                                                    Pay Remaining ₹${remainingAmount}
                                                </button>` : ''}
                                        ` : paymentType === 'full' ? 
                                            `<p><strong>Full Payment:</strong> ₹${paidAmount} (Completed)</p>` : 
                                            `<button onclick="retryPayment('${booking._id}')" class="btn-book" style="background: #ffc107; color: black; margin-top: 5px; padding: 5px 10px; font-size: 0.9rem;">
                                                Complete Payment
                                            </button>`}
                                    </div>
                                    
                                    <p><strong>Booking Status:</strong> 
                                        <span style="display: inline-block; padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 600; 
                                            background: ${booking.status === 'confirmed' ? '#d4edda' : booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd'};
                                            color: ${booking.status === 'confirmed' ? '#155724' : booking.status === 'cancelled' ? '#721c24' : '#856404'};">
                                            ${booking.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                ${booking.status === 'pending' ? 
                                    `<button onclick="cancelUserBooking('${booking._id}')" style="background: #ef4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Cancel</button>` 
                                    : ''}
                            </div>
                            ${booking.special_requests ? `<p style="margin-top: 10px; font-style: italic;"><strong>Special Requests:</strong> ${booking.special_requests}</p>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <button class="btn btn-primary" onclick="closeModal('dashboard'); openModal('booking')" style="display: inline-block; padding: 10px 20px;">Book New Service</button>
                <button class="btn btn-outline" onclick="exportBookings()" style="margin-left: 10px;">Export Bookings</button>
            </div>
        </div>
    `;
    
    let dashboardModal = document.getElementById('dashboardModal');
    if (!dashboardModal) {
        dashboardModal = document.createElement('div');
        dashboardModal.id = 'dashboardModal';
        dashboardModal.className = 'modal';
        document.body.appendChild(dashboardModal);
    }
    
    dashboardModal.innerHTML = dashboardHTML;
    dashboardModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function showVendorDashboard() {
    if (!currentUser || currentUser.user_type !== 'vendor') {
        showToast('Please register as a vendor first', 'error');
        return;
    }
    
    const bookings = await getVendorBookings();
    const services = await getVendorServices();
    const earnings = await getVendorEarnings();
    const profile = await getUserProfile();
    
    const totalEarnings = earnings?.total || 0;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;
    
    const dashboardHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
            <span class="close-modal" onclick="closeModal('vendorDashboard')">&times;</span>
            <h2>Vendor Dashboard</h2>
            
            <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
                <h3 style="color: white; margin-bottom: 15px;">Business Profile</h3>
                <p><strong>Business Name:</strong> ${profile?.business_info?.name || currentUser.name}</p>
                <p><strong>Owner:</strong> ${currentUser.name}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Phone:</strong> ${profile?.phone || 'Not provided'}</p>
                <p><strong>Verification Status:</strong> 
                    <span style="color: ${profile?.verified ? '#d4edda' : '#fff3cd'};">
                        ${profile?.verified ? 'Verified ✓' : 'Pending Verification'}
                    </span>
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: var(--shadow); text-align: center;">
                    <h4 style="color: var(--primary); font-size: 2rem;">${services.length}</h4>
                    <p>Total Services</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: var(--shadow); text-align: center;">
                    <h4 style="color: var(--primary); font-size: 2rem;">${pendingBookings}</h4>
                    <p>Pending Bookings</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: var(--shadow); text-align: center;">
                    <h4 style="color: var(--primary); font-size: 2rem;">₹${totalEarnings}</h4>
                    <p>Total Earnings</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin: 20px 0; border-bottom: 2px solid #eee; padding-bottom: 10px; flex-wrap: wrap;">
                <button onclick="showVendorTab('services')" class="vendor-tab active" id="tab-services" style="padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer;">My Services</button>
                <button onclick="showVendorTab('bookings')" class="vendor-tab" id="tab-bookings" style="padding: 10px 20px; background: #eee; border: none; border-radius: 5px; cursor: pointer;">Bookings</button>
                <button onclick="showVendorTab('earnings')" class="vendor-tab" id="tab-earnings" style="padding: 10px 20px; background: #eee; border: none; border-radius: 5px; cursor: pointer;">Earnings</button>
                <button onclick="showVendorTab('add-service')" class="vendor-tab" id="tab-add-service" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">+ Add Service</button>
            </div>
            
            <div id="vendor-services-tab" class="vendor-tab-content">
                <h3>My Services</h3>
                ${services.length === 0 ? '<p style="text-align: center; padding: 20px;">No services added yet.</p>' : ''}
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${services.map(service => `
                        <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                                <i class="fas fa-image" style="font-size: 2rem;"></i>
                            </div>
                            <div style="padding: 15px;">
                                <h4 style="margin-bottom: 5px;">${service.name}</h4>
                                <p style="color: var(--gray); font-size: 0.9rem;">${service.category}</p>
                                <p><strong>₹${service.price}</strong> ${service.discount ? `<span style="color: green;">(${service.discount}% off)</span>` : ''}</p>
                                <div style="display: flex; gap: 5px; margin-top: 10px;">
                                    <button onclick="editVendorService('${service._id}')" style="flex: 1; padding: 5px; background: var(--primary); color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">Edit</button>
                                    <button onclick="deleteVendorServiceConfirm('${service._id}')" style="flex: 1; padding: 5px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">Delete</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="vendor-bookings-tab" class="vendor-tab-content" style="display: none;">
                <h3>Booking Requests</h3>
                ${bookings.length === 0 ? '<p style="text-align: center; padding: 20px;">No bookings yet.</p>' : ''}
                ${bookings.map(booking => `
                    <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background: white;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <h4 style="color: var(--primary);">${booking.service_type}</h4>
                                <p><strong>Date:</strong> ${new Date(booking.event_date).toLocaleDateString()}</p>
                                <p><strong>Guests:</strong> ${booking.guests}</p>
                                <p><strong>Amount:</strong> ₹${booking.total_amount || 5000}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: inline-block; padding: 3px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 600; 
                                    background: ${booking.status === 'confirmed' ? '#d4edda' : booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd'};
                                    color: ${booking.status === 'confirmed' ? '#155724' : booking.status === 'cancelled' ? '#721c24' : '#856404'};">
                                    ${booking.status.toUpperCase()}
                                </span>
                                ${booking.status === 'pending' ? `
                                    <div style="margin-top: 10px; display: flex; gap: 5px;">
                                        <button onclick="handleVendorBookingStatus('${booking._id}', 'confirmed')" style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">Confirm</button>
                                        <button onclick="handleVendorBookingStatus('${booking._id}', 'cancelled')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">Reject</button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div id="vendor-earnings-tab" class="vendor-tab-content" style="display: none;">
                <h3>Earnings Overview</h3>
                <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                        <div>
                            <h4>Total Earnings</h4>
                            <p style="font-size: 2rem; color: var(--primary);">₹${totalEarnings}</p>
                        </div>
                        <div>
                            <h4>Pending Payouts</h4>
                            <p style="font-size: 1.5rem; color: #ffc107;">₹${earnings?.pending || 0}</p>
                        </div>
                        <div>
                            <h4>Completed Orders</h4>
                            <p style="font-size: 1.5rem;">${completedBookings}</p>
                        </div>
                        <div>
                            <h4>This Month</h4>
                            <p style="font-size: 1.5rem;">₹${earnings?.monthly || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="vendor-add-service-tab" class="vendor-tab-content" style="display: none;">
                <h3>Add New Service</h3>
                <form id="addServiceForm" onsubmit="handleAddService(event)" style="margin-top: 20px;">
                    <div class="form-group">
                        <label for="serviceName">Service Name</label>
                        <input type="text" id="serviceName" required placeholder="e.g., Premium Birthday Decoration">
                    </div>
                    <div class="form-group">
                        <label for="serviceCategory">Category</label>
                        <select id="serviceCategory" required>
                            <option value="">Select category</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Anniversary">Anniversary</option>
                            <option value="Baby Shower">Baby Shower</option>
                            <option value="Haldi">Haldi</option>
                            <option value="Mehendi">Mehendi</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="serviceDescription">Description</label>
                        <textarea id="serviceDescription" required placeholder="Describe your service" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="servicePrice">Price (₹)</label>
                        <input type="number" id="servicePrice" required min="0" placeholder="e.g., 5000">
                    </div>
                    <div class="form-group">
                        <label for="serviceDiscount">Discount % (Optional)</label>
                        <input type="number" id="serviceDiscount" min="0" max="100" placeholder="e.g., 20">
                    </div>
                    <div class="form-group">
                        <label for="serviceImage">Image URL</label>
                        <input type="url" id="serviceImage" placeholder="https://example.com/image.jpg">
                    </div>
                    <button type="submit" class="btn-submit">Add Service</button>
                </form>
            </div>
        </div>
    `;
    
    let vendorModal = document.getElementById('vendorDashboardModal');
    if (!vendorModal) {
        vendorModal = document.createElement('div');
        vendorModal.id = 'vendorDashboardModal';
        vendorModal.className = 'modal';
        document.body.appendChild(vendorModal);
    }
    
    vendorModal.innerHTML = dashboardHTML;
    vendorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showVendorTab(tabName) {
    document.querySelectorAll('.vendor-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('.vendor-tab').forEach(btn => {
        btn.style.background = '#eee';
        btn.style.color = '#333';
    });
    
    document.getElementById(`vendor-${tabName}-tab`).style.display = 'block';
    
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) {
        activeBtn.style.background = 'var(--primary)';
        activeBtn.style.color = 'white';
    }
}

async function handleVendorBookingStatus(bookingId, status) {
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
        showToast(`Booking ${status}!`, 'success');
        closeModal('vendorDashboard');
        showVendorDashboard();
    } else {
        showToast(result.error || 'Failed to update booking', 'error');
    }
}

async function cancelUserBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        const result = await cancelBooking(bookingId);
        if (result.success) {
            showToast('Booking cancelled successfully', 'success');
            closeModal('dashboard');
            showDashboard();
        } else {
            showToast(result.error || 'Failed to cancel booking', 'error');
        }
    }
}

async function deleteVendorServiceConfirm(serviceId) {
    if (confirm('Are you sure you want to delete this service?')) {
        const result = await deleteVendorService(serviceId);
        if (result.success) {
            showToast('Service deleted', 'success');
            closeModal('vendorDashboard');
            showVendorDashboard();
        } else {
            showToast(result.error || 'Failed to delete service', 'error');
        }
    }
}

function editVendorService(serviceId) {
    showToast('Edit feature coming soon!', 'info');
}

// ========== UI: LOADING & RENDERING ==========

function loadCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) return;
    
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => filterByCategory(cat.name);
        card.innerHTML = `
            <i class="fas ${cat.icon}"></i>
            <h4>${cat.name}</h4>
            <p>Starting ${cat.price}</p>
        `;
        grid.appendChild(card);
    });
}

function loadExploreTabs() {
    const tabsContainer = document.getElementById('exploreTabs');
    if (!tabsContainer) return;
    
    const cats = ['All', 'Anniversary', 'Birthday', 'Wedding', 'Baby Shower', 'Haldi', 'Mehendi'];
    
    cats.forEach((cat, index) => {
        const tab = document.createElement('div');
        tab.className = `tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = cat;
        tab.onclick = () => filterExplore(cat, tab);
        tabsContainer.appendChild(tab);
    });
}

function loadDecorations(category) {
    const grid = document.getElementById('exploreGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading-spinner"></div>';
    
    setTimeout(() => {
        grid.innerHTML = '';
        
        const filtered = category.toLowerCase() === 'all' 
            ? decorations 
            : decorations.filter(d => d.category.toLowerCase() === category.toLowerCase());
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No decorations found</p>';
            return;
        }
        
        filtered.forEach(item => {
            const card = createDecorationCard(item);
            grid.appendChild(card);
        });
    }, 500);
}

function createDecorationCard(item) {
    const card = document.createElement('div');
    card.className = 'explore-card';
    card.onclick = () => showServiceDetails(item);
    
    const isInWishlist = wishlist.includes(item.id);
    const vendor = vendorProfiles[item.vendorId];
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="discount-badge">-${item.discount}%</div>
            <div class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${item.id})">
                <i class="fas fa-heart"></i>
            </div>
        </div>
        <div class="card-content">
            <h4>${item.name}</h4>
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
                <img src="https://ui-avatars.com/api/?name=${vendor?.name || 'Vendor'}&background=8B5CF6&color=fff&size=24" style="width: 24px; height: 24px; border-radius: 50%;">
                <span style="font-size: 0.9rem; color: var(--gray);">${vendor?.name || 'Vendor'}</span>
                ${vendor?.verified ? '<i class="fas fa-check-circle" style="color: #28a745; font-size: 0.8rem;"></i>' : ''}
            </div>
            <div class="rating">
                ${getStarRating(item.rating)} <span>(${item.reviews} reviews)</span>
            </div>
            <div class="price">
                <span class="original-price">₹${item.originalPrice}</span>
                <span class="discounted-price">₹${item.discountedPrice}</span>
            </div>
            <div style="display: flex; gap: 5px; margin-top: 10px;">
                <button class="btn-book" style="flex: 2;" onclick="event.stopPropagation(); openBookingModalWithService('${item.category}', '${item.name}', ${item.vendorId}, '${vendor?.name}')">Book Now</button>
                <button class="btn-book" style="flex: 1; background: var(--primary);" onclick="event.stopPropagation(); viewVendor(${item.vendorId})">
                    <i class="fas fa-store"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function loadServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.onclick = () => openBookingModalWithService(service.name, service.name + ' Service', 101, 'Elegant Events');
        card.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h4>${service.name}</h4>
        `;
        grid.appendChild(card);
    });
}

function loadTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    
    testimonials.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <i class="fas fa-quote-left"></i>
            <p>"${t.text}"</p>
            <div class="customer-info">
                <div class="customer-avatar">${t.avatar}</div>
                <div class="customer-details">
                    <h5>${t.name}</h5>
                    <div class="rating">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ========== UI: AUTH & NAVIGATION ==========

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;
    
    if (currentUser) {
        if (currentUser.user_type === 'vendor') {
            authButtons.innerHTML = `
                <span style="color: white; margin-right: 1rem;">Welcome, ${currentUser.name}</span>
                <a href="#" class="btn btn-outline" onclick="event.preventDefault(); showVendorDashboard()">Vendor Dashboard</a>
                <a href="#" class="btn btn-primary" onclick="event.preventDefault(); logoutUser()">Logout</a>
            `;
        } else {
            authButtons.innerHTML = `
                <span style="color: white; margin-right: 1rem;">Welcome, ${currentUser.name}</span>
                <a href="#" class="btn btn-outline" onclick="event.preventDefault(); showDashboard()">My Bookings</a>
                <a href="#" class="btn btn-primary" onclick="event.preventDefault(); logoutUser()">Logout</a>
            `;
        }
    } else {
        authButtons.innerHTML = `
            <a href="#" class="btn btn-outline" onclick="event.preventDefault(); openModal('login')">Login</a>
            <a href="#" class="btn btn-primary" onclick="event.preventDefault(); openModal('register')">Register</a>
        `;
    }
}

function setupVendorFormToggle() {
    const regType = document.getElementById('regType');
    if (!regType) return;
    
    regType.addEventListener('change', function() {
        const vendorFields = document.getElementById('vendorFields');
        if (this.value === 'vendor') {
            if (!vendorFields) {
                const form = document.getElementById('registerForm');
                const extraFields = document.createElement('div');
                extraFields.id = 'vendorFields';
                extraFields.innerHTML = `
                    <div class="form-group">
                        <label for="vendorBusinessName">Business Name</label>
                        <input type="text" id="vendorBusinessName" required placeholder="Enter business name">
                    </div>
                    <div class="form-group">
                        <label for="vendorBusinessDesc">Business Description</label>
                        <textarea id="vendorBusinessDesc" required placeholder="Describe your services" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="vendorServiceCategory">Service Categories</label>
                        <select id="vendorServiceCategory" required multiple size="4">
                            <option value="Decoration">Decoration</option>
                            <option value="Photography">Photography</option>
                            <option value="Catering">Catering</option>
                            <option value="Music">Music/DJ</option>
                            <option value="Makeup">Makeup/Mehendi</option>
                            <option value="Anchor">Anchor/Hosting</option>
                            <option value="Lighting">Lighting/Sound</option>
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple</small>
                    </div>
                    <div class="form-group">
                        <label for="vendorGstNumber">GST Number (Optional)</label>
                        <input type="text" id="vendorGstNumber" placeholder="Enter GST number">
                    </div>
                    <div class="form-group">
                        <label for="vendorExperience">Years of Experience</label>
                        <input type="number" id="vendorExperience" min="0" placeholder="Years in business">
                    </div>
                `;
                form.appendChild(extraFields);
            }
        } else {
            if (vendorFields) {
                vendorFields.remove();
            }
        }
    });
}

function addSearchToNav() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const searchItem = document.createElement('div');
    searchItem.className = 'search-box';
    searchItem.innerHTML = `
        <input type="text" placeholder="Search services..." id="searchInput">
        <button onclick="performSearch()"><i class="fas fa-search"></i></button>
    `;
    navMenu.appendChild(searchItem);
}

function setMinEventDate() {
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        eventDateInput.min = today;
    }
}

// ========== UI: INTERACTIONS ==========

function filterExplore(category, tabElement) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    tabElement.classList.add('active');
    loadDecorations(category);
}

function filterByCategory(category) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase() === category.toLowerCase()) {
            filterExplore(category, tab);
        }
    });
    
    document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
}

function toggleWishlist(itemId) {
    const index = wishlist.indexOf(itemId);
    if (index === -1) {
        wishlist.push(itemId);
        showToast('Added to wishlist!', 'success');
    } else {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        loadDecorations(activeTab.textContent);
    }
}

function performSearch() {
    const query = document.getElementById('searchInput')?.value.toLowerCase().trim();
    if (!query) {
        showToast('Please enter a search term', 'error');
        return;
    }
    
    const results = decorations.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        showToast(`Found ${results.length} services`, 'success');
        const grid = document.getElementById('exploreGrid');
        grid.innerHTML = '';
        results.forEach(item => {
            const card = createDecorationCard(item);
            grid.appendChild(card);
        });
        
        document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
    } else {
        showToast('No services found', 'error');
    }
}

function openServiceDetail(service) {
    showServiceDetails(service);
}

function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '★';
        } else if (i - 0.5 <= rating) {
            stars += '½';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

function calculateTotal() {
    const serviceType = document.getElementById('serviceType').value;
    const guests = parseInt(document.getElementById('guestCount').value) || 0;
    
    const prices = {
        'Birthday': 1999,
        'Wedding': 9999,
        'Anniversary': 2999,
        'Baby Shower': 3499,
        'Haldi': 4999,
        'Mehendi': 3999
    };
    
    const basePrice = prices[serviceType] || 2000;
    const guestCharge = guests * 50;
    
    return basePrice + guestCharge;
}

function toggleBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// ========== UI: MODAL MANAGEMENT ==========

function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function switchModal(from, to) {
    closeModal(from);
    openModal(to);
}

// ========== UI: NOTIFICATIONS ==========

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== HELPER FUNCTIONS ==========

function startCall() {
    showToast('Calling support...', 'info');
}

function startVideo() {
    showToast('Starting video call...', 'info');
}