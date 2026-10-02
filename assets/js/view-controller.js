/**
 * VIEW CONTROLLER (Control de Audiencia & Administración)
 * Proyecto: Christian Romero Portfolio & CV
 * 
 * Gestiona la segmentación entre Vista Pública y Vista Profesional (Empresas/Reclutadores),
 * el flujo de autenticación administrativa, la persistencia de acceso por token,
 * y la configuración dinámica de datos clave del CV en tiempo real con persistencia en localStorage.
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
        PROFILE_DATA: 'cv_profile_data'
    };

    // Datos por defecto del perfil profesional y académico
    const DEFAULT_PROFILE_DATA = {
        jobRole: 'Desarrollador de Software (Contrato de Aprendizaje)',
        jobCompany: 'Celerix SAS',
        jobPeriod: '2024 - Presente',
        jobDesc: 'Desarrollo y soporte en soluciones tecnológicas empresariales, automatización de procesos internos, desarrollo de módulos con Claris FileMaker e integración de datos y APIs.',
        eduTitle: 'Tecnólogo en Análisis y Desarrollo de Software',
        eduInstitution: 'SENA (Servicio Nacional de Aprendizaje)',
        eduStatus: 'studying', // 'studying' | 'graduated'
        eduDate: 'Enero de 2027'
    };

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

    // Gestión del Perfil Dinámico (localStorage)
    function getProfileData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
            if (raw) {
                return Object.assign({}, DEFAULT_PROFILE_DATA, JSON.parse(raw));
            }
        } catch (e) {
            console.warn('Error al leer cv_profile_data:', e);
        }
        return Object.assign({}, DEFAULT_PROFILE_DATA);
    }

    function saveProfileData(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(data));
            applyProfileDataToDOM(data);
            return true;
        } catch (e) {
            console.error('Error al guardar cv_profile_data:', e);
            return false;
        }
    }

    function applyProfileDataToDOM(data) {
        if (!data) data = getProfileData();

        // 1. Puesto Actual y Empresa
        const elJobRole = document.getElementById('display-job-role');
        if (elJobRole) elJobRole.textContent = data.jobRole;

        const elJobCompany = document.getElementById('display-job-company');
        if (elJobCompany) elJobCompany.textContent = data.jobCompany;

        const elJobPeriod = document.getElementById('display-job-period');
        if (elJobPeriod) elJobPeriod.textContent = data.jobPeriod;

        const elJobDesc = document.getElementById('display-job-desc');
        if (elJobDesc && data.jobDesc) elJobDesc.textContent = data.jobDesc;

        // 2. Carrera y Entidad Educativa
        const elEduTitle = document.getElementById('display-edu-title');
        if (elEduTitle) elEduTitle.textContent = data.eduTitle;

        const elEduInstitution = document.getElementById('display-edu-institution');
        if (elEduInstitution) elEduInstitution.textContent = data.eduInstitution;

        // 3. Switch de Estado Académico (Estudiando vs Graduado)
        const elStatusBadge = document.getElementById('display-edu-status-badge');
        const elEduDateText = document.getElementById('display-edu-date-text');
        const isGraduated = data.eduStatus === 'graduated';

        if (elStatusBadge) {
            if (isGraduated) {
                elStatusBadge.innerHTML = `<span class="badge badge-success px-2 py-1" style="font-size: 0.75rem; border-radius: 4px; background-color: #10b981;"><i class="ti-medall mr-1"></i> <span id="display-edu-status-text">Graduado en ${data.eduDate}</span></span>`;
            } else {
                elStatusBadge.innerHTML = `<span class="badge badge-danger px-2 py-1" style="font-size: 0.75rem; border-radius: 4px; background-color: #F85C70;"><i class="ti-book mr-1"></i> <span id="display-edu-status-text">En formación / Estudiante</span></span>`;
            }
        }

        if (elEduDateText) {
            elEduDateText.textContent = isGraduated 
                ? `Graduado: ${data.eduDate}` 
                : `Finalización estimada: ${data.eduDate}`;
        }

        // 4. Sincronización en resumen.html si está cargada
        const resumeRole = document.getElementById('cv-resume-job-role');
        if (resumeRole) resumeRole.textContent = data.jobRole;
        const resumeCompany = document.getElementById('cv-resume-job-company');
        if (resumeCompany) resumeCompany.textContent = data.jobCompany;
        const resumePeriod = document.getElementById('cv-resume-job-period');
        if (resumePeriod) resumePeriod.textContent = data.jobPeriod;
        const resumeEduTitle = document.getElementById('cv-resume-edu-title');
        if (resumeEduTitle) resumeEduTitle.textContent = data.eduTitle;
        const resumeEduStatus = document.getElementById('cv-resume-edu-status');
        if (resumeEduStatus) {
            resumeEduStatus.textContent = isGraduated
                ? `Graduado en ${data.eduDate}`
                : `En formación / Estudiante (Finalización estimada: ${data.eduDate})`;
        }
    }

    // -------------------------------------------------------------------------
    // 3. Notificaciones Flotantes (Toasts)
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
    // 4. Aplicación de Modo de Vista
    // -------------------------------------------------------------------------
    function applyViewMode(mode) {
        document.body.classList.remove('mode-public', 'mode-recruiter');
        document.body.classList.add(`mode-${mode}`);

        // Manejo del Banner de Reclutador
        const banner = document.getElementById('recruiter-mode-banner');
        if (banner) {
            if (mode === 'recruiter') {
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        }

        // Si es reclutador, sincronizar enlaces de descarga/resumen para incluir el token
        const resumeLinks = document.querySelectorAll('a[href*="resumen.html"]');
        resumeLinks.forEach(link => {
            const currentToken = getRecruiterToken();
            link.href = `resumen.html?mode=empresa&token=${encodeURIComponent(currentToken)}`;
        });

        // Actualizar botones de la barra de administración si está presente
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

        // Si el admin está activo, recordar su preferencia de previsualización
        if (isAdminLoggedIn()) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_PREVIEW, mode);
        }

        // Refrescar GSAP ScrollTrigger si está cargado
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }
    }

    // -------------------------------------------------------------------------
    // 5. Panel Flotante de Administrador (UI & Comportamiento)
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

            const profileData = getProfileData();

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

                        <!-- SECCIÓN DE CONFIGURACIÓN DINÁMICA DEL CV (CHRIZDEV07) -->
                        <div class="admin-cv-config-section mt-3 pt-3" style="border-top: 1px solid rgba(248, 92, 112, 0.25);">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="admin-section-label mb-0" style="color: #F85C70; font-weight: 700;">
                                    <i class="ti-settings mr-1"></i> Configuración Dinámica CV
                                </span>
                                <button id="admin-editor-toggle-btn" class="admin-btn-icon" title="Plegar/Desplegar Editor" type="button">
                                    <i class="ti-angle-down" id="admin-editor-chevron"></i>
                                </button>
                            </div>

                            <div id="admin-editor-panel" class="admin-editor-panel">
                                <form id="admin-cv-editor-form">
                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-input-job-role">Puesto / Rol Actual</label>
                                        <input type="text" id="admin-input-job-role" class="admin-ctrl-input" value="${profileData.jobRole}" placeholder="Desarrollador de Software">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-input-job-company">Empresa Actual</label>
                                        <input type="text" id="admin-input-job-company" class="admin-ctrl-input" value="${profileData.jobCompany}" placeholder="Celerix SAS">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-input-job-period">Periodo de Experiencia</label>
                                        <input type="text" id="admin-input-job-period" class="admin-ctrl-input" value="${profileData.jobPeriod}" placeholder="2024 - Presente">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-input-edu-title">Carrera / Título</label>
                                        <input type="text" id="admin-input-edu-title" class="admin-ctrl-input" value="${profileData.eduTitle}" placeholder="Tecnólogo en Análisis y Desarrollo de Software">
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-select-edu-status">Estado Académico</label>
                                        <select id="admin-select-edu-status" class="admin-ctrl-select">
                                            <option value="studying" ${profileData.eduStatus === 'studying' ? 'selected' : ''}>En formación / Estudiante</option>
                                            <option value="graduated" ${profileData.eduStatus === 'graduated' ? 'selected' : ''}>Graduado</option>
                                        </select>
                                    </div>

                                    <div class="admin-form-group mb-2">
                                        <label class="admin-form-label" for="admin-input-edu-date">Fecha Finalización / Graduación</label>
                                        <input type="text" id="admin-input-edu-date" class="admin-ctrl-input" value="${profileData.eduDate}" placeholder="Enero de 2027">
                                    </div>

                                    <div class="d-flex align-items-center mt-3 pt-1" style="gap: 8px;">
                                        <button type="submit" id="admin-btn-save-cv" class="admin-btn-save-cv flex-fill" title="Guardar cambios y actualizar en vivo">
                                            <i class="ti-save mr-1"></i> Guardar Cambios
                                        </button>
                                        <button type="button" id="admin-btn-reset-cv" class="admin-btn-reset-cv" title="Restablecer valores originales">
                                            <i class="ti-reload"></i>
                                        </button>
                                    </div>
                                    <div id="admin-editor-feedback" class="admin-editor-feedback mt-2" style="display: none;"></div>
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

            // Toggle Editor Panel
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

            // Form Submit: Guardar Cambios Dinámicos
            const formEditor = document.getElementById('admin-cv-editor-form');
            if (formEditor) {
                formEditor.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const updated = {
                        jobRole: document.getElementById('admin-input-job-role').value.trim() || DEFAULT_PROFILE_DATA.jobRole,
                        jobCompany: document.getElementById('admin-input-job-company').value.trim() || DEFAULT_PROFILE_DATA.jobCompany,
                        jobPeriod: document.getElementById('admin-input-job-period').value.trim() || DEFAULT_PROFILE_DATA.jobPeriod,
                        jobDesc: DEFAULT_PROFILE_DATA.jobDesc,
                        eduTitle: document.getElementById('admin-input-edu-title').value.trim() || DEFAULT_PROFILE_DATA.eduTitle,
                        eduInstitution: DEFAULT_PROFILE_DATA.eduInstitution,
                        eduStatus: document.getElementById('admin-select-edu-status').value,
                        eduDate: document.getElementById('admin-input-edu-date').value.trim() || DEFAULT_PROFILE_DATA.eduDate
                    };

                    saveProfileData(updated);

                    const feedback = document.getElementById('admin-editor-feedback');
                    if (feedback) {
                        feedback.innerHTML = '<i class="ti-check mr-1"></i> ¡Cambios guardados y reflejados en el CV!';
                        feedback.style.display = 'block';
                        setTimeout(() => {
                            feedback.style.display = 'none';
                        }, 3000);
                    }
                    showToast('Perfil del CV actualizado y guardado en tiempo real.', 'success');
                });
            }

            // Reset Button: Restablecer Valores por Defecto
            const btnReset = document.getElementById('admin-btn-reset-cv');
            if (btnReset) {
                btnReset.addEventListener('click', function () {
                    saveProfileData(DEFAULT_PROFILE_DATA);
                    document.getElementById('admin-input-job-role').value = DEFAULT_PROFILE_DATA.jobRole;
                    document.getElementById('admin-input-job-company').value = DEFAULT_PROFILE_DATA.jobCompany;
                    document.getElementById('admin-input-job-period').value = DEFAULT_PROFILE_DATA.jobPeriod;
                    document.getElementById('admin-input-edu-title').value = DEFAULT_PROFILE_DATA.eduTitle;
                    document.getElementById('admin-select-edu-status').value = DEFAULT_PROFILE_DATA.eduStatus;
                    document.getElementById('admin-input-edu-date').value = DEFAULT_PROFILE_DATA.eduDate;

                    const feedback = document.getElementById('admin-editor-feedback');
                    if (feedback) {
                        feedback.innerHTML = '<i class="ti-reload mr-1"></i> Valores restablecidos por defecto.';
                        feedback.style.display = 'block';
                        setTimeout(() => {
                            feedback.style.display = 'none';
                        }, 3000);
                    }
                    showToast('Valores del CV restablecidos por defecto.', 'info');
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
    // 6. Autenticación de Administrador (Login / Logout)
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

        // Si tampoco es reclutador por token, regresar a vista pública
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
    // 7. Inicialización en index.html
    // -------------------------------------------------------------------------
    function initIndexPage() {
        // Aplicar datos dinámicos guardados en el DOM inmediatamente
        applyProfileDataToDOM(getProfileData());

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
            // Administrador ya autenticado
            renderAdminToolbar();
            activeMode = localStorage.getItem(STORAGE_KEYS.ADMIN_PREVIEW) || 'recruiter';
        } else if (modeParam === 'empresa') {
            // Intento de acceso mediante parámetro URL
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
            // Reclutador con sesión activa en este navegador
            activeMode = 'recruiter';
        } else {
            // Público general por defecto
            activeMode = 'public';
        }

        applyViewMode(activeMode);

        // Atajos de teclado: Ctrl + Shift + A o Alt + A para Administrador
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
                (e.altKey && (e.key === 'A' || e.key === 'a'))) {
                e.preventDefault();
                if (isAdminLoggedIn()) {
                    showToast('Ya has iniciado sesión como administrador.', 'info');
                    const tb = document.getElementById('admin-toolbar');
                    if (tb) tb.classList.remove('collapsed');
                } else {
                    openAdminModal();
                }
            }
        });

        // Trigger discreto: 3 clics rápidos en el avatar de la marca de la navbar
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
                        showToast('Modo Administrador ChrizDev activo.', 'info');
                    }
                } else {
                    avatarTimer = setTimeout(() => {
                        avatarClicks = 0;
                    }, 1200);
                }
            });
        }

        // Eventos de los Modales y Formularios
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

        // Salir de modo reclutador desde el banner
        const btnExitRecruiter = document.getElementById('btn-exit-recruiter');
        if (btnExitRecruiter) {
            btnExitRecruiter.addEventListener('click', function () {
                sessionStorage.removeItem(STORAGE_KEYS.RECRUITER_SESSION);
                applyViewMode('public');
                showToast('Has cambiado a la Vista Pública.', 'info');
            });
        }

        // Disparador del Footer para Administrador
        const footerAdminTrigger = document.getElementById('admin-login-trigger');
        if (footerAdminTrigger) {
            footerAdminTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (isAdminLoggedIn()) {
                    showToast('Sesión de administrador activa.', 'info');
                } else {
                    openAdminModal();
                }
            });
        }

        // Disparador del Footer para Reclutadores
        const footerRecruiterTrigger = document.getElementById('recruiter-access-trigger');
        if (footerRecruiterTrigger) {
            footerRecruiterTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                openRecruiterModal();
            });
        }
    }

    // -------------------------------------------------------------------------
    // 8. Protección de la Página de CV (resumen.html)
    // -------------------------------------------------------------------------
    function initResumePage() {
        // Aplicar datos dinámicos guardados en el DOM inmediatamente
        applyProfileDataToDOM(getProfileData());

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
            // Ocultar contenido del CV y mostrar pantalla de bloqueo
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
    // 9. Ejecución Automática según la Página
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
        getShareUrl: getRecruiterShareUrl,
        getProfileData: getProfileData,
        saveProfileData: saveProfileData,
        applyProfileDataToDOM: applyProfileDataToDOM
    };

})();
