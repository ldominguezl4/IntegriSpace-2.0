/**
 * IntegriSpace 2.0 - Dashboard Clean Engine (Limpio para nuevos usuarios)
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // ---- 1. MANEJO DE LA FECHA REAL ----
    const lblCurrentDate = document.getElementById('lblCurrentDate');
    if (lblCurrentDate) {
        const hoy = new Date();
        const opcionesFecha = { day: 'numeric', month: 'short', year: 'numeric' };
        let fechaFormateada = hoy.toLocaleDateString('es-ES', opcionesFecha);
        fechaFormateada = fechaFormateada.replace('.', ''); 
        lblCurrentDate.textContent = fechaFormateada;
    }

    // ---- 2. SALUDO COMPLETAMENTE DINÁMICO ----
    const txtWelcome = document.getElementById('txtWelcome');
    const usuarioActivo = localStorage.getItem('sesionActiva');

    // Evaluamos quién ingresó para evitar que se quede fijo "Idominguez"
    if (txtWelcome) {
        if (usuarioActivo) {
            txtWelcome.textContent = `¡Hola, ${usuarioActivo}! 👋`;
        } else {
            txtWelcome.textContent = `¡Hola, Invitado! 👋`;
        }
    }

    // ---- 3. CONTROL DE HISTORIAL LIMPIO PARA NUEVO USUARIO ----
    let historialRutas = JSON.parse(localStorage.getItem('historialRutas'));

    // Si es la cuenta maestra o de desarrollo 'Idominguez' / 'admin', cargamos la demo
    if (usuarioActivo === "Idominguez" || usuarioActivo === "admin") {
        if (!historialRutas) {
            historialRutas = [
                { fecha: '11 Jun.', hora: '08:20 a. m.', distancia: 5.40, energia: 6800, nivel: 'Moderado' },
                { fecha: '11 Jun.', hora: '04:15 p. m.', distancia: 8.03, energia: 9947, nivel: 'Complejo' },
                { fecha: '12 Jun.', hora: '09:39 p. m.', distancia: 0.65, energia: 780, nivel: 'Moderado' }
            ];
            localStorage.setItem('historialRutas', JSON.stringify(historialRutas));
        }
    } else {
        // SI ES UN NUEVO USUARIO REGISTRADO: Empezará totalmente en blanco (limpio)
        if (!historialRutas || usuarioActivo !== "Idominguez") {
            historialRutas = []; // Vacío para que el nuevo usuario cree sus propias rutas
        }
    }

    // ---- 4. PROCESAMIENTO Y RENDER DE LÓGICA ----
    if (historialRutas.length > 0) {
        // Usuario con datos (Demo)
        let semanaDistanciaTotal = 0;
        let semanaEnergiaTotal = 0;

        historialRutas.forEach(ruta => {
            semanaDistanciaTotal += Number(ruta.distancia) || 0;
            semanaEnergiaTotal += Number(ruta.energia) || 0;
        });

        // Valores de Hoy (Último registro simulado)
        document.getElementById('lblTodayDist').textContent = "0.65";
        document.getElementById('lblTodayEnergy').textContent = "780";
        document.getElementById('lblTodayCalories').textContent = "186";
        document.getElementById('lblTodayLevel').textContent = "Moderado";

        // Valores Semanales Calculados
        document.getElementById('lblWeekRoutes').textContent = historialRutas.length;
        document.getElementById('lblWeekDist').textContent = `${semanaDistanciaTotal.toFixed(2)} km`;
        document.getElementById('lblWeekEnergy').textContent = `${semanaEnergiaTotal} J`;

        // Render de la tarjeta inferior
        const ultimaRuta = historialRutas[historialRutas.length - 1];
        document.getElementById('lblRecentRouteTime').textContent = `${ultimaRuta.fecha}, ${ultimaRuta.hora}`;
        document.getElementById('lblRecentRouteMeta').innerHTML = `${ultimaRuta.distancia} km · <span class="meta-highlight">${ultimaRuta.nivel}</span>`;
    } else {
        // NUEVO USUARIO: Todo se muestra inicialmente en 0 sin errores raros (NaN / undefined)
        document.getElementById('lblTodayDist').textContent = "0.00";
        document.getElementById('lblTodayEnergy').textContent = "0";
        document.getElementById('lblTodayCalories').textContent = "0";
        document.getElementById('lblTodayLevel').textContent = "N/A";

        document.getElementById('lblWeekRoutes').textContent = "0";
        document.getElementById('lblWeekDist').textContent = "0.00 km";
        document.getElementById('lblWeekEnergy').textContent = "0 J";

        document.getElementById('lblRecentRouteTime').textContent = "Sin rutas registradas";
        document.getElementById('lblRecentRouteMeta').textContent = "Empieza a evaluar para ver estadísticas.";
    }

    // ---- 5. INTERACCIÓN DEL BOTÓN DE NOTIFICACIONES ----
    const btnNotification = document.getElementById('btnNotification');
    const badgeNoti = document.getElementById('badgeNoti');

    if (btnNotification) {
        btnNotification.addEventListener('click', () => {
            alert("No tienes alertas ni notificaciones pendientes en este momento.");
            if (badgeNoti) {
                badgeNoti.style.display = 'none'; // Desaparece el punto rojo al leerlas
            }
        });
    }
});