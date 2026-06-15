/**
 * IntegriSpace 2.0 - Core Script (Login, Registro, Accesibilidad e Idioma Global)
 */

// ==========================================================================
// 🌍 MOTOR DE TRADUCCIÓN GLOBAL MULTIPÁGINA
// ==========================================================================
function aplicarIdioma(lang) {
    if (!lang) return;

    // Traducir cualquier texto con atributos data-en / data-es en la página actual
    document.querySelectorAll('[data-en], [data-es]').forEach(el => {
        const textoTraducido = el.getAttribute(`data-${lang}`);
        if (textoTraducido) {
            el.textContent = textoTraducido;
        }
    });

    // Traducir placeholders de los inputs de forma masiva
    document.querySelectorAll('input').forEach(input => {
        const placeholderTraducido = input.getAttribute(`data-placeholder-${lang}`);
        if (placeholderTraducido) {
            input.placeholder = placeholderTraducido;
        }
    });

    // Actualizar visualmente el estado de los botones selector si existen en esta pantalla
    const btnLangEs = document.getElementById('btnLangEs');
    const btnLangEn = document.getElementById('btnLangEn');
    if (btnLangEs) btnLangEs.classList.toggle('active', lang === 'es');
    if (btnLangEn) btnLangEn.classList.toggle('active', lang === 'en');
}

// 🛡️ INYECTOR INMEDIATO DE ACCESIBILIDAD (Evita parpadeos visuales al cargar)
if (localStorage.getItem('access_large_text') === 'true') document.body.classList.add('large-text');
if (localStorage.getItem('access_high_contrast') === 'true') document.body.classList.add('high-contrast');

// DISPARADOR CONFIGURADO: Se ejecuta cuando la estructura de la página actual esté 100% construida
document.addEventListener('DOMContentLoaded', () => {
    
    // Leer qué idioma prefiere el usuario y traducirlo en pantalla de inmediato
    const idiomaGlobal = localStorage.getItem('app_lang') || 'es';
    aplicarIdioma(idiomaGlobal);

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

    // DICCIONARIO PARA ANUNCIOS Y ERRORES DEL SISTEMA
    const mensajesSistema = {
        es: {
            registroExitoso: "¡Registro Exitoso! Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
            loginIncorrecto: "Usuario o contraseña incorrectos.",
            recuperarExito: "El enlace de restauración ha sido enviado a tu correo institucional.",
            recuperarError: "El correo electrónico ingresado no se encuentra registrado."
        },
        en: {
            registroExitoso: "Successful Registration! Your account has been successfully created. Now you can log in.",
            loginIncorrecto: "Incorrect username or password.",
            recuperarExito: "The restoration link has been sent to your institutional email.",
            recuperarError: "The email address entered is not registered."
        }
    };

    // Sincronizar el color de fondo de las opciones del menú de accesibilidad si existen en la página activa
    function sincronizarEstilosMenu() {
        if (optLargeText) {
            optLargeText.style.background = localStorage.getItem('access_large_text') === 'true' ? '#263756' : 'none';
        }
        if (optContrast) {
            optContrast.style.background = localStorage.getItem('access_high_contrast') === 'true' ? '#263756' : 'none';
        }
    }
    sincronizarEstilosMenu();

    // ==========================================================================
    // 📝 PROCESO DE REGISTRO REAL
    // ==========================================================================
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuarioNuevo = {
                nombre: regNombre.value.trim(),
                apellido: regApellido.value.trim(),
                username: regUsername.value.trim(), 
                email: regEmail.value.trim().toLowerCase(),
                password: regPassword.value
            };

            localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioNuevo));
            
            const langActual = localStorage.getItem('app_lang') || 'es';
            alert(mensajesSistema[langActual].registroExitoso);
            
            window.location.href = "index.html";
        });
    }

    // ==========================================================================
    // 🚀 VALIDACIÓN DE LOGIN
    // ==========================================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userInput = usernameInput.value.trim().toLowerCase();
            const passInput = passwordInput.value;
            const datosUsuario = localStorage.getItem('usuarioRegistrado');

            if (datosUsuario) {
                const usuario = JSON.parse(datosUsuario);
                if ((userInput === usuario.email || userInput === usuario.username.toLowerCase()) && passInput === usuario.password) {
                    localStorage.setItem('sesionActiva', usuario.username);
                    window.location.href = "dashboard.html"; 
                    return;
                }
            }

            if (userInput === "admin@ucv.edu.pe" || userInput === "admin") {
                if (passInput === "1234") {
                    localStorage.setItem('sesionActiva', "Idominguez");
                    window.location.href = "dashboard.html";
                    return;
                }
            }

            if (loginErrorMsg) {
                const langActual = localStorage.getItem('app_lang') || 'es';
                loginErrorMsg.textContent = mensajesSistema[langActual].loginIncorrecto;
                loginErrorMsg.style.display = "block";
            }
        });
    }

    // ==========================================================================
    // 📬 FLUJO DE RECUPERACIÓN DE CONTRASEÑA
    // ==========================================================================
    if (recoverForm && recoverStatus) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = recoverEmail.value.trim().toLowerCase();
            const datosUsuario = localStorage.getItem('usuarioRegistrado');
            let usuarioExiste = false;

            if (datosUsuario) {
                const usuario = JSON.parse(datosUsuario);
                if (emailInput === usuario.email) usuarioExiste = true;
            }
            if (emailInput === "admin@ucv.edu.pe") usuarioExiste = true;

            recoverStatus.className = "msg-status"; 
            recoverStatus.style.display = "block";

            const langActual = localStorage.getItem('app_lang') || 'es';

            if (usuarioExiste) {
                recoverStatus.classList.add("msg-success");
                recoverStatus.textContent = mensajesSistema[langActual].recuperarExito;
                recoverEmail.value = ""; 
            } else {
                recoverStatus.classList.add("msg-error");
                recoverStatus.textContent = mensajesSistema[langActual].recuperarError;
            }
        });
    }

    // ==========================================================================
    // 🔍 ACCESIBILIDAD INTERACTIVA (Menús Desplegables)
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
        optLargeText.addEventListener('click', () => { 
            const estado = document.body.classList.toggle('large-text');
            localStorage.setItem('access_large_text', estado);
            sincronizarEstilosMenu();
        });
    }
    if (optContrast) {
        optContrast.addEventListener('click', () => { 
            const estado = document.body.classList.toggle('high-contrast');
            localStorage.setItem('access_high_contrast', estado);
            sincronizarEstilosMenu();
        });
    }

    // Controladores de eventos para cambiar el idioma de forma manual haciendo clic
    if (btnLangEs) {
        btnLangEs.addEventListener('click', () => {
            localStorage.setItem('app_lang', 'es');
            aplicarIdioma('es');
        });
    }
    if (btnLangEn) {
        btnLangEn.addEventListener('click', () => {
            localStorage.setItem('app_lang', 'en');
            aplicarIdioma('en');
        });
    }
});