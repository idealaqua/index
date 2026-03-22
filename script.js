document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS
    AOS.init({ duration: 800, once: true });
    
    // Initialize Swiper for partners
    const partnersSlider = document.querySelector('.partners-slider');
    if (partnersSlider) {
        const slides = document.querySelectorAll('.partners-slider .swiper-slide');
        const enableLoop = slides.length >= 4;
        
        new Swiper('.partners-slider', {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: enableLoop,
            autoplay: { delay: 3000, disableOnInteraction: false },
            breakpoints: {
                640: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
            }
        });
    }
    
    // Hide loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hide');
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
    }, 1500);
    
    // Header scroll effect
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progressBar');
    const backToTop = document.getElementById('backToTop');
    const progressCircle = document.getElementById('progressCircle');
    
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 100) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        if (progressBar) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
            if (progressCircle) {
                const circumference = 2 * Math.PI * 22;
                const offset = circumference - (scrolled / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
            }
        }
        if (backToTop) {
            if (window.scrollY > 500) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        }
    });
    
    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    
    // Mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuToggle.querySelector('i')) {
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                }
            });
        });
    }
    
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Animate numbers
    const statCircles = document.querySelectorAll('.stat-circle');
    const animateNumbers = () => {
        statCircles.forEach(circle => {
            const target = parseInt(circle.getAttribute('data-count'));
            if (target && !circle.hasAttribute('data-animated')) {
                circle.setAttribute('data-animated', 'true');
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        circle.textContent = target;
                        clearInterval(timer);
                    } else {
                        circle.textContent = Math.floor(current);
                    }
                }, 20);
            }
        });
    };
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(aboutSection);
    }
    
    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => item.classList.toggle('active'));
        }
    });
    
    // Calculator
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const area = parseFloat(document.getElementById('area')?.value) || 0;
            const irrigationType = document.getElementById('irrigationType')?.value || 'drip';
            const automation = document.getElementById('automation')?.value || 'basic';
            let basePrice = area * 25000000;
            if (irrigationType === 'sprinkler') basePrice *= 1;
            if (irrigationType === 'combined') basePrice *= 1.2;
            if (automation === 'semi') basePrice *= 1.15;
            if (automation === 'smart') basePrice *= 1.3;
            const priceResult = document.getElementById('priceResult');
            if (priceResult) {
                priceResult.textContent = new Intl.NumberFormat('uz-UZ').format(Math.round(basePrice));
            }
        });
    }
    
    // Weather API
    const cities = {
        '41.2995,69.2401': { name: 'Toshkent', lat: 41.2995, lon: 69.2401 },
        '39.6542,66.9597': { name: 'Samarqand', lat: 39.6542, lon: 66.9597 },
        '39.7747,64.4286': { name: 'Buxoro', lat: 39.7747, lon: 64.4286 },
        '41.3783,60.3640': { name: 'Xiva', lat: 41.3783, lon: 60.3640 },
        '40.3842,71.7843': { name: 'Farg\'ona', lat: 40.3842, lon: 71.7843 },
        '40.7821,72.3442': { name: 'Andijon', lat: 40.7821, lon: 72.3442 },
        '40.9983,71.6726': { name: 'Namangan', lat: 40.9983, lon: 71.6726 },
        '38.8606,65.7891': { name: 'Qarshi', lat: 38.8606, lon: 65.7891 },
        '37.2242,67.2784': { name: 'Termiz', lat: 37.2242, lon: 67.2784 },
        '42.4533,59.6103': { name: 'Nukus', lat: 42.4533, lon: 59.6103 }
    };
    let currentCity = localStorage.getItem('selectedCity') || '41.2995,69.2401';
    
    async function getWeather() {
        const cityData = cities[currentCity];
        if (!cityData) return;
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current_weather=true`);
            const data = await response.json();
            if (data && data.current_weather) {
                const temp = data.current_weather.temperature;
                let condition = '', icon = 'fa-cloud-sun', recommendation = '';
                if (temp > 30) { condition = 'Issiq'; icon = 'fa-sun'; recommendation = 'Ko\'proq sug\'orish (+30%)'; }
                else if (temp > 20) { condition = 'Mo\'tadil'; icon = 'fa-cloud'; recommendation = 'Normal sug\'orish'; }
                else if (temp > 10) { condition = 'Salqin'; icon = 'fa-cloud-rain'; recommendation = 'Sug\'orishni kamaytiring'; }
                else { condition = 'Sovuq'; icon = 'fa-snowflake'; recommendation = 'Sug\'orishni to\'xtating'; }
                
                const weatherIcon = document.getElementById('weatherIcon');
                const weatherTemp = document.getElementById('weatherTemp');
                const weatherCondition = document.getElementById('weatherCondition');
                const irrigationRecommendation = document.getElementById('irrigationRecommendation');
                if (weatherIcon) weatherIcon.className = `fas ${icon}`;
                if (weatherTemp) weatherTemp.textContent = `${Math.round(temp)}°C`;
                if (weatherCondition) weatherCondition.textContent = condition;
                if (irrigationRecommendation) irrigationRecommendation.innerHTML = `<i class="fas fa-tint"></i> ${recommendation}`;
            }
        } catch (error) { console.error('Weather error:', error); }
    }
    
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.value = currentCity;
        citySelect.addEventListener('change', (e) => {
            currentCity = e.target.value;
            localStorage.setItem('selectedCity', currentCity);
            getWeather();
        });
    }
    getWeather();
    setInterval(getWeather, 30 * 60 * 1000);
    
    // Voice search
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    if (voiceSearchBtn && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'uz-UZ';
        voiceSearchBtn.addEventListener('click', () => {
            recognition.start();
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Tinglanmoqda...';
        });
        recognition.onresult = (event) => {
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i> Ovozli qidiruv';
            showNotification(`Qidiruv: "${event.results[0][0].transcript}"`, 'info');
        };
        recognition.onerror = () => { voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i> Ovozli qidiruv'; };
        recognition.onend = () => { voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i> Ovozli qidiruv'; };
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
    
    // Language toggle
    const translations = {
        uz: { free_consultation: 'Bepul Konsultatsiya', catalog: 'Katalog ko\'rish', voice_search: 'Ovozli qidiruv' },
        ru: { free_consultation: 'Бесплатная консультация', catalog: 'Посмотреть каталог', voice_search: 'Голосовой поиск' },
        en: { free_consultation: 'Free Consultation', catalog: 'View Catalog', voice_search: 'Voice Search' }
    };
    const langToggle = document.getElementById('languageToggle');
    let currentLang = localStorage.getItem('language') || 'uz';
    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'SPAN') el.textContent = translations[lang][key];
                else el.innerHTML = translations[lang][key];
            }
        });
        const currentLangSpan = document.getElementById('currentLang');
        if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();
        localStorage.setItem('language', lang);
    }
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'uz' ? 'ru' : (currentLang === 'ru' ? 'en' : 'uz');
            updateLanguage(currentLang);
        });
        updateLanguage(currentLang);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
            submitBtn.disabled = true;
            await new Promise(resolve => setTimeout(resolve, 1500));
            showNotification('Xabaringiz muvaffaqiyatli yuborildi!', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                showNotification('Obunangiz qabul qilindi!', 'success');
                newsletterForm.reset();
            }
        });
    }
    
    // Cookie consent
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptCookies = document.getElementById('acceptCookies');
    if (cookieConsent && !localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'flex';
    } else if (cookieConsent) {
        cookieConsent.style.display = 'none';
    }
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.style.display = 'none';
        });
    }
    
    // Chat widget
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.getElementById('chatWidget');
    const chatClose = document.querySelector('.chat-close');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', () => chatWidget.classList.toggle('active'));
        if (chatClose) chatClose.addEventListener('click', () => chatWidget.classList.remove('active'));
        
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                chatInput.value = '';
                setTimeout(() => {
                    addMessage('Rahmat! Mutaxassislarimiz tez orada bog\'lanadi.', 'bot');
                }, 500);
            }
        }
        
        if (chatSendBtn) chatSendBtn.addEventListener('click', sendMessage);
        if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Video background with error handling
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        // Try to play video
        const playVideo = () => {
            heroVideo.play().catch(e => {
                console.log('Video autoplay failed, trying muted...');
                heroVideo.muted = true;
                heroVideo.play().catch(err => {
                    console.log('Video still cannot play, using fallback');
                    heroVideo.style.display = 'none';
                });
            });
        };
        
        // Check if video can play
        heroVideo.addEventListener('canplay', playVideo);
        
        // If video fails to load
        heroVideo.addEventListener('error', () => {
            console.log('Video failed to load, using fallback');
            heroVideo.style.display = 'none';
        });
        
        // Try to play immediately
        playVideo();
    }
    
    // Notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    window.showNotification = showNotification;
    
    console.log('IDEAL AQUA Website Loaded Successfully!');
   
});


// ==================== MOBILE DETECTION & OPTIMIZATION ====================

// Mobil qurilmani aniqlash
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Mobil qurilmada AOS ni soddalashtirish
if (isMobile()) {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 400,
            once: true,
            offset: 50,
            disable: 'mobile'
        });
    }
} else {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
}

// Mobil qurilmada touch event lar uchun optimizatsiya
if (isMobile()) {
    document.querySelectorAll('.card, .btn-primary, .btn-secondary, .faq-question').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Mobil qurilmada video autoplay ni optimallashtirish
if (isMobile()) {
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.play().catch(e => console.log('Video play failed on mobile'));
    }
}

// Ekran o'lchami o'zgarganda AOS ni yangilash
window.addEventListener('resize', () => {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});