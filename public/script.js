// =========================================
//      CONFIGURACIÓN DE FIREBASE
// =========================================
const firebaseConfig = {
  apiKey: "AIzaSyA81sLNp_2zdFtENWnVnKlyJxmQsuktKOY",
  authDomain: "ares-credit-capital.firebaseapp.com",
  projectId: "ares-credit-capital",
  storageBucket: "ares-credit-capital.firebasestorage.app",
  messagingSenderId: "994953754017",
  appId: "1:994953754017:web:c258cbded1145ae116c7e0",
  measurementId: "G-XHT7XVHJXR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig );
const db = firebase.firestore();



// =========================================
//      CONFIGURACIÓN INICIAL
// =========================================

// Configuración de animaciones y efectos
const CONFIG = {
    animations: {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        stagger: 100
    },
    scroll: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    theme: {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

// Estado global de la aplicación
const AppState = {
    isLoaded: false,
    currentTheme: 'light',
    scrollPosition: 0,
    isScrolling: false,
    activeSection: 'inicio'
};

// =========================================
//      SISTEMA DE TEMA MEJORADO
// =========================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('checkbox');
        this.body = document.body;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    init() {
        // Detectar tema inicial
        this.detectInitialTheme();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Aplicar tema inicial
        this.applyTheme(AppState.currentTheme);
        
        // Escuchar cambios en preferencias del sistema
        this.prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme-override')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    detectInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPreference = this.prefersDark.matches ? 'dark' : 'light';
        
        if (savedTheme) {
            AppState.currentTheme = savedTheme;
        } else {
            AppState.currentTheme = systemPreference;
        }
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', (e) => {
                const newTheme = e.target.checked ? 'dark' : 'light';
                this.setTheme(newTheme);
                localStorage.setItem('theme-override', 'true');
            });
        }
    }

    setTheme(theme) {
        AppState.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateToggle(theme);
        this.animateThemeTransition();
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            this.body.classList.add('dark-mode');
        } else {
            this.body.classList.remove('dark-mode');
        }
        
        // Actualizar meta theme-color para móviles
        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#111827' : '#ffffff';
    }

    updateToggle(theme) {
        if (this.themeToggle) {
            this.themeToggle.checked = theme === 'dark';
        }
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    animateThemeTransition() {
        // Crear efecto de transición suave
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${AppState.currentTheme === 'dark' ? '#111827' : '#ffffff'};
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.3';
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }, 150);
        });
    }
}

// =========================================
//      SISTEMA DE ANIMACIONES AVANZADO
// =========================================

class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: CONFIG.scroll.threshold,
            rootMargin: CONFIG.scroll.rootMargin
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);

        // Observar elementos para animación
        const elementsToAnimate = document.querySelectorAll(`
            .section-title,
            .diff-card,
            .service-card,
            .financing-card,
            .process-step,
            .pricing-feature,
            .contact-item
        `);

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });

        this.observers.set('main', observer);
    }

    animateElement(element) {
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'fadeInUp':
                this.fadeInUp(element);
                break;
            case 'slideInLeft':
                this.slideInLeft(element);
                break;
            case 'slideInRight':
                this.slideInRight(element);
                break;
            case 'scaleIn':
                this.scaleIn(element);
                break;
            case 'staggered':
                this.staggeredAnimation(element);
                break;
            default:
                this.fadeInUp(element);
        }
    }

    getAnimationType(element) {
        if (element.classList.contains('section-title')) return 'fadeInUp';
        if (element.classList.contains('process-step')) return 'slideInLeft';
        if (element.classList.contains('contact-item')) return 'slideInRight';
        if (element.classList.contains('diff-card')) return 'staggered';
        return 'fadeInUp';
    }

    fadeInUp(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms, transform ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    slideInLeft(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = `opacity ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms, transform ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    slideInRight(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = `opacity ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms, transform ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    scaleIn(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `opacity ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms, transform ${CONFIG.animations.duration}ms ${CONFIG.animations.easing} ${delay}ms`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    staggeredAnimation(element) {
        const parent = element.parentElement;
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element);
        const delay = index * CONFIG.animations.stagger;
        
        this.fadeInUp(element, delay);
    }

    setupScrollAnimations() {
        // Parallax para hero
        const hero = document.querySelector('.hero');
        const heroGraphic = document.querySelector('.hero-graphic');
        
        if (hero && heroGraphic) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.2;
                heroGraphic.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
            }, 16));
        }

        // Animación de números en la sección de financiamiento
        this.setupCounterAnimations();
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.amount');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const numbers = text.match(/[\d,]+/g);
        
        if (numbers) {
            const finalNumber = parseInt(numbers[0].replace(/,/g, ''));
            let current = 0;
            const increment = finalNumber / 60; // 60 frames para 1 segundo
            const duration = 2000; // 2 segundos
            const frameTime = duration / 60;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    current = finalNumber;
                    clearInterval(timer);
                }
                
                const formattedNumber = Math.floor(current).toLocaleString();
                element.textContent = text.replace(numbers[0], formattedNumber);
            }, frameTime);
        }
    }

    setupHoverEffects() {
        // Efecto de partículas en botones
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createParticleEffect(e.target);
            });
        });

        // Efecto de ondas en cards
        const cards = document.querySelectorAll('.diff-card, .service-card, .financing-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
            });
        });
    }

    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = 6;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 1000);
        }
    }

    createRippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(30, 58, 138, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            element.removeChild(ripple);
        }, 600);
    }

    setupLoadingAnimations() {
        window.addEventListener('load', () => {
            AppState.isLoaded = true;
            this.animatePageLoad();
        });
    }

    animatePageLoad() {
        // Animar contenido del hero
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            this.slideInLeft(heroContent, 200);
            this.slideInRight(heroImage, 400);
        }

        // Animar navegación
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach((item, index) => {
            this.fadeInUp(item, index * 100);
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// =========================================
//      NAVEGACIÓN MEJORADA
// =========================================

class NavigationManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveSection();

                // AÑADE ESTA LÍNEA PARA HACER LA FUNCIÓN ACCESIBLE
        window.smoothScrollToTarget = this.smoothScrollTo.bind(this);

    }

    setupMobileNavigation() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Cerrar menú al hacer clic en un enlace
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    this.smoothScrollTo(targetPosition);
                }
            });
        });
    }

    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            AppState.scrollPosition = scrollTop;
            
            // Efecto de header al hacer scroll
            if (scrollTop > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Auto-hide header en móvil
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    this.header.style.transform = 'translateY(-100%)';
                } else {
                    this.header.style.transform = 'translateY(0)';
                }
            }

            lastScrollTop = scrollTop;
        }, 16));
    }

    setupActiveSection() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                    AppState.activeSection = id;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active-link');
            }
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// =========================================
//      FORMULARIO MEJORADO
// =========================================

class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupFormAnimations();
        }
    }

    setupFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

// Reemplaza esta función en tu script.js
// Reemplaza esta función en tu script.js, dentro de la clase FormManager

validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessageKey = ''; // Usaremos una clave de traducción

    const currentLang = localStorage.getItem('language') || 'es';

    // --- LÓGICA DE VALIDACIÓN ACTUALIZADA ---
    if (field.required && !value) {
        // 1. Primero, comprueba si un campo requerido está vacío
        isValid = false;
        errorMessageKey = 'validation_required';
    } else if (field.type === 'email' && value) {
        // 2. Si tiene valor y es un email, valida el formato
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessageKey = 'validation_email';
        }
    } else if (field.type === 'tel' && value) {
        // 3. Si tiene valor y es un teléfono, valida el formato
        // Este regex es más flexible, permite espacios, guiones y paréntesis
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessageKey = 'validation_phone';
        }
    }
    
    
   


    // Obtener el mensaje traducido
    const errorMessage = translations[currentLang][errorMessageKey] || '';
    
    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
}

    showFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');

        if (!isValid) {
            field.classList.add('error');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                `;
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
            requestAnimationFrame(() => {
                errorElement.style.opacity = '1';
                errorElement.style.transform = 'translateY(0)';
            });
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.style.opacity = '0';
                errorElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    formGroup.removeChild(errorElement);
                }, 300);
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (errorElement.parentNode) {
                    formGroup.removeChild(errorElement);
                }
            }, 300);
        }
    }

    setupFormSubmission() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }





// Dentro de la clase FormManager

async handleFormSubmission() {
    // --- URLs de tus dos formularios de Formspree ---
    const endpoint1 = 'https://formspree.io/f/xldpodya';
    const endpoint2 = 'https://formspree.io/f/mzzjkznw';

    const formData = new FormData(this.contactForm);
    let isFormValid = true;

    // 1. Validar el formulario como antes
    const inputs = this.contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!this.validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        this.showNotification('Por favor, corrige los errores en el formulario.', 'error');
        return;
    }

    const submitButton = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    this.setButtonLoading(submitButton, true);

    try {
        // 2. Crear las dos promesas de envío a Formspree
        const sendToEndpoint1 = fetch(endpoint1, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        const sendToEndpoint2 = fetch(endpoint2, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        // 3. Esperar a que AMBOS envíos a Formspree terminen
        const results = await Promise.allSettled([sendToEndpoint1, sendToEndpoint2]);

        // 4. Analizar los resultados de los envíos de correo
        const [result1, result2] = results;
        const success1 = result1.status === 'fulfilled' && result1.value.ok;
        const success2 = result2.status === 'fulfilled' && result2.value.ok;

        // 5. LÓGICA DE FIREBASE: Guardar si AL MENOS UN correo se envió
        if (success1 || success2) {
            const formObject = Object.fromEntries(formData.entries());
            formObject.timestamp = firebase.firestore.FieldValue.serverTimestamp(); // Añade fecha y hora

            try {
                // Intenta guardar el documento en la colección 'submissions'
                await db.collection('submissions').add(formObject);
                console.log("Formulario guardado en Firestore exitosamente.");
            } catch (dbError) {
                console.error("Error al guardar en Firestore:", dbError);
                // Este error es silencioso para el usuario, pero importante para ti (el desarrollador).
                // No detiene el flujo, el usuario seguirá viendo el mensaje de éxito del correo.
            }
        }

        // 6. Notificar al usuario según el resultado de los correos
        if (success1 && success2) {
            // Caso ideal: Ambos correos se enviaron con éxito.
            this.showNotification('¡Mensaje enviado exitosamente!', 'success');
            this.contactForm.reset();
            inputs.forEach(input => this.clearFieldError(input));
            this.animateFormSuccess();
        } else {
            // Caso de error: Al menos uno de los envíos de correo falló.
            console.error('Resultado del envío 1:', result1);
            console.error('Resultado del envío 2:', result2);
            this.showNotification('Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo.', 'warning');
        }

    } catch (error) {
        // Este error captura problemas mayores, como falta de conexión a internet.
        console.error('Error de red al enviar el formulario:', error);
        this.showNotification('Error de conexión. No se pudo enviar el mensaje.', 'error');
    } finally {
        // 7. Restaurar el botón al estado original, pase lo que pase.
        this.setButtonLoading(submitButton, false, originalText);
    }
}






    setButtonLoading(button, isLoading, originalText = 'Enviar Mensaje') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Enviando...
                </span>
            `;
        } else {
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Formulario enviado:', data);
                resolve();
            }, 2000);
        });
    }

    animateFormSuccess() {
        const formGroups = this.contactForm.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.style.transform = 'scale(0.95)';
                group.style.opacity = '0.7';
                setTimeout(() => {
                    group.style.transform = 'scale(1)';
                    group.style.opacity = '1';
                }, 200);
            }, index * 100);
        });
    }

    setupFormAnimations() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px)';
                input.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.15)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'translateY(0)';
                input.style.boxShadow = '';
            });
        });
    }

    showNotification(message, type = 'info') {
        // Usar el sistema de notificaciones global
        window.showNotification(message, type);
    }
}





// =========================================
//      SISTEMA DE NOTIFICACIONES MEJORADO
// =========================================

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.addStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    addStyles() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes particleFloat {
                    0% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-50px) scale(0); }
                }
                @keyframes ripple {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                .notification {
                    background: white;
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid;
                    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                }
                .notification.success { border-left-color: #10b981; }
                .notification.error { border-left-color: #ef4444; }
                .notification.info { border-left-color: #3b82f6; }
                .notification.warning { border-left-color: #f59e0b; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .notification-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    flex-shrink: 0;
                }
                .notification.success .notification-icon { background: #10b981; }
                .notification.error .notification-icon { background: #ef4444; }
                .notification.info .notification-icon { background: #3b82f6; }
                .notification.warning .notification-icon { background: #f59e0b; }
                .notification-message {
                    flex: 1;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                    color: #6b7280;
                }
                .notification-close:hover {
                    background-color: #f3f4f6;
                }
                .form-group input.error,
                .form-group select.error,
                .form-group textarea.error {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type] || icons.info}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.remove(notification);
        });

        return notification;
    }

    remove(notification) {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    this.container.removeChild(notification);
                    this.notifications = this.notifications.filter(n => n !== notification);
                }
            }, 300);
        }
    }
}

// =========================================
//      UTILIDADES ADICIONALES
// =========================================

class UtilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupWhatsAppIntegration();
        this.setupAnalytics();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }

    setupWhatsAppIntegration() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            const phoneNumber = link.getAttribute('href').replace('tel:', '');
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const modal = this.createContactModal(phoneNumber);
                document.body.appendChild(modal);
            });
        });
    }

    createContactModal(phoneNumber) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(5px);
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <h3 style="margin-bottom: 1rem; color: #1f2937;">¿Cómo prefieres contactarnos?</h3>
                <p style="margin-bottom: 2rem; color: #6b7280;">Elige tu método de contacto preferido</p>
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <button class="whatsapp-btn" style="
                        flex: 1;
                        padding: 1rem;
                        background: #25d366;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        📱 WhatsApp
                    </button>
                    <button class="phone-btn" style="
                        flex: 1;
                        padding: 1rem;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        📞 Llamar
                    </button>
                </div>
                <button class="close-btn" style="
                    background: #f3f4f6;
                    color: #6b7280;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancelar</button>
            </div>
        `;

        // Animar entrada
        requestAnimationFrame(() => {
            modal.querySelector('div').style.transform = 'scale(1)';
        });

        // Event listeners
        modal.querySelector('.whatsapp-btn').addEventListener('click', () => {
            const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=Hola, me interesa conocer más sobre los servicios de ARES Credit Capital.`;
            window.open(whatsappUrl, '_blank');
            this.removeModal(modal);
        });

        modal.querySelector('.phone-btn').addEventListener('click', () => {
            window.location.href = `tel:${phoneNumber}`;
            this.removeModal(modal);
        });

        modal.querySelector('.close-btn').addEventListener('click', () => {
            this.removeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.removeModal(modal);
            }
        });

        return modal;
    }

    removeModal(modal) {
        modal.querySelector('div').style.transform = 'scale(0.9)';
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    setupAnalytics() {
        // Tracking de eventos (placeholder para Google Analytics)
        const trackEvent = (action, category, label) => {
            console.log(`Analytics: ${category} - ${action} - ${label}`);
            // gtag('event', action, { 'event_category': category, 'event_label': label });
        };

        // Track button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                trackEvent('click', 'button', button.textContent.trim());
            });
        });

        // Track form interactions
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                trackEvent('focus', 'form', input.name || input.id);
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    trackEvent('scroll', 'engagement', `${maxScroll}%`);
                }
            }
        }, 1000));
    }

    setupPerformanceOptimizations() {
        // Lazy loading para imágenes
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    setupAccessibility() {
        // Mejorar navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Añadir estilos para navegación por teclado
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        // Skip link para accesibilidad
        this.addSkipLink();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#inicio';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10002;
            transition: top 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// =========================================
//      INICIALIZACIÓN
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los managers
    const themeManager = new ThemeManager();
    const animationManager = new AnimationManager();
    const navigationManager = new NavigationManager();
    const formManager = new FormManager();
    const notificationManager = new NotificationManager();
    const utilityManager = new UtilityManager();

    // Hacer el sistema de notificaciones disponible globalmente
    window.showNotification = (message, type, duration) => {
        return notificationManager.show(message, type, duration);
    };

    // Configurar eventos globales
    window.addEventListener('beforeunload', () => {
        // Guardar estado si es necesario
        localStorage.setItem('lastVisit', Date.now());
    });

    // Mostrar mensaje de bienvenida después de la carga
    setTimeout(() => {
        if (!localStorage.getItem('welcomeShown')) {
            window.showNotification('¡Bienvenido a ARES Credit Capital! Estamos aquí para ayudarte.', 'info', 8000);
            localStorage.setItem('welcomeShown', 'true');
        }
    }, 2000);

    console.log('🚀 ARES Credit Capital - Sistema mejorado cargado exitosamente');
});

// =========================================
//      FUNCIONES DE UTILIDAD GLOBALES
// =========================================

// Función para debug (solo en desarrollo)
window.debugApp = () => {
    console.log('Estado de la aplicación:', AppState);
    console.log('Tema actual:', AppState.currentTheme);
    console.log('Sección activa:', AppState.activeSection);
    console.log('Posición de scroll:', AppState.scrollPosition);
};

// Función para cambiar tema programáticamente
window.setTheme = (theme) => {
    if (window.themeManager) {
        window.themeManager.setTheme(theme);
    }
};

// Función para mostrar estadísticas de rendimiento
window.showPerformanceStats = () => {
    if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log(`📊 Estadísticas de rendimiento:
        - Tiempo de carga total: ${loadTime}ms
        - DOM listo en: ${domReady}ms
        - Tiempo de respuesta del servidor: ${timing.responseEnd - timing.requestStart}ms`);
    }
};


// =========================================
//      FUNCIONALIDAD DE PESTAÑAS (TABS)
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');

            // Desactivar todos los links y contenidos
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));

            // Activar el link y contenido seleccionado
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// ===============================================================
//      FUNCIONALIDAD PARA EL ACORDEÓN V2
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item-v2');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header-v2');
        const content = item.querySelector('.accordion-content-v2');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                content.style.padding = '0 1.5rem';
            } else {
                header.setAttribute('aria-expanded', 'true');
                // Calcula la altura del contenido y añade padding
                const contentHeight = content.scrollHeight;
                content.style.maxHeight = `${contentHeight + 48}px`; // 48px = 1.5rem * 2 * 16px/rem
                content.style.padding = '0 1.5rem 1.5rem 1.5rem';
            }
        });
    });
});


// =========================================
//   FUNCIONALIDAD DEL MENÚ DESPLEGABLE "MÁS"
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    const moreMenuBtn = document.getElementById('more-menu-btn');
    
    if (moreMenuBtn) {
        const dropdown = moreMenuBtn.closest('.dropdown');

        moreMenuBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.classList.toggle('active');
            const isExpanded = dropdown.classList.contains('active');
            moreMenuBtn.setAttribute('aria-expanded', isExpanded);
        });

        document.addEventListener('click', function(event) {
            if (dropdown.classList.contains('active') && !dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
                moreMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});


// =========================================
//      SISTEMA DE TRADUCCIÓN (i18n)
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FUNCIÓN PRINCIPAL PARA CAMBIAR IDIOMA ---
    // La definimos aquí para que esté disponible para initializeLanguage
    const setLanguage = (lang) => {
        if (!translations[lang]) {
            console.error(`Idioma no encontrado: ${lang}`);
            return;
        }

        // Guardar el idioma seleccionado
        localStorage.setItem('language', lang);

        // Actualizar textos normales
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Actualizar placeholders de inputs/textareas
        document.querySelectorAll('[data-key-placeholder]').forEach(element => {
            const key = element.getAttribute('data-key-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
        
        // Actualizar el atributo lang del HTML para SEO y accesibilidad
        document.documentElement.lang = lang;

        // Actualizar meta tags
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag && translations[lang].meta_description) {
            descriptionTag.content = translations[lang].meta_description;
        }
        const keywordsTag = document.querySelector('meta[name="keywords"]');
        if (keywordsTag && translations[lang].meta_keywords) {
            keywordsTag.content = translations[lang].meta_keywords;
        }
    };

    // --- 2. FUNCIÓN PARA INICIALIZAR Y CONTROLAR EL SWITCH ---
    const initializeLanguage = () => {
        const langSwitch = document.getElementById('language-switch');

        // Función para actualizar la UI del switch
        const updateSwitchUI = (lang) => {
            if (langSwitch) { // Comprobación de seguridad
                if (lang === 'en') {
                    langSwitch.classList.add('active');
                } else {
                    langSwitch.classList.remove('active');
                }
            }
        };

        // Asignar evento de clic al switch
        if (langSwitch) {
            langSwitch.addEventListener('click', () => {
                const isEnglish = langSwitch.classList.contains('active');
                const newLang = isEnglish ? 'es' : 'en';
                
                setLanguage(newLang);
                updateSwitchUI(newLang);
            });
        }

        // Detectar idioma al cargar la página
        const savedLang = localStorage.getItem('language');
        const browserLang = navigator.language.split('-')[0];
        
        const initialLang = (savedLang && translations[savedLang]) ? savedLang 
                          : (translations[browserLang]) ? browserLang 
                          : 'es';
                          
        // Establece el idioma y la posición inicial del switch
        setLanguage(initialLang);
        updateSwitchUI(initialLang);
    };

    // --- 3. LLAMAR A LA FUNCIÓN DE INICIALIZACIÓN ---
    initializeLanguage();
});

// =======================================================
//   FUNCIONALIDAD PARA EL FORMULARIO RÁPIDO DEL HERO
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const heroQuickForm = document.getElementById('hero-quick-form');
    
    if (heroQuickForm) {
        heroQuickForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previene el envío normal del formulario
            
            const heroEmailInput = document.getElementById('hero-email');
            const emailValue = heroEmailInput.value;

            if (emailValue) {
                // Guarda el email en localStorage para usarlo después
                localStorage.setItem('prefilled_email', emailValue);
                
                // Redirige al usuario a la sección de contacto
                window.location.hash = '#contacto';
                
                // Pequeña espera para que el scroll termine antes de rellenar
                setTimeout(() => {
                    const mainContactEmailInput = document.querySelector('#contacto #email');
                    if (mainContactEmailInput) {
                        mainContactEmailInput.value = emailValue;
                        // Opcional: Enfocar el siguiente campo, como el de mensaje
                        document.querySelector('#contacto #name').focus();
                    }
                    // Limpiar el localStorage para no rellenarlo siempre
                    localStorage.removeItem('prefilled_email');
                }, 800); // 800ms coincide con la duración del smooth scroll
            }
        });
    }

    // Comprobar si hay un email guardado al cargar la página (por si el hash ya es #contacto)
    const prefilledEmail = localStorage.getItem('prefilled_email');
    if (prefilledEmail && window.location.hash === '#contacto') {
        const mainContactEmailInput = document.querySelector('#contacto #email');
        if (mainContactEmailInput) {
            mainContactEmailInput.value = prefilledEmail;
            document.querySelector('#contacto #name').focus();
        }
        localStorage.removeItem('prefilled_email');
    }
});


// =======================================================
//   LÓGICA FINAL Y UNIFICADA PARA LA BARRA FLOTANTE DE CTA
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtenemos todos los elementos necesarios
    const ctaBar = document.getElementById('floating-cta-bar');
    const closeButton = document.getElementById('close-cta-bar');
    const footer = document.querySelector('.footer');

    // Si falta alguno de los elementos, no hacemos nada.
    if (!ctaBar || !closeButton || !footer) {
        return;
    }

    // --- Lógica principal para gestionar la visibilidad de la barra ---
    const handleBarVisibility = () => {
        // Si el usuario ya cerró la barra en esta sesión, detenemos la función.
        if (sessionStorage.getItem('ctaBarClosed') === 'true') {
            return;
        }

        // Calculamos si el footer está visible en la pantalla.
        const footerPosition = footer.getBoundingClientRect().top;
        const isFooterVisible = footerPosition < window.innerHeight;

        // Aplicamos la lógica combinada:
        if (isFooterVisible) {
            // PRIORIDAD 1: Si el footer es visible, la barra SIEMPRE se oculta.
            ctaBar.classList.remove('visible');
        } else if (window.scrollY > 400) {
            // PRIORIDAD 2: Si el footer no es visible y el scroll es suficiente, la barra se muestra.
            ctaBar.classList.add('visible');
        } else {
            // PRIORIDAD 3: Si no se cumplen las anteriores (estamos arriba), la barra se oculta.
            ctaBar.classList.remove('visible');
        }
    };

    // --- Lógica para cerrar la barra de forma permanente en la sesión ---
    const closeBarPermanently = () => {
        ctaBar.classList.remove('visible');
        sessionStorage.setItem('ctaBarClosed', 'true');
        // Optimizamos quitando el listener de scroll, ya que no se volverá a mostrar.
        window.removeEventListener('scroll', handleBarVisibility);
    };

    // Asignamos los eventos a las funciones correspondientes.
    window.addEventListener('scroll', handleBarVisibility);
    closeButton.addEventListener('click', closeBarPermanently);
});


// =======================================================
//   LÓGICA FINAL Y CORREGIDA v2 PARA EL CHATBOT
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotOptions = document.getElementById('chatbot-options');
    const chatbotGreeting = document.getElementById('chatbot-greeting');
    const closeGreetingBtn = document.getElementById('close-greeting');

    if (!chatbotToggle) return;

    const getCurrentLang = () => localStorage.getItem('language') || 'es';

    const addMessage = (text, type = 'bot') => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        messageDiv.innerHTML = text;
        chatbotBody.appendChild(messageDiv);
        setTimeout(() => { chatbotBody.scrollTop = chatbotBody.scrollHeight; }, 10);
    };

    const showOptions = (options) => {
        chatbotOptions.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chat-option-btn';
            button.dataset.key = option.key;
            button.innerHTML = translations[getCurrentLang()][option.key];
            
            button.onclick = () => {
                const lang = getCurrentLang();
                addMessage(translations[lang][option.key], 'user');
                chatbotOptions.innerHTML = '';

                if (option.action === 'redirect') {
                    // *** CORRECCIÓN DEFINITIVA ***
                    // Usamos la función de scroll manual para máxima fiabilidad.
                    const targetElement = document.getElementById('contacto');
                    if (targetElement && window.smoothScrollToTarget) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        window.smoothScrollToTarget(targetPosition);
                    }
                    toggleChatbot(false);
                } else {
                    setTimeout(() => {
                        addMessage(translations[lang][option.responseKey]);
                        setTimeout(() => {
                            addMessage(translations[lang]['chatbot_final_prompt']);
                            showOptions([
                                { key: 'chatbot_go_to_form', action: 'redirect' }
                            ]);
                        }, 1000);
                    }, 500);
                }
            };
            chatbotOptions.appendChild(button);
        });
    };

    const startChat = () => {
        const lang = getCurrentLang();
        chatbotBody.innerHTML = '';
        chatbotOptions.innerHTML = '';
        addMessage(translations[lang]['chatbot_initial_message']);
        showOptions([
            { key: 'chatbot_option_credit', responseKey: 'chatbot_credit_reply' },
            { key: 'chatbot_option_financing', responseKey: 'chatbot_financing_reply' },
            { key: 'chatbot_option_other', responseKey: 'chatbot_other_reply' }
        ]);
    };

    const toggleChatbot = (forceState) => {
        const isActive = chatbotWindow.classList.contains('active');
        const shouldBeActive = typeof forceState === 'boolean' ? forceState : !isActive;

        if (shouldBeActive) {
            if (!isActive) { startChat(); }
            chatbotWindow.classList.add('active');
            chatbotToggle.classList.add('active');
            if (chatbotGreeting) chatbotGreeting.style.display = 'none';
        } else {
            chatbotWindow.classList.remove('active');
            chatbotToggle.classList.remove('active');
        }
    };

    chatbotToggle.addEventListener('click', () => toggleChatbot());
    if (closeGreetingBtn) {
        closeGreetingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotGreeting.style.display = 'none';
        });
    }
});


