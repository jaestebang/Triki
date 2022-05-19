import { SingletonIdPlayer } from './singleton-idplayer';

/**
 * Clase Jugador
 */
export class Player {
    public codigo: number;
    public color: string;

    public fichas = [];
    public triki = [];

    public turno: boolean = false;

    constructor() {
        this.codigo = SingletonIdPlayer.getInstance().iterator;;
        this.color = (this.codigo == 1) ? "red" : "blue";

        //Inicializa fichas
        let i = 1;
        while (i <= 9) {
            const lx = 400 + (i * 20);
            const ly = (this.codigo == 1) ? 220 : 250;

            /** Objeto de tipo ficha */
            const f = {
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
     * Elimina ficha
     * @param {*} i Número de ficha
     */
    deleteFicha(id: number): void {
        console.log(this.fichas);
        this.fichas.forEach(f => {
            if (f.id === id) this.fichas.splice(this.fichas.indexOf(f), 1);
        });

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
     * Almacena Triki realizado
     * @param {*} id ID Triki
     */
    setTriki(id: null) {
        this.triki.push(id);
    }
}