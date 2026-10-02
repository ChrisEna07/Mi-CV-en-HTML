/**
 * VIEW CONTROLLER (Control de Audiencia & Administración Dinámica)
 * Proyecto: Christian Romero Portfolio & CV (ChrizDev)
 * 
 * Gestiona:
 * 1. La segmentación entre Vista Pública y Vista Profesional (Empresas/Reclutadores).
 * 2. Autenticación de Administrador (ChrizDev07) y persistencia de sesión.
 * 3. Gestión y persistencia completa del Portafolio y CV en localStorage ('chrizdev_cv_data'):
 *    - Edición total de datos personales (nombre, título, bio, contacto, redes, etc.).
 *    - Foto de perfil dinámica por URL con previsualización en vivo (web y CV).
 *    - Gestor CRUD dinámico de experiencias laborales (añadir, editar, eliminar y reordenar).
 *    - Configuración de educación y estado académico (estudiante vs graduado).
 * 4. Sincronización en tiempo real con el DOM de la página principal y la vista de impresión (resumen.html).
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

    // Estructura completa de datos por defecto
    const DEFAULT_CV_DATA = {
        personal: {
            fullname: 'Christian Romero (ChrizDev)',
            displayName: 'Christian Romero',
            jobTitle: 'Junior Software Developer especializado en IA y Automatización',
            brandSubtitle: 'Analista de Datos | Desarrollador Junior',
            bio: 'Transformo procesos complejos en soluciones digitales eficientes. Mi enfoque combina el desarrollo Full Stack con la implementación estratégica de IA (LLMs) y arquitecturas de datos robustas. Apasionado por la resiliencia del software y la ingeniería detrás de los datos legales.',
            email: 'christianjoroce@gmail.com',
            phone: '3183517802',
            location: 'Medellín, Antioquia',
            portfolioUrl: 'https://my-app-s-portafolio-digital.vercel.app/',
            linkedinUrl: 'https://www.linkedin.com/in/christian-romero-5a9577145/',
            githubUrl: 'https://github.com/ChrisEna07',
            whatsappUrl: 'https://wa.link/o6m42i',
            avatarUrl: 'assets/imgs/avatar.jpg'
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
                role: 'Técnico en Soporte de Hardware',
                period: '2020 - 2023',
                contract: 'Independiente',
                desc: 'Ensamble, reparación y mantenimiento preventivo/correctivo de computadores de escritorio y portátiles de diversas marcas.'
            },
            {
                id: 'exp_3',
                company: 'Empresa Privada',
                role: 'Asistente Administrativo',
                period: '2018 - 2020',
                contract: 'Presencial',
                desc: 'Gestión documental, digitalización de archivos masivos, atención a clientes y soporte en procesos administrativos.'
            }
        ]
    };

    // Variable en memoria para operaciones del modal
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
                return {
                    personal: Object.assign({}, DEFAULT_CV_DATA.personal, parsed.personal || {}),
                    education: Object.assign({}, DEFAULT_CV_DATA.education, parsed.education || {}),
                    experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 
                        ? parsed.experiences 
                        : JSON.parse(JSON.stringify(DEFAULT_CV_DATA.experiences))
                };
            }

            // Migración transparente si existía cv_profile_data legacy
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
            
            // Sincronizar compatibilidad legacy
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
    function applyCvDataToDOM(data) {
        if (!data) data = getCvData();
        const p = data.personal || {};
        const edu = data.education || {};
        const exps = Array.isArray(data.experiences) ? data.experiences : [];

        // ---------------------------------------------------------------------
        // A. FOTO DE PERFIL (Avatar)
        // ---------------------------------------------------------------------
        const avatarUrl = p.avatarUrl || 'assets/imgs/avatar.jpg';

        const webAvatarImg = document.getElementById('display-avatar-img');
        if (webAvatarImg) webAvatarImg.src = avatarUrl;

        const resumeAvatarImg = document.getElementById('display-resume-avatar');
        if (resumeAvatarImg) resumeAvatarImg.src = avatarUrl;

        // Cualquier otro avatar con clase brand-img o profile-img-resume
        document.querySelectorAll('.brand-img').forEach(img => { img.src = avatarUrl; });
        document.querySelectorAll('.profile-img-resume').forEach(img => { img.src = avatarUrl; });

        // ---------------------------------------------------------------------
        // B. DATOS PERSONALES & ENCABEZADOS
        // ---------------------------------------------------------------------
        // Nombre Completo
        const elHeaderName = document.getElementById('display-header-name');
        if (elHeaderName && p.fullname) elHeaderName.textContent = p.fullname;

        const elResumeName = document.getElementById('display-resume-name');
        if (elResumeName && p.fullname) elResumeName.textContent = p.fullname;

        const elFooterName = document.getElementById('display-footer-name');
        if (elFooterName && (p.displayName || p.fullname)) elFooterName.textContent = p.displayName || p.fullname;

        // Nombre de Marca / Navbar
        const elBrandName = document.getElementById('display-brand-name');
        if (elBrandName && (p.displayName || p.fullname)) elBrandName.textContent = p.displayName || p.fullname;

        // Título Profesional
        const elHeaderTitle = document.getElementById('display-header-title');
        if (elHeaderTitle && p.jobTitle) elHeaderTitle.textContent = p.jobTitle;

        const elResumeTitle = document.getElementById('display-resume-title');
        if (elResumeTitle && p.jobTitle) elResumeTitle.textContent = p.jobTitle;

        // Subtítulo Navbar / Especialidad
        const elBrandTitle = document.getElementById('display-brand-title');
        if (elBrandTitle && p.brandSubtitle) elBrandTitle.textContent = p.brandSubtitle;

        // Biografía / Resumen
        const elAboutBio = document.getElementById('display-about-bio');
        if (elAboutBio && p.bio) elAboutBio.textContent = p.bio;

        const elResumeBio = document.getElementById('display-resume-bio');
        if (elResumeBio && p.bio) elResumeBio.textContent = p.bio;

        // Correo Electrónico
        const elPersonalEmail = document.getElementById('display-personal-email');
        if (elPersonalEmail && p.email) elPersonalEmail.textContent = p.email;

        const elContactEmail = document.getElementById('display-contact-email');
        if (elContactEmail && p.email) elContactEmail.textContent = p.email;

        const elResumeEmail = document.getElementById('display-resume-email');
        if (elResumeEmail && p.email) elResumeEmail.textContent = p.email;

        // Teléfono
        const elPersonalPhone = document.getElementById('display-personal-phone');
        if (elPersonalPhone && p.phone) elPersonalPhone.textContent = p.phone;

        const elContactPhone = document.getElementById('display-contact-phone');
        if (elContactPhone && p.phone) elContactPhone.textContent = p.phone;

        const elResumePhone = document.getElementById('display-resume-phone');
        if (elResumePhone && p.phone) elResumePhone.textContent = p.phone;

        // Ubicación
        const elPersonalLoc = document.getElementById('display-personal-location');
        if (elPersonalLoc && p.location) elPersonalLoc.textContent = p.location;

        const elContactLoc = document.getElementById('display-contact-location');
        if (elContactLoc && p.location) elContactLoc.textContent = p.location;

        const elResumeLoc = document.getElementById('display-resume-location');
        if (elResumeLoc && p.location) elResumeLoc.textContent = p.location;

        // Enlace de Portafolio
        if (p.portfolioUrl) {
            const elPersonalPort = document.getElementById('display-personal-portfolio');
            if (elPersonalPort) {
                elPersonalPort.href = p.portfolioUrl;
            }
            const elResumePort = document.getElementById('display-resume-portfolio');
            if (elResumePort) {
                elResumePort.href = p.portfolioUrl;
                let cleanPort = p.portfolioUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
                elResumePort.textContent = `Portafolio de Apps: ${cleanPort}`;
            }
        }

        // Enlace a LinkedIn
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

            document.querySelectorAll('.contact-info-card a[href*="linkedin"]').forEach(a => {
                a.href = p.linkedinUrl;
            });
        }

        // Enlace a GitHub
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

            document.querySelectorAll('.contact-info-card a[href*="github"]').forEach(a => {
                a.href = p.githubUrl;
            });
        }

        // Enlace de WhatsApp
        if (p.whatsappUrl) {
            const elAboutWa = document.getElementById('display-about-whatsapp');
            if (elAboutWa) elAboutWa.href = p.whatsappUrl;

            const elHeaderWa = document.getElementById('display-header-whatsapp');
            if (elHeaderWa) elHeaderWa.href = p.whatsappUrl;

            document.querySelectorAll('.whatsapp-float, .contact-info-card a[href*="wa.link"], .contact-info-card a[href*="whatsapp"]').forEach(a => {
                a.href = p.whatsappUrl;
            });
        }

        // ---------------------------------------------------------------------
        // C. EDUCACIÓN & ESTADO ACADÉMICO
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

        // En resumen.html
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
        // D. EXPERIENCIAS LABORALES DINÁMICAS (CRUD RENDER)
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
                                <span>${escapeHtml(exp.period)}</span>
                            </div>
                            <div class="item-sub">${escapeHtml(exp.company)}${exp.contract ? ` (${escapeHtml(exp.contract)})` : ''}</div>
                            <p>${escapeHtml(exp.desc)}</p>
                        </div>
                    `;
                });
                resumeExpContainer.innerHTML = html;
            }
        }

        // Elementos legacy si existen en el DOM
        if (exps.length > 0) {
            const firstExp = exps[0];
            const elJobRole = document.getElementById('display-job-role');
            if (elJobRole) elJobRole.textContent = firstExp.role;
            const elJobCompany = document.getElementById('display-job-company');
            if (elJobCompany) elJobCompany.textContent = firstExp.company;
            const elJobPeriod = document.getElementById('display-job-period');
            if (elJobPeriod) elJobPeriod.textContent = firstExp.period;
            const elJobDesc = document.getElementById('display-job-desc');
            if (elJobDesc) elJobDesc.textContent = firstExp.desc;

            const resumeRole = document.getElementById('cv-resume-job-role');
            if (resumeRole) resumeRole.textContent = firstExp.role;
            const resumeCompany = document.getElementById('cv-resume-job-company');
            if (resumeCompany) resumeCompany.textContent = firstExp.company;
            const resumePeriod = document.getElementById('cv-resume-job-period');
            if (resumePeriod) resumePeriod.textContent = firstExp.period;
            const resumeDesc = document.getElementById('cv-resume-job-desc');
            if (resumeDesc) resumeDesc.textContent = firstExp.desc;
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
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
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
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
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
        const edu = data.education || {};

        // 1. Datos Personales
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setVal('admin-input-fullname', p.fullname);
        setVal('admin-input-displayname', p.displayName);
        setVal('admin-input-jobtitle', p.jobTitle);
        setVal('admin-input-brandtitle', p.brandSubtitle);
        setVal('admin-input-bio', p.bio);
        setVal('admin-input-email', p.email);
        setVal('admin-input-phone', p.phone);
        setVal('admin-input-location', p.location);
        setVal('admin-input-portfolio', p.portfolioUrl);
        setVal('admin-input-linkedin', p.linkedinUrl);
        setVal('admin-input-github', p.githubUrl);
        setVal('admin-input-avatar-url', p.avatarUrl);

        // Preview foto de perfil
        const previewImg = document.getElementById('admin-avatar-preview');
        if (previewImg) {
            previewImg.src = p.avatarUrl || 'assets/imgs/avatar.jpg';
        }

        // 2. Educación
        setVal('admin-input-edutitle', edu.title);
        setVal('admin-input-eduinst', edu.institution);
        setVal('admin-input-edudate', edu.date);
        const selEduStatus = document.getElementById('admin-select-edustatus');
        if (selEduStatus) selEduStatus.value = edu.status || 'studying';

        // 3. Renderizar listado de experiencias CRUD
        renderAdminExpList();
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
        // Editar
        document.querySelectorAll('.admin-btn-edit-exp').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const exp = activeCvData.experiences.find(e => e.id === id);
                if (exp) {
                    showExpForm(exp);
                }
            });
        });

        // Eliminar
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

        // Mover Arriba / Abajo
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

    function initCvManagerModal() {
        // Botón "Nueva Experiencia"
        const btnNewExp = document.getElementById('admin-btn-new-exp');
        if (btnNewExp) {
            btnNewExp.addEventListener('click', () => showExpForm(null));
        }

        // Botón Cancelar Formulario Experiencia
        const btnCancelExp = document.getElementById('admin-btn-cancel-exp');
        if (btnCancelExp) {
            btnCancelExp.addEventListener('click', hideExpForm);
        }

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
                    // Actualizar existente
                    const idx = activeCvData.experiences.findIndex(item => item.id === expId);
                    if (idx >= 0) {
                        activeCvData.experiences[idx] = { id: expId, company, role, period, contract, desc };
                    }
                } else {
                    // Crear nuevo
                    const newId = generateId();
                    activeCvData.experiences.unshift({ id: newId, company, role, period, contract, desc });
                }

                saveCvData(activeCvData);
                hideExpForm();
                renderAdminExpList();
                showToast('Experiencia laboral guardada y reflejada en el CV.', 'success');
            });
        }

        // Live Preview de Foto de Perfil por URL
        const inputAvatarUrl = document.getElementById('admin-input-avatar-url');
        const previewAvatarImg = document.getElementById('admin-avatar-preview');
        const btnPreviewAvatar = document.getElementById('admin-btn-preview-avatar');
        const btnResetAvatar = document.getElementById('admin-btn-reset-avatar');

        if (inputAvatarUrl && previewAvatarImg) {
            const updatePreview = () => {
                const url = inputAvatarUrl.value.trim();
                if (url) {
                    previewAvatarImg.src = url;
                } else {
                    previewAvatarImg.src = DEFAULT_CV_DATA.personal.avatarUrl;
                }
            };

            inputAvatarUrl.addEventListener('input', updatePreview);
            inputAvatarUrl.addEventListener('change', updatePreview);

            previewAvatarImg.addEventListener('error', function () {
                this.src = DEFAULT_CV_DATA.personal.avatarUrl;
                showToast('No se pudo cargar la imagen desde la URL proporcionada. Se mantendrá la foto original.', 'danger');
            });

            if (btnPreviewAvatar) {
                btnPreviewAvatar.addEventListener('click', () => {
                    updatePreview();
                    showToast('Previsualización de foto actualizada.', 'info');
                });
            }

            if (btnResetAvatar) {
                btnResetAvatar.addEventListener('click', () => {
                    inputAvatarUrl.value = DEFAULT_CV_DATA.personal.avatarUrl;
                    previewAvatarImg.src = DEFAULT_CV_DATA.personal.avatarUrl;
                    showToast('Foto restablecida a la original del proyecto.', 'info');
                });
            }
        }

        // Botón Maestro: Guardar Cambios (Modal Footer)
        const btnSaveMaster = document.getElementById('admin-btn-save-master');
        if (btnSaveMaster) {
            btnSaveMaster.addEventListener('click', function () {
                if (!activeCvData) activeCvData = getCvData();

                const getVal = (id, def = '') => {
                    const el = document.getElementById(id);
                    return el ? el.value.trim() : def;
                };

                // 1. Recoger Datos Personales
                activeCvData.personal = {
                    fullname: getVal('admin-input-fullname', DEFAULT_CV_DATA.personal.fullname),
                    displayName: getVal('admin-input-displayname', DEFAULT_CV_DATA.personal.displayName),
                    jobTitle: getVal('admin-input-jobtitle', DEFAULT_CV_DATA.personal.jobTitle),
                    brandSubtitle: getVal('admin-input-brandtitle', DEFAULT_CV_DATA.personal.brandSubtitle),
                    bio: getVal('admin-input-bio', DEFAULT_CV_DATA.personal.bio),
                    email: getVal('admin-input-email', DEFAULT_CV_DATA.personal.email),
                    phone: getVal('admin-input-phone', DEFAULT_CV_DATA.personal.phone),
                    location: getVal('admin-input-location', DEFAULT_CV_DATA.personal.location),
                    portfolioUrl: getVal('admin-input-portfolio', DEFAULT_CV_DATA.personal.portfolioUrl),
                    linkedinUrl: getVal('admin-input-linkedin', DEFAULT_CV_DATA.personal.linkedinUrl),
                    githubUrl: getVal('admin-input-github', DEFAULT_CV_DATA.personal.githubUrl),
                    whatsappUrl: activeCvData.personal.whatsappUrl || DEFAULT_CV_DATA.personal.whatsappUrl,
                    avatarUrl: getVal('admin-input-avatar-url', DEFAULT_CV_DATA.personal.avatarUrl)
                };

                // 2. Recoger Educación
                const selEduStatus = document.getElementById('admin-select-edustatus');
                activeCvData.education = {
                    title: getVal('admin-input-edutitle', DEFAULT_CV_DATA.education.title),
                    institution: getVal('admin-input-eduinst', DEFAULT_CV_DATA.education.institution),
                    status: selEduStatus ? selEduStatus.value : 'studying',
                    date: getVal('admin-input-edudate', DEFAULT_CV_DATA.education.date)
                };

                // Guardar y aplicar en DOM
                saveCvData(activeCvData);

                // Feedback en modal
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
                this.value = ''; // Reset file input
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
            if (isCollapsed) {
                toolbar.classList.add('collapsed');
            }

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

                        <!-- MINI EDITOR RÁPIDO PLEGABLE -->
                        <div class="admin-cv-config-section mt-3 pt-3" style="border-top: 1px solid rgba(248, 92, 112, 0.25);">
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

            // Abrir Modal de Gestión Completo desde Toolbar
            const btnOpenModal = document.getElementById('admin-btn-open-cv-manager');
            if (btnOpenModal) {
                btnOpenModal.addEventListener('click', openCvManagerModal);
            }
            const btnOpenModalFromQuick = document.getElementById('admin-btn-open-modal-from-quick');
            if (btnOpenModalFromQuick) {
                btnOpenModalFromQuick.addEventListener('click', openCvManagerModal);
            }

            // Cambiar modo de vista
            document.getElementById('admin-btn-view-public').addEventListener('click', function () {
                applyViewMode('public');
                showToast('Modo de previsualización: Vista Pública', 'info');
            });

            document.getElementById('admin-btn-view-recruiter').addEventListener('click', function () {
                applyViewMode('recruiter');
                showToast('Modo de previsualización: Vista de Empresa', 'info');
            });

            // Copiar Enlace
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

            // Toggle Editor Rápido
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

            // Form Submit: Guardar Rápido
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

            // Logout
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
        // Aplicar datos dinámicos guardados en el DOM inmediatamente
        applyCvDataToDOM(getCvData());

        // Inicializar listeners del modal de administración
        initCvManagerModal();

        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        const tokenParam = urlParams.get('token');
        const adminParam = urlParams.get('admin');

        // Disparador vía URL ?admin=1 o ?admin=login
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

        // Atajos de teclado: Ctrl + Shift + A o Alt + A para Administrador
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

        // Trigger discreto: 3 clics rápidos en el avatar o nombre de marca
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
                    avatarTimer = setTimeout(() => {
                        avatarClicks = 0;
                    }, 1200);
                }
            });
        }

        // Form Login Administrador
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

        // Form Token Reclutador
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

        // Salir de modo reclutador desde el banner
        const btnExitRecruiter = document.getElementById('btn-exit-recruiter');
        if (btnExitRecruiter) {
            btnExitRecruiter.addEventListener('click', function () {
                sessionStorage.removeItem(STORAGE_KEYS.RECRUITER_SESSION);
                applyViewMode('public');
                showToast('Has cambiado a la Vista Pública.', 'info');
            });
        }

        // Triggers del Footer
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
    }

    // -------------------------------------------------------------------------
    // 11. Protección y Render Dinámico en resumen.html (CV Imprimible)
    // -------------------------------------------------------------------------
    function initResumePage() {
        // Aplicar datos dinámicos guardados en el DOM inmediatamente
        applyCvDataToDOM(getCvData());

        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get('token');
        const modeParam = urlParams.get('mode');

        const isAuthorized = isAdminLoggedIn() || 
                             isRecruiterAuthorized() || 
                             (modeParam === 'empresa' && tokenParam === getRecruiterToken());

        if (modeParam === 'empresa' && tokenParam === getRecruiterToken()) {
            sessionStorage.setItem(STORAGE_KEYS.RECRUITER_SESSION, 'true');
        }

        if (!isAuthorized) {
            const pages = document.querySelectorAll('.page');
            pages.forEach(p => p.style.display = 'none');
            const noPrint = document.querySelectorAll('.no-print');
            noPrint.forEach(np => np.style.display = 'none');

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
                        lockOverlay.remove();
                        pages.forEach(p => p.style.display = '');
                        noPrint.forEach(np => np.style.display = '');
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

    // Exponer API en window para interacción y pruebas
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
        applyCvDataToDOM: applyCvDataToDOM
    };

})();
