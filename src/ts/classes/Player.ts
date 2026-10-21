import { SingletonIdPlayer } from './singleton-idplayer';

export interface Ficha {
    id: number;
    c: string | null;
    x: number;
    y: number;
    xi: number;
    yi: number;
    move: boolean;
}

/**
 * Clase Jugador
 */
export class Player {
    public codigo: number;
    public color: string;
    public colorNombre: 'verde' | 'amarillo';
    public nombre: string;

    public fichas: Ficha[] = [];
    public triki: number[] = [];
    private fichasColocadas = 0;

    public turno: boolean = false;

    constructor() {
        this.codigo = SingletonIdPlayer.getInstance().iterator;
        this.colorNombre = (this.codigo === 1) ? 'verde' : 'amarillo';
        this.color = (this.codigo === 1) ? '#22c55e' : '#eab308';
        this.nombre = (this.codigo === 1) ? 'Jugador 1 (Verde)' : 'Jugador 2 (Amarillo)';

        //Inicializa 9 fichas centradas
        let i = 1;
        while (i <= 9) {
            const lx = 400 + (i * 20);
            const ly = (this.codigo === 1) ? 215 : 285;

            const f: Ficha = {
                id: i,
                c: null,
                x: lx,
                y: ly,
                xi: lx,
                yi: ly,
                move: false
            };

            this.fichas.push(f);
            i++;
        }
    }

    /**
     * Elimina ficha por ID
     * @param {*} id Número identificador de ficha
     */
    deleteFicha(id: number): void {
        this.fichas = this.fichas.filter(f => f.id !== id);
    }

    /**
     * Asigna posición a una ficha
     * @param {*} id ID Ficha
     * @param {*} x Posición en X
     * @param {*} y Posición en Y
     */
    setPosicion(id: null, x: number, y: number) {
        var f = this.fichas.filter(f => f.id == id);
        f[0].x = x;
        f[0].y = y;
    }

    /**
     * Reestablece la posición en X - Y
     * @param {*} id ID Ficha
     */
    resetPosicion(id: number) {
        var f = this.fichas.filter(f => f.id == id);
        f[0].x = f[0].xi;
        f[0].y = f[0].yi;
    }

    /**
     * Reestablece movimiento
     */
    resetMove() {
        this.turno = false;
        this.fichas.forEach(f => {
            f.move = false;
        });
    }

    /**
     * Almacena Triki realizado si aún no fue registrado
     * @param {number} id ID Triki
     */
    setTriki(id: number): void {
        if (this.triki.indexOf(id) < 0) {
            this.triki.push(id);
        }
    }

    /**
     * Retorna el número de trikis acumulados por el jugador
     */
    get totalTrikis(): number {
        return this.triki.length;
    }

    /**
     * Fichas que aún no han sido introducidas al tablero (en reserva)
     */
    get fichasEnReserva(): Ficha[] {
        return this.fichas.filter(f => f.c === null);
    }

    /**
     * Fichas que ya se encuentran colocadas en alguna casilla del tablero
     */
    get fichasEnTablero(): Ficha[] {
        return this.fichas.filter(f => f.c !== null);
    }

    /**
     * Registra una ficha introducida al tablero, aunque luego sea eliminada.
     */
    registrarFichaColocada(): void {
        this.fichasColocadas++;
    }

    /**
     * Indica si todas las fichas del jugador ya han entrado al tablero (Fase de Movimiento)
     */
    get todasFichasEnJuego(): boolean {
        return this.fichasColocadas >= 9;
    }
}