/**
 * Clase Jugador
 */
class Jugador {
    fichas = [];
    color;

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

            var f = { id: i, x: lx, y: ly };

            this.fichas.push(f);
            i++;
        }
    }

    /**
     * Elimina ficha
     * @param {*} i Número de ficha
     */
    deleteFicha(i) {
        this.fichas.splice(this.fichas.indexOf(i), 1);
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
}