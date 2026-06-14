/**
 * IntegriSpace 2.0 - Core Script (Login, Registro con Usuario y Accesibilidad)
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // ---- ELEMENTOS DEL LOGIN ----
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorMsg = document.getElementById('loginErrorMsg');

    // ---- ELEMENTOS DEL REGISTRO ----
    const registerForm = document.getElementById('registerForm');
    const regNombre = document.getElementById('regNombre');
    const regApellido = document.getElementById('regApellido');
    const regUsername = document.getElementById('regUsername'); 
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');

    // ---- ELEMENTOS DE RECUPERACIÓN ----
    const recoverForm = document.getElementById('recoverForm');
    const recoverEmail = document.getElementById('recoverEmail');
    const recoverStatus = document.getElementById('recoverStatus');

    // ---- ACCESIBILIDAD E IDIOMAS ----
    const accessibilityBtn = document.getElementById('accessibilityBtn');
    const accessibilityMenu = document.getElementById('accessibilityMenu');
    const optLargeText = document.getElementById('optLargeText');
    const optContrast = document.getElementById('optContrast');
    const btnLangEs = document.getElementById('btnLangEs');
    const btnLangEn = document.getElementById('btnLangEn');

    // ==========================================================================
    // 📝 PROCESO DE REGISTRO REAL (Ahora guarda el Username)
    // ==========================================================================
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuarioNuevo = {
                nombre: regNombre.value.trim(),
                apellido: regApellido.value.trim(),
                username: regUsername.value.trim(), // Guarda el texto tal cual lo escribe el usuario
                email: regEmail.value.trim().toLowerCase(),
                password: regPassword.value
            };

            localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioNuevo));
            
            alert("¡Registro Exitoso! Ahora puedes iniciar sesión.");
            window.location.href = "index.html";
        });
    }

    // ==========================================================================
    // 🚀 VALIDACIÓN DE LOGIN REAL (¡CORREGIDO PARA IGNORAR MAYÚSCULAS!)
    // ==========================================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userInput = usernameInput.value.trim().toLowerCase();
            const passInput = passwordInput.value;
            const datosUsuario = localStorage.getItem('usuarioRegistrado');

            if (datosUsuario) {
                const usuario = JSON.parse(datosUsuario);
                
                // CORRECCIÓN CLAVE: Pasamos el correo Y el username guardado a minúsculas antes de comparar
                const coincideEmail = (userInput === usuario.email);
                const coincideUsername = (userInput === usuario.username.toLowerCase());

                if ((coincideEmail || coincideUsername) && passInput === usuario.password) {
                    // Guardamos la sesión usando su username original para el Dashboard
                    localStorage.setItem('sesionActiva', usuario.username);
                    window.location.href = "dashboard.html";
                    return;
                }
            }

            // Cuenta admin de respaldo por defecto
            if (userInput === "admin@ucv.edu.pe" || userInput === "admin") {
                if (passInput === "1234") {
                    localStorage.setItem('sesionActiva', "Idominguez");
                    window.location.href = "dashboard.html";
                    return;
                }
            }

            if (loginErrorMsg) {
                loginErrorMsg.style.display = "block";
            }
        });
    }

    // ==========================================================================
    // 📬 FLUJO REAL DE RECUPERACIÓN DE CONTRASEÑA
    // ==========================================================================
    if (recoverForm && recoverStatus) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = recoverEmail.value.trim().toLowerCase();
            const datosUsuario = localStorage.getItem('usuarioRegistrado');
            
            let usuarioExiste = false;

            if (datosUsuario) {
                const usuario = JSON.parse(datosUsuario);
                if (emailInput === usuario.email) {
                    usuarioExiste = true;
                }
            }

            if (emailInput === "admin@ucv.edu.pe") {
                usuarioExiste = true;
            }

            recoverStatus.className = "msg-status"; 
            recoverStatus.style.display = "block";

            if (usuarioExiste) {
                recoverStatus.classList.add("msg-success");
                recoverStatus.textContent = "El enlace de restauración ha sido enviado a tu correo institucional.";
                recoverEmail.value = ""; 
            } else {
                recoverStatus.classList.add("msg-error");
                recoverStatus.textContent = "El correo electrónico ingresado no se encuentra registrado.";
            }
        });
    }

    // ==========================================================================
    // 🔍 ACCESIBILIDAD Y TRADUCCIONES
    // ==========================================================================
    if (accessibilityBtn && accessibilityMenu) {
        accessibilityBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation(); 
            accessibilityMenu.classList.toggle('show');
        });
        accessibilityMenu.addEventListener('click', (e) => { e.stopPropagation(); });
        document.addEventListener('click', () => { accessibilityMenu.classList.remove('show'); });
    }

    if (optLargeText) {
        optLargeText.addEventListener('click', () => { document.body.classList.toggle('large-text'); });
    }
    if (optContrast) {
        optContrast.addEventListener('click', () => { document.body.classList.toggle('high-contrast'); });
    }

    function aplicarIdioma(lang) {
        if (lang === 'es') {
            if (btnLangEs) btnLangEs.classList.add('active');
            if (btnLangEn) btnLangEn.classList.remove('active');
        } else {
            if (btnLangEn) btnLangEn.classList.add('active');
            if (btnLangEs) btnLangEs.classList.remove('active');
        }
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });
        document.querySelectorAll('input[data-placeholder-en]').forEach(input => {
            input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
        });
    }

    if (btnLangEs && btnLangEn) {
        btnLangEs.addEventListener('click', () => aplicarIdioma('es'));
        btnLangEn.addEventListener('click', () => aplicarIdioma('en'));
    }
});