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

// Multi-language Logic
const translations = {
    'es': {
        'nav-home': 'Inicio',
        'nav-about': 'Perfil',
        'nav-resume': 'Currículum',
        'nav-contact': 'Contacto',
        'header-hello': 'Hola, soy',
        'header-title': 'Analista de Datos y Desarrollador de Software Junior',
        'about-who': '¿Quién soy?',
        'about-tagline': 'Un apasionado por la tecnología con enfoque en soluciones para el cliente',
        'about-description': 'Analista de Datos y Desarrollador de Software Junior apasionado por la tecnología, la arquitectura de hardware y el desarrollo de software moderno. Mi enfoque profesional se centra en diseñar soluciones eficientes, escalables y orientadas a satisfacer las necesidades reales del usuario final. Me caracterizo por mi mentalidad de aprendizaje continuo, adaptabilidad ante nuevos desafíos tecnológicos y un fuerte compromiso con los valores éticos. Busco aportar valor en proyectos dinámicos de análisis de datos y desarrollo de aplicaciones.',
        'about-personal': 'Información Personal',
        'exp-title': 'Mi Especialidad',
        'exp-sw': 'Desarrollo de Software',
        'exp-sw-desc': 'Creación de aplicaciones robustas y escalables con .NET, Node.js y Python.',
        'exp-ui': 'Diseño UI/UX Móvil',
        'exp-ui-desc': 'Interfaces intuitivas y modernas enfocadas en la experiencia del usuario con Flutter.',
        'exp-data': 'Análisis de Datos',
        'exp-data-desc': 'Extracción de valor y patrones significativos a partir de datos complejos.',
        'resume-my': 'Mi',
        'resume-title': 'Currículum',
        'resume-exp': 'Experiencia',
        'resume-current': 'Actualidad',
        'resume-role1': 'Desarrollador Independiente',
        'resume-desc1': 'Desarrollo de proyectos y soluciones de software de manera autónoma mientras finalizo mis estudios tecnológicos.',
        'resume-edu': 'Educación',
        'resume-inprogress': 'En curso',
        'resume-degree': 'Tecnología en Análisis y Desarrollo de Software',
        'skill-adaptation': 'Adaptación',
        'skill-learning': 'Aprendizaje Rápido',
        'skill-belonging': 'Sentido de pertenencia',
        'skill-responsibility': 'Responsabilidad',
        'skill-punctuality': 'Puntualidad',
        'skill-communication': 'Comunicación',
        'skill-teamwork': 'Trabajo en equipo',
        'services-my': 'Mis',
        'services-title': 'Servicios',
        'serv-data': 'Análisis de Datos',
        'serv-data-desc': 'Extracción, limpieza y visualización de datos para la toma de decisiones estratégicas, utilizando herramientas modernas para encontrar patrones y tendencias.',
        'serv-sw': 'Desarrollo de Software',
        'serv-sw-desc': 'Creación de aplicaciones robustas y escalables, tanto para escritorio como para web, enfocadas en la eficiencia y la experiencia del usuario.',
        'port-all': 'Todos',
        'port-web': 'Web',
        'port-mobile': 'Móvil',
        'port-ai': 'IA',
        'port-git-title': 'Explora mis proyectos',
        'port-git-desc': 'Mantengo todos mis desarrollos, experimentos y soluciones de código abierto actualizados en mi perfil de GitHub.',
        'stat-hours': 'Horas Académicas',
        'stat-projects': 'Proyectos en GitHub',
        'stat-clients': 'Satisfacción',
        'stat-coffee': 'Cafés Tomados',
        'hire-title': 'Disponible para proyectos freelance o contrato laboral',
        'hire-btn': 'Contrátame',
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
        'nav-home': 'Home',
        'nav-about': 'Profile',
        'nav-resume': 'Resume',
        'nav-contact': 'Contact',
        'header-hello': 'Hello, I am',
        'header-title': 'Data Analyst and Junior Software Developer',
        'about-who': 'Who am I?',
        'about-tagline': 'A technology enthusiast focused on client-driven solutions',
        'about-description': 'Junior Data Analyst and Software Developer passionate about technology, hardware architecture, and modern software development. My professional focus is on designing efficient, scalable, and user-centric solutions. I am characterized by my continuous learning mindset, adaptability to new technological challenges, and a strong commitment to ethical values. I seek to add value to dynamic projects in data analysis and application development.',
        'about-personal': 'Personal Information',
        'exp-title': 'My Expertise',
        'exp-sw': 'Software Development',
        'exp-sw-desc': 'Creating robust and scalable applications with .NET, Node.js, and Python.',
        'exp-ui': 'Mobile UI/UX Design',
        'exp-ui-desc': 'Intuitive and modern interfaces focused on user experience with Flutter.',
        'exp-data': 'Data Analysis',
        'exp-data-desc': 'Extracting value and significant patterns from complex data.',
        'resume-my': 'My',
        'resume-title': 'Resume',
        'resume-exp': 'Experience',
        'resume-current': 'Current',
        'resume-role1': 'Freelance Developer',
        'resume-desc1': 'Developing software projects and solutions independently while completing my technological studies.',
        'resume-edu': 'Education',
        'resume-inprogress': 'In progress',
        'resume-degree': 'Analysis and Software Development Technology',
        'skill-adaptation': 'Adaptation',
        'skill-learning': 'Quick Learning',
        'skill-belonging': 'Sense of Belonging',
        'skill-responsibility': 'Responsibility',
        'skill-punctuality': 'Puntualidad',
        'skill-communication': 'Communication',
        'skill-teamwork': 'Teamwork',
        'services-my': 'My',
        'services-title': 'Services',
        'serv-data': 'Data Analysis',
        'serv-data-desc': 'Extraction, cleaning, and visualization of data for strategic decision-making, using modern tools to find patterns and trends.',
        'serv-sw': 'Software Development',
        'serv-sw-desc': 'Creation of robust and scalable applications, for both desktop and web, focused on efficiency and user experience.',
        'port-all': 'All',
        'port-web': 'Web',
        'port-mobile': 'Mobile',
        'port-ai': 'AI',
        'port-git-title': 'Explore my projects',
        'port-git-desc': 'I keep all my developments, experiments, and open-source solutions updated on my GitHub profile.',
        'stat-hours': 'Academic Hours',
        'stat-projects': 'GitHub Projects',
        'stat-clients': 'Satisfaction',
        'stat-coffee': 'Coffee Drunk',
        'hire-title': 'Available for freelance projects or full-time employment',
        'hire-btn': 'Hire me',
        'contact-form-title': 'Send a message',
        'contact-info-title': 'Get in touch',
        'form-success': 'Message sent successfully!',
        'form-error': 'There was an error sending the message. Please try again.',
        'form-sending': 'Sending...',
        'survey-title': 'Satisfaction Survey',
        'survey-name': 'Name',
        'survey-project': 'Project handled',
        'survey-rating': 'Rating',
        'survey-comment': 'Comment',
        'survey-submit': 'Submit Rating'
    }
};

let currentLang = localStorage.getItem('lang') || 'es';

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
    document.getElementById('lang-toggle').innerText = lang === 'es' ? 'EN' : 'ES';
    localStorage.setItem('lang', lang);
}

document.getElementById('lang-toggle').addEventListener('click', function() {
    setLanguage(currentLang === 'es' ? 'en' : 'es');
});

// Load saved language
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
        
        tl.from('.profile-img-header', {
            scale: 0.3,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
        })
        .from('.header-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, '-=0.8')
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
}

