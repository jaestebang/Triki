//Inicializa el lienzo de canvas
var tablerocanvas = document.querySelector("#lienzo");
var ctx = tablerocanvas.getContext("2d");

//Constantes
const lineWidth = 2;
const strokeStyle = "black";
const radio = 10;


/**
 * Dibuja las casillas del Triki
 */
drawCasillas = () => {

    /**
     * Dibula las casillas
     * @param {*} x Posición inicial en X
     * @param {*} y Posición inicial en Y
     */
    let draw = (x, y) => {
        ctx.beginPath();

        //Círculos
        ctx.arc(x, y, radio, 0, 2 * Math.PI, 0);

        //Relleno
        ctx.font = '15px sans-serif';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = "lightgray";
        ctx.fill();
        ctx.stroke();
    }

    //Recorremos el array de casillas
    casillasArr.forEach(c => {
        draw(c.x, c.y);
    })

}

/**
 * Dibuja las líneas dentro del tablero
 */
drawLineas = () => {

    /**
     * Dibula las líneas
     * @param {*} x Posición inicial en X
     * @param {*} y Posición inicial en Y
     * @param {*} fx Posición final en X
     * @param {*} fy Posición final en Y
     */
    let draw = (x, y, fx, fy) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(fx, fy);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }

    //Diagonal primaria - secundaria
    draw(0, 0, 1000, 500);
    draw(0, 500, 1000, 0);

    //Vertical - Horizontal
    draw(500, 0, 500, 500);
    draw(0, 250, 1000, 250);
}

/**
 * Dibuja tablero del rectángulo
 */
drawTablero = () => {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    //Relleno
    var fillStyle = ctx.createLinearGradient(0, 0, 750, 375);
    fillStyle.addColorStop(0, "red");
    fillStyle.addColorStop(1, "blue");
    ctx.fillStyle = fillStyle;

    //Relleno bordes anteriores al tablero
    ctx.fillRect(0, 0, 1000, 10);
    ctx.fillRect(0, 0, 20, 500);
    ctx.fillRect(0, 490, 1000, 10);
    ctx.fillRect(980, 0, 20, 500);

    ctx.strokeRect(20, 10, 960, 480);   //Rectángulo principal
    ctx.strokeRect(167, 84, 666, 332);  //Rectángulo secundario
    ctx.strokeRect(314, 158, 372, 184); //Rectángulo terciario
    ctx.fillRect(314, 158, 372, 184);   //Rectángulo terciario (Relleno)
    ctx.stroke();


};

/**
 * Dibuja fichas para cada jugador
 * @param {*} j Objeto de tipo jugador
 */
drawFichas = (j) => {
    j.fichas.forEach(f => {
        //Aquí debemos pintar las fichas en Canvas
        console.log("Ficha", f);
    });
}

//Ejecutamos el dibujo de canvas
drawLineas();
drawTablero();
drawCasillas();

//Crea jugadores
let j1 = new Jugador(1); //Instanciamos Jugador 1
let j2 = new Jugador(2); //Instanciamos Jugador 2

//Dibuja fichas de jugador
drawFichas(j1);