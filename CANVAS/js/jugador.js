/**
 * Clase Jugador
 */
class Jugador {
    fichas = [];
    color;
    turno = false;

    /**
     * Consturcot
     * @param {*} id ID Jugador
     */
    constructor(codigo) {
        this.codigo = codigo;
        this.color = (codigo == 1) ? "red" : "blue";

        //Inicializa fichas
        let i = 1;
        while (i <= 9) {
            let lx = 400 + (i * 20);
            let ly = (codigo == 1) ? 220 : 250;

            /** Objeto de tipo ficha */
            var f = {
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
    deleteFicha(id) {
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
    setPosicion(id, x, y) {
        var f = this.fichas.filter(f => f.id == id);
        f[0].x = x;
        f[0].y = y;
    }

    /**
     * Reestablece la posición en X - Y
     * @param {*} id ID Ficha
     */
    resetPosicion(id) {
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
}