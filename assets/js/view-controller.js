/**
 * VIEW CONTROLLER (Control de Audiencia & Administración Dinámica)
 * Proyecto: Christian Romero Portfolio & CV (ChrizDev)
 * 
 * Gestiona:
 * 1. La segmentación entre Vista Pública y Vista Profesional (Empresas/Reclutadores).
 * 2. Autenticación de Administrador (ChrizDev07) y persistencia de sesión.
 * 3. Gestión y persistencia completa del Portafolio y CV en localStorage ('chrizdev_cv_data'):
 *    - Independencia total de imágenes: Portada/Muro, Avatar Web y Foto CV Imprimible con live preview.
 *    - Switch dinámico de disponibilidad laboral: Búsqueda activa (freelance/laboral) vs Trabajando (soluciones corporativas).
 *    - Edición total de datos personales (nombre, título, bio, contacto, redes, etc.).
 *    - Gestor CRUD dinámico de experiencias laborales (añadir, editar, eliminar y reordenar).
 *    - Configuración de educación y estado académico (estudiante vs graduado).
 * 4. Sincronización en tiempo real con el DOM de la página principal y la vista de impresión ejecutiva (resumen.html).
 * 5. Importación y exportación de respaldos en formato JSON.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. Constantes y Configuración
    // -------------------------------------------------------------------------
    const ADMIN_USER = 'ChrizDev07';
    const ADMIN_PASS = 'ChrizDev07*';
    const DEFAULT_RECRUITER_TOKEN = 'chrizdev_talent_2025';

    const STORAGE_KEYS = {
        ADMIN_SESSION: 'cv_admin_session',
        RECRUITER_SESSION: 'cv_recruiter_session',
        RECRUITER_TOKEN: 'cv_recruiter_token',
        ADMIN_PREVIEW: 'cv_admin_preview_mode',
        TOOLBAR_COLLAPSED: 'cv_admin_toolbar_collapsed',
        CV_DATA: 'chrizdev_cv_data',
        LEGACY_PROFILE_DATA: 'cv_profile_data'
    };

    // Estructura completa de datos por defecto con las 3 imágenes, switch y bilingüismo nativo
    const DEFAULT_CV_DATA = {
        personal: {
            fullname: 'Christian Romero (ChrizDev)',
            displayName: 'Christian Romero',
            // Campos bilingües nativos
            jobTitle_es: 'Junior Software Developer especializado en IA y Automatización',
            jobTitle_en: 'Junior Software Developer specializing in AI and Automation',
            jobTitle: 'Junior Software Developer especializado en IA y Automatización', // Retrocompatibilidad
            brandSubtitle_es: 'Analista de Datos | Desarrollador Junior',
            brandSubtitle_en: 'Data Analyst | Junior Developer',
            brandSubtitle: 'Analista de Datos | Desarrollador Junior', // Retrocompatibilidad
            bio_es: 'Transformo procesos complejos en soluciones digitales eficientes. Mi enfoque combina el desarrollo Full Stack con la implementación estratégica de IA (LLMs) y arquitecturas de datos robustas. Apasionado por la resiliencia del software y la ingeniería detrás de los datos legales.',
            bio_en: 'I transform complex processes into efficient digital solutions. My approach combines Full Stack development with the strategic implementation of AI (LLMs) and robust data architectures. Passionate about software resilience and the engineering behind legal data.',
            bio: 'Transformo procesos complejos en soluciones digitales eficientes. Mi enfoque combina el desarrollo Full Stack con la implementación estratégica de IA (LLMs) y arquitecturas de datos robustas. Apasionado por la resiliencia del software y la ingeniería detrás de los datos legales.', // Retrocompatibilidad
            location_es: 'Medellín, Antioquia',
            location_en: 'Medellín, Colombia',
            location: 'Medellín, Antioquia', // Retrocompatibilidad
            email: 'christianjoroce@gmail.com',
            phone: '3183517802',
            portfolioUrl: 'https://my-app-s-portafolio-digital.vercel.app/',
            linkedinUrl: 'https://www.linkedin.com/in/christian-romero-5a9577145/',
            githubUrl: 'https://github.com/ChrisEna07',
            whatsappUrl: 'https://wa.link/o6m42i',
            // 3 Imágenes Desacopladas y Enfoque/Posición Vertical
            bannerUrl: 'assets/imgs/header.jpg',          // Foto de Portada / Banner (Muro)
            bannerPos: '50%',                             // Posición vertical fondo portada
            avatarWebUrl: 'assets/imgs/avatar.jpg',        // Foto de Presentación Web
            avatarWebPos: '20%',                          // Enfoque vertical avatar web
            avatarResumeUrl: 'assets/imgs/CVpicture.jpg',  // Foto del CV Imprimible (Ejecutiva)
            avatarResumePos: '15%',                       // Enfoque vertical rostro CV
            avatarUrl: 'assets/imgs/avatar.jpg'            // Retrocompatibilidad
        },
        availability: {
            isCurrentlyWorking: false, // false = Búsqueda activa / Freelance o laboral, true = Trabajando actualmente / Soluciones a medida
            workingBannerText_es: '¿Buscas digitalizar tu negocio o necesitas una solución a medida? Desarrollo aplicaciones web, plataformas móviles y herramientas de gestión empresarial para cualquier sector. Hablemos de tu proyecto.',
            workingBannerText_en: 'Looking to digitalize your business or need a custom solution? I develop web applications, mobile platforms, and business management tools for any sector. Let\'s talk about your project.',
            standardBannerText_es: 'Disponible para proyectos freelance o contrato laboral',
            standardBannerText_en: 'Available for freelance projects or employment contract',
            workingBtnText_es: 'Iniciar Proyecto',
            workingBtnText_en: 'Start Project',
            standardBtnText_es: 'Contrátame',
            standardBtnText_en: 'Hire Me',
            // Retrocompatibilidad
            workingBannerText: '¿Buscas digitalizar tu negocio o necesitas una solución a medida? Desarrollo aplicaciones web, plataformas móviles y herramientas de gestión empresarial para cualquier sector. Hablemos de tu proyecto.',
            standardBannerText: 'Disponible para proyectos freelance o contrato laboral',
            workingBtnText: 'Iniciar Proyecto',
            standardBtnText: 'Contrátame'
        },
        education: {
            title: 'Tecnólogo en Análisis y Desarrollo de Software',
            institution: 'SENA (Servicio Nacional de Aprendizaje)',
            status: 'studying', // 'studying' | 'graduated'
            date: 'Enero de 2027'
        },
        experiences: [
            {
                id: 'exp_1',
                company: 'Celerix SAS',
                role: 'Desarrollador de Software',
                period: '2024 - Presente',
                contract: 'Contrato de Aprendizaje',
                desc: 'Desarrollo y soporte en soluciones tecnológicas empresariales, automatización de procesos internos, desarrollo de módulos con Claris FileMaker e integración de datos y APIs.'
            },
            {
                id: 'exp_2',
                company: 'Soporte Técnico Freelance',
                role: 'Técnico en Soporte de Hardware & Ensambles',
                period: '2020 - 2023',
                contract: 'Independiente',
                desc: 'Consultoría y ensamble de estaciones de trabajo y PCs de alto rendimiento. Diagnóstico a nivel de componentes, optimización térmica, configuración de sistemas operativos y benchmarking.'
            },
            {
                id: 'exp_3',
                company: 'Empresa Privada',
                role: 'Asistente Administrativo',
                period: '2018 - 2020',
                contract: 'Presencial',
                desc: 'Gestión documental, digitalización de archivos masivos, atención a clientes y soporte en procesos administrativos.'
            }
        ],
        certifications: [
            {
                id: 'cert_claris_filemaker_specialist_2026',
                title: 'App Developer for Claris FileMaker Pro Specialist',
                issuer: 'Claris International Inc. (An Apple Company) & Credly',
                date: '14 de Octubre de 2026',
                credlyUrl: 'https://www.credly.com/badges/7bbcb5fd-fc4c-42ef-a6ca-1d1541941f31/public_url',
                badgeId: '7bbcb5fd-fc4c-42ef-a6ca-1d1541941f31',
                pdfUrl: 'ClarisCertificate-Specialist20261014.pdf',
                imageUrl: 'claris-specialist-badge.png',
                desc: 'Acreditación profesional oficial de nivel Especialista (2 estrellas) otorgada por Claris International Inc. Certifica competencias avanzadas en ingeniería de software con Claris FileMaker Pro, desarrollo de soluciones empresariales escalables, optimización de rendimiento, seguridad avanzada, integración de APIs REST y modelado de arquitecturas relacionales complejas.',
                skills: 'Claris FileMaker Pro, Specialist Scripting, REST Data APIs, Relational Architecture, Enterprise Security & Performance',
                showInWeb: true,
                showInResume: true
            },
            {
                id: 'cert_claris_filemaker_associate_2026',
                title: 'App Developer for Claris FileMaker Pro Associate',
                issuer: 'Claris International Inc. (An Apple Company) & Credly',
                date: '13 de Octubre de 2026',
                credlyUrl: 'https://www.credly.com/badges/d8c70883-218b-46e7-a89b-5b459d53a20a/public_url',
                badgeId: 'd8c70883-218b-46e7-a89b-5b459d53a20a',
                pdfUrl: 'ClarisCertificate-Main20261013-21-sbjpms.pdf',
                imageUrl: 'certificado.jpeg',
                desc: 'Acreditación internacional oficial que certifica competencias sólidas en el diseño de arquitectura relacional, desarrollo de soluciones modulares, creación de flujos automatizados con scripting y diseño de interfaces optimizadas bajo el ecosistema Claris FileMaker Pro.',
                skills: 'Claris FileMaker Pro, Scripting, Relational Architecture, Data APIs, Enterprise Solutions',
                showInWeb: true,
                showInResume: true
            }
        ],
        layout: {
            sectionsOrderWeb: [
                'about',
                'section-claris-specialization',
                'resume',
                'portfolio',
                'service',
                'price',
                'blog',
                'contact'
            ],
            sectionsVisibilityWeb: {
                'about': true,
                'section-claris-specialization': true,
                'resume': true,
                'portfolio': true,
                'service': true,
                'price': true,
                'blog': true,
                'contact': true
            },
            sectionsOrderResume: [
                'resume-section-profile',
                'resume-section-experience',
                'resume-section-projects',
                'resume-section-hardware',
                'resume-section-education',
                'resume-section-filemaker',
                'resume-section-certifications',
                'resume-section-skills',
                'resume-section-languages'
            ],
            sectionsVisibilityResume: {
                'resume-section-profile': true,
                'resume-section-experience': true,
                'resume-section-projects': true,
                'resume-section-education': true,
                'resume-section-hardware': true,
                'resume-section-filemaker': true,
                'resume-section-certifications': true,
                'resume-section-skills': true,
                'resume-section-languages': true
            }
        }
    };

    let activeCvData = null;

    // -------------------------------------------------------------------------
    // 2. Helpers de Estado y Almacenamiento
    // -------------------------------------------------------------------------
    function isAdminLoggedIn() {
        return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    }

    function isRecruiterAuthorized() {
        return sessionStorage.getItem(STORAGE_KEYS.RECRUITER_SESSION) === 'true';
    }

    function getRecruiterToken() {
        return localStorage.getItem(STORAGE_KEYS.RECRUITER_TOKEN) || DEFAULT_RECRUITER_TOKEN;
    }

    function getCleanBaseUrl() {
        return window.location.origin + window.location.pathname;
    }

    function getRecruiterShareUrl() {
        return `${getCleanBaseUrl()}?mode=empresa&token=${encodeURIComponent(getRecruiterToken())}`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function generateId(prefix = 'exp_') {
        return prefix + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    }

    // -------------------------------------------------------------------------
    // 3. Gestión y Persistencia del Modelo de Datos (chrizdev_cv_data)
    // -------------------------------------------------------------------------
    function getCvData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.CV_DATA);
            if (raw) {
                const parsed = JSON.parse(raw);
                const personal = Object.assign({}, DEFAULT_CV_DATA.personal, parsed.personal || {});
                
                // Normalización de imágenes desacopladas y posiciones si faltan
                if (!personal.bannerUrl) personal.bannerUrl = DEFAULT_CV_DATA.personal.bannerUrl;
                if (!personal.bannerPos) personal.bannerPos = DEFAULT_CV_DATA.personal.bannerPos;
                if (!personal.avatarWebUrl) personal.avatarWebUrl = personal.avatarUrl || DEFAULT_CV_DATA.personal.avatarWebUrl;
                if (!personal.avatarWebPos) personal.avatarWebPos = DEFAULT_CV_DATA.personal.avatarWebPos;
                if (!personal.avatarResumeUrl) personal.avatarResumeUrl = DEFAULT_CV_DATA.personal.avatarResumeUrl;
                if (!personal.avatarResumePos) personal.avatarResumePos = DEFAULT_CV_DATA.personal.avatarResumePos;

                // Normalización de campos bilingües nativos
                if (!personal.jobTitle_es) personal.jobTitle_es = personal.jobTitle || DEFAULT_CV_DATA.personal.jobTitle_es;
                if (!personal.jobTitle_en) personal.jobTitle_en = DEFAULT_CV_DATA.personal.jobTitle_en;
                personal.jobTitle = personal.jobTitle_es;

                if (!personal.brandSubtitle_es) personal.brandSubtitle_es = personal.brandSubtitle || DEFAULT_CV_DATA.personal.brandSubtitle_es;
                if (!personal.brandSubtitle_en) personal.brandSubtitle_en = DEFAULT_CV_DATA.personal.brandSubtitle_en;
                personal.brandSubtitle = personal.brandSubtitle_es;

                if (!personal.bio_es) personal.bio_es = personal.bio || DEFAULT_CV_DATA.personal.bio_es;
                if (!personal.bio_en) personal.bio_en = DEFAULT_CV_DATA.personal.bio_en;
                personal.bio = personal.bio_es;

                if (!personal.location_es) personal.location_es = personal.location || DEFAULT_CV_DATA.personal.location_es;
                if (!personal.location_en) personal.location_en = DEFAULT_CV_DATA.personal.location_en;
                personal.location = personal.location_es;

                const availability = Object.assign({}, DEFAULT_CV_DATA.availability, parsed.availability || {});
                if (parsed.personal && typeof parsed.personal.isCurrentlyWorking === 'boolean') {
                    availability.isCurrentlyWorking = parsed.personal.isCurrentlyWorking;
                }

                // Normalización bilingüe de textos de disponibilidad
                if (!availability.workingBannerText_es) availability.workingBannerText_es = availability.workingBannerText || DEFAULT_CV_DATA.availability.workingBannerText_es;
                if (!availability.workingBannerText_en) availability.workingBannerText_en = DEFAULT_CV_DATA.availability.workingBannerText_en;
                if (!availability.standardBannerText_es) availability.standardBannerText_es = availability.standardBannerText || DEFAULT_CV_DATA.availability.standardBannerText_es;
                if (!availability.standardBannerText_en) availability.standardBannerText_en = DEFAULT_CV_DATA.availability.standardBannerText_en;

                if (!availability.workingBtnText_es) availability.workingBtnText_es = availability.workingBtnText || DEFAULT_CV_DATA.availability.workingBtnText_es;
                if (!availability.workingBtnText_en) availability.workingBtnText_en = DEFAULT_CV_DATA.availability.workingBtnText_en;
                if (!availability.standardBtnText_es) availability.standardBtnText_es = availability.standardBtnText || DEFAULT_CV_DATA.availability.standardBtnText_es;
                if (!availability.standardBtnText_en) availability.standardBtnText_en = DEFAULT_CV_DATA.availability.standardBtnText_en;

                let certs = Array.isArray(parsed.certifications) && parsed.certifications.length > 0
                    ? parsed.certifications
                    : JSON.parse(JSON.stringify(DEFAULT_CV_DATA.certifications));

                // Asegurar que el nuevo certificado Specialist esté presente de forma automática
                const hasSpecialist = certs.some(c => c.badgeId === '7bbcb5fd-fc4c-42ef-a6ca-1d1541941f31' || (c.title && c.title.toLowerCase().includes('specialist')));
                if (!hasSpecialist) {
                    certs.unshift(JSON.parse(JSON.stringify(DEFAULT_CV_DATA.certifications[0])));
                }

                // Normalización de layout dinámico
                const layout = Object.assign({}, DEFAULT_CV_DATA.layout, parsed.layout || {});
                if (!layout.sectionsOrderWeb) layout.sectionsOrderWeb = DEFAULT_CV_DATA.layout.sectionsOrderWeb.slice();
                if (!layout.sectionsVisibilityWeb) layout.sectionsVisibilityWeb = Object.assign({}, DEFAULT_CV_DATA.layout.sectionsVisibilityWeb);
                if (!layout.sectionsOrderResume) layout.sectionsOrderResume = DEFAULT_CV_DATA.layout.sectionsOrderResume.slice();
                if (!layout.sectionsVisibilityResume) layout.sectionsVisibilityResume = Object.assign({}, DEFAULT_CV_DATA.layout.sectionsVisibilityResume);

                DEFAULT_CV_DATA.layout.sectionsOrderWeb.forEach(secId => {
                    if (!layout.sectionsOrderWeb.includes(secId)) layout.sectionsOrderWeb.push(secId);
                });
                DEFAULT_CV_DATA.layout.sectionsOrderResume.forEach(secId => {
                    if (!layout.sectionsOrderResume.includes(secId)) layout.sectionsOrderResume.push(secId);
                });

                return {
                    personal: personal,
                    availability: availability,
                    education: Object.assign({}, DEFAULT_CV_DATA.education, parsed.education || {}),
                    experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 
                        ? parsed.experiences 
                        : JSON.parse(JSON.stringify(DEFAULT_CV_DATA.experiences)),
                    certifications: certs,
                    layout: layout
                };
            }

            // Migración desde legacy cv_profile_data
            const legacyRaw = localStorage.getItem(STORAGE_KEYS.LEGACY_PROFILE_DATA);
            if (legacyRaw) {
                const legacy = JSON.parse(legacyRaw);
                const migrated = JSON.parse(JSON.stringify(DEFAULT_CV_DATA));
                if (legacy.jobRole) migrated.experiences[0].role = legacy.jobRole;
                if (legacy.jobCompany) migrated.experiences[0].company = legacy.jobCompany;
                if (legacy.jobPeriod) migrated.experiences[0].period = legacy.jobPeriod;
                if (legacy.jobDesc) migrated.experiences[0].desc = legacy.jobDesc;
                if (legacy.eduTitle) migrated.education.title = legacy.eduTitle;
                if (legacy.eduInstitution) migrated.education.institution = legacy.eduInstitution;
                if (legacy.eduStatus) migrated.education.status = legacy.eduStatus;
                if (legacy.eduDate) migrated.education.date = legacy.eduDate;
                
                localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(migrated));
                return migrated;
            }
        } catch (e) {
            console.warn('Error al leer chrizdev_cv_data:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_CV_DATA));
    }

    function saveCvData(data) {
        try {
            if (!data) data = activeCvData || getCvData();
            localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(data));
            
            // Compatibilidad legacy
            if (data.experiences && data.experiences.length > 0 && data.education) {
                const legacyData = {
                    jobRole: data.experiences[0].role,
                    jobCompany: data.experiences[0].company,
                    jobPeriod: data.experiences[0].period,
                    jobDesc: data.experiences[0].desc,
                    eduTitle: data.education.title,
                    eduInstitution: data.education.institution,
                    eduStatus: data.education.status,
                    eduDate: data.education.date
                };
                localStorage.setItem(STORAGE_KEYS.LEGACY_PROFILE_DATA, JSON.stringify(legacyData));
            }

            activeCvData = JSON.parse(JSON.stringify(data));
            applyCvDataToDOM(data);
            return true;
        } catch (e) {
            console.error('Error al guardar chrizdev_cv_data:', e);
            return false;
        }
    }

    function resetCvData() {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_CV_DATA));
        saveCvData(fresh);
        return fresh;
    }

    // -------------------------------------------------------------------------
    // 4. Sincronización Total con el DOM (Web & CV Imprimible)
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // 4. Sincronización Total con el DOM (Web & CV Imprimible)
    // -------------------------------------------------------------------------
    function applyHeroCoverImage(url, pos) {
        const headerBg = document.getElementById('display-header-bg') || document.querySelector('header.header');
        if (!headerBg) return;

        headerBg.style.backgroundAttachment = 'scroll';

        const defaultUrl = DEFAULT_CV_DATA.personal.bannerUrl || 'assets/imgs/header.jpg';
        let cleanUrl = (url && typeof url === 'string') ? url.trim().replace(/\\/g, '/') : '';
        if (!cleanUrl) cleanUrl = defaultUrl;
        const bgPos = (pos && typeof pos === 'string') ? (pos.includes('%') ? pos : pos + '%') : '50%';

        const imgTester = new Image();
        imgTester.onload = function () {
            headerBg.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("${cleanUrl}")`;
            headerBg.style.backgroundSize = 'cover';
            headerBg.style.backgroundPosition = `center ${bgPos}`;
            headerBg.style.backgroundAttachment = 'scroll';
            headerBg.style.backgroundRepeat = 'no-repeat';
        };
        imgTester.onerror = function () {
            console.warn('Imagen de portada no accesible:', cleanUrl, '. Usando imagen por defecto.');
            headerBg.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url("${defaultUrl}")`;
            headerBg.style.backgroundSize = 'cover';
            headerBg.style.backgroundPosition = `center ${bgPos}`;
            headerBg.style.backgroundAttachment = 'scroll';
            headerBg.style.backgroundRepeat = 'no-repeat';
        };
        imgTester.src = cleanUrl;
    }

    function applyAvailabilityBannerToDOM(isWorking) {
        const currentLang = localStorage.getItem('lang') || 'es';
        const avail = (activeCvData && activeCvData.availability) ? activeCvData.availability : DEFAULT_CV_DATA.availability;
        
        const bannerTitleEl = document.getElementById('display-hire-title');
        const bannerBtnEl = document.getElementById('display-hire-btn');
        const heroBtnTextEl = document.getElementById('display-hero-hire-text');

        const content = {
            es: {
                active: {
                    banner: "Disponible para proyectos freelance o contrato laboral",
                    btn: "Contrátame",
                    heroBtn: "Contrátame",
                    href: "#contact"
                },
                working: {
                    banner: "¿Buscas digitalizar tu negocio o necesitas una solución a medida? Desarrollo aplicaciones web, plataformas móviles y herramientas de gestión empresarial para cualquier sector. Hablemos de tu proyecto.",
                    btn: "Iniciar Proyecto",
                    heroBtn: "Iniciar Proyecto",
                    href: "#contact"
                }
            },
            en: {
                active: {
                    banner: "Available for freelance projects or employment contract",
                    btn: "Hire Me",
                    heroBtn: "Hire Me",
                    href: "#contact"
                },
                working: {
                    banner: "Looking to digitalize your business or need a custom solution? I develop web applications, mobile platforms, and business management tools for any sector. Let's talk about your project.",
                    btn: "Start Project",
                    heroBtn: "Start Project",
                    href: "#contact"
                }
            }
        };

        const langData = content[currentLang] || content.es;
        const item = isWorking ? langData.working : langData.active;

        if (bannerTitleEl) {
            bannerTitleEl.textContent = item.banner;
        }
        if (bannerBtnEl) {
            bannerBtnEl.textContent = item.btn;
            bannerBtnEl.setAttribute('href', item.href);
        }
        if (heroBtnTextEl) {
            heroBtnTextEl.textContent = item.heroBtn;
        }
    }

    function applyLayoutToDOM(layout) {
        if (!layout) layout = (activeCvData && activeCvData.layout) ? activeCvData.layout : DEFAULT_CV_DATA.layout;

        // 1. Reordenamiento y visibilidad en index.html
        if (Array.isArray(layout.sectionsOrderWeb)) {
            const containerFluid = document.querySelector('body > .container-fluid') || document.body;
            layout.sectionsOrderWeb.forEach(secId => {
                const el = document.getElementById(secId);
                if (el) {
                    const isVisible = layout.sectionsVisibilityWeb ? layout.sectionsVisibilityWeb[secId] !== false : true;
                    el.style.display = isVisible ? '' : 'none';
                    if (el.parentNode === containerFluid) {
                        containerFluid.appendChild(el);
                    }
                }
            });
        }

        // 2. Reordenamiento y visibilidad en resumen.html
        if (Array.isArray(layout.sectionsOrderResume)) {
            const colMain = document.getElementById('resume-col-main');
            const colSidebar = document.getElementById('resume-col-sidebar');
            const mainSecIds = ['resume-section-profile', 'resume-section-experience', 'resume-section-projects', 'resume-section-hardware'];

            layout.sectionsOrderResume.forEach(secId => {
                const el = document.getElementById(secId);
                if (el) {
                    const isVisible = layout.sectionsVisibilityResume ? layout.sectionsVisibilityResume[secId] !== false : true;
                    el.style.display = isVisible ? '' : 'none';
                    if (mainSecIds.includes(secId) && colMain) {
                        colMain.appendChild(el);
                    } else if (colSidebar) {
                        colSidebar.appendChild(el);
                    }
                }
            });
        }
    }

    function setAvailabilityState(isWorking, save = true) {
        if (!activeCvData) activeCvData = getCvData();
        activeCvData.availability.isCurrentlyWorking = isWorking;

        const modalSwitch = document.getElementById('admin-switch-working-status');
        if (modalSwitch) modalSwitch.checked = isWorking;

        const quickSwitch = document.getElementById('admin-quick-switch-working');
        if (quickSwitch) quickSwitch.checked = isWorking;

        updateAvailabilityUI(isWorking);
        applyAvailabilityBannerToDOM(isWorking);

        if (save) {
            saveCvData(activeCvData);
            showToast(
                isWorking 
                    ? 'Disponibilidad: Soluciones de Negocio (ON)' 
                    : 'Disponibilidad: Búsqueda Activa (OFF)', 
                'info', 
                3000
            );
        }
    }

    function applyCvDataToDOM(data) {
        if (!data) data = getCvData();
        const p = data.personal || {};
        const avail = data.availability || DEFAULT_CV_DATA.availability;
        const edu = data.education || {};
        const exps = Array.isArray(data.experiences) ? data.experiences : [];
        const currentLang = localStorage.getItem('lang') || 'es';

        // ---------------------------------------------------------------------
        // A. GESTIÓN INDEPENDIENTE DE IMÁGENES & ENFOQUE/POSICIÓN
        // ---------------------------------------------------------------------
        // 1. Portada / Banner (Muro) con verificación, fallback y posición vertical
        const bannerPos = p.bannerPos || '50%';
        applyHeroCoverImage(p.bannerUrl, bannerPos);

        // 2. Avatar de Presentación Web con enfoque vertical
        const avatarWebUrl = p.avatarWebUrl || p.avatarUrl || 'assets/imgs/avatar.jpg';
        const webPos = p.avatarWebPos ? (p.avatarWebPos.includes('%') ? p.avatarWebPos : p.avatarWebPos + '%') : '20%';
        const webAvatarImg = document.getElementById('display-avatar-img');
        if (webAvatarImg) {
            webAvatarImg.src = avatarWebUrl;
            webAvatarImg.style.objectPosition = `center ${webPos}`;
        }
        document.querySelectorAll('.brand-img').forEach(img => {
            img.src = avatarWebUrl;
            img.style.objectPosition = `center ${webPos}`;
        });

        // 3. Foto del CV Imprimible (Ejecutiva) con enfoque vertical (rostro)
        const avatarResumeUrl = p.avatarResumeUrl || p.avatarUrl || 'assets/imgs/CVpicture.jpg';
        const resumePos = p.avatarResumePos ? (p.avatarResumePos.includes('%') ? p.avatarResumePos : p.avatarResumePos + '%') : '15%';
        const resumeAvatarImg = document.getElementById('display-resume-avatar');
        if (resumeAvatarImg) {
            resumeAvatarImg.src = avatarResumeUrl;
            resumeAvatarImg.style.objectPosition = `center ${resumePos}`;
        }
        document.querySelectorAll('.profile-img-resume').forEach(img => {
            img.src = avatarResumeUrl;
            img.style.objectPosition = `center ${resumePos}`;
        });

        // ---------------------------------------------------------------------
        // B. SWITCH DINÁMICO DE DISPONIBILIDAD LABORAL (BANNER CTA)
        // ---------------------------------------------------------------------
        const isWorking = avail.isCurrentlyWorking === true;
        applyAvailabilityBannerToDOM(isWorking);

        // ---------------------------------------------------------------------
        // C. DATOS PERSONALES & ENCABEZADOS (SOPORTE BILINGÜE ES / EN)
        // ---------------------------------------------------------------------
        const elHeaderName = document.getElementById('display-header-name');
        if (elHeaderName && p.fullname) elHeaderName.textContent = p.fullname;

        const elResumeName = document.getElementById('display-resume-name');
        if (elResumeName && p.fullname) elResumeName.textContent = p.fullname;

        const elFooterName = document.getElementById('display-footer-name');
        if (elFooterName && (p.displayName || p.fullname)) elFooterName.textContent = p.displayName || p.fullname;

        const elBrandName = document.getElementById('display-brand-name');
        if (elBrandName && (p.displayName || p.fullname)) elBrandName.textContent = p.displayName || p.fullname;

        // Título Profesional Bilingüe
        const activeTitle = (currentLang === 'en' ? p.jobTitle_en : p.jobTitle_es) || p.jobTitle || (currentLang === 'en' ? DEFAULT_CV_DATA.personal.jobTitle_en : DEFAULT_CV_DATA.personal.jobTitle_es);
        const elHeaderTitle = document.getElementById('display-header-title');
        if (elHeaderTitle) elHeaderTitle.textContent = activeTitle;

        const elResumeTitle = document.getElementById('display-resume-title');
        if (elResumeTitle) elResumeTitle.textContent = activeTitle;

        // Especialidad / Subtítulo Navbar Bilingüe
        const activeBrandSubtitle = (currentLang === 'en' ? p.brandSubtitle_en : p.brandSubtitle_es) || p.brandSubtitle || (currentLang === 'en' ? DEFAULT_CV_DATA.personal.brandSubtitle_en : DEFAULT_CV_DATA.personal.brandSubtitle_es);
        const elBrandTitle = document.getElementById('display-brand-title');
        if (elBrandTitle) elBrandTitle.textContent = activeBrandSubtitle;

        // Biografía "¿Quién soy?" Bilingüe
        const activeBio = (currentLang === 'en' ? p.bio_en : p.bio_es) || p.bio || (currentLang === 'en' ? DEFAULT_CV_DATA.personal.bio_en : DEFAULT_CV_DATA.personal.bio_es);
        const elAboutBio = document.getElementById('display-about-bio');
        if (elAboutBio) elAboutBio.textContent = activeBio;

        const elResumeBio = document.getElementById('display-resume-bio');
        if (elResumeBio) elResumeBio.textContent = activeBio;

        // Contacto
        const elPersonalEmail = document.getElementById('display-personal-email');
        if (elPersonalEmail && p.email) elPersonalEmail.textContent = p.email;
        const elContactEmail = document.getElementById('display-contact-email');
        if (elContactEmail && p.email) elContactEmail.textContent = p.email;
        const elResumeEmail = document.getElementById('display-resume-email');
        if (elResumeEmail && p.email) elResumeEmail.textContent = p.email;

        const elPersonalPhone = document.getElementById('display-personal-phone');
        if (elPersonalPhone && p.phone) elPersonalPhone.textContent = p.phone;
        const elContactPhone = document.getElementById('display-contact-phone');
        if (elContactPhone && p.phone) elContactPhone.textContent = p.phone;
        const elResumePhone = document.getElementById('display-resume-phone');
        if (elResumePhone && p.phone) elResumePhone.textContent = p.phone;

        // Ubicación Bilingüe
        const activeLocation = (currentLang === 'en' ? p.location_en : p.location_es) || p.location || (currentLang === 'en' ? DEFAULT_CV_DATA.personal.location_en : DEFAULT_CV_DATA.personal.location_es);
        const elPersonalLoc = document.getElementById('display-personal-location');
        if (elPersonalLoc) elPersonalLoc.textContent = activeLocation;
        const elContactLoc = document.getElementById('display-contact-location');
        if (elContactLoc) elContactLoc.textContent = activeLocation;
        const elResumeLoc = document.getElementById('display-resume-location');
        if (elResumeLoc) elResumeLoc.textContent = activeLocation;

        // Enlaces
        if (p.portfolioUrl) {
            const elPersonalPort = document.getElementById('display-personal-portfolio');
            if (elPersonalPort) elPersonalPort.href = p.portfolioUrl;
            const elResumePort = document.getElementById('display-resume-portfolio');
            if (elResumePort) {
                elResumePort.href = p.portfolioUrl;
                let cleanPort = p.portfolioUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
                elResumePort.textContent = `Portafolio: ${cleanPort}`;
            }
        }

        if (p.linkedinUrl) {
            const elAboutIn = document.getElementById('display-about-linkedin');
            if (elAboutIn) elAboutIn.href = p.linkedinUrl;
            const elHeaderIn = document.getElementById('display-header-linkedin');
            if (elHeaderIn) elHeaderIn.href = p.linkedinUrl;
            const elResumeIn = document.getElementById('display-resume-linkedin');
            if (elResumeIn) {
                elResumeIn.href = p.linkedinUrl;
                let cleanIn = p.linkedinUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
                elResumeIn.textContent = cleanIn;
            }
            document.querySelectorAll('.contact-info-card a[href*="linkedin"]').forEach(a => { a.href = p.linkedinUrl; });
        }

        if (p.githubUrl) {
            const elAboutGh = document.getElementById('display-about-github');
            if (elAboutGh) elAboutGh.href = p.githubUrl;
            const elHeaderGh = document.getElementById('display-header-github');
            if (elHeaderGh) elHeaderGh.href = p.githubUrl;
            const elResumeGh = document.getElementById('display-resume-github');
            if (elResumeGh) {
                elResumeGh.href = p.githubUrl;
                let cleanGh = p.githubUrl.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
                elResumeGh.textContent = cleanGh;
            }
            document.querySelectorAll('.contact-info-card a[href*="github"]').forEach(a => { a.href = p.githubUrl; });
        }

        if (p.whatsappUrl) {
            const elAboutWa = document.getElementById('display-about-whatsapp');
            if (elAboutWa) elAboutWa.href = p.whatsappUrl;
            const elHeaderWa = document.getElementById('display-header-whatsapp');
            if (elHeaderWa) elHeaderWa.href = p.whatsappUrl;
            document.querySelectorAll('.whatsapp-float, .contact-info-card a[href*="wa.link"], .contact-info-card a[href*="whatsapp"]').forEach(a => { a.href = p.whatsappUrl; });
        }

        // ---------------------------------------------------------------------
        // D. EDUCACIÓN & ESTADO ACADÉMICO
        // ---------------------------------------------------------------------
        const isGraduated = edu.status === 'graduated';

        const elEduTitle = document.getElementById('display-edu-title');
        if (elEduTitle && edu.title) elEduTitle.textContent = edu.title;

        const elEduInst = document.getElementById('display-edu-institution');
        if (elEduInst && edu.institution) elEduInst.textContent = edu.institution;

        const elStatusBadge = document.getElementById('display-edu-status-badge');
        if (elStatusBadge) {
            if (isGraduated) {
                elStatusBadge.innerHTML = `<span class="badge badge-success px-2 py-1" style="font-size: 0.75rem; border-radius: 4px; background-color: #10b981;"><i class="ti-medall mr-1"></i> <span id="display-edu-status-text">Graduado en ${escapeHtml(edu.date)}</span></span>`;
            } else {
                elStatusBadge.innerHTML = `<span class="badge badge-danger px-2 py-1" style="font-size: 0.75rem; border-radius: 4px; background-color: #F85C70;"><i class="ti-book mr-1"></i> <span id="display-edu-status-text">En formación / Estudiante</span></span>`;
            }
        }

        const elEduDateText = document.getElementById('display-edu-date-text');
        if (elEduDateText && edu.date) {
            elEduDateText.textContent = isGraduated 
                ? `Graduado: ${edu.date}` 
                : `Finalización estimada: ${edu.date}`;
        }

        const resumeEduTitle = document.getElementById('cv-resume-edu-title');
        if (resumeEduTitle && edu.title) resumeEduTitle.textContent = edu.title;

        const resumeEduStatus = document.getElementById('cv-resume-edu-status');
        if (resumeEduStatus) {
            resumeEduStatus.textContent = isGraduated
                ? `Graduado en ${edu.date}`
                : `En formación / Estudiante (Finalización estimada: ${edu.date})`;
        }

        const resumeEduInst = document.getElementById('cv-resume-edu-institution') || document.getElementById('cv-resume-edu-inst');
        if (resumeEduInst && edu.institution) resumeEduInst.textContent = edu.institution;

        // ---------------------------------------------------------------------
        // E. EXPERIENCIAS LABORALES DINÁMICAS (CRUD RENDER)
        // ---------------------------------------------------------------------
        // 1. En index.html (#display-experience-container)
        const displayExpContainer = document.getElementById('display-experience-container');
        if (displayExpContainer) {
            if (exps.length === 0) {
                displayExpContainer.innerHTML = '<p class="text-muted text-center py-3">No hay experiencias laborales registradas.</p>';
            } else {
                let html = '';
                exps.forEach((exp, index) => {
                    const isLast = index === exps.length - 1;
                    html += `
                        <div class="experience-entry mb-3 pb-2 ${isLast ? '' : 'border-bottom'}">
                            <div class="d-flex justify-content-between align-items-center mb-1 flex-wrap">
                                <h6 class="title text-danger mb-0 font-weight-bold">${escapeHtml(exp.period)}</h6>
                                ${exp.contract ? `<span class="badge badge-light text-muted small px-2 py-1">${escapeHtml(exp.contract)}</span>` : ''}
                            </div>
                            <p class="font-weight-bold mb-0 text-dark" style="font-size: 0.95rem;">${escapeHtml(exp.role)}</p>
                            <p class="text-danger font-weight-bold small mb-1">${escapeHtml(exp.company)}</p>
                            <p class="subtitle mb-0 small text-muted">${escapeHtml(exp.desc)}</p>
                        </div>
                    `;
                });
                displayExpContainer.innerHTML = html;
            }
        }

        // 2. En resumen.html (#resume-experience-container)
        const resumeExpContainer = document.getElementById('resume-experience-container');
        if (resumeExpContainer) {
            if (exps.length === 0) {
                resumeExpContainer.innerHTML = '<p class="text-muted">No hay experiencias laborales registradas.</p>';
            } else {
                let html = '';
                exps.forEach(exp => {
                    html += `
                        <div class="exp-item">
                            <div class="item-header">
                                <span>${escapeHtml(exp.role)}</span>
                                <span class="item-period">${escapeHtml(exp.period)}</span>
                            </div>
                            <div class="item-sub">${escapeHtml(exp.company)}${exp.contract ? ` (${escapeHtml(exp.contract)})` : ''}</div>
                            <p class="item-desc">${escapeHtml(exp.desc)}</p>
                        </div>
                    `;
                });
                resumeExpContainer.innerHTML = html;
            }
        }

        // ---------------------------------------------------------------------
        // F. CERTIFICACIONES & INSIGNIAS OFICIALES (CREDLY & CLARIS)
        // ---------------------------------------------------------------------
        const certs = (data.certifications && Array.isArray(data.certifications)) 
            ? data.certifications 
            : DEFAULT_CV_DATA.certifications;

        // 1. Tarjeta Destacada de FileMaker en index.html (#filemaker-cert-highlight)
        const fmCertContainer = document.getElementById('filemaker-cert-highlight');
        if (fmCertContainer) {
            const fmCert = certs.find(c => c.badgeId || (c.title && c.title.toLowerCase().includes('filemaker'))) || certs[0];
            if (fmCert && fmCert.showInWeb !== false) {
                fmCertContainer.style.display = 'block';
                const elTitle = fmCertContainer.querySelector('.fm-cert-title');
                if (elTitle) elTitle.textContent = fmCert.title;
                const elIssuer = fmCertContainer.querySelector('.fm-cert-issuer-text');
                if (elIssuer) elIssuer.textContent = fmCert.issuer;
                const elDate = fmCertContainer.querySelector('.fm-cert-date-text');
                if (elDate) elDate.textContent = fmCert.date;
                const elDesc = fmCertContainer.querySelector('.fm-cert-desc-text');
                if (elDesc) elDesc.textContent = fmCert.desc;
                const elCredlyBtn = fmCertContainer.querySelector('.fm-cert-credly-btn');
                if (elCredlyBtn && fmCert.credlyUrl) elCredlyBtn.href = fmCert.credlyUrl;
                const elPdfBtn = fmCertContainer.querySelector('.fm-cert-pdf-btn');
                if (elPdfBtn && fmCert.pdfUrl) elPdfBtn.href = fmCert.pdfUrl;
                const elImgBtn = fmCertContainer.querySelector('.fm-cert-img-btn');
                if (elImgBtn && fmCert.imageUrl) elImgBtn.href = fmCert.imageUrl;
            } else if (fmCert && fmCert.showInWeb === false) {
                fmCertContainer.style.display = 'none';
            }
        }

        // 2. Lista General de Certificaciones en index.html (#display-certifications-container)
        const isRecruiterMode = isRecruiterAuthorized() || isAdminLoggedIn() || document.body.classList.contains('mode-recruiter');
        const displayCertsContainer = document.getElementById('display-certifications-container');
        if (displayCertsContainer) {
            const webCerts = certs.filter(c => c.showInWeb !== false);
            if (webCerts.length === 0) {
                displayCertsContainer.innerHTML = '<p class="text-muted text-center py-2">No hay certificaciones configuradas para la vista web.</p>';
            } else {
                let certHtml = '';
                webCerts.forEach(cert => {
                    certHtml += `
                        <div class="col-12 col-md-6 mb-3">
                            <div class="card h-100 p-3 shadow-sm" style="border: 1px solid rgba(248, 92, 112, 0.25); border-left: 4px solid #F85C70; background: #ffffff; border-radius: 8px;">
                                <div class="d-flex align-items-center flex-wrap" style="gap: 12px;">
                                    ${cert.imageUrl ? `<img src="${escapeHtml(cert.imageUrl)}" alt="${escapeHtml(cert.title)}" style="width: 52px; height: 52px; object-fit: contain; border-radius: 6px; border: 1px solid #e2e8f0; padding: 2px; flex-shrink: 0;">` : `<i class="ti-medall text-danger" style="font-size: 2rem; flex-shrink: 0;"></i>`}
                                    <div class="flex-fill" style="min-width: 200px;">
                                        <div class="d-flex justify-content-between align-items-baseline flex-wrap">
                                            <h6 class="font-weight-bold text-dark mb-0">${escapeHtml(cert.title)}</h6>
                                            <span class="badge badge-light text-muted small"><i class="ti-calendar mr-1"></i>${escapeHtml(cert.date)}</span>
                                        </div>
                                        <div class="text-danger font-weight-bold small">${escapeHtml(cert.issuer)}</div>
                                        <p class="subtitle mb-2 small text-muted">${escapeHtml(cert.desc)}</p>
                                        <div class="d-flex flex-wrap" style="gap: 6px;">
                                            ${cert.credlyUrl ? `<a href="${escapeHtml(cert.credlyUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-danger btn-sm py-0 px-2" style="font-size: 0.72rem;"><i class="ti-check-box mr-1"></i>Verificar en Credly</a>` : ''}
                                            ${cert.pdfUrl ? (isRecruiterMode 
                                                ? `<a href="${escapeHtml(cert.pdfUrl)}" target="_blank" download class="btn btn-outline-dark btn-sm py-0 px-2 recruiter-only-download" style="font-size: 0.72rem;"><i class="ti-download mr-1"></i>Descargar PDF</a>` 
                                                : `<span class="badge badge-light border text-muted py-1 px-2 recruiter-lock-notice" style="font-size: 0.72rem;"><i class="ti-lock text-warning mr-1"></i>PDF (Modo Empresa)</span>`
                                            ) : ''}
                                            ${cert.imageUrl ? `<a href="${escapeHtml(cert.imageUrl)}" target="_blank" class="btn btn-outline-secondary btn-sm py-0 px-2" style="font-size: 0.72rem;"><i class="ti-image mr-1"></i>Ver Diploma</a>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                displayCertsContainer.innerHTML = certHtml;
            }
        }

        // 3. En resumen.html (#resume-certifications-container)
        const resumeCertsContainer = document.getElementById('resume-certifications-container');
        if (resumeCertsContainer) {
            const resumeCerts = certs.filter(c => c.showInResume !== false);
            if (resumeCerts.length === 0) {
                resumeCertsContainer.innerHTML = '<p class="text-muted small">No hay certificaciones publicadas en el CV.</p>';
            } else {
                let resumeCertHtml = '';
                resumeCerts.forEach(cert => {
                    resumeCertHtml += `
                        <div class="cv-card-box mb-2" style="border-left-color: #10b981; background: #ffffff;">
                            <div style="display: flex; gap: 10px; align-items: flex-start;">
                                <img src="${escapeHtml(cert.imageUrl || 'certificado.jpeg')}" alt="${escapeHtml(cert.title)}" class="cv-cert-badge-img">
                                <div style="flex: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px;">
                                        <strong style="color: var(--dark); font-size: 12px;">${escapeHtml(cert.title)}</strong>
                                        <span class="item-period" style="background: rgba(16, 185, 129, 0.12); color: #047857; font-weight: 700;">${escapeHtml(cert.date)}</span>
                                    </div>
                                    <div style="font-size: 11px; color: #F85C70; font-weight: 700; margin: 2px 0;">${escapeHtml(cert.issuer)}</div>
                                    <p style="margin: 0 0 5px; font-size: 11px; color: var(--text-muted); line-height: 1.35;">${escapeHtml(cert.desc)}</p>
                                    <div class="cert-card-actions no-print" style="display: flex; gap: 6px; flex-wrap: wrap;">
                                        ${cert.pdfUrl ? (isRecruiterMode
                                            ? `<a href="${escapeHtml(cert.pdfUrl)}" target="_blank" download class="recruiter-only-download" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; color: #0f172a; text-decoration: none; background: #e2e8f0; padding: 2px 7px; border-radius: 4px;"><i class="ti-download text-danger"></i> Descargar PDF</a>`
                                            : `<span class="recruiter-lock-notice" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 7px; border-radius: 4px; border: 1px solid #cbd5e1;"><i class="ti-lock text-warning"></i> PDF en Modo Empresa</span>`
                                        ) : ''}
                                        ${cert.credlyUrl ? `<a href="${escapeHtml(cert.credlyUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; color: #F85C70; text-decoration: none; background: rgba(248, 92, 112, 0.08); padding: 2px 7px; border-radius: 4px;"><i class="ti-check-box"></i> Verificar Credly</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                resumeCertsContainer.innerHTML = resumeCertHtml;
            }
        }

        // ---------------------------------------------------------------------
        // G. DISPOSICIÓN & REORDENAMIENTO DE SECCIONES (LAYOUT MANAGER)
        // ---------------------------------------------------------------------
        if (data && data.layout) {
            applyLayoutToDOM(data.layout);
        }
    }

    // -------------------------------------------------------------------------
    // 5. Notificaciones Flotantes (Toasts)
    // -------------------------------------------------------------------------
    function showToast(message, type = 'info', duration = 3500) {
        let toastContainer = document.getElementById('view-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'view-toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `view-toast ${type === 'success' ? 'toast-success' : type === 'danger' ? 'toast-danger' : ''}`;
        
        let iconHtml = '<i class="ti-info-alt"></i>';
        if (type === 'success') iconHtml = '<i class="ti-check"></i>';
        if (type === 'danger') iconHtml = '<i class="ti-alert"></i>';

        toast.innerHTML = `${iconHtml} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-15px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    }

    // -------------------------------------------------------------------------
    // 6. Aplicación de Modo de Vista (Pública vs Reclutador)
    // -------------------------------------------------------------------------
    function applyViewMode(mode) {
        document.body.classList.remove('mode-public', 'mode-recruiter');
        document.body.classList.add(`mode-${mode}`);

        const banner = document.getElementById('recruiter-mode-banner');
        if (banner) {
            banner.style.display = (mode === 'recruiter') ? 'block' : 'none';
        }

        const resumeLinks = document.querySelectorAll('a[href*="resumen.html"]');
        resumeLinks.forEach(link => {
            const currentToken = getRecruiterToken();
            link.href = `resumen.html?mode=empresa&token=${encodeURIComponent(currentToken)}`;
        });

        const btnPublic = document.getElementById('admin-btn-view-public');
        const btnRecruiter = document.getElementById('admin-btn-view-recruiter');
        if (btnPublic && btnRecruiter) {
            if (mode === 'public') {
                btnPublic.classList.add('active');
                btnRecruiter.classList.remove('active');
            } else {
                btnRecruiter.classList.add('active');
                btnPublic.classList.remove('active');
            }
        }

        if (isAdminLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_PREVIEW, mode);
        }

        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => { ScrollTrigger.refresh(); }, 100);
        }
    }

    // -------------------------------------------------------------------------
    // 7. Modal Completo de Gestión del CV (#admin-cv-manager-modal)
    // -------------------------------------------------------------------------
    function openCvManagerModal() {
        if (!isAdminLoggedIn()) {
            openAdminModal();
            return;
        }

        activeCvData = getCvData();
        populateModalInputs(activeCvData);

        if (typeof $ !== 'undefined') {
            $('#admin-cv-manager-modal').modal('show');
        }
    }

    function populateModalInputs(data) {
        const p = data.personal || {};
        const avail = data.availability || DEFAULT_CV_DATA.availability;
        const edu = data.education || {};

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        // 1. Imágenes Desacopladas y Posición/Enfoque
        setVal('admin-input-banner-url', p.bannerUrl);
        setVal('admin-input-avatar-web-url', p.avatarWebUrl);
        setVal('admin-input-avatar-resume-url', p.avatarResumeUrl);

        const bannerPosNum = parseInt(p.bannerPos || '50', 10);
        const webPosNum = parseInt(p.avatarWebPos || '20', 10);
        const resumePosNum = parseInt(p.avatarResumePos || '15', 10);

        setVal('admin-input-banner-pos', bannerPosNum);
        const lblBannerPos = document.getElementById('admin-val-banner-pos');
        if (lblBannerPos) lblBannerPos.textContent = bannerPosNum + '%';

        setVal('admin-input-avatar-web-pos', webPosNum);
        const lblWebPos = document.getElementById('admin-val-avatar-web-pos');
        if (lblWebPos) lblWebPos.textContent = webPosNum + '%';

        setVal('admin-input-avatar-resume-pos', resumePosNum);
        const lblResumePos = document.getElementById('admin-val-avatar-resume-pos');
        if (lblResumePos) lblResumePos.textContent = resumePosNum + '%';

        const bannerPrev = document.getElementById('admin-banner-preview');
        if (bannerPrev) {
            bannerPrev.src = p.bannerUrl || DEFAULT_CV_DATA.personal.bannerUrl;
            bannerPrev.style.objectPosition = `center ${bannerPosNum}%`;
        }

        const avatarWebPrev = document.getElementById('admin-avatar-web-preview');
        if (avatarWebPrev) {
            avatarWebPrev.src = p.avatarWebUrl || DEFAULT_CV_DATA.personal.avatarWebUrl;
            avatarWebPrev.style.objectPosition = `center ${webPosNum}%`;
        }

        const avatarResumePrev = document.getElementById('admin-avatar-resume-preview');
        if (avatarResumePrev) {
            avatarResumePrev.src = p.avatarResumeUrl || DEFAULT_CV_DATA.personal.avatarResumeUrl;
            avatarResumePrev.style.objectPosition = `center ${resumePosNum}%`;
        }

        // 2. Switch de Disponibilidad
        const switchWork = document.getElementById('admin-switch-working-status');
        const labelWork = document.getElementById('admin-label-working-status');
        const hintWork = document.getElementById('admin-availability-hint-text');

        if (switchWork) {
            switchWork.checked = (avail.isCurrentlyWorking === true);
            updateAvailabilityUI(switchWork.checked);
        }

        // 3. Datos Personales (Bilingües)
        setVal('admin-input-fullname', p.fullname);
        setVal('admin-input-displayname', p.displayName);

        setVal('admin-input-jobtitle-es', p.jobTitle_es || p.jobTitle);
        setVal('admin-input-jobtitle-en', p.jobTitle_en || DEFAULT_CV_DATA.personal.jobTitle_en);
        setVal('admin-input-jobtitle', p.jobTitle_es || p.jobTitle);

        setVal('admin-input-brandtitle-es', p.brandSubtitle_es || p.brandSubtitle);
        setVal('admin-input-brandtitle-en', p.brandSubtitle_en || DEFAULT_CV_DATA.personal.brandSubtitle_en);
        setVal('admin-input-brandtitle', p.brandSubtitle_es || p.brandSubtitle);

        setVal('admin-input-bio-es', p.bio_es || p.bio);
        setVal('admin-input-bio-en', p.bio_en || DEFAULT_CV_DATA.personal.bio_en);
        setVal('admin-input-bio', p.bio_es || p.bio);

        setVal('admin-input-location-es', p.location_es || p.location);
        setVal('admin-input-location-en', p.location_en || DEFAULT_CV_DATA.personal.location_en);
        setVal('admin-input-location', p.location_es || p.location);

        setVal('admin-input-email', p.email);
        setVal('admin-input-phone', p.phone);
        setVal('admin-input-portfolio', p.portfolioUrl);
        setVal('admin-input-linkedin', p.linkedinUrl);
        setVal('admin-input-github', p.githubUrl);
        setVal('admin-input-whatsapp', p.whatsappUrl);

        // 4. Educación
        setVal('admin-input-edutitle', edu.title);
        setVal('admin-input-eduinst', edu.institution);
        setVal('admin-input-edudate', edu.date);
        const selEduStatus = document.getElementById('admin-select-edustatus');
        if (selEduStatus) selEduStatus.value = edu.status || 'studying';

        // 5. Renderizar listado de experiencias CRUD
        renderAdminExpList();

        // 6. Renderizar listado de certificaciones e insignias CRUD
        renderAdminCertList();

        // 7. Renderizar administrador de disposición y orden de secciones
        renderAdminLayoutManager();
    }

    function updateAvailabilityUI(isWorking) {
        const labelWork = document.getElementById('admin-label-working-status');
        const hintWork = document.getElementById('admin-availability-hint-text');
        const statusDesc = document.getElementById('admin-availability-status-desc');
        if (labelWork) {
            labelWork.textContent = isWorking 
                ? 'Trabajando Actualmente (Soluciones de Negocio)' 
                : 'Búsqueda Activa (Freelance o Laboral)';
        }
        if (statusDesc) {
            statusDesc.textContent = isWorking
                ? 'Modo corporativo: Enfocado en desarrollo de soluciones a medida para empresas y negocios.'
                : 'Modo abierto: Abierto a proyectos freelance y ofertas de contratación laboral directa.';
        }
        if (hintWork) {
            hintWork.textContent = isWorking
                ? 'Modo corporativo activo: El banner ofrecerá "¿Buscas digitalizar tu negocio o necesitas una solución a medida? Desarrollo aplicaciones web, plataformas móviles y herramientas de gestión empresarial..." con botón "Iniciar Proyecto" (oculta contrato laboral).'
                : 'Modo búsqueda activa: El banner ofrecerá "Disponible para proyectos freelance o contrato laboral" con botón "Contrátame".';
        }
    }

    function renderAdminExpList() {
        const container = document.getElementById('admin-exp-crud-list');
        if (!container) return;

        const exps = (activeCvData && Array.isArray(activeCvData.experiences)) ? activeCvData.experiences : [];

        if (exps.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-muted rounded" style="background: rgba(255,255,255,0.02); border: 1px dashed #334155;">
                    <i class="ti-briefcase mb-2" style="font-size: 1.8rem;"></i>
                    <p class="mb-0">No hay experiencias configuradas. Pulsa en "Nueva Experiencia" para agregar la primera.</p>
                </div>
            `;
            return;
        }

        let html = '';
        exps.forEach((exp, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === exps.length - 1;

            html += `
                <div class="admin-crud-item" data-id="${escapeHtml(exp.id)}">
                    <div class="d-flex justify-content-between align-items-start flex-wrap" style="gap: 10px;">
                        <div class="flex-fill" style="min-width: 220px;">
                            <div class="d-flex align-items-center flex-wrap" style="gap: 8px;">
                                <span class="exp-company">${escapeHtml(exp.company)}</span>
                                ${exp.contract ? `<span class="badge badge-secondary px-2 py-0" style="font-size: 0.7rem; background: #334155;">${escapeHtml(exp.contract)}</span>` : ''}
                            </div>
                            <div class="exp-role mt-1">${escapeHtml(exp.role)}</div>
                            <div class="exp-period"><i class="ti-calendar mr-1"></i>${escapeHtml(exp.period)}</div>
                            <div class="exp-desc">${escapeHtml(exp.desc)}</div>
                        </div>
                        <div class="admin-crud-actions d-flex align-items-center" style="gap: 5px;">
                            <button type="button" class="btn btn-dark btn-sm admin-btn-move-exp" data-id="${escapeHtml(exp.id)}" data-dir="up" title="Mover Arriba" ${isFirst ? 'disabled' : ''} style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-arrow-up"></i>
                            </button>
                            <button type="button" class="btn btn-dark btn-sm admin-btn-move-exp" data-id="${escapeHtml(exp.id)}" data-dir="down" title="Mover Abajo" ${isLast ? 'disabled' : ''} style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-arrow-down"></i>
                            </button>
                            <button type="button" class="btn btn-outline-info btn-sm admin-btn-edit-exp" data-id="${escapeHtml(exp.id)}" title="Editar" style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm admin-btn-delete-exp" data-id="${escapeHtml(exp.id)}" title="Eliminar" style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        attachExpListEvents();
    }

    function attachExpListEvents() {
        document.querySelectorAll('.admin-btn-edit-exp').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const exp = activeCvData.experiences.find(e => e.id === id);
                if (exp) showExpForm(exp);
            });
        });

        document.querySelectorAll('.admin-btn-delete-exp').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const exp = activeCvData.experiences.find(e => e.id === id);
                const roleName = exp ? exp.role : 'este registro';

                if (confirm(`¿Estás seguro de que deseas eliminar la experiencia "${roleName}"?`)) {
                    activeCvData.experiences = activeCvData.experiences.filter(e => e.id !== id);
                    saveCvData(activeCvData);
                    renderAdminExpList();
                    showToast('Experiencia laboral eliminada correctamente.', 'info');
                }
            });
        });

        document.querySelectorAll('.admin-btn-move-exp').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const dir = this.getAttribute('data-dir');
                const idx = activeCvData.experiences.findIndex(e => e.id === id);
                if (idx < 0) return;

                if (dir === 'up' && idx > 0) {
                    const temp = activeCvData.experiences[idx];
                    activeCvData.experiences[idx] = activeCvData.experiences[idx - 1];
                    activeCvData.experiences[idx - 1] = temp;
                } else if (dir === 'down' && idx < activeCvData.experiences.length - 1) {
                    const temp = activeCvData.experiences[idx];
                    activeCvData.experiences[idx] = activeCvData.experiences[idx + 1];
                    activeCvData.experiences[idx + 1] = temp;
                }

                saveCvData(activeCvData);
                renderAdminExpList();
            });
        });
    }

    function showExpForm(exp = null) {
        const formCard = document.getElementById('admin-exp-form-card');
        const formTitle = document.getElementById('admin-exp-form-title');
        if (!formCard) return;

        formCard.style.display = 'block';

        if (exp) {
            formTitle.innerHTML = '<i class="ti-pencil-alt mr-1"></i> Editar Experiencia Laboral';
            document.getElementById('admin-exp-id').value = exp.id;
            document.getElementById('admin-exp-company').value = exp.company || '';
            document.getElementById('admin-exp-role').value = exp.role || '';
            document.getElementById('admin-exp-period').value = exp.period || '';
            document.getElementById('admin-exp-contract').value = exp.contract || '';
            document.getElementById('admin-exp-desc').value = exp.desc || '';
        } else {
            formTitle.innerHTML = '<i class="ti-plus mr-1"></i> Añadir Nueva Experiencia Laboral';
            document.getElementById('admin-exp-id').value = '';
            document.getElementById('admin-exp-company').value = '';
            document.getElementById('admin-exp-role').value = '';
            document.getElementById('admin-exp-period').value = '';
            document.getElementById('admin-exp-contract').value = '';
            document.getElementById('admin-exp-desc').value = '';
        }

        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideExpForm() {
        const formCard = document.getElementById('admin-exp-form-card');
        if (formCard) formCard.style.display = 'none';
        const form = document.getElementById('form-admin-exp');
        if (form) form.reset();
        const idInput = document.getElementById('admin-exp-id');
        if (idInput) idInput.value = '';
    }

    // -------------------------------------------------------------------------
    // G. GESTOR CRUD DE CERTIFICACIONES & INSIGNIAS OFICIALES (ChrizDev)
    // -------------------------------------------------------------------------
    function renderAdminCertList() {
        const container = document.getElementById('admin-cert-crud-list');
        if (!container) return;

        const certs = (activeCvData && Array.isArray(activeCvData.certifications)) ? activeCvData.certifications : [];

        if (certs.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-muted rounded" style="background: rgba(255,255,255,0.02); border: 1px dashed #334155;">
                    <i class="ti-medall mb-2" style="font-size: 1.8rem; color: #F85C70;"></i>
                    <p class="mb-0">No hay certificaciones o insignias registradas. Pulsa en "Nueva Insignia / Certificación" para registrar la primera.</p>
                </div>
            `;
            return;
        }

        let html = '';
        certs.forEach((cert, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === certs.length - 1;

            html += `
                <div class="admin-cert-item" data-id="${escapeHtml(cert.id)}">
                    <div class="d-flex justify-content-between align-items-start flex-wrap" style="gap: 12px;">
                        <div class="d-flex align-items-start flex-fill" style="gap: 12px; min-width: 240px;">
                            <img src="${escapeHtml(cert.imageUrl || 'certificado.jpeg')}" alt="Badge" class="admin-cert-thumb">
                            <div class="flex-fill">
                                <div class="admin-cert-title">${escapeHtml(cert.title)}</div>
                                <div class="admin-cert-issuer">${escapeHtml(cert.issuer)} <span class="admin-cert-meta ml-2"><i class="ti-calendar mr-1"></i>${escapeHtml(cert.date)}</span></div>
                                <div class="mt-1 d-flex flex-wrap" style="gap: 4px;">
                                    ${cert.badgeId ? `<span class="badge badge-info px-2 py-0" style="font-size: 0.68rem; background: #0284c7;">Credly ID: ${escapeHtml(cert.badgeId)}</span>` : ''}
                                    <span class="badge ${cert.showInWeb !== false ? 'badge-success' : 'badge-secondary'} px-2 py-0" style="font-size: 0.68rem;">${cert.showInWeb !== false ? '<i class="ti-world mr-1"></i>Web' : 'Oculto Web'}</span>
                                    <span class="badge ${cert.showInResume !== false ? 'badge-primary' : 'badge-secondary'} px-2 py-0" style="font-size: 0.68rem;">${cert.showInResume !== false ? '<i class="ti-file mr-1"></i>CV' : 'Oculto CV'}</span>
                                </div>
                                <div class="admin-cert-desc">${escapeHtml(cert.desc)}</div>
                            </div>
                        </div>
                        <div class="admin-crud-actions d-flex align-items-center" style="gap: 5px;">
                            <button type="button" class="btn btn-dark btn-sm admin-btn-move-cert" data-id="${escapeHtml(cert.id)}" data-dir="up" title="Mover Arriba" ${isFirst ? 'disabled' : ''} style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-arrow-up"></i>
                            </button>
                            <button type="button" class="btn btn-dark btn-sm admin-btn-move-cert" data-id="${escapeHtml(cert.id)}" data-dir="down" title="Mover Abajo" ${isLast ? 'disabled' : ''} style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-arrow-down"></i>
                            </button>
                            <button type="button" class="btn btn-outline-info btn-sm admin-btn-edit-cert" data-id="${escapeHtml(cert.id)}" title="Editar" style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm admin-btn-delete-cert" data-id="${escapeHtml(cert.id)}" title="Eliminar" style="padding: 3px 8px; font-size: 0.72rem;">
                                <i class="ti-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        attachCertListEvents();
    }

    function attachCertListEvents() {
        document.querySelectorAll('.admin-btn-edit-cert').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const cert = activeCvData.certifications.find(c => c.id === id);
                if (cert) showCertForm(cert);
            });
        });

        document.querySelectorAll('.admin-btn-delete-cert').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const cert = activeCvData.certifications.find(c => c.id === id);
                const title = cert ? cert.title : 'este certificado';

                if (confirm(`¿Estás seguro de que deseas eliminar la certificación "${title}"?`)) {
                    activeCvData.certifications = activeCvData.certifications.filter(c => c.id !== id);
                    saveCvData(activeCvData);
                    renderAdminCertList();
                    applyCvDataToDOM(activeCvData);
                    showToast('Certificación eliminada correctamente.', 'info');
                }
            });
        });

        document.querySelectorAll('.admin-btn-move-cert').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const dir = this.getAttribute('data-dir');
                const idx = activeCvData.certifications.findIndex(c => c.id === id);
                if (idx < 0) return;

                if (dir === 'up' && idx > 0) {
                    const temp = activeCvData.certifications[idx];
                    activeCvData.certifications[idx] = activeCvData.certifications[idx - 1];
                    activeCvData.certifications[idx - 1] = temp;
                } else if (dir === 'down' && idx < activeCvData.certifications.length - 1) {
                    const temp = activeCvData.certifications[idx];
                    activeCvData.certifications[idx] = activeCvData.certifications[idx + 1];
                    activeCvData.certifications[idx + 1] = temp;
                }

                saveCvData(activeCvData);
                renderAdminCertList();
                applyCvDataToDOM(activeCvData);
            });
        });
    }

    function showCertForm(cert = null) {
        const formCard = document.getElementById('admin-cert-form-card');
        const formTitle = document.getElementById('admin-cert-form-title');
        if (!formCard) return;

        formCard.style.display = 'block';

        if (cert) {
            formTitle.innerHTML = '<i class="ti-pencil-alt mr-1"></i> Editar Certificación o Insignia';
            document.getElementById('admin-cert-id').value = cert.id;
            document.getElementById('admin-cert-title').value = cert.title || '';
            document.getElementById('admin-cert-issuer').value = cert.issuer || '';
            document.getElementById('admin-cert-date').value = cert.date || '';
            document.getElementById('admin-cert-credly-url').value = cert.credlyUrl || '';
            document.getElementById('admin-cert-badge-id').value = cert.badgeId || '';
            document.getElementById('admin-cert-pdf-url').value = cert.pdfUrl || '';
            document.getElementById('admin-cert-image-url').value = cert.imageUrl || '';
            document.getElementById('admin-cert-desc').value = cert.desc || '';
            document.getElementById('admin-cert-skills').value = cert.skills || '';
            document.getElementById('admin-cert-show-web').checked = cert.showInWeb !== false;
            document.getElementById('admin-cert-show-resume').checked = cert.showInResume !== false;
        } else {
            formTitle.innerHTML = '<i class="ti-plus mr-1"></i> Añadir Nueva Certificación o Insignia';
            document.getElementById('admin-cert-id').value = '';
            document.getElementById('admin-cert-title').value = '';
            document.getElementById('admin-cert-issuer').value = '';
            document.getElementById('admin-cert-date').value = '';
            document.getElementById('admin-cert-credly-url').value = '';
            document.getElementById('admin-cert-badge-id').value = '';
            document.getElementById('admin-cert-pdf-url').value = 'ClarisCertificate-Main20261013-21-sbjpms.pdf';
            document.getElementById('admin-cert-image-url').value = 'certificado.jpeg';
            document.getElementById('admin-cert-desc').value = '';
            document.getElementById('admin-cert-skills').value = '';
            document.getElementById('admin-cert-show-web').checked = true;
            document.getElementById('admin-cert-show-resume').checked = true;
        }

        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideCertForm() {
        const formCard = document.getElementById('admin-cert-form-card');
        if (formCard) formCard.style.display = 'none';
        const form = document.getElementById('form-admin-cert');
        if (form) form.reset();
        const idInput = document.getElementById('admin-cert-id');
        if (idInput) idInput.value = '';
    }

    // -------------------------------------------------------------------------
    // H. GESTIÓN DE DISPOSICIÓN & SECCIONES (TAB 6 LAYOUT MANAGER)
    // -------------------------------------------------------------------------
    const WEB_SECTION_LABELS = {
        'about': { label: 'Perfil / Sobre Mí', icon: 'ti-user' },
        'section-claris-specialization': { label: 'Especialización Claris FileMaker (Doble Certificación)', icon: 'ti-layers' },
        'resume': { label: 'Currículum & Trayectoria Laboral', icon: 'ti-briefcase' },
        'portfolio': { label: 'Portafolio de Proyectos Web & Móvil', icon: 'ti-layout-grid2' },
        'service': { label: 'Servicios Empresariales & Soluciones', icon: 'ti-settings' },
        'price': { label: 'Tarifas / Precios de Servicios', icon: 'ti-receipt' },
        'blog': { label: 'Blog / Artículos Técnicos', icon: 'ti-notepad' },
        'contact': { label: 'Contacto & Formulario Directo', icon: 'ti-email' }
    };

    const RESUME_SECTION_LABELS = {
        'resume-section-profile': { label: 'Perfil Profesional (Bio Ejecutiva)', icon: 'ti-user' },
        'resume-section-experience': { label: 'Experiencia Laboral (Celerix SAS / Freelance)', icon: 'ti-briefcase' },
        'resume-section-projects': { label: 'Proyectos de Ingeniería Destacados', icon: 'ti-folder' },
        'resume-section-hardware': { label: 'Arquitectura de Hardware & Ensambles', icon: 'ti-harddrives' },
        'resume-section-education': { label: 'Educación Académica (SENA ADSO)', icon: 'ti-book' },
        'resume-section-filemaker': { label: 'Claris FileMaker Pro & Server Enterprise', icon: 'ti-layers' },
        'resume-section-certifications': { label: 'Certificaciones Oficiales Claris (Credly)', icon: 'ti-medall' },
        'resume-section-skills': { label: 'Stack Tecnológico (Habilidades Técnicas)', icon: 'ti-widget' },
        'resume-section-languages': { label: 'Idiomas (Español / Inglés)', icon: 'ti-world' }
    };

    function renderAdminLayoutManager() {
        if (!activeCvData) activeCvData = getCvData();
        if (!activeCvData.layout) activeCvData.layout = JSON.parse(JSON.stringify(DEFAULT_CV_DATA.layout));
        const layout = activeCvData.layout;

        const webContainer = document.getElementById('admin-layout-web-list');
        const resumeContainer = document.getElementById('admin-layout-resume-list');

        // 1. Renderizar Secciones Web
        if (webContainer && Array.isArray(layout.sectionsOrderWeb)) {
            let webHtml = '';
            layout.sectionsOrderWeb.forEach((secId, idx) => {
                const info = WEB_SECTION_LABELS[secId] || { label: secId, icon: 'ti-layout-width-default' };
                const isVisible = layout.sectionsVisibilityWeb ? layout.sectionsVisibilityWeb[secId] !== false : true;
                const isFirst = idx === 0;
                const isLast = idx === layout.sectionsOrderWeb.length - 1;

                webHtml += `
                    <div class="admin-layout-item ${isVisible ? '' : 'is-hidden'}" data-id="${escapeHtml(secId)}">
                        <div class="admin-layout-info">
                            <span class="admin-layout-handle"><i class="${info.icon}"></i></span>
                            <span class="admin-layout-title" title="${escapeHtml(info.label)}">${escapeHtml(info.label)}</span>
                        </div>
                        <div class="admin-layout-actions">
                            <div class="custom-control custom-switch mr-1">
                                <input type="checkbox" class="custom-control-input admin-toggle-web-sec" id="toggle-web-${escapeHtml(secId)}" data-id="${escapeHtml(secId)}" ${isVisible ? 'checked' : ''}>
                                <label class="custom-control-label" for="toggle-web-${escapeHtml(secId)}" title="${isVisible ? 'Ocultar sección' : 'Mostrar sección'}"></label>
                            </div>
                            <button type="button" class="admin-layout-btn admin-btn-move-web" data-id="${escapeHtml(secId)}" data-dir="up" title="Mover Arriba" ${isFirst ? 'disabled' : ''}>
                                <i class="ti-arrow-up"></i>
                            </button>
                            <button type="button" class="admin-layout-btn admin-btn-move-web" data-id="${escapeHtml(secId)}" data-dir="down" title="Mover Abajo" ${isLast ? 'disabled' : ''}>
                                <i class="ti-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            webContainer.innerHTML = webHtml;

            // Listeners Web
            webContainer.querySelectorAll('.admin-btn-move-web').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    const dir = this.getAttribute('data-dir');
                    const arr = activeCvData.layout.sectionsOrderWeb;
                    const idx = arr.indexOf(id);
                    if (idx < 0) return;
                    if (dir === 'up' && idx > 0) {
                        const temp = arr[idx];
                        arr[idx] = arr[idx - 1];
                        arr[idx - 1] = temp;
                    } else if (dir === 'down' && idx < arr.length - 1) {
                        const temp = arr[idx];
                        arr[idx] = arr[idx + 1];
                        arr[idx + 1] = temp;
                    }
                    saveCvData(activeCvData);
                    applyLayoutToDOM(activeCvData.layout);
                    renderAdminLayoutManager();
                });
            });

            webContainer.querySelectorAll('.admin-toggle-web-sec').forEach(chk => {
                chk.addEventListener('change', function () {
                    const id = this.getAttribute('data-id');
                    if (!activeCvData.layout.sectionsVisibilityWeb) activeCvData.layout.sectionsVisibilityWeb = {};
                    activeCvData.layout.sectionsVisibilityWeb[id] = this.checked;
                    saveCvData(activeCvData);
                    applyLayoutToDOM(activeCvData.layout);
                    renderAdminLayoutManager();
                });
            });
        }

        // 2. Renderizar Secciones CV Imprimible
        if (resumeContainer && Array.isArray(layout.sectionsOrderResume)) {
            let resHtml = '';
            layout.sectionsOrderResume.forEach((secId, idx) => {
                const info = RESUME_SECTION_LABELS[secId] || { label: secId, icon: 'ti-layout-width-default' };
                const isVisible = layout.sectionsVisibilityResume ? layout.sectionsVisibilityResume[secId] !== false : true;
                const isFirst = idx === 0;
                const isLast = idx === layout.sectionsOrderResume.length - 1;

                resHtml += `
                    <div class="admin-layout-item ${isVisible ? '' : 'is-hidden'}" data-id="${escapeHtml(secId)}">
                        <div class="admin-layout-info">
                            <span class="admin-layout-handle"><i class="${info.icon}"></i></span>
                            <span class="admin-layout-title" title="${escapeHtml(info.label)}">${escapeHtml(info.label)}</span>
                        </div>
                        <div class="admin-layout-actions">
                            <div class="custom-control custom-switch mr-1">
                                <input type="checkbox" class="custom-control-input admin-toggle-resume-sec" id="toggle-res-${escapeHtml(secId)}" data-id="${escapeHtml(secId)}" ${isVisible ? 'checked' : ''}>
                                <label class="custom-control-label" for="toggle-res-${escapeHtml(secId)}" title="${isVisible ? 'Ocultar sección' : 'Mostrar sección'}"></label>
                            </div>
                            <button type="button" class="admin-layout-btn admin-btn-move-resume" data-id="${escapeHtml(secId)}" data-dir="up" title="Mover Arriba" ${isFirst ? 'disabled' : ''}>
                                <i class="ti-arrow-up"></i>
                            </button>
                            <button type="button" class="admin-layout-btn admin-btn-move-resume" data-id="${escapeHtml(secId)}" data-dir="down" title="Mover Abajo" ${isLast ? 'disabled' : ''}>
                                <i class="ti-arrow-down"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            resumeContainer.innerHTML = resHtml;

            // Listeners Resume
            resumeContainer.querySelectorAll('.admin-btn-move-resume').forEach(btn => {
                btn.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    const dir = this.getAttribute('data-dir');
                    const arr = activeCvData.layout.sectionsOrderResume;
                    const idx = arr.indexOf(id);
                    if (idx < 0) return;
                    if (dir === 'up' && idx > 0) {
                        const temp = arr[idx];
                        arr[idx] = arr[idx - 1];
                        arr[idx - 1] = temp;
                    } else if (dir === 'down' && idx < arr.length - 1) {
                        const temp = arr[idx];
                        arr[idx] = arr[idx + 1];
                        arr[idx + 1] = temp;
                    }
                    saveCvData(activeCvData);
                    applyLayoutToDOM(activeCvData.layout);
                    renderAdminLayoutManager();
                });
            });

            resumeContainer.querySelectorAll('.admin-toggle-resume-sec').forEach(chk => {
                chk.addEventListener('change', function () {
                    const id = this.getAttribute('data-id');
                    if (!activeCvData.layout.sectionsVisibilityResume) activeCvData.layout.sectionsVisibilityResume = {};
                    activeCvData.layout.sectionsVisibilityResume[id] = this.checked;
                    saveCvData(activeCvData);
                    applyLayoutToDOM(activeCvData.layout);
                    renderAdminLayoutManager();
                });
            });
        }

        // Listener Reset Layout
        const btnResetLayout = document.getElementById('admin-btn-reset-layout');
        if (btnResetLayout && !btnResetLayout.dataset.bound) {
            btnResetLayout.dataset.bound = 'true';
            btnResetLayout.addEventListener('click', function () {
                activeCvData.layout = JSON.parse(JSON.stringify(DEFAULT_CV_DATA.layout));
                saveCvData(activeCvData);
                applyLayoutToDOM(activeCvData.layout);
                renderAdminLayoutManager();
                showToast('Estructura de secciones restablecida al orden inicial.', 'info');
            });
        }
    }

    function initCvManagerModal() {
        const btnNewExp = document.getElementById('admin-btn-new-exp');
        if (btnNewExp) btnNewExp.addEventListener('click', () => showExpForm(null));

        const btnCancelExp = document.getElementById('admin-btn-cancel-exp');
        if (btnCancelExp) btnCancelExp.addEventListener('click', hideExpForm);

        // Submit Formulario Experiencia
        const formExp = document.getElementById('form-admin-exp');
        if (formExp) {
            formExp.addEventListener('submit', function (e) {
                e.preventDefault();
                const expId = document.getElementById('admin-exp-id').value.trim();
                const company = document.getElementById('admin-exp-company').value.trim();
                const role = document.getElementById('admin-exp-role').value.trim();
                const period = document.getElementById('admin-exp-period').value.trim();
                const contract = document.getElementById('admin-exp-contract').value.trim();
                const desc = document.getElementById('admin-exp-desc').value.trim();

                if (!company || !role || !period || !desc) {
                    showToast('Por favor completa todos los campos requeridos (*)', 'danger');
                    return;
                }

                if (!activeCvData) activeCvData = getCvData();
                if (!Array.isArray(activeCvData.experiences)) activeCvData.experiences = [];

                if (expId) {
                    const idx = activeCvData.experiences.findIndex(item => item.id === expId);
                    if (idx >= 0) {
                        activeCvData.experiences[idx] = { id: expId, company, role, period, contract, desc };
                    }
                } else {
                    const newId = generateId();
                    activeCvData.experiences.unshift({ id: newId, company, role, period, contract, desc });
                }

                saveCvData(activeCvData);
                hideExpForm();
                renderAdminExpList();
                showToast('Experiencia laboral guardada y reflejada en el CV.', 'success');
            });
        }

        // Setup Formulario de Certificaciones / Insignias (CRUD)
        const btnNewCert = document.getElementById('admin-btn-new-cert');
        if (btnNewCert) btnNewCert.addEventListener('click', () => showCertForm(null));

        const btnCancelCert = document.getElementById('admin-btn-cancel-cert');
        if (btnCancelCert) btnCancelCert.addEventListener('click', hideCertForm);

        const formCert = document.getElementById('form-admin-cert');
        if (formCert) {
            formCert.addEventListener('submit', function (e) {
                e.preventDefault();
                const certId = document.getElementById('admin-cert-id').value.trim();
                const title = document.getElementById('admin-cert-title').value.trim();
                const issuer = document.getElementById('admin-cert-issuer').value.trim();
                const date = document.getElementById('admin-cert-date').value.trim();
                const credlyUrl = document.getElementById('admin-cert-credly-url').value.trim();
                const badgeId = document.getElementById('admin-cert-badge-id').value.trim();
                const pdfUrl = document.getElementById('admin-cert-pdf-url').value.trim();
                const imageUrl = document.getElementById('admin-cert-image-url').value.trim();
                const desc = document.getElementById('admin-cert-desc').value.trim();
                const skills = document.getElementById('admin-cert-skills').value.trim();
                const showWebEl = document.getElementById('admin-cert-show-web');
                const showResumeEl = document.getElementById('admin-cert-show-resume');
                const showInWeb = showWebEl ? showWebEl.checked : true;
                const showInResume = showResumeEl ? showResumeEl.checked : true;

                if (!title || !issuer || !date) {
                    showToast('Por favor completa los campos requeridos del certificado (*)', 'danger');
                    return;
                }

                if (!activeCvData) activeCvData = getCvData();
                if (!Array.isArray(activeCvData.certifications)) activeCvData.certifications = [];

                const certItem = {
                    id: certId || generateId('cert_'),
                    title,
                    issuer,
                    date,
                    credlyUrl,
                    badgeId,
                    pdfUrl: pdfUrl || 'ClarisCertificate-Main20261013-21-sbjpms.pdf',
                    imageUrl: imageUrl || 'certificado.jpeg',
                    desc,
                    skills,
                    showInWeb,
                    showInResume
                };

                if (certId) {
                    const idx = activeCvData.certifications.findIndex(c => c.id === certId);
                    if (idx >= 0) {
                        activeCvData.certifications[idx] = certItem;
                    } else {
                        activeCvData.certifications.push(certItem);
                    }
                } else {
                    activeCvData.certifications.unshift(certItem);
                }

                saveCvData(activeCvData);
                hideCertForm();
                renderAdminCertList();
                applyCvDataToDOM(activeCvData);
                showToast('Insignia / Certificación guardada y sincronizada.', 'success');
            });
        }



        // ---------------------------------------------------------------------
        // GESTIÓN DE IMÁGENES: PREVIEWS EN VIVO, LOCAL FILE PICKERS & PRESETS
        // ---------------------------------------------------------------------
        const setupImagePreview = (inputId, previewId, btnPreviewId, btnResetId, defaultUrl, liveUpdateFn) => {
            const inputEl = document.getElementById(inputId);
            const previewEl = document.getElementById(previewId);
            const btnPrev = document.getElementById(btnPreviewId);
            const btnReset = document.getElementById(btnResetId);

            if (!inputEl || !previewEl) return;

            const update = () => {
                const url = inputEl.value.trim();
                const targetUrl = url || defaultUrl;
                previewEl.src = targetUrl;
                if (typeof liveUpdateFn === 'function') {
                    liveUpdateFn(targetUrl);
                }
            };

            inputEl.addEventListener('input', update);
            inputEl.addEventListener('change', update);

            previewEl.addEventListener('error', function () {
                if (!inputEl.value.trim()) {
                    this.src = defaultUrl;
                }
            });

            if (btnPrev) {
                btnPrev.addEventListener('click', () => {
                    update();
                    showToast('Previsualización actualizada en el sitio.', 'info');
                });
            }

            if (btnReset) {
                btnReset.addEventListener('click', () => {
                    inputEl.value = defaultUrl;
                    previewEl.src = defaultUrl;
                    if (typeof liveUpdateFn === 'function') {
                        liveUpdateFn(defaultUrl);
                    }
                    showToast('Imagen restaurada a la original por defecto.', 'info');
                });
            }
        };

        // Helper para conectar input type="file" local con lectura en Base64 DataURL
        const bindFileInput = (fileInputId, textInputId, previewImgId, liveUpdateFn) => {
            const fileInput = document.getElementById(fileInputId);
            const textInput = document.getElementById(textInputId);
            const previewImg = document.getElementById(previewImgId);
            if (!fileInput) return;

            fileInput.addEventListener('change', function () {
                if (!this.files || !this.files[0]) return;
                const file = this.files[0];
                if (!file.type.startsWith('image/')) {
                    showToast('Por favor selecciona un archivo de imagen válido (.jpg, .png, .webp).', 'danger');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataUrl = e.target.result;
                    if (textInput) textInput.value = dataUrl;
                    if (previewImg) previewImg.src = dataUrl;
                    if (typeof liveUpdateFn === 'function') {
                        liveUpdateFn(dataUrl);
                    }
                    showToast(`Imagen local cargada con éxito: ${file.name}`, 'success');
                };
                reader.onerror = function () {
                    showToast('Error al leer el archivo local.', 'danger');
                };
                reader.readAsDataURL(file);
            });
        };

        const bindUploadBtn = (btnId, fileInputId) => {
            const btn = document.getElementById(btnId);
            const fileInput = document.getElementById(fileInputId);
            if (btn && fileInput) {
                btn.addEventListener('click', () => fileInput.click());
            }
        };

        // 1. Portada / Banner (Muro)
        setupImagePreview(
            'admin-input-banner-url', 
            'admin-banner-preview', 
            'admin-btn-preview-banner', 
            'admin-btn-reset-banner', 
            DEFAULT_CV_DATA.personal.bannerUrl,
            (url) => {
                const pos = (document.getElementById('admin-input-banner-pos')?.value || '50') + '%';
                applyHeroCoverImage(url, pos);
            }
        );
        bindUploadBtn('admin-btn-upload-banner', 'admin-file-banner');
        bindFileInput('admin-file-banner', 'admin-input-banner-url', 'admin-banner-preview', (url) => {
            const pos = (document.getElementById('admin-input-banner-pos')?.value || '50') + '%';
            applyHeroCoverImage(url, pos);
        });

        // 2. Avatar Web
        setupImagePreview(
            'admin-input-avatar-web-url', 
            'admin-avatar-web-preview', 
            'admin-btn-preview-avatar-web', 
            'admin-btn-reset-avatar-web', 
            DEFAULT_CV_DATA.personal.avatarWebUrl,
            (url) => {
                const pos = (document.getElementById('admin-input-avatar-web-pos')?.value || '20') + '%';
                document.querySelectorAll('#display-avatar-img, .brand-img').forEach(img => {
                    img.src = url;
                    img.style.objectPosition = `center ${pos}`;
                });
            }
        );
        bindUploadBtn('admin-btn-upload-avatar-web', 'admin-file-avatar-web');
        bindFileInput('admin-file-avatar-web', 'admin-input-avatar-web-url', 'admin-avatar-web-preview', (url) => {
            const pos = (document.getElementById('admin-input-avatar-web-pos')?.value || '20') + '%';
            document.querySelectorAll('#display-avatar-img, .brand-img').forEach(img => {
                img.src = url;
                img.style.objectPosition = `center ${pos}`;
            });
        });

        // 3. Avatar CV Imprimible
        setupImagePreview(
            'admin-input-avatar-resume-url', 
            'admin-avatar-resume-preview', 
            'admin-btn-preview-avatar-resume', 
            'admin-btn-reset-avatar-resume', 
            DEFAULT_CV_DATA.personal.avatarResumeUrl,
            (url) => {
                const pos = (document.getElementById('admin-input-avatar-resume-pos')?.value || '15') + '%';
                document.querySelectorAll('#display-resume-avatar, .profile-img-resume').forEach(img => {
                    img.src = url;
                    img.style.objectPosition = `center ${pos}`;
                });
            }
        );
        bindUploadBtn('admin-btn-upload-avatar-resume', 'admin-file-avatar-resume');
        bindFileInput('admin-file-avatar-resume', 'admin-input-avatar-resume-url', 'admin-avatar-resume-preview', (url) => {
            const pos = (document.getElementById('admin-input-avatar-resume-pos')?.value || '15') + '%';
            document.querySelectorAll('#display-resume-avatar, .profile-img-resume').forEach(img => {
                img.src = url;
                img.style.objectPosition = `center ${pos}`;
            });
        });

        // Presets Rápidos
        document.querySelectorAll('.preset-banner-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                const input = document.getElementById('admin-input-banner-url');
                const prev = document.getElementById('admin-banner-preview');
                if (input) input.value = url;
                if (prev) prev.src = url;
                const pos = (document.getElementById('admin-input-banner-pos')?.value || '50') + '%';
                applyHeroCoverImage(url, pos);
                showToast('Preset de portada aplicado.', 'info');
            });
        });

        document.querySelectorAll('.preset-avatar-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                const input = document.getElementById('admin-input-avatar-web-url');
                const prev = document.getElementById('admin-avatar-web-preview');
                if (input) input.value = url;
                if (prev) prev.src = url;
                const pos = (document.getElementById('admin-input-avatar-web-pos')?.value || '20') + '%';
                document.querySelectorAll('#display-avatar-img, .brand-img').forEach(img => {
                    img.src = url;
                    img.style.objectPosition = `center ${pos}`;
                });
                showToast('Preset de avatar web aplicado.', 'info');
            });
        });

        document.querySelectorAll('.preset-resume-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                const input = document.getElementById('admin-input-avatar-resume-url');
                const prev = document.getElementById('admin-avatar-resume-preview');
                if (input) input.value = url;
                if (prev) prev.src = url;
                const pos = (document.getElementById('admin-input-avatar-resume-pos')?.value || '15') + '%';
                document.querySelectorAll('#display-resume-avatar, .profile-img-resume').forEach(img => {
                    img.src = url;
                    img.style.objectPosition = `center ${pos}`;
                });
                showToast('Preset de foto CV aplicado.', 'info');
            });
        });

        // Sliders de Enfoque y Posición Vertical con previsualización en vivo
        const bindPosSlider = (sliderId, labelId, previewId, liveTargetSelector, isBg = false) => {
            const slider = document.getElementById(sliderId);
            const label = document.getElementById(labelId);
            const preview = document.getElementById(previewId);
            if (!slider) return;

            slider.addEventListener('input', function () {
                const val = this.value + '%';
                if (label) label.textContent = val;
                if (preview) {
                    preview.style.objectPosition = `center ${val}`;
                }
                if (liveTargetSelector) {
                    document.querySelectorAll(liveTargetSelector).forEach(el => {
                        if (isBg) {
                            el.style.backgroundPosition = `center ${val}`;
                        } else {
                            el.style.objectPosition = `center ${val}`;
                        }
                    });
                }
            });
        };

        bindPosSlider('admin-input-banner-pos', 'admin-val-banner-pos', 'admin-banner-preview', '#display-header-bg, header.header', true);
        bindPosSlider('admin-input-avatar-web-pos', 'admin-val-avatar-web-pos', 'admin-avatar-web-preview', '#display-avatar-img, .brand-img', false);
        bindPosSlider('admin-input-avatar-resume-pos', 'admin-val-avatar-resume-pos', 'admin-avatar-resume-preview', '#display-resume-avatar, .profile-img-resume', false);

        // Switch de Disponibilidad Laboral Listener - Reactividad Bidireccional Inmediata
        const switchWork = document.getElementById('admin-switch-working-status');
        if (switchWork) {
            switchWork.addEventListener('change', function () {
                setAvailabilityState(this.checked, true);
            });
        }

        // Botón Maestro: Guardar Cambios
        const btnSaveMaster = document.getElementById('admin-btn-save-master');
        if (btnSaveMaster) {
            btnSaveMaster.addEventListener('click', function () {
                if (!activeCvData) activeCvData = getCvData();

                const getVal = (id, def = '') => {
                    const el = document.getElementById(id);
                    return el ? el.value.trim() : def;
                };

                const swWorking = document.getElementById('admin-switch-working-status');
                const isWorkingChecked = swWorking ? swWorking.checked : false;

                // 1. Recoger Imágenes Desacopladas y Datos Personales (Bilingües)
                const jobTitleEs = getVal('admin-input-jobtitle-es') || getVal('admin-input-jobtitle') || DEFAULT_CV_DATA.personal.jobTitle_es;
                const jobTitleEn = getVal('admin-input-jobtitle-en') || DEFAULT_CV_DATA.personal.jobTitle_en;
                const brandSubtitleEs = getVal('admin-input-brandtitle-es') || getVal('admin-input-brandtitle') || DEFAULT_CV_DATA.personal.brandSubtitle_es;
                const brandSubtitleEn = getVal('admin-input-brandtitle-en') || DEFAULT_CV_DATA.personal.brandSubtitle_en;
                const bioEs = getVal('admin-input-bio-es') || getVal('admin-input-bio') || DEFAULT_CV_DATA.personal.bio_es;
                const bioEn = getVal('admin-input-bio-en') || DEFAULT_CV_DATA.personal.bio_en;
                const locationEs = getVal('admin-input-location-es') || getVal('admin-input-location') || DEFAULT_CV_DATA.personal.location_es;
                const locationEn = getVal('admin-input-location-en') || DEFAULT_CV_DATA.personal.location_en;

                const bannerPosVal = (getVal('admin-input-banner-pos') || '50') + '%';
                const avatarWebPosVal = (getVal('admin-input-avatar-web-pos') || '20') + '%';
                const avatarResumePosVal = (getVal('admin-input-avatar-resume-pos') || '15') + '%';

                activeCvData.personal = {
                    fullname: getVal('admin-input-fullname', DEFAULT_CV_DATA.personal.fullname),
                    displayName: getVal('admin-input-displayname', DEFAULT_CV_DATA.personal.displayName),
                    jobTitle_es: jobTitleEs,
                    jobTitle_en: jobTitleEn,
                    jobTitle: jobTitleEs,
                    brandSubtitle_es: brandSubtitleEs,
                    brandSubtitle_en: brandSubtitleEn,
                    brandSubtitle: brandSubtitleEs,
                    bio_es: bioEs,
                    bio_en: bioEn,
                    bio: bioEs,
                    location_es: locationEs,
                    location_en: locationEn,
                    location: locationEs,
                    email: getVal('admin-input-email', DEFAULT_CV_DATA.personal.email),
                    phone: getVal('admin-input-phone', DEFAULT_CV_DATA.personal.phone),
                    portfolioUrl: getVal('admin-input-portfolio', DEFAULT_CV_DATA.personal.portfolioUrl),
                    linkedinUrl: getVal('admin-input-linkedin', DEFAULT_CV_DATA.personal.linkedinUrl),
                    githubUrl: getVal('admin-input-github', DEFAULT_CV_DATA.personal.githubUrl),
                    whatsappUrl: getVal('admin-input-whatsapp', activeCvData.personal.whatsappUrl || DEFAULT_CV_DATA.personal.whatsappUrl),
                    bannerUrl: getVal('admin-input-banner-url', DEFAULT_CV_DATA.personal.bannerUrl),
                    bannerPos: bannerPosVal,
                    avatarWebUrl: getVal('admin-input-avatar-web-url', DEFAULT_CV_DATA.personal.avatarWebUrl),
                    avatarWebPos: avatarWebPosVal,
                    avatarResumeUrl: getVal('admin-input-avatar-resume-url', DEFAULT_CV_DATA.personal.avatarResumeUrl),
                    avatarResumePos: avatarResumePosVal,
                    avatarUrl: getVal('admin-input-avatar-web-url', DEFAULT_CV_DATA.personal.avatarWebUrl)
                };

                // 2. Disponibilidad
                activeCvData.availability = {
                    isCurrentlyWorking: isWorkingChecked,
                    workingBannerText_es: DEFAULT_CV_DATA.availability.workingBannerText_es,
                    workingBannerText_en: DEFAULT_CV_DATA.availability.workingBannerText_en,
                    standardBannerText_es: DEFAULT_CV_DATA.availability.standardBannerText_es,
                    standardBannerText_en: DEFAULT_CV_DATA.availability.standardBannerText_en,
                    workingBtnText_es: DEFAULT_CV_DATA.availability.workingBtnText_es,
                    workingBtnText_en: DEFAULT_CV_DATA.availability.workingBtnText_en,
                    standardBtnText_es: DEFAULT_CV_DATA.availability.standardBtnText_es,
                    standardBtnText_en: DEFAULT_CV_DATA.availability.standardBtnText_en,
                    workingBannerText: DEFAULT_CV_DATA.availability.workingBannerText,
                    standardBannerText: DEFAULT_CV_DATA.availability.standardBannerText,
                    workingBtnText: DEFAULT_CV_DATA.availability.workingBtnText,
                    standardBtnText: DEFAULT_CV_DATA.availability.standardBtnText
                };

                // 3. Educación
                const selEduStatus = document.getElementById('admin-select-edustatus');
                activeCvData.education = {
                    title: getVal('admin-input-edutitle', DEFAULT_CV_DATA.education.title),
                    institution: getVal('admin-input-eduinst', DEFAULT_CV_DATA.education.institution),
                    status: selEduStatus ? selEduStatus.value : 'studying',
                    date: getVal('admin-input-edudate', DEFAULT_CV_DATA.education.date)
                };

                saveCvData(activeCvData);

                const feedback = document.getElementById('admin-modal-feedback');
                if (feedback) {
                    feedback.className = 'alert alert-success mt-3 py-2 small';
                    feedback.innerHTML = '<i class="ti-check mr-1"></i> ¡Todos los cambios han sido guardados en localStorage y aplicados en vivo en el sitio y el CV!';
                    feedback.style.display = 'block';
                    setTimeout(() => { feedback.style.display = 'none'; }, 4000);
                }

                showToast('¡Configuración del CV guardada y sincronizada con éxito!', 'success', 4000);
            });
        }

        // Pestaña Respaldo: Exportar JSON
        const btnExport = document.getElementById('admin-btn-export-json');
        if (btnExport) {
            btnExport.addEventListener('click', function () {
                const data = getCvData();
                const jsonStr = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chrizdev_cv_backup_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Archivo de respaldo JSON descargado exitosamente.', 'success');
            });
        }

        // Pestaña Respaldo: Importar JSON
        const fileImport = document.getElementById('admin-file-import-json');
        if (fileImport) {
            fileImport.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (!imported.personal || !imported.education) {
                            throw new Error('Estructura de JSON inválida para este CV.');
                        }
                        saveCvData(imported);
                        populateModalInputs(imported);
                        showToast('¡Respaldo importado y aplicado correctamente!', 'success');
                    } catch (err) {
                        showToast(`Error al importar JSON: ${err.message}`, 'danger');
                    }
                };
                reader.readAsText(file);
                this.value = '';
            });
        }

        // Pestaña Respaldo: Restablecer Valores Iniciales
        const btnResetDefaults = document.getElementById('admin-btn-reset-defaults');
        if (btnResetDefaults) {
            btnResetDefaults.addEventListener('click', function () {
                if (confirm('¿Deseas restablecer todos los datos del CV a los valores originales de fábrica? Se borrarán las personalizaciones.')) {
                    const fresh = resetCvData();
                    populateModalInputs(fresh);
                    showToast('Valores iniciales del CV restaurados.', 'info');
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 8. Barra de Control Flotante de Administrador (UI & Comportamiento)
    // -------------------------------------------------------------------------
    function renderAdminToolbar() {
        if (!isAdminLoggedIn()) return;

        let toolbar = document.getElementById('admin-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'admin-toolbar';
            toolbar.className = 'admin-toolbar';

            const isCollapsed = localStorage.getItem(STORAGE_KEYS.TOOLBAR_COLLAPSED) === 'true';
            if (isCollapsed) toolbar.classList.add('collapsed');

            const cvData = getCvData();
            const firstExp = cvData.experiences && cvData.experiences.length > 0 ? cvData.experiences[0] : {};

            toolbar.innerHTML = `
                <div class="admin-card">
                    <div class="admin-card-header">
                        <span class="admin-title">
                            <i class="ti-shield"></i> ChrizDev Admin
                        </span>
                        <div class="admin-header-actions">
                            <button id="admin-toolbar-toggle-btn" class="admin-btn-icon" title="Minimizar/Expandir">
                                <i class="${isCollapsed ? 'ti-angle-up' : 'ti-angle-down'}"></i>
                            </button>
                        </div>
                    </div>
                    <div class="admin-card-body">
                        <!-- BOTÓN DESTACADO PARA ABRIR GESTOR COMPLETO -->
                        <button type="button" id="admin-btn-open-cv-manager" class="admin-btn-manage-cv w-100 mb-3" style="font-weight: 700;">
                            <i class="ti-id-badge mr-2"></i> Abrir Editor Completo de CV
                        </button>

                        <span class="admin-section-label">Previsualizar Vista</span>
                        <div class="admin-view-toggle">
                            <button id="admin-btn-view-public" class="admin-view-btn">
                                <i class="ti-world"></i> Pública
                            </button>
                            <button id="admin-btn-view-recruiter" class="admin-view-btn">
                                <i class="ti-briefcase"></i> Empresa
                            </button>
                        </div>

                        <span class="admin-section-label">Enlace Compartible (Reclutadores)</span>
                        <div class="admin-share-box">
                            <input type="text" id="admin-share-link" class="admin-share-input" readonly value="${getRecruiterShareUrl()}">
                            <button id="admin-btn-copy-link" class="admin-btn-copy" title="Copiar enlace directo">
                                <i class="ti-clipboard mr-1"></i> Copiar
                            </button>
                        </div>

                        <!-- MINI SWITCH DE DISPONIBILIDAD DIRECTO -->
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                            <span style="font-size: 0.78rem; color: #f1f5f9; font-weight: 600;">
                                <i class="ti-briefcase text-danger mr-1"></i> ¿Trabajando?
                            </span>
                            <div class="custom-control custom-switch m-0">
                                <input type="checkbox" class="custom-control-input" id="admin-quick-switch-working" ${cvData.availability.isCurrentlyWorking ? 'checked' : ''}>
                                <label class="custom-control-label" for="admin-quick-switch-working" style="cursor: pointer;"></label>
                            </div>
                        </div>

                        <!-- MINI EDITOR RÁPIDO PLEGABLE -->
                        <div class="admin-cv-config-section mt-3 pt-2" style="border-top: 1px solid rgba(248, 92, 112, 0.25);">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="admin-section-label mb-0" style="color: #F85C70; font-weight: 700;">
                                    <i class="ti-settings mr-1"></i> Edición Rápida
                                </span>
                                <button id="admin-editor-toggle-btn" class="admin-btn-icon" title="Plegar/Desplegar Editor Rápido" type="button">
                                    <i class="ti-angle-down" id="admin-editor-chevron"></i>
                                </button>
                            </div>

                            <div id="admin-editor-panel" class="admin-editor-panel" style="display: none;">
                                <form id="admin-cv-quick-editor-form">
                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-job-role">Puesto Principal</label>
                                        <input type="text" id="admin-quick-job-role" class="admin-ctrl-input" value="${escapeHtml(firstExp.role || '')}" placeholder="Desarrollador de Software">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-job-company">Empresa Principal</label>
                                        <input type="text" id="admin-quick-job-company" class="admin-ctrl-input" value="${escapeHtml(firstExp.company || '')}" placeholder="Celerix SAS">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-job-period">Periodo</label>
                                        <input type="text" id="admin-quick-job-period" class="admin-ctrl-input" value="${escapeHtml(firstExp.period || '')}" placeholder="2024 - Presente">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-edu-title">Carrera</label>
                                        <input type="text" id="admin-quick-edu-title" class="admin-ctrl-input" value="${escapeHtml(cvData.education.title || '')}" placeholder="Tecnólogo en Análisis...">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-edu-status">Estado Académico</label>
                                        <select id="admin-quick-edu-status" class="admin-ctrl-select">
                                            <option value="studying" ${cvData.education.status === 'studying' ? 'selected' : ''}>En formación / Estudiante</option>
                                            <option value="graduated" ${cvData.education.status === 'graduated' ? 'selected' : ''}>Graduado</option>
                                        </select>
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-quick-edu-date">Fecha Finalización</label>
                                        <input type="text" id="admin-quick-edu-date" class="admin-ctrl-input" value="${escapeHtml(cvData.education.date || '')}" placeholder="Enero de 2027">
                                    </div>

                                    <div class="d-flex align-items-center mt-3 pt-1" style="gap: 8px;">
                                        <button type="submit" id="admin-btn-save-quick" class="admin-btn-save-cv flex-fill" title="Guardar cambios rápidos">
                                            <i class="ti-save mr-1"></i> Guardar Rápido
                                        </button>
                                        <button type="button" id="admin-btn-open-modal-from-quick" class="admin-btn-reset-cv" title="Abrir Administrador Completo">
                                            <i class="ti-layout-tab-window"></i>
                                        </button>
                                    </div>
                                    <div id="admin-quick-feedback" class="admin-editor-feedback mt-2" style="display: none;"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="admin-card-footer">
                        <span style="font-size: 0.72rem; color: #94a3b8;">Sesión activa persistente</span>
                        <button id="admin-btn-logout" class="admin-btn-logout" title="Cerrar sesión de administrador">
                            <i class="ti-power-off mr-1"></i> Salir
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(toolbar);

            // Eventos del Toolbar
            document.getElementById('admin-toolbar-toggle-btn').addEventListener('click', function () {
                toolbar.classList.toggle('collapsed');
                const collapsed = toolbar.classList.contains('collapsed');
                this.querySelector('i').className = collapsed ? 'ti-angle-up' : 'ti-angle-down';
                localStorage.setItem(STORAGE_KEYS.TOOLBAR_COLLAPSED, collapsed ? 'true' : 'false');
            });

            const btnOpenModal = document.getElementById('admin-btn-open-cv-manager');
            if (btnOpenModal) btnOpenModal.addEventListener('click', openCvManagerModal);

            const btnOpenModalFromQuick = document.getElementById('admin-btn-open-modal-from-quick');
            if (btnOpenModalFromQuick) btnOpenModalFromQuick.addEventListener('click', openCvManagerModal);

            // Quick Switch Trabajando Listener - Reactividad Bidireccional
            const quickSwitch = document.getElementById('admin-quick-switch-working');
            if (quickSwitch) {
                quickSwitch.addEventListener('change', function () {
                    setAvailabilityState(this.checked, true);
                });
            }

            document.getElementById('admin-btn-view-public').addEventListener('click', function () {
                applyViewMode('public');
                showToast('Modo de previsualización: Vista Pública', 'info');
            });

            document.getElementById('admin-btn-view-recruiter').addEventListener('click', function () {
                applyViewMode('recruiter');
                showToast('Modo de previsualización: Vista de Empresa', 'info');
            });

            document.getElementById('admin-btn-copy-link').addEventListener('click', function () {
                const input = document.getElementById('admin-share-link');
                input.value = getRecruiterShareUrl();
                input.select();
                input.setSelectionRange(0, 99999);

                navigator.clipboard.writeText(input.value).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="ti-check mr-1"></i> ¡Copiado!';
                    this.classList.add('copied');
                    showToast('¡Enlace exclusivo para empresas copiado al portapapeles!', 'success');
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('copied');
                    }, 2500);
                }).catch(() => {
                    document.execCommand('copy');
                    showToast('Enlace copiado al portapapeles', 'success');
                });
            });

            const btnToggleEditor = document.getElementById('admin-editor-toggle-btn');
            const editorPanel = document.getElementById('admin-editor-panel');
            const editorChevron = document.getElementById('admin-editor-chevron');
            if (btnToggleEditor && editorPanel) {
                btnToggleEditor.addEventListener('click', function () {
                    const isHidden = editorPanel.style.display === 'none';
                    editorPanel.style.display = isHidden ? 'block' : 'none';
                    if (editorChevron) {
                        editorChevron.className = isHidden ? 'ti-angle-down' : 'ti-angle-up';
                    }
                });
            }

            const formQuick = document.getElementById('admin-cv-quick-editor-form');
            if (formQuick) {
                formQuick.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const current = getCvData();
                    if (!current.experiences || current.experiences.length === 0) {
                        current.experiences = [{ id: generateId(), company: '', role: '', period: '', contract: '', desc: '' }];
                    }

                    current.experiences[0].role = document.getElementById('admin-quick-job-role').value.trim() || current.experiences[0].role;
                    current.experiences[0].company = document.getElementById('admin-quick-job-company').value.trim() || current.experiences[0].company;
                    current.experiences[0].period = document.getElementById('admin-quick-job-period').value.trim() || current.experiences[0].period;

                    current.education.title = document.getElementById('admin-quick-edu-title').value.trim() || current.education.title;
                    current.education.status = document.getElementById('admin-quick-edu-status').value;
                    current.education.date = document.getElementById('admin-quick-edu-date').value.trim() || current.education.date;

                    saveCvData(current);

                    const feedback = document.getElementById('admin-quick-feedback');
                    if (feedback) {
                        feedback.innerHTML = '<i class="ti-check mr-1"></i> ¡Cambios guardados!';
                        feedback.style.display = 'block';
                        setTimeout(() => { feedback.style.display = 'none'; }, 3000);
                    }
                    showToast('Datos rápidos actualizados y reflejados en el CV.', 'success');
                });
            }

            document.getElementById('admin-btn-logout').addEventListener('click', function () {
                logoutAdmin();
            });
        } else {
            toolbar.style.display = 'block';
            const shareInput = document.getElementById('admin-share-link');
            if (shareInput) shareInput.value = getRecruiterShareUrl();
        }
    }

    // -------------------------------------------------------------------------
    // 9. Autenticación de Administrador (Login / Logout)
    // -------------------------------------------------------------------------
    function loginAdmin(user, pass) {
        if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
            if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PREVIEW)) {
                localStorage.setItem(STORAGE_KEYS.ADMIN_PREVIEW, 'recruiter');
            }

            if (typeof $ !== 'undefined') {
                $('#admin-login-modal').modal('hide');
            }

            renderAdminToolbar();
            const preferredMode = localStorage.getItem(STORAGE_KEYS.ADMIN_PREVIEW) || 'recruiter';
            applyViewMode(preferredMode);
            showToast('¡Bienvenido, Administrador (ChrizDev)! Panel activado.', 'success');
            return true;
        } else {
            return false;
        }
    }

    function logoutAdmin() {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        const toolbar = document.getElementById('admin-toolbar');
        if (toolbar) toolbar.remove();

        if (!isRecruiterAuthorized()) {
            applyViewMode('public');
        } else {
            applyViewMode('recruiter');
        }

        showToast('Sesión de administrador cerrada.', 'info');
    }

    function openAdminModal() {
        if (typeof $ !== 'undefined') {
            $('#admin-login-modal').modal('show');
            setTimeout(() => {
                const userInput = document.getElementById('admin-user-input');
                if (userInput) userInput.focus();
            }, 300);
        }
    }

    function openRecruiterModal() {
        if (typeof $ !== 'undefined') {
            $('#recruiter-token-modal').modal('show');
            setTimeout(() => {
                const tokenInput = document.getElementById('recruiter-token-input');
                if (tokenInput) tokenInput.focus();
            }, 300);
        }
    }

    // -------------------------------------------------------------------------
    // 10. Inicialización en index.html
    // -------------------------------------------------------------------------
    function initIndexPage() {
        applyCvDataToDOM(getCvData());
        initCvManagerModal();

        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        const tokenParam = urlParams.get('token');
        const adminParam = urlParams.get('admin');

        if (adminParam === 'login' || adminParam === '1') {
            setTimeout(openAdminModal, 500);
        }

        let activeMode = 'public';

        if (isAdminLoggedIn()) {
            renderAdminToolbar();
            activeMode = localStorage.getItem(STORAGE_KEYS.ADMIN_PREVIEW) || 'recruiter';
        } else if (modeParam === 'empresa') {
            const expectedToken = getRecruiterToken();
            if (tokenParam && tokenParam.trim() === expectedToken) {
                sessionStorage.setItem(STORAGE_KEYS.RECRUITER_SESSION, 'true');
                activeMode = 'recruiter';
                showToast('👔 Vista de Empresa activa. Experiencia y CV completo desbloqueados.', 'success', 4500);
            } else {
                showToast('Token de acceso para empresas no válido o expirado. Mostrando vista pública.', 'danger', 4500);
                activeMode = 'public';
            }
        } else if (isRecruiterAuthorized()) {
            activeMode = 'recruiter';
        } else {
            activeMode = 'public';
        }

        applyViewMode(activeMode);

        // Atajos de teclado: Ctrl + Shift + A o Alt + A
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
                (e.altKey && (e.key === 'A' || e.key === 'a'))) {
                e.preventDefault();
                if (isAdminLoggedIn()) {
                    openCvManagerModal();
                } else {
                    openAdminModal();
                }
            }
        });

        // 3 Clics rápidos en la marca
        let avatarClicks = 0;
        let avatarTimer = null;
        const brandAvatar = document.querySelector('.navbar-brand, .brand-img, .brand');
        if (brandAvatar) {
            brandAvatar.addEventListener('click', function () {
                avatarClicks++;
                clearTimeout(avatarTimer);
                if (avatarClicks >= 3) {
                    avatarClicks = 0;
                    if (!isAdminLoggedIn()) {
                        openAdminModal();
                    } else {
                        openCvManagerModal();
                    }
                } else {
                    avatarTimer = setTimeout(() => { avatarClicks = 0; }, 1200);
                }
            });
        }

        const adminForm = document.getElementById('admin-login-form');
        if (adminForm) {
            adminForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const user = document.getElementById('admin-user-input').value;
                const pass = document.getElementById('admin-pass-input').value;
                const errorBox = document.getElementById('admin-login-error');

                if (loginAdmin(user, pass)) {
                    if (errorBox) errorBox.style.display = 'none';
                    adminForm.reset();
                } else {
                    if (errorBox) {
                        errorBox.innerText = 'Usuario o contraseña de administrador incorrectos.';
                        errorBox.style.display = 'block';
                    }
                }
            });
        }

        const recruiterForm = document.getElementById('recruiter-token-form');
        if (recruiterForm) {
            recruiterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const tokenInput = document.getElementById('recruiter-token-input').value.trim();
                const errorBox = document.getElementById('recruiter-token-error');

                if (tokenInput === getRecruiterToken()) {
                    sessionStorage.setItem(STORAGE_KEYS.RECRUITER_SESSION, 'true');
                    if (typeof $ !== 'undefined') {
                        $('#recruiter-token-modal').modal('hide');
                    }
                    recruiterForm.reset();
                    if (errorBox) errorBox.style.display = 'none';
                    applyViewMode('recruiter');
                    showToast('¡Acceso concedido! Vista Profesional habilitada.', 'success');
                } else {
                    if (errorBox) {
                        errorBox.innerText = 'El token ingresado no es válido. Verifica con el titular.';
                        errorBox.style.display = 'block';
                    }
                }
            });
        }

        const btnExitRecruiter = document.getElementById('btn-exit-recruiter');
        if (btnExitRecruiter) {
            btnExitRecruiter.addEventListener('click', function () {
                sessionStorage.removeItem(STORAGE_KEYS.RECRUITER_SESSION);
                applyViewMode('public');
                showToast('Has cambiado a la Vista Pública.', 'info');
            });
        }

        const footerAdminTrigger = document.getElementById('admin-login-trigger');
        if (footerAdminTrigger) {
            footerAdminTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (isAdminLoggedIn()) {
                    openCvManagerModal();
                } else {
                    openAdminModal();
                }
            });
        }

        const footerRecruiterTrigger = document.getElementById('recruiter-access-trigger');
        if (footerRecruiterTrigger) {
            footerRecruiterTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                openRecruiterModal();
            });
        }

        setupSendCvEmailModal();
    }

    // -------------------------------------------------------------------------
    // 11. Modal de Envío de CV por Correo (Reclutadores & Empresas)
    // -------------------------------------------------------------------------
    function setupSendCvEmailModal() {
        const modal = document.getElementById('sendCvEmailModal');
        if (!modal) return;

        const btnOpenBanner = document.getElementById('btn-banner-email-cv');
        const btnOpenTop = document.getElementById('btn-top-email-cv');
        const btnClose = document.getElementById('btn-close-send-email');
        const form = document.getElementById('form-send-cv-email');
        const feedback = document.getElementById('send-cv-feedback');
        const btnMailto = document.getElementById('btn-mailto-fallback');

        const openModal = () => {
            modal.style.display = 'flex';
            if (feedback) feedback.style.display = 'none';
            const recEmail = document.getElementById('send-cv-recipient-email');
            if (recEmail) setTimeout(() => recEmail.focus(), 100);
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        if (btnOpenBanner && !btnOpenBanner.dataset.bound) {
            btnOpenBanner.dataset.bound = 'true';
            btnOpenBanner.addEventListener('click', openModal);
        }
        if (btnOpenTop && !btnOpenTop.dataset.bound) {
            btnOpenTop.dataset.bound = 'true';
            btnOpenTop.addEventListener('click', openModal);
        }
        if (btnClose && !btnClose.dataset.bound) {
            btnClose.dataset.bound = 'true';
            btnClose.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        const getEmailData = () => {
            const recipient = document.getElementById('send-cv-recipient-email')?.value.trim() || '';
            const recruiter = document.getElementById('send-cv-recruiter-name')?.value.trim() || 'Reclutador / Empresa';
            const note = document.getElementById('send-cv-note')?.value.trim() || '';

            const subject = `Curriculum Vitae Autorizado - Christian Romero (ChrizDev)`;
            const resumeUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/resumen.html?mode=empresa&token=${getRecruiterToken()}`;
            const portfolioUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/index.html?mode=empresa&token=${getRecruiterToken()}`;

            const body = `Hola ${recruiter},\n\nTe comparto el Currículum Vitae oficial y credenciales autorizadas de Christian Romero (ChrizDev) - Desarrollador de Software enfocado en IA y Automatización.\n\n` +
                `🔗 CV Interactivo y Acreditado (Modo Empresa):\n${resumeUrl}\n\n` +
                `🌐 Portafolio Profesional Completo:\n${portfolioUrl}\n\n` +
                `🏆 Certificaciones Oficiales Claris FileMaker (Apple Company):\n` +
                `1. App Developer for Claris FileMaker Pro Specialist (★★ Specialist - Octubre 2026):\nhttps://www.credly.com/badges/7bbcb5fd-fc4c-42ef-a6ca-1d1541941f31/public_url\n\n` +
                `2. App Developer for Claris FileMaker Pro Associate (★ Associate - Octubre 2026):\nhttps://www.credly.com/badges/d8c70883-218b-46e7-a89b-5b459d53a20a/public_url\n\n` +
                (note ? `📝 Mensaje del Reclutador:\n"${note}"\n\n` : '') +
                `Contacto directo: christianjoroce@gmail.com | Tel: 3183517802\nMedellín, Antioquia, Colombia`;

            return { recipient, recruiter, note, subject, body, resumeUrl, portfolioUrl };
        };

        if (btnMailto && !btnMailto.dataset.bound) {
            btnMailto.dataset.bound = 'true';
            btnMailto.addEventListener('click', () => {
                const data = getEmailData();
                if (!data.recipient) {
                    showToast('Ingresa el correo destinatario antes de abrir tu cliente.', 'warning');
                    document.getElementById('send-cv-recipient-email')?.focus();
                    return;
                }
                const mailtoUrl = `mailto:${encodeURIComponent(data.recipient)}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
                window.open(mailtoUrl, '_blank');
                showToast('Abriendo tu cliente de correo...', 'info');
            });
        }

        if (form && !form.dataset.bound) {
            form.dataset.bound = 'true';
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const data = getEmailData();
                if (!data.recipient) return;

                const submitBtn = document.getElementById('btn-submit-send-email');
                const originalBtnHtml = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="ti-reload mr-1"></i> Enviando...';

                if (feedback) {
                    feedback.className = 'alert alert-info small py-2 mb-3';
                    feedback.innerHTML = '<i class="ti-reload mr-1"></i> Transmitiendo CV y credenciales autorizadas...';
                    feedback.style.display = 'block';
                }

                try {
                    const response = await fetch('https://formspree.io/f/xrejgnla', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            destinatario: data.recipient,
                            solicitante: data.recruiter,
                            mensaje: data.note,
                            enlace_cv: data.resumeUrl,
                            enlace_portafolio: data.portfolioUrl,
                            _subject: data.subject,
                            _replyto: data.recipient
                        })
                    });

                    if (response.ok) {
                        if (feedback) {
                            feedback.className = 'alert alert-success small py-2 mb-3';
                            feedback.innerHTML = '<i class="ti-check mr-1"></i> ¡El CV oficial y los enlaces de verificación fueron enviados exitosamente!';
                        }
                        showToast(`CV enviado con éxito a ${data.recipient}`, 'success');
                        setTimeout(() => {
                            closeModal();
                            form.reset();
                        }, 2200);
                    } else {
                        throw new Error('Servicio de envío ocupado');
                    }
                } catch (err) {
                    if (feedback) {
                        feedback.className = 'alert alert-warning small py-2 mb-3';
                        feedback.innerHTML = '<i class="ti-info-alt mr-1"></i> Abriendo tu cliente de correo predeterminado para garantizar la entrega directa.';
                    }
                    const mailtoUrl = `mailto:${encodeURIComponent(data.recipient)}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
                    window.open(mailtoUrl, '_blank');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // 12. Protección y Render Dinámico en resumen.html (CV Imprimible)
    // -------------------------------------------------------------------------
    function initResumePage() {
        applyCvDataToDOM(getCvData());
        setupSendCvEmailModal();

        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        const modeParam = urlParams.get('mode');

        const isAuthorized = isAdminLoggedIn() || 
                             isRecruiterAuthorized() || 
                             (modeParam === 'empresa' && tokenParam === getRecruiterToken());

        if (modeParam === 'empresa' && tokenParam === getRecruiterToken()) {
            sessionStorage.setItem(STORAGE_KEYS.RECRUITER_SESSION, 'true');
        }

        const updateResumeButtons = (authorized) => {
            const topSpecialist = document.getElementById('resume-top-claris-specialist-btn');
            const topAssociate = document.getElementById('resume-top-claris-associate-btn');
            const topEmailBtn = document.getElementById('btn-top-email-cv');
            const topLock = document.getElementById('resume-top-claris-lock');

            if (topSpecialist) topSpecialist.style.display = authorized ? 'inline-flex' : 'none';
            if (topAssociate) topAssociate.style.display = authorized ? 'inline-flex' : 'none';
            if (topEmailBtn) topEmailBtn.style.display = authorized ? 'inline-flex' : 'none';
            if (topLock) topLock.style.display = authorized ? 'none' : 'inline-flex';
        };

        if (isAuthorized) {
            document.body.classList.remove('mode-public');
            document.body.classList.add('mode-recruiter');
            updateResumeButtons(true);
        } else {
            document.body.classList.remove('mode-recruiter');
            document.body.classList.add('mode-public');
            updateResumeButtons(false);

            const pages = document.querySelectorAll('.cv-page, .page');
            pages.forEach(p => p.style.display = 'none');
            const topBars = document.querySelectorAll('.cv-top-bar, .no-print');
            topBars.forEach(np => np.style.display = 'none');

            let lockOverlay = document.getElementById('restricted-access-overlay');
            if (!lockOverlay) {
                lockOverlay = document.createElement('div');
                lockOverlay.id = 'restricted-access-overlay';
                lockOverlay.className = 'restricted-access-overlay';
                lockOverlay.innerHTML = `
                    <div class="restricted-card">
                        <div class="lock-icon"><i class="ti-lock"></i></div>
                        <h2>Acceso Exclusivo para Empresas</h2>
                        <p>Este currículum vitae detallado contiene información sensible de postulación y está reservado para reclutadores autorizados.</p>
                        
                        <form id="resume-unlock-form" style="max-width: 320px; margin: 0 auto 20px;">
                            <div class="form-group mb-3">
                                <input type="password" id="resume-token-input" class="form-control" placeholder="Introduce el token de empresa..." required style="background: #0f172a; border: 1px solid #334155; color: #fff; text-align: center;">
                            </div>
                            <div id="resume-token-error" style="display: none; color: #ef4444; font-size: 0.85rem; margin-bottom: 10px;"></div>
                            <button type="submit" class="btn btn-primary btn-block" style="background: #F85C70; border: none; font-weight: 600;">
                                <i class="ti-key mr-1"></i> Desbloquear CV
                            </button>
                        </form>
                        
                        <div>
                            <a href="index.html" class="btn btn-outline-light btn-sm">
                                <i class="ti-arrow-left mr-1"></i> Volver al Portafolio
                            </a>
                        </div>
                    </div>
                `;
                document.body.appendChild(lockOverlay);

                document.getElementById('resume-unlock-form').addEventListener('submit', function (e) {
                    e.preventDefault();
                    const val = document.getElementById('resume-token-input').value.trim();
                    const err = document.getElementById('resume-token-error');

                    if (val === getRecruiterToken() || val === ADMIN_PASS) {
                        sessionStorage.setItem(STORAGE_KEYS.RECRUITER_SESSION, 'true');
                        document.body.classList.remove('mode-public');
                        document.body.classList.add('mode-recruiter');
                        lockOverlay.remove();
                        pages.forEach(p => p.style.display = '');
                        topBars.forEach(np => np.style.display = '');
                        updateResumeButtons(true);
                        applyCvDataToDOM(getCvData());
                        showToast('CV desbloqueado. Modo Empresa habilitado.', 'success');
                    } else {
                        err.innerText = 'Token incorrecto. Solicita acceso al propietario.';
                        err.style.display = 'block';
                    }
                });
            }
        }
    }

    // -------------------------------------------------------------------------
    // 12. Inicialización Automática
    // -------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        if (window.location.pathname.endsWith('resumen.html')) {
            initResumePage();
        } else {
            initIndexPage();
        }
    });

    window.ViewController = {
        applyViewMode: applyViewMode,
        loginAdmin: loginAdmin,
        logoutAdmin: logoutAdmin,
        openAdminModal: openAdminModal,
        openRecruiterModal: openRecruiterModal,
        openCvManagerModal: openCvManagerModal,
        getShareUrl: getRecruiterShareUrl,
        getCvData: getCvData,
        saveCvData: saveCvData,
        resetCvData: resetCvData,
        applyCvDataToDOM: applyCvDataToDOM,
        applyHeroCoverImage: applyHeroCoverImage,
        setAvailabilityState: setAvailabilityState,
        applyAvailabilityBannerToDOM: applyAvailabilityBannerToDOM
    };

})();
