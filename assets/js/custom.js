// Dark Mode Logic
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('ti-light-bulb', 'ti-shine');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('ti-shine', 'ti-light-bulb');
        localStorage.setItem('theme', 'light');
    }
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').querySelector('i').classList.replace('ti-light-bulb', 'ti-shine');
}

// Multi-language Logic - Diccionario Estructurado Completo
const translations = {
    'es': {
        // Navegación
        'nav-home': 'Inicio',
        'nav-about': 'Perfil',
        'nav-resume': 'Currículum',
        'nav-portfolio': 'Portafolio',
        'nav-contact': 'Contacto',

        // Hero & Cabecera
        'header-hello': 'Hola, soy',
        'header-title': 'Junior Software Developer especializado en IA y Automatización',
        'btn-print-cv': 'Imprimir CV',
        'btn-download-cv': 'Descargar CV',

        // Banner Reclutador / Empresa
        'recruiter-banner-badge': 'Modo Empresa',
        'recruiter-banner-text': 'Visualizando experiencia laboral completa, enlaces a repositorios y descarga de CV.',
        'recruiter-btn-public': 'Vista Pública',

        // Sobre mí & Información Personal
        'about-who': '¿Quién soy?',
        'about-tagline': 'Un apasionado por la tecnología con enfoque en soluciones para el cliente',
        'about-description': 'Transformo procesos complejos en soluciones digitales eficientes. Mi enfoque combina el desarrollo Full Stack con la implementación estratégica de IA (LLMs) y arquitecturas de datos robustas. Apasionado por la resiliencia del software y la ingeniería detrás de los datos legales.',
        'about-personal': 'Información Personal',
        'personal-id': 'Cédula',
        'personal-license': 'Licencia de Conducción',
        'personal-passport': 'Pasaporte',
        'personal-travel': 'Sí (Disponible para viajar)',
        'personal-email': 'Email',
        'personal-phone': 'Teléfono',
        'personal-location': 'Ubicación',
        'personal-apps': 'Portafolio Apps',
        'personal-apps-link': 'Ver Portafolio de Apps',

        // Especialidades
        'exp-title': 'Mi Especialidad',
        'exp-sw': 'Desarrollo de Software',
        'exp-sw-desc': 'Creación de aplicaciones robustas y escalables con .NET, Node.js y Python.',
        'exp-ui': 'Diseño UI/UX Móvil',
        'exp-ui-desc': 'Interfaces intuitivas y modernas enfocadas en la experiencia del usuario con Flutter.',
        'exp-data': 'Análisis de Datos',
        'exp-data-desc': 'Extracción de valor y patrones significativos a partir de datos complejos.',
        'exp-hw': 'Arquitectura de Hardware',
        'exp-hw-desc': 'Ensambles de alto rendimiento, optimización térmica y diagnóstico a nivel de componentes.',

        // Currículum & Educación
        'resume-my': 'Mi',
        'resume-title': 'Currículum',
        'resume-exp': 'Experiencia',
        'resume-current': '2024 - Presente',
        'resume-role1': 'Desarrollador de Software (Contrato de Aprendizaje)',
        'resume-desc1': 'Desarrollo y soporte en soluciones tecnológicas empresariales, automatización de procesos internos, desarrollo de módulos con Claris FileMaker e integración de datos y APIs.',
        'resume-edu': 'Educación',
        'resume-inprogress': 'En formación / Estudiante',
        'resume-degree': 'Tecnología en Análisis y Desarrollo de Software',

        // Habilidades Blandas
        'skill-adaptation': 'Adaptación',
        'skill-learning': 'Aprendizaje Rápido',
        'skill-belonging': 'Sentido de pertenencia',
        'skill-responsibility': 'Responsabilidad',
        'skill-punctuality': 'Puntualidad',
        'skill-communication': 'Comunicación',
        'skill-teamwork': 'Trabajo en equipo',

        // Servicios
        'services-my': 'Mis',
        'services-title': 'Servicios',
        'serv-auto': 'Automatización & Low-Code',
        'serv-auto-desc': 'Optimización de procesos operativos mediante plataformas de desarrollo ágil, digitalización de flujos de trabajo y reducción de fricción manual en la gestión empresarial.',
        'serv-sw': 'Desarrollo de Soluciones de Software',
        'serv-sw-desc': 'Creación de aplicaciones web y de escritorio robustas, escalables y orientadas a la eficiencia operativa (.NET, Node.js, Python), diseñadas a la medida del negocio.',
        'serv-mobile': 'Aplicaciones Móviles',
        'serv-mobile-desc': 'Desarrollo de herramientas móviles multiplataforma nativas y fluidas con Flutter y Dart, facilitando la movilidad corporativa y la captura de datos en campo.',
        'serv-data': 'Arquitectura & Gestión de Datos',
        'serv-data-desc': 'Estructuración, almacenamiento seguro y disponibilidad de información empresarial mediante esquemas relacionales (SQL) y no relacionales (NoSQL), trazabilidad y auditoría.',
        'serv-bi': 'Business Intelligence & Análisis',
        'serv-bi-desc': 'Extracción, consolidación y visualización de métricas para la toma de decisiones estratégicas, detectando patrones clave y optimizaciones mediante Python y analítica.',
        'serv-maint': 'Mantenimiento & Continuidad',
        'serv-maint-desc': 'Actualización evolutiva, diagnóstico preventivo y soporte técnico continuo sobre sistemas existentes para garantizar su estabilidad, rapidez y seguridad a largo plazo.',
        'serv-hw-title': 'Consultoría & Arquitectura de Hardware | Ensambles de Alto Rendimiento',
        'serv-hw-badge': 'Infraestructura Física & Hardware Especializado',
        'serv-hw-desc': 'Especialista en infraestructura física de cómputo y soluciones avanzadas de ingeniería de hardware para maximizar la eficiencia térmica, benchmarking y continuidad operativa:',

        // Portafolio & Proyectos
        'port-all': 'Todos',
        'port-web': 'Web',
        'port-mobile': 'Móvil',
        'port-ai': 'IA',
        'port-git-title': 'Explora mis proyectos',
        'port-git-desc': 'Mantengo todos mis desarrollos, experimentos y soluciones de código abierto actualizados en mi perfil de GitHub.',

        // Métricas / Stats
        'stat-hours': 'Horas Académicas',
        'stat-projects': 'Repositorios en GitHub',
        'stat-prompts': 'Prompts Ejecutados',
        'stat-vibecoding': 'Con conciencia y profesionalismo',
        'stat-clients': 'Satisfacción',
        'stat-coffee': 'Cafés Tomados',

        // Formularios & Contacto
        'contact-form-title': 'Envía un mensaje',
        'contact-info-title': 'Ponte en contacto',
        'form-success': '¡Mensaje enviado con éxito!',
        'form-error': 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
        'form-sending': 'Enviando...',
        'survey-title': 'Encuesta de Satisfacción',
        'survey-name': 'Nombre',
        'survey-project': 'Proyecto realizado',
        'survey-rating': 'Calificación',
        'survey-comment': 'Comentario',
        'survey-submit': 'Enviar Calificación'
    },
    'en': {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'Profile',
        'nav-resume': 'Resume',
        'nav-portfolio': 'Portfolio',
        'nav-contact': 'Contact',

        // Hero & Header
        'header-hello': 'Hello, I am',
        'header-title': 'Junior Software Developer specializing in AI and Automation',
        'btn-print-cv': 'Print CV',
        'btn-download-cv': 'Download CV',

        // Recruiter Banner
        'recruiter-banner-badge': 'Company Mode',
        'recruiter-banner-text': 'Viewing complete work experience, repository links, and downloadable CV.',
        'recruiter-btn-public': 'Public View',

        // About & Personal Information
        'about-who': 'Who am I?',
        'about-tagline': 'A technology enthusiast focused on client-driven solutions',
        'about-description': 'I transform complex processes into efficient digital solutions. My approach combines Full Stack development with strategic AI implementation (LLMs) and robust data architectures. Passionate about software resilience and the engineering behind legal data.',
        'about-personal': 'Personal Information',
        'personal-id': 'National ID',
        'personal-license': "Driver's License",
        'personal-passport': 'Passport',
        'personal-travel': 'Yes (Available to travel)',
        'personal-email': 'Email',
        'personal-phone': 'Phone',
        'personal-location': 'Location',
        'personal-apps': 'Apps Portfolio',
        'personal-apps-link': 'View Apps Portfolio',

        // Expertise
        'exp-title': 'My Expertise',
        'exp-sw': 'Software Development',
        'exp-sw-desc': 'Creating robust and scalable applications with .NET, Node.js, and Python.',
        'exp-ui': 'Mobile UI/UX Design',
        'exp-ui-desc': 'Intuitive and modern interfaces focused on user experience with Flutter.',
        'exp-data': 'Data Analysis',
        'exp-data-desc': 'Extracting value and significant patterns from complex data.',
        'exp-hw': 'Hardware Architecture',
        'exp-hw-desc': 'High-performance PC builds, thermal optimization, and component-level diagnosis.',

        // Resume & Education
        'resume-my': 'My',
        'resume-title': 'Resume',
        'resume-exp': 'Experience',
        'resume-current': '2024 - Present',
        'resume-role1': 'Software Developer (Apprenticeship Contract)',
        'resume-desc1': 'Enterprise software development and support at Celerix SAS, process automation, Claris FileMaker modules, and API integration.',
        'resume-edu': 'Education',
        'resume-inprogress': 'In Training / Student',
        'resume-degree': 'Software Analysis and Development Technology',

        // Soft Skills
        'skill-adaptation': 'Adaptability',
        'skill-learning': 'Quick Learning',
        'skill-belonging': 'Sense of Belonging',
        'skill-responsibility': 'Responsibility',
        'skill-punctuality': 'Punctuality',
        'skill-communication': 'Communication',
        'skill-teamwork': 'Teamwork',

        // Services
        'services-my': 'My',
        'services-title': 'Services',
        'serv-auto': 'Automation & Low-Code',
        'serv-auto-desc': 'Operational process optimization through agile platforms, workflow digitization, and manual friction reduction in business management.',
        'serv-sw': 'Software Solutions Development',
        'serv-sw-desc': 'Building robust, scalable web and desktop applications focused on operational efficiency (.NET, Node.js, Python), tailored to your business.',
        'serv-mobile': 'Mobile Applications',
        'serv-mobile-desc': 'Native and fluid cross-platform mobile development with Flutter and Dart, facilitating corporate mobility and field data capture.',
        'serv-data': 'Architecture & Data Management',
        'serv-data-desc': 'Structuring, safe storage, and availability of enterprise information with relational (SQL) and non-relational (NoSQL) schemas, traceability, and auditability.',
        'serv-bi': 'Business Intelligence & Analytics',
        'serv-bi-desc': 'Extraction, consolidation, and visualization of strategic metrics, finding key patterns and process optimizations with Python and data analytics.',
        'serv-maint': 'Maintenance & Continuity',
        'serv-maint-desc': 'Evolutionary maintenance, preventive diagnosis, and ongoing technical support on existing systems to ensure stability, speed, and long-term security.',
        'serv-hw-title': 'Hardware Consulting & Architecture | High-Performance Builds',
        'serv-hw-badge': 'Physical Infrastructure & Specialized Hardware',
        'serv-hw-desc': 'Specialist in physical computing infrastructure and advanced hardware engineering to maximize thermal efficiency, benchmarking, and business continuity:',

        // Portfolio & Projects
        'port-all': 'All',
        'port-web': 'Web',
        'port-mobile': 'Mobile',
        'port-ai': 'AI',
        'port-git-title': 'Explore my projects',
        'port-git-desc': 'I keep all my developments, experiments, and open-source solutions updated on my GitHub profile.',

        // Metrics / Stats
        'stat-hours': 'Academic Hours',
        'stat-projects': 'GitHub Repositories',
        'stat-prompts': 'Executed Prompts',
        'stat-vibecoding': 'With awareness & professionalism',
        'stat-clients': 'Satisfaction',
        'stat-coffee': 'Coffee Cups Drunk',

        // Forms & Contact
        'contact-form-title': 'Send a message',
        'contact-info-title': 'Get in touch',
        'form-success': 'Message sent successfully!',
        'form-error': 'There was an error sending the message. Please try again.',
        'form-sending': 'Sending...',
        'survey-title': 'Satisfaction Survey',
        'survey-name': 'Name',
        'survey-project': 'Completed project',
        'survey-rating': 'Rating',
        'survey-comment': 'Comment',
        'survey-submit': 'Submit Rating'
    }
};

let currentLang = localStorage.getItem('lang') || 'es';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // 1. Actualizar textos estáticos según data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            element.innerText = translations[lang][key];
        }
    });

    // 2. Actualizar botón de idioma
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.innerText = lang === 'es' ? 'EN' : 'ES';
        langToggleBtn.title = lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish';
    }

    // 3. Re-aplicar datos dinámicos bilingües y banner de disponibilidad desde ViewController
    if (window.ViewController && typeof window.ViewController.applyCvDataToDOM === 'function') {
        window.ViewController.applyCvDataToDOM();
    }
}

document.getElementById('lang-toggle').addEventListener('click', function() {
    setLanguage(currentLang === 'es' ? 'en' : 'es');
});

// Exponer globalmente
window.setLanguage = setLanguage;
window.AppTranslations = translations;

// Inicialización de idioma guardado
setLanguage(currentLang);

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;
        
        // Show sending state
        btn.innerText = translations[currentLang]['form-sending'];
        btn.disabled = true;
        
        // Real submission using Fetch API
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'alert alert-success mt-3';
                formFeedback.innerText = translations[currentLang]['form-success'];
                contactForm.reset();
            } else {
                response.json().then(data => {
                    formFeedback.style.display = 'block';
                    formFeedback.className = 'alert alert-danger mt-3';
                    if (Object.hasOwn(data, 'errors')) {
                        formFeedback.innerText = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formFeedback.innerText = translations[currentLang]['form-error'];
                    }
                });
            }
        }).catch(error => {
            formFeedback.style.display = 'block';
            formFeedback.className = 'alert alert-danger mt-3';
            formFeedback.innerText = translations[currentLang]['form-error'];
        }).finally(() => {
            btn.innerText = originalBtnText;
            btn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        });
    });
}

// Survey Form Handling
const surveyForm = document.getElementById('survey-form');
const surveyFeedback = document.getElementById('survey-feedback');
const satisfactionCounter = document.getElementById('satisfaction-counter');

if (surveyForm) {
    surveyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;
        
        btn.innerText = translations[currentLang]['form-sending'];
        btn.disabled = true;
        
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                surveyFeedback.style.display = 'block';
                surveyFeedback.className = 'alert alert-success mt-3';
                surveyFeedback.innerText = translations[currentLang]['form-success'];
                
                // Update counter visually (simulation)
                let currentCount = parseInt(satisfactionCounter.innerText);
                satisfactionCounter.innerText = (currentCount + 1) + '+';
                
                surveyForm.reset();
                setTimeout(() => {
                    $('#surveyModal').modal('hide');
                    surveyFeedback.style.display = 'none';
                }, 2000);
            } else {
                surveyFeedback.style.display = 'block';
                surveyFeedback.className = 'alert alert-danger mt-3';
                surveyFeedback.innerText = translations[currentLang]['form-error'];
            }
        }).catch(error => {
            surveyFeedback.style.display = 'block';
            surveyFeedback.className = 'alert alert-danger mt-3';
            surveyFeedback.innerText = translations[currentLang]['form-error'];
        }).finally(() => {
            btn.innerText = originalBtnText;
            btn.disabled = false;
        });
    });
}

/* GSAP Animations & ScrollTrigger */
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Header Load Animations
    window.addEventListener('DOMContentLoaded', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
        
        tl.from('.header-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8
        })
        .from('.header-title', {
            y: 40,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.header-mono', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.portfolio-header-link', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(2)'
        }, '-=0.4')
        .from('.header .btn-primary', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.header .social-icons .social-item', {
            y: -20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6
        }, '-=0.8');
    });

    // About Section Scroll Animation
    gsap.from('#about .about-card', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Resume Section Cards Animation
    gsap.from('#resume .card', {
        scrollTrigger: {
            trigger: '#resume',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Dynamic Progress Bars Animation
    gsap.utils.toArray('.progress-bar').forEach(bar => {
        const targetWidth = bar.style.width || bar.getAttribute('aria-valuenow') + '%';
        bar.style.width = '0%'; // Reset width to 0 for animation
        
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out'
        });
    });

    // Counter/Stats Count Up Animation
    gsap.utils.toArray('.font40').forEach(stat => {
        const rawText = stat.innerText;
        const numMatch = rawText.match(/\d+/);
        if (numMatch) {
            const finalVal = parseInt(numMatch[0]);
            const obj = { val: 0 };
            
            gsap.to(obj, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                val: finalVal,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    stat.innerText = rawText.replace(/\d+/, Math.floor(obj.val));
                }
            });
        }
    });

    // Services Cards Scroll Animation
    gsap.from('#service .card', {
        scrollTrigger: {
            trigger: '#service',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Portfolio Section Animation
    gsap.from('#portfolio .card', {
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Contact Cards Animation
    gsap.from('.contact-form-card, .contact-info-card', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Refresh ScrollTrigger after all assets and images have loaded to prevent layout shift miscalculations
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
}

