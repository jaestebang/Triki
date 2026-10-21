import { Player, Ficha } from './classes/Player';
import { GameState } from './classes/GameState';
import { BOXES, TRIKI_ARR } from './utility';
import { sonVecinos, getVecinos } from './vecinos';

// ─────────────────────────────────────────────
// 1. CONFIGURACIÓN HIGH-DPI (Retina / HDPI)
// ─────────────────────────────────────────────

function setupHiDPI(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const dpr = window.devicePixelRatio || 1;

    const cssW = canvas.clientWidth  || parseInt(canvas.getAttribute('width') || '1000',  10);
    const cssH = canvas.clientHeight || parseInt(canvas.getAttribute('height') || '500', 10);

    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(canvas.width / 1000, 0, 0, canvas.height / 500, 0, 0);
    return ctx;
}

// ─────────────────────────────────────────────
// 2. INICIALIZACIÓN
// ─────────────────────────────────────────────

const tableroCanvas = document.querySelector<HTMLCanvasElement>('#lienzo')!;
let ctx = setupHiDPI(tableroCanvas);

// Elementos del HUD HTML
const cardJ1         = document.querySelector<HTMLDivElement>('#card-j1');
const cardJ2         = document.querySelector<HTMLDivElement>('#card-j2');
const badgeJ1        = document.querySelector<HTMLDivElement>('#badge-j1');
const badgeJ2        = document.querySelector<HTMLDivElement>('#badge-j2');
const trikisJ1Elem   = document.querySelector<HTMLSpanElement>('#trikis-j1');
const trikisJ2Elem   = document.querySelector<HTMLSpanElement>('#trikis-j2');
const fichasJ1Elem   = document.querySelector<HTMLSpanElement>('#fichas-j1');
const fichasJ2Elem   = document.querySelector<HTMLSpanElement>('#fichas-j2');
const statusMessage  = document.querySelector<HTMLDivElement>('#status-message');
const btnReiniciar   = document.querySelector<HTMLButtonElement>('#btnReiniciar');
const btnAmpliar     = document.querySelector<HTMLButtonElement>('#btnAmpliar');
const gameTitle      = document.querySelector<HTMLHeadingElement>('.game-title');
const fullscreenPrompt = document.querySelector<HTMLDivElement>('#fullscreen-prompt');
const fullscreenPromptMessage = document.querySelector<HTMLParagraphElement>('#fullscreen-prompt-message');
const btnFullscreen = document.querySelector<HTMLButtonElement>('#btnFullscreen');

// Constantes
const LINEWIDTH   = 2;
const STROKESTYLE = '#1e293b';
const RADIUS      = 10;
const mobileLandscape = window.matchMedia('(pointer: coarse) and (orientation: landscape)');
const mobileBoardScale = (): number => mobileLandscape.matches ? 1.5 : 1;

// Estado
const state = new GameState();
let resultadoTimeout: number | undefined;

const ajustarPosicionesReserva = (): void => {
    if (state.arrastrar) return;

    [state.j1, state.j2].forEach(jugador => {
        jugador.fichasEnReserva.forEach(ficha => {
            ficha.x = mobileLandscape.matches ? 500 : 400 + ficha.id * 20;
            ficha.y = jugador.codigo === 1 ? 215 : 285;
            ficha.xi = ficha.x;
            ficha.yi = ficha.y;
        });
    });
};

// ─────────────────────────────────────────────
// 3. SINCRONIZACIÓN DE LA UI (HUD)
// ─────────────────────────────────────────────

const actualizarHUD = (): void => {
    if (!cardJ1 || !cardJ2 || !badgeJ1 || !badgeJ2 || !statusMessage) return;

    if (state.juegoTerminado && state.mostrarResultado) {
        if (state.esEmpate) {
            badgeJ1.textContent = '🤝 EMPATE';
            badgeJ2.textContent = '🤝 EMPATE';
            cardJ1.classList.remove('active');
            cardJ2.classList.remove('active');
        } else if (state.ganador?.codigo === 1) {
            badgeJ1.textContent = '🏆 GANADOR';
            badgeJ2.textContent = 'DERROTA';
            cardJ1.classList.add('active');
            cardJ2.classList.remove('active');
        } else {
            badgeJ2.textContent = '🏆 GANADOR';
            badgeJ1.textContent = 'DERROTA';
            cardJ2.classList.add('active');
            cardJ1.classList.remove('active');
        }
    } else if (!state.juegoTerminado) {
        const esJ1 = state.turnoActual === 1;

        if (esJ1) {
            cardJ1.classList.add('active');
            cardJ2.classList.remove('active');
            badgeJ1.textContent = state.modoEliminar ? 'ELIMINAR' : 'ACTIVO';
            badgeJ2.textContent = 'EN ESPERA';
        } else {
            cardJ2.classList.add('active');
            cardJ1.classList.remove('active');
            badgeJ2.textContent = state.modoEliminar ? 'ELIMINAR' : 'ACTIVO';
            badgeJ1.textContent = 'EN ESPERA';
        }
    }

    // Actualiza los contadores acumulados de trikis de cada jugador
    if (trikisJ1Elem) trikisJ1Elem.textContent = `${state.j1.totalTrikis}`;
    if (trikisJ2Elem) trikisJ2Elem.textContent = `${state.j2.totalTrikis}`;

    // Actualiza el número de fichas que cada jugador tiene en el tablero
    if (fichasJ1Elem) fichasJ1Elem.textContent = `${state.j1.fichasEnTablero.length}`;
    if (fichasJ2Elem) fichasJ2Elem.textContent = `${state.j2.fichasEnTablero.length}`;

    statusMessage.textContent = state.mensaje;
};

// ─────────────────────────────────────────────
// 4. FUNCIONES DE DIBUJO EN CANVAS (VISTA)
// ─────────────────────────────────────────────

/** Dibuja una ficha con diseño 3D vectorial en Canvas */
const drawFicha = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    colorJugador: 'verde' | 'amarillo',
    isMoving: boolean,
    isTargetable: boolean = false,
    scaleMultiplier: number = 1
): void => {
    c.save();

    const escala = mobileBoardScale() * scaleMultiplier;
    const r = (isMoving ? 13 : 11) * escala;

    // Sombra proyectada
    if (isMoving) {
        c.shadowColor = 'rgba(0, 0, 0, 0.5)';
        c.shadowBlur = 12 * escala;
        c.shadowOffsetX = 3 * escala;
        c.shadowOffsetY = 6 * escala;
    } else {
        c.shadowColor = 'rgba(0, 0, 0, 0.3)';
        c.shadowBlur = 4 * escala;
        c.shadowOffsetX = escala;
        c.shadowOffsetY = 2 * escala;
    }

    // Halo luminoso si la ficha está siendo arrastrada
    if (isMoving) {
        c.beginPath();
        c.arc(x, y, r + 4, 0, 2 * Math.PI);
        c.strokeStyle = (colorJugador === 'verde')
            ? 'rgba(74, 222, 128, 0.85)'
            : 'rgba(250, 204, 21, 0.85)';
        c.lineWidth = 3 * escala;
        c.stroke();
    }

    // Halo rojo discontinuo si es objetivo eliminable tras un Triki
    if (isTargetable) {
        c.beginPath();
        c.arc(x, y, r + 5, 0, 2 * Math.PI);
        c.strokeStyle = '#ef4444';
        c.lineWidth = 2.5 * escala;
        if (c.setLineDash) c.setLineDash([4 * escala, 3 * escala]);
        c.stroke();
        if (c.setLineDash) c.setLineDash([]);
    }

    // Gradiente radial 3D
    const grad = c.createRadialGradient(
        x - r * 0.35, y - r * 0.35, r * 0.1,
        x, y, r
    );

    if (colorJugador === 'verde') {
        // Jugador 1: Verde vibrante
        grad.addColorStop(0, '#86efac');
        grad.addColorStop(0.3, '#22c55e');
        grad.addColorStop(0.8, '#16a34a');
        grad.addColorStop(1, '#14532d');
    } else {
        // Jugador 2: Amarillo dorado
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.3, '#facc15');
        grad.addColorStop(0.8, '#eab308');
        grad.addColorStop(1, '#854d0e');
    }

    // Cuerpo de la ficha
    c.beginPath();
    c.arc(x, y, r, 0, 2 * Math.PI);
    c.fillStyle = grad;
    c.fill();

    // Borde exterior nítido
    c.lineWidth = 1.5 * escala;
    c.strokeStyle = (colorJugador === 'verde') ? '#14532d' : '#713f12';
    c.stroke();

    // Aro interior decorativo
    c.beginPath();
    c.arc(x, y, r * 0.55, 0, 2 * Math.PI);
    c.lineWidth = escala;
    c.strokeStyle = (colorJugador === 'verde')
        ? 'rgba(255, 255, 255, 0.45)'
        : 'rgba(255, 255, 255, 0.6)';
    c.stroke();

    c.restore();
};

/** Dibuja las casillas del tablero */
const drawCasillas = (): void => {
    const escala = mobileBoardScale();
    // Si se está arrastrando una ficha que ya está en el tablero,
    // identificamos sus casillas vecinas disponibles
    const origenFicha = state.fichaActiva?.c;
    const esFaseVecinos = (state.arrastrar && origenFicha && state.jugadorActivoArrastre?.todasFichasEnJuego);
    const vecinosValidos = esFaseVecinos ? getVecinos(origenFicha!) : [];

    BOXES.forEach(box => {
        const esDestinoVecino = esFaseVecinos && (vecinosValidos.indexOf(box.c) >= 0) && !box.b;

        ctx.beginPath();
        ctx.arc(box.x, box.y, RADIUS * escala, 0, 2 * Math.PI, false);

        ctx.lineWidth   = (esDestinoVecino ? 3 : 2.5) * escala;
        ctx.strokeStyle = esDestinoVecino ? '#22c55e' : STROKESTYLE;
        ctx.fillStyle   = esDestinoVecino ? '#dcfce7' : (box.b ? '#94a3b8' : '#e2e8f0');
        ctx.fill();
        ctx.stroke();

        // Si es casilla vecina válida, dibujamos halo luminoso
        if (esDestinoVecino) {
            ctx.beginPath();
            ctx.arc(box.x, box.y, (RADIUS + 4) * escala, 0, 2 * Math.PI, false);
            ctx.lineWidth = 2 * escala;
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.75)';
            ctx.stroke();
        }

        // Letra de la casilla para orientación
        ctx.fillStyle = esDestinoVecino ? '#15803d' : '#475569';
        ctx.font = `bold ${9 * escala}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(box.c, box.x, box.y);
    });
};

/** Dibuja las líneas internas conectoras (sin cruzar el área central) */
const drawLineas = (): void => {
    const draw = (x: number, y: number, fx: number, fy: number): void => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(fx, fy);
        ctx.lineWidth   = LINEWIDTH;
        ctx.strokeStyle = STROKESTYLE;
        ctx.stroke();
    };

    // 1. DIAGONALES (Conectan rectángulo exterior con intermedio e interior; NO cruzan el centro)
    draw(20,  10,  314, 158);  // Superior-izquierda: A -> D -> G
    draw(980, 10,  686, 158);  // Superior-derecha:   C -> F -> I
    draw(20,  490, 314, 342);  // Inferior-izquierda: V -> S -> P
    draw(980, 490, 686, 342);  // Inferior-derecha:   X -> U -> R

    // 2. EJES CENTRALES (Conectan rectángulo exterior con intermedio e interior; NO cruzan el centro)
    draw(500, 10,  500, 158);  // Vertical superior:    B -> E -> H
    draw(500, 490, 500, 342);  // Vertical inferior:    W -> T -> Q
    draw(20,  250, 314, 250);  // Horizontal izquierda: J -> K -> L
    draw(980, 250, 686, 250);  // Horizontal derecha:   O -> N -> M
};

/** Dibuja el tablero con rectángulos concéntricos y bordes exteriores de grosor uniforme */
const drawTablero = (): void => {
    ctx.save();

    // Bordes azules decorativos exteriores con GROSOR EXACTAMENTE IGUAL en los 4 lados (12px)
    const GROSOR_BORDE = 12;
    const fillStyle = ctx.createLinearGradient(0, 0, 1000, 500);
    fillStyle.addColorStop(0, '#0284c7');
    fillStyle.addColorStop(0.5, '#2563eb');
    fillStyle.addColorStop(1, '#4f46e5');
    ctx.fillStyle = fillStyle;

    // Los 4 bordes exteriores simétricos (mismo grosor de 12px en superior, inferior, laterales)
    ctx.fillRect(0, 0, 1000, GROSOR_BORDE);                     // Borde superior
    ctx.fillRect(0, 500 - GROSOR_BORDE, 1000, GROSOR_BORDE);   // Borde inferior
    ctx.fillRect(0, 0, GROSOR_BORDE, 500);                     // Borde lateral izquierdo
    ctx.fillRect(1000 - GROSOR_BORDE, 0, GROSOR_BORDE, 500);   // Borde lateral derecho

    // Líneas de los tres rectángulos concéntricos principales
    ctx.beginPath();
    ctx.lineWidth   = LINEWIDTH;
    ctx.strokeStyle = STROKESTYLE;

    ctx.strokeRect(20,  10,  960, 480);  // Rectángulo 1: Exterior
    ctx.strokeRect(167, 84,  666, 332);  // Rectángulo 2: Intermedio
    ctx.strokeRect(314, 158, 372, 184);  // Rectángulo 3: Interior

    // Relleno suave y limpio del rectángulo central (sin líneas que lo atraviesen)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(314, 158, 372, 184);

    ctx.restore();
};

/** Dibuja el badge de turno y marcadores de trikis en el propio canvas */
const drawTurnoCanvas = (): void => {
    ctx.save();

    // Si el juego terminó, dibuja la pantalla de fin de juego y proclamación de ganador
    if (state.juegoTerminado) {
        if (!state.mostrarResultado) {
            ctx.restore();
            return;
        }

        // Fondo oscuro translúcido
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 0, 1000, 500);

        // Cartel central de victoria
        const px = 220;
        const py = 120;
        const pw = 560;
        const ph = 260;

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(px, py, pw, ph, 16);
        else ctx.rect(px, py, pw, ph);
        ctx.fill();

        const colorBorde = state.ganador?.codigo === 1 ? '#22c55e' : (state.ganador?.codigo === 2 ? '#eab308' : '#38bdf8');
        ctx.strokeStyle = colorBorde;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Título
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏆 ¡FIN DE LA PARTIDA!', px + pw / 2, py + 45);

        // Proclamación del ganador
        const textoGanador = state.esEmpate
            ? '🤝 ¡EMPATE ENTRE AMBOS JUGADORES!'
            : `¡GANADOR: ${state.ganador?.nombre.toUpperCase()}!`;
        ctx.fillStyle = state.ganador?.codigo === 1 ? '#4ade80' : (state.ganador?.codigo === 2 ? '#facc15' : '#38bdf8');
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(textoGanador, px + pw / 2, py + 95);
        ctx.restore();
        return;
    }

    ctx.restore();
};

/** Dibuja todas las fichas de los dos jugadores */
const drawFichas = (j1: Player, j2: Player): void => {
    if (state.juegoTerminado) return;

    const rival = state.getJugadorRival();
    const jugadorEnTurno = state.getJugadorEnTurno();
    const esFichaVisible = (jugador: Player, ficha: Ficha): boolean => {
        if (ficha.c !== null || !mobileLandscape.matches) return true;
        return !state.modoEliminar
            && jugador === jugadorEnTurno
            && jugador.fichasEnReserva[0] === ficha;
    };

    // 1. Dibuja primero las fichas estáticas
    j1.fichas.forEach(f => {
        const esTarget = state.modoEliminar && (rival === j1) && (f.c !== null);
        if (!f.move && esFichaVisible(j1, f)) {
            drawFicha(ctx, f.x, f.y, 'verde', false, esTarget, f.c === null ? 0.65 : 1);
        }
    });
    j2.fichas.forEach(f => {
        const esTarget = state.modoEliminar && (rival === j2) && (f.c !== null);
        if (!f.move && esFichaVisible(j2, f)) {
            drawFicha(ctx, f.x, f.y, 'amarillo', false, esTarget, f.c === null ? 0.65 : 1);
        }
    });

    // 2. Dibuja al final la ficha en movimiento para que quede siempre encima
    j1.fichas.forEach(f => {
        if (f.move) drawFicha(ctx, f.x, f.y, 'verde', true);
    });
    j2.fichas.forEach(f => {
        if (f.move) drawFicha(ctx, f.x, f.y, 'amarillo', true);
    });
};

/** Dibuja las líneas que conectan los trikis ya conquistados y bloqueados */
const drawTrikisRealizados = (): void => {
    state.historialTrikis.forEach(t => {
        const c1 = BOXES.find(b => b.c === t.casillas[0]);
        const c3 = BOXES.find(b => b.c === t.casillas[2]);
        if (c1 && c3) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c3.x, c3.y);
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.strokeStyle = (t.jugadorCodigo === 1)
                ? 'rgba(34, 197, 94, 0.45)'
                : 'rgba(234, 179, 8, 0.45)';
            ctx.stroke();
            ctx.restore();
        }
    });
};

// ─────────────────────────────────────────────
// 4.5 SISTEMA DE EFECTOS VISUALES (EXPLOSIÓN DE FICHAS)
// ─────────────────────────────────────────────

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    decay: number;
    rot: number;
    vRot: number;
}

interface Shockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    color: string;
}

const particles: Particle[] = [];
const shockwaves: Shockwave[] = [];

/** Crea una animación de mini explosión / destrucción de ficha */
const crearExplosionFicha = (x: number, y: number, colorTipo: 'verde' | 'amarillo'): void => {
    // Paleta de fragmentos y chispas
    const paleta = (colorTipo === 'verde')
        ? ['#22c55e', '#4ade80', '#86efac', '#15803d', '#ffffff', '#bbf7d0']
        : ['#eab308', '#facc15', '#fef08a', '#ca8a04', '#ffffff', '#fef9c3'];

    // 1. Onda expansiva brillante
    shockwaves.push({
        x,
        y,
        radius: 6,
        maxRadius: 42,
        alpha: 1,
        color: (colorTipo === 'verde') ? '#4ade80' : '#facc15'
    });

    // 2. Fragmentos expulsados en todas direcciones (mini explosión)
    const CANTIDAD = 28;
    for (let i = 0; i < CANTIDAD; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidad = 2.0 + Math.random() * 4.8;
        const color = paleta[Math.floor(Math.random() * paleta.length)];

        particles.push({
            x,
            y,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad,
            size: 2.5 + Math.random() * 4,
            alpha: 1,
            color,
            decay: 0.022 + Math.random() * 0.028,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.25
        });
    }

    state.markDirty();
};

/** Actualiza y dibuja todas las partículas y ondas activas */
const updateAndDrawFX = (): void => {
    if (particles.length === 0 && shockwaves.length === 0) return;

    ctx.save();

    // 1. Dibujar ondas de choque
    for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 2.6;
        sw.alpha -= 0.05;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
            shockwaves.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // 2. Dibujar fragmentos de la ficha
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95; // Fricción suave
        p.vy *= 0.95;
        p.vy += 0.09; // Leve gravedad
        p.rot += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    }

    ctx.restore();

    // Si aún quedan efectos activos, solicita continuar animando
    if (particles.length > 0 || shockwaves.length > 0) {
        state.markDirty();
    }
};

/** Render principal */
const render = (): void => {
    ctx.clearRect(0, 0, 1000, 500);

    drawLineas();
    drawTablero();
    drawTrikisRealizados();
    drawCasillas();
    drawFichas(state.j1, state.j2);
    updateAndDrawFX();
    drawTurnoCanvas();
};

// ─────────────────────────────────────────────
// 5. GAME LOOP con requestAnimationFrame
// ─────────────────────────────────────────────

const gameLoop = (): void => {
    // Si hay partículas en animación, asegurar que se renderice cada frame
    if (particles.length > 0 || shockwaves.length > 0) {
        state.markDirty();
    }

    if (state.consumeDirty()) {
        render();
        actualizarHUD();
    }
    requestAnimationFrame(gameLoop);
};

// ─────────────────────────────────────────────
// 6. CONVERSIÓN DE COORDENADAS LIMPIA
// ─────────────────────────────────────────────

const toCanvasCoords = (
    canvas: HTMLCanvasElement,
    evt: MouseEvent | TouchEvent
): { x: number; y: number } => {
    evt.preventDefault();

    const rect   = canvas.getBoundingClientRect();
    const scaleX = 1000 / rect.width;
    const scaleY = 500  / rect.height;

    const clientX = (evt.type.includes('touch'))
        ? (<TouchEvent>evt).changedTouches[0].clientX
        : (<MouseEvent>evt).clientX;
    const clientY = (evt.type.includes('touch'))
        ? (<TouchEvent>evt).changedTouches[0].clientY
        : (<MouseEvent>evt).clientY;

    return {
        x: Math.round((clientX - rect.left) * scaleX),
        y: Math.round((clientY - rect.top)  * scaleY)
    };
};

// ─────────────────────────────────────────────
// 7. LÓGICA DE JUEGO (CONTROLADOR)
// ─────────────────────────────────────────────

/** 
 * Valida cuántos trikis nuevos completó el jugador en este movimiento.
 * REGLA: Si un triki ya ha sido realizado por cualquier jugador (J1 o J2)
 * en la partida, queda completamente inhabilitado y no puede volver a realizarse.
 */
const checkTriki = (j: Player): number => {
    let nuevosTrikis = 0;

    TRIKI_ARR.forEach(t => {
        // Si este triki ya fue realizado en la partida, queda bloqueado para ambos jugadores
        if (state.esTrikiYaRealizado(t.id)) {
            return;
        }

        let matches = 0;
        j.fichas.forEach(f => {
            if (f.c !== null && t.c.indexOf(f.c) >= 0) matches++;
        });

        if (matches === 3) {
            // Se registra en el jugador y a nivel global de la partida
            j.setTriki(t.id);
            state.registrarTrikiGlobal(t.id, t.c, j.codigo);
            nuevosTrikis++;
        }
    });

    return nuevosTrikis;
};

// ─────────────────────────────────────────────
// 8. EVENTOS DE MOUSE Y TOUCH
// ─────────────────────────────────────────────

/** Intenta eliminar una ficha del rival que ya haya jugado en el tablero */
const intentarEliminarFichaRival = (m: { x: number; y: number }): boolean => {
    if (!state.modoEliminar) return false;

    const rival = state.getJugadorRival();
    let fichaAEliminar: Ficha | null = null;
    let intentoFichaNoJugada = false;

    rival.fichas.forEach(f => {
        const dist = Math.hypot(m.x - f.x, m.y - f.y);
        if (dist <= 18 * mobileBoardScale()) {
            if (f.c !== null) {
                // Ficha válida: ya está en el tablero
                fichaAEliminar = f;
            } else {
                // Ficha inválida: aún no ha jugado (está en reserva)
                intentoFichaNoJugada = true;
            }
        }
    });

    if (fichaAEliminar) {
        const casilla = (fichaAEliminar as Ficha).c;
        const fx = (fichaAEliminar as Ficha).x;
        const fy = (fichaAEliminar as Ficha).y;

        // Dispara animación de mini explosión / destrucción
        crearExplosionFicha(fx, fy, rival.colorNombre);

        rival.deleteFicha((fichaAEliminar as Ficha).id);
        state.setCasillasVacias();
        state.eliminacionesPendientes--;

        // Regla: El juego finaliza cuando a un jugador le queden menos de 3 fichas
        const finalizo = state.verificarFinDeJuego();

        if (!finalizo) {
            const fichasRivalesEnTablero = rival.fichas.filter(f => f.c !== null).length;
            if (state.eliminacionesPendientes > 0 && fichasRivalesEnTablero > 0) {
                state.modoEliminar = true;
                state.mensaje = `💥 Ficha rival en casilla ${casilla} eliminada. Retira otra ficha (${state.eliminacionesPendientes} pendiente${state.eliminacionesPendientes === 1 ? '' : 's'}).`;
            } else {
                state.eliminacionesPendientes = 0;
                state.modoEliminar = false;
                state.mensaje = `💥 Ficha rival en casilla ${casilla} eliminada. Turno completado.`;
                state.cambiarTurno();
            }
        } else {
            if (resultadoTimeout !== undefined) {
                window.clearTimeout(resultadoTimeout);
            }
            resultadoTimeout = window.setTimeout(() => {
                resultadoTimeout = undefined;
                if (state.juegoTerminado) {
                    state.mostrarResultado = true;
                    state.markDirty();
                }
            }, 700);
        }

        state.markDirty();
        return true;
    }

    if (intentoFichaNoJugada) {
        state.mensaje = `⚠️ Solo puedes eliminar una ficha del rival que YA HAYA JUGADO (en el tablero).`;
        state.markDirty();
        return true;
    }

    return false;
};

/** mousedown / touchstart: inicio de arrastre respetando turnos */
const onDown = (e: MouseEvent | TouchEvent): void => {
    // Si la partida ya finalizó, bloquear interacción
    if (state.juegoTerminado) {
        state.mensaje = state.ganador
            ? `🏆 Partida finalizada. Ganador: ${state.ganador.nombre}. Haz clic en "Reiniciar Partida" para jugar otra vez.`
            : `🤝 Partida finalizada en empate. Haz clic en "Reiniciar Partida" para jugar otra vez.`;
        state.markDirty();
        return;
    }

    const m = toCanvasCoords(tableroCanvas, e);

    // Si está en modo de ELIMINAR rival tras un triki
    if (state.modoEliminar) {
        const elimino = intentarEliminarFichaRival(m);
        if (!elimino) {
            state.mensaje = `¡Triki activo! Selecciona una ficha rival que YA esté en el tablero.`;
            state.markDirty();
        }
        return;
    }

    const jugador = state.getJugadorEnTurno();
    const rival   = state.getJugadorRival();

    // 1. Verificamos si tocó una ficha del jugador activo
    let fichaSeleccionada: Ficha | null = null;
    jugador.fichas.forEach(f => {
        const dist = Math.hypot(m.x - f.x, m.y - f.y);
        const radioSeleccion = mobileLandscape.matches && f.c === null ? 16 : 16 * mobileBoardScale();
        if (dist <= radioSeleccion) {
            fichaSeleccionada = f;
        }
    });

    if (fichaSeleccionada) {
        if (fichaSeleccionada.c !== null && !jugador.todasFichasEnJuego) {
            state.mensaje = `${jugador.nombre}: Debes poner tus 9 fichas en juego antes de moverlas.`;
            state.markDirty();
            return;
        }

        state.arrastrar = true;
        state.fichaActiva = fichaSeleccionada;
        state.jugadorActivoArrastre = jugador;
        (fichaSeleccionada as Ficha).move = true;

        if (fichaSeleccionada.c !== null) {
            const vecinosList = getVecinos(fichaSeleccionada.c).join(' - ');
            state.mensaje = `${jugador.nombre}: Mueve desde ${fichaSeleccionada.c} a sus casillas vecinas [${vecinosList}]`;
        } else if (fichaSeleccionada.c === null) {
            state.mensaje = `${jugador.nombre}: Coloca tu ficha en cualquier casilla libre (${jugador.fichasEnReserva.length} restantes)`;
        } else {
            state.mensaje = `${jugador.nombre}: Arrastra la ficha a una casilla`;
        }

        state.markDirty();
        return;
    }

    // 2. Si intentó tocar una ficha del rival
    let fichaRival: Ficha | null = null;
    rival.fichas.forEach(f => {
        const dist = Math.hypot(m.x - f.x, m.y - f.y);
        const radioSeleccion = mobileLandscape.matches && f.c === null ? 16 : 16 * mobileBoardScale();
        if (dist <= radioSeleccion) {
            fichaRival = f;
        }
    });

    if (fichaRival) {
        state.mensaje = `⚠️ No es tu turno. Le corresponde a ${jugador.nombre}.`;
        state.markDirty();
    }
};

/** mousemove / touchmove: arrastrar la ficha */
const onMove = (e: MouseEvent | TouchEvent): void => {
    if (state.juegoTerminado || !state.arrastrar || !state.fichaActiva) return;

    const m = toCanvasCoords(tableroCanvas, e);
    state.fichaActiva.x = m.x;
    state.fichaActiva.y = m.y;

    state.markDirty();
};

/** mouseup / touchend: soltar ficha, validar casilla y alternar turno */
const onUp = (e: MouseEvent | TouchEvent): void => {
    if (state.juegoTerminado) return;
    if (!state.arrastrar || !state.fichaActiva || !state.jugadorActivoArrastre) {
        state.arrastrar = false;
        state.fichaActiva = null;
        state.jugadorActivoArrastre = null;
        return;
    }

    const ficha = state.fichaActiva;
    const jugador = state.jugadorActivoArrastre;

    // Buscar casilla disponible cercana dentro de tolerancia de 30 px
    let casillaDestino: typeof BOXES[0] | null = null;
    let minDist = 30 * mobileBoardScale();

    BOXES.forEach(c => {
        const d = Math.hypot(c.x - ficha.x, c.y - ficha.y);
        if (d < minDist) {
            // Válida si está vacía o si ya era la casilla de esta ficha
            if (!c.b || ficha.c === c.c) {
                minDist = d;
                casillaDestino = c;
            }
        }
    });

    if (casillaDestino) {
        const casillaOrigen = ficha.c;
        const todasEnJuego = jugador.todasFichasEnJuego;

        // Si la ficha fue soltada en la misma casilla donde ya estaba
        if (casillaOrigen !== null && casillaDestino.c === casillaOrigen) {
            ficha.x = casillaDestino.x;
            ficha.y = casillaDestino.y;
            ficha.move = false;
            state.fichaActiva = null;
            state.jugadorActivoArrastre = null;
            state.arrastrar = false;
            state.markDirty();
            return;
        }

        // REGLA: Cuando las fichas ya están todas en juego, SOLO se pueden mover a casillas vecinas
        // Ejemplo: Si la ficha está en D, solo puede moverse a A - G - K - E
        if (casillaOrigen !== null && todasEnJuego) {
            if (!sonVecinos(casillaOrigen, casillaDestino.c)) {
                // Movimiento no válido: vuelve a su casilla de origen
                ficha.x = ficha.xi;
                ficha.y = ficha.yi;
                const vecinosDisponibles = getVecinos(casillaOrigen).join(' - ');
                state.mensaje = `⚠️ Movimiento no válido. Desde ${casillaOrigen} solo puedes moverte a sus casillas vecinas: ${vecinosDisponibles}`;
                ficha.move = false;
                state.fichaActiva = null;
                state.jugadorActivoArrastre = null;
                state.arrastrar = false;
                state.markDirty();
                return;
            }
        }

        // Snap al centro exacto de la casilla
        ficha.x = casillaDestino.x;
        ficha.y = casillaDestino.y;
        ficha.xi = casillaDestino.x;
        ficha.yi = casillaDestino.y;
        ficha.c = casillaDestino.c;
        if (casillaOrigen === null) {
            jugador.registrarFichaColocada();
        }

        state.setCasillasVacias();

        // Validar si logró un Triki
        const nuevosTrikis = checkTriki(jugador);

        if (nuevosTrikis > 0) {
            const rival = state.getJugadorRival();
            const fichasJugadasRival = rival.fichas.filter(f => f.c !== null);
            state.eliminacionesPendientes = Math.min(nuevosTrikis, fichasJugadasRival.length);

            // Obtiene el último triki registrado
            const ultimoTriki = state.historialTrikis[state.historialTrikis.length - 1];
            const comboStr = ultimoTriki ? `[${ultimoTriki.casillas.join(' - ')}]` : '';

            if (state.eliminacionesPendientes > 0) {
                state.modoEliminar = true;
                const cantidad = state.eliminacionesPendientes;
                state.mensaje = `🎉 ¡SUPER TRIKI ${comboStr} de ${jugador.nombre}! Se formaron ${nuevosTrikis} triki${nuevosTrikis === 1 ? '' : 's'}. Retira ${cantidad} ficha${cantidad === 1 ? '' : 's'} rival${cantidad === 1 ? '' : 'es'} del tablero.`;
            } else {
                state.modoEliminar = false;
                state.mensaje = `🎉 ¡SUPER TRIKI ${comboStr} de ${jugador.nombre}! (${jugador.totalTrikis} triki${jugador.totalTrikis > 1 ? 's' : ''}). Combinación cerrada.`;
                state.cambiarTurno();
            }
        } else {
            // Pasa el turno al otro jugador
            state.cambiarTurno();
        }
    } else {
        // Regresa a su posición original si no cayó en casilla válida
        ficha.x = ficha.xi;
        ficha.y = ficha.yi;
        state.mensaje = `${jugador.nombre}: Casilla no válida u ocupada. Elige una casilla libre.`;
    }

    ficha.move = false;
    state.fichaActiva = null;
    state.jugadorActivoArrastre = null;
    state.arrastrar = false;

    state.markDirty();
};

/** dblclick: soporte adicional para eliminar con doble clic */
const onDblClick = (e: MouseEvent): void => {
    const m = toCanvasCoords(tableroCanvas, e);
    intentarEliminarFichaRival(m);
};

// ─────────────────────────────────────────────
// 9. CONTROLES DE LA INTERFAZ
// ─────────────────────────────────────────────

const reiniciarPartida = (): void => {
    if (resultadoTimeout !== undefined) {
        window.clearTimeout(resultadoTimeout);
        resultadoTimeout = undefined;
    }
    state.reiniciarJuego();
    actualizarHUD();
};

if (btnReiniciar) {
    btnReiniciar.addEventListener('click', reiniciarPartida);
}

let landscapeFullscreenAttempted = false;

const mostrarAvisoPantallaCompleta = (mensaje: string, ofrecerAccion: boolean): void => {
    if (!fullscreenPrompt || !fullscreenPromptMessage || !mobileLandscape.matches) return;

    fullscreenPromptMessage.textContent = mensaje;
    if (btnFullscreen) btnFullscreen.hidden = !ofrecerAccion;
    fullscreenPrompt.hidden = false;
    fullscreenPrompt.classList.add('is-visible');
};

const ocultarAvisoPantallaCompleta = (): void => {
    if (!fullscreenPrompt) return;

    fullscreenPrompt.hidden = true;
    fullscreenPrompt.classList.remove('is-visible');
};

const requestMobileFullscreen = (fromUserGesture: boolean = false): void => {
    if (!mobileLandscape.matches) {
        landscapeFullscreenAttempted = false;
        ocultarAvisoPantallaCompleta();
        return;
    }
    if (document.fullscreenElement || (!fromUserGesture && landscapeFullscreenAttempted)) return;

    landscapeFullscreenAttempted = true;
    if (!document.documentElement.requestFullscreen) {
        mostrarAvisoPantallaCompleta(
            'Para ocultar Safari, añade el juego a la pantalla de inicio desde el menú Compartir.',
            false
        );
        return;
    }

    document.documentElement.requestFullscreen().catch(() => {
        mostrarAvisoPantallaCompleta(
            'El navegador requiere un toque para ocultar sus barras.',
            true
        );
    });
};

if (gameTitle) {
    let ultimoToque = 0;

    gameTitle.addEventListener('click', () => {
        if (!window.matchMedia('(pointer: coarse)').matches) return;

        const ahora = Date.now();
        if (ahora - ultimoToque <= 400) {
            ultimoToque = 0;
            reiniciarPartida();
        } else {
            ultimoToque = ahora;
            requestMobileFullscreen(true);
        }
    });
}

if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => requestMobileFullscreen(true));
}

mobileLandscape.addEventListener('change', event => {
    ajustarPosicionesReserva();
    state.markDirty();

    if (event.matches) {
        requestMobileFullscreen();
    } else {
        landscapeFullscreenAttempted = false;
    }
});

if (mobileLandscape.matches) {
    requestMobileFullscreen();
}

document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('fullscreen-mode', Boolean(document.fullscreenElement));
    if (document.fullscreenElement) ocultarAvisoPantallaCompleta();
    state.markDirty();
});

if (btnAmpliar) {
    btnAmpliar.addEventListener('click', () => {
        const isFull = document.body.classList.toggle('fullscreen-mode');
        btnAmpliar.textContent = isFull ? '⛶ Reducir Canvas' : '⛶ Ampliar Canvas';
    });
}

const canvasResizeObserver = new ResizeObserver(() => {
    ajustarPosicionesReserva();
    ctx = setupHiDPI(tableroCanvas);
    state.markDirty();
});
canvasResizeObserver.observe(tableroCanvas);

// ─────────────────────────────────────────────
// 10. REGISTRO DE EVENTOS
// ─────────────────────────────────────────────

const opts: AddEventListenerOptions = { passive: false };

tableroCanvas.addEventListener('mousemove',  onMove,     opts);
tableroCanvas.addEventListener('touchmove',  onMove,     opts);
tableroCanvas.addEventListener('mouseup',    onUp,       opts);
tableroCanvas.addEventListener('touchend',   onUp,       opts);
tableroCanvas.addEventListener('mousedown',  onDown,     opts);
tableroCanvas.addEventListener('touchstart', onDown,     opts);
tableroCanvas.addEventListener('dblclick',   onDblClick);

// ─────────────────────────────────────────────
// ARRANQUE
// ─────────────────────────────────────────────

ajustarPosicionesReserva();
actualizarHUD();
gameLoop();
