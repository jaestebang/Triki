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
            this.fichas.push(i);
            i++;
        }
    }

    //Elimina fichas
    deleteFicha(i) {
        this.fichas.splice(this.fichas.indexOf(i), 1);
    }
}