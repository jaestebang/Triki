import { Player, Ficha } from './Player';
import { SingletonIdPlayer } from './singleton-idplayer';
import { BOXES } from '../utility';

/**
 * Clase GameState: Centraliza el estado del juego (Modelo).
 * Controla turnos, jugadores, modo de eliminación y estado del tablero.
 */
export class GameState {

    public j1: Player;
    public j2: Player;

    /** Jugador actual con el turno: 1 (Verde) o 2 (Amarillo) */
    public turnoActual: number = 1;

    /** Indica si se acaba de completar un Triki y se debe eliminar una ficha rival */
    public modoEliminar: boolean = false;

    /** Cantidad de fichas rivales que faltan por eliminar por los trikis completados */
    public eliminacionesPendientes: number = 0;

    /** Ficha que está siendo arrastrada */
    public fichaActiva: Ficha | null = null;
    public jugadorActivoArrastre: Player | null = null;

    /** Mensaje de estado para la interfaz */
    public mensaje: string = 'Turno del Jugador 1 (Verde): Arrastra una ficha verde';

    /** Lista global de IDs de trikis ya realizados en toda la partida por cualquier jugador */
    public trikisRealizadosGlobal: number[] = [];

    /** Historial de trikis realizados con el jugador que lo logró */
    public historialTrikis: { id: number; casillas: string[]; jugadorCodigo: number }[] = [];

    /** Indica si el juego ha finalizado */
    public juegoTerminado: boolean = false;

    /** Indica si ya se debe mostrar el panel final al jugador */
    public mostrarResultado: boolean = false;

    /** Jugador ganador de la partida (null si fue empate o sigue activa) */
    public ganador: Player | null = null;

    /** Indica si la partida terminó en empate */
    public esEmpate: boolean = false;

    /** Flag para el game loop: true cuando hay que redibujar */
    public needsRedraw: boolean = true;

    constructor() {
        this.reiniciarJuego();
    }

    /**
     * Reinicia la partida completa
     */
    reiniciarJuego(): void {
        SingletonIdPlayer.reset();
        this.j1 = new Player();
        this.j2 = new Player();
        this.turnoActual = 1;
        this.modoEliminar = false;
        this.eliminacionesPendientes = 0;
        this.fichaActiva = null;
        this.jugadorActivoArrastre = null;
        this.trikisRealizadosGlobal = [];
        this.historialTrikis = [];
        this.juegoTerminado = false;
        this.mostrarResultado = false;
        this.ganador = null;
        this.esEmpate = false;
        this.mensaje = 'Turno del Jugador 1 (Verde): Arrastra una ficha verde';

        // Restablece casillas
        BOXES.forEach(c => { c.b = false; });
        this.markDirty();
    }

    /**
     * Comprueba si el juego ha finalizado:
     * El juego termina cuando a un jugador le queden menos de 3 fichas.
     * Gana quién haya realizado más trikis (o le queden más fichas).
     */
    verificarFinDeJuego(): boolean {
        if (this.j1.fichas.length < 3 || this.j2.fichas.length < 3) {
            this.juegoTerminado = true;
            this.mostrarResultado = false;
            this.modoEliminar = false;
            this.eliminacionesPendientes = 0;

            // Determinar ganador por mayor número de trikis
            if (this.j1.totalTrikis > this.j2.totalTrikis) {
                this.ganador = this.j1;
                this.esEmpate = false;
                this.mensaje = `🏆 ¡FIN DEL JUEGO! ${this.j1.nombre} gana la partida con ${this.j1.totalTrikis} trikis (${this.j1.fichas.length} fichas restantes).`;
            } else if (this.j2.totalTrikis > this.j1.totalTrikis) {
                this.ganador = this.j2;
                this.esEmpate = false;
                this.mensaje = `🏆 ¡FIN DEL JUEGO! ${this.j2.nombre} gana la partida con ${this.j2.totalTrikis} trikis (${this.j2.fichas.length} fichas restantes).`;
            } else {
                // En caso de empate en trikis, desempata quien tenga más fichas
                if (this.j1.fichas.length > this.j2.fichas.length) {
                    this.ganador = this.j1;
                    this.esEmpate = false;
                    this.mensaje = `🏆 ¡FIN DEL JUEGO! ${this.j1.nombre} gana por mayor cantidad de fichas en el tablero (${this.j1.fichas.length} vs ${this.j2.fichas.length}).`;
                } else if (this.j2.fichas.length > this.j1.fichas.length) {
                    this.ganador = this.j2;
                    this.esEmpate = false;
                    this.mensaje = `🏆 ¡FIN DEL JUEGO! ${this.j2.nombre} gana por mayor cantidad de fichas en el tablero (${this.j2.fichas.length} vs ${this.j1.fichas.length}).`;
                } else {
                    this.ganador = null;
                    this.esEmpate = true;
                    this.mensaje = `🤝 ¡FIN DEL JUEGO! Empate con ${this.j1.totalTrikis} trikis y ${this.j1.fichas.length} fichas cada uno.`;
                }
            }

            this.markDirty();
            return true;
        }

        return false;
    }

    /**
     * Verifica si un triki ya fue realizado en la partida por cualquier jugador
     */
    esTrikiYaRealizado(id: number): boolean {
        return this.trikisRealizadosGlobal.indexOf(id) >= 0;
    }

    /**
     * Registra un triki completado como quemado/usado a nivel global
     */
    registrarTrikiGlobal(id: number, casillas: string[], jugadorCodigo: number): void {
        if (!this.esTrikiYaRealizado(id)) {
            this.trikisRealizadosGlobal.push(id);
            this.historialTrikis.push({ id, casillas, jugadorCodigo });
        }
    }

    /**
     * Obtiene el jugador que tiene el ACTIVO
     */
    getJugadorEnTurno(): Player {
        return (this.turnoActual === 1) ? this.j1 : this.j2;
    }

    /**
     * Obtiene el jugador rival al ACTIVO
     */
    getJugadorRival(): Player {
        return (this.turnoActual === 1) ? this.j2 : this.j1;
    }

    /**
     * Alterna el turno entre Jugador 1 y Jugador 2
     */
    cambiarTurno(): void {
        this.turnoActual = (this.turnoActual === 1) ? 2 : 1;
        const nombreTurno = (this.turnoActual === 1) ? 'Jugador 1 (Verde)' : 'Jugador 2 (Amarillo)';
        this.mensaje = `Turno de ${nombreTurno}: Arrastra una ficha`;
        this.markDirty();
    }

    /**
     * Recalcula qué casillas están ocupadas comparando
     * las fichas de ambos jugadores.
     */
    setCasillasVacias(): void {
        BOXES.forEach(c => {
            c.b = false;
            this.j1.fichas.forEach(f => { if (f.c === c.c) c.b = true; });
            this.j2.fichas.forEach(f => { if (f.c === c.c) c.b = true; });
        });
    }

    /** Marca el estado como necesitado de redibujado */
    markDirty(): void {
        this.needsRedraw = true;
    }

    /** Consume el flag de redibujado */
    consumeDirty(): boolean {
        if (this.needsRedraw) {
            this.needsRedraw = false;
            return true;
        }
        return false;
    }
}
