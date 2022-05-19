import { Player } from './classes/Player';
import { BOXES } from './Boxes';
import { TRIKI_ARR } from './Triki'

//Inicializa el lienzo de canvas
const tablerocanvas: HTMLCanvasElement = document.querySelector("#lienzo");
const fichascanvas: HTMLCanvasElement = document.querySelector("#lienzo");
const ctx: CanvasRenderingContext2D = tablerocanvas.getContext("2d");
const ctxFichas: CanvasRenderingContext2D = fichascanvas.getContext("2d");

//Constantes
const lineWidth = 2;
const strokeStyle = "black";
const radio = 10;

//Usuarios
var j1 = new Player(1); //Instanciamos Jugador 1
var j2 = new Player(2); //Instanciamos Jugador 2

//Imagen
const img: HTMLImageElement = document.querySelector("#boton");

//Arrastrar
let arrastrar = false;

/**
 * Dibuja las casillas del Triki
 */
const drawCasillas = () => {

    /**
     * Dibula las casillas
     * @param {*} x Posición inicial en X
     * @param {*} y Posición inicial en Y
     */
    let draw = (x, y) => {
        ctx.beginPath();

        //Círculos
        ctx.arc(x, y, radio, 0, (2 * Math.PI), false);
        //Relleno
        ctx.font = '15px sans-serif';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = strokeStyle;
        ctx.fillStyle = "lightgray";
        ctx.fill();
        ctx.stroke();
    }

    //Recorremos el array de casillas
    BOXES.forEach(c => {
        draw(c.x, c.y);
    });

}

/**
 * Dibuja las líneas dentro del tablero
 */
const drawLineas = () => {

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
const drawTablero = () => {
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
 * @param {*} jx Objeto de tipo jugador 1
 * @param {*} jy Objeto de tipo jugador 2
 */
const drawFichas = (jx, jy) => {
    ctxFichas.globalCompositeOperation = <GlobalCompositeOperation>'fichas';

    let jug = [];

    jug.push(jx);
    jug.push(jy);

    //Pinta primero las fichas que no está moviendo
    jug.forEach(j => {
        j.fichas.forEach(f => {
            if (!f.move) {
                if (j.codigo == 1) {
                    ctxFichas.drawImage(img, 250, 0, 250, 250, f.x, f.y, 20, 20);
                } else {
                    ctxFichas.drawImage(img, 0, 0, 250, 250, f.x, f.y, 20, 20);
                }
            }
        })
    });

    //Pinta al final la ficha que se está moviendo
    jug.forEach(j => {
        j.fichas.forEach(f => {
            if (f.move) {
                if (j.codigo == 1) {
                    ctxFichas.drawImage(img, 250, 0, 250, 250, f.x, f.y, 20, 20);
                } else {
                    ctxFichas.drawImage(img, 0, 0, 250, 250, f.x, f.y, 20, 20);
                }
            }
        })
    });

    ctxFichas.closePath();
}

/**
 * Dibuja CANVAS
 */
const draw = () => {
    ctx.globalCompositeOperation = <GlobalCompositeOperation>'triki';
    ctx.clearRect(0, 0, 1000, 500); // clear canvas

    //Ejecutamos el dibujo de canvas
    drawLineas();
    drawTablero();
    drawCasillas();

    //Dibuja fichas de jugadores
    drawFichas(j1, j2);
}

/**
 * Init
 */
const init = () => {

    //Dibuja
    draw();

    /**
     * Posición X - Y para el mouse
     * @param {*} canvas Canvas
     * @param {*} evt Evento
     * @param {boolean} Indica si restamos el radio
     */
    let oMousePos = (canvas, evt, ind = true) => {
        var ClientRect = canvas.getBoundingClientRect();
        return { //objeto
            x: Math.round(evt.clientX - ClientRect.left) - ((ind) ? 10 : 0),
            y: Math.round(evt.clientY - ClientRect.top) - ((ind) ? 10 : 0)
        }
    }

    /**
     * Actualiza la posición de una ficha si se acerca a la casilla
     * @param {*} j 
     * @param {*} f 
     */
    let setPosFicha = (j, f, m) => {
        j.setPosicion(f.id, m.x, m.y);
    }

    /**
     * Set posición ficha a casilla
     * @param {*} j Jugador
     * @param {*} f Ficha
     * @param {*} m Coordenadas X - Y
     */
    let setPosFichaCasilla = (j, f, m) => {

        //Recorremos el array de casillas
        BOXES.forEach(c => {
            if (!c.b && (Math.abs(c.x - m.x) <= 10 && Math.abs(c.y - m.y) <= 10)) {
                f.xi = c.x - 10;
                f.yi = c.y - 10;
                c.b = true;
                f.c = c.c;
            }
        });

        //Reiniciamos posición y asignamos casillas vacías
        j.resetPosicion(f.id);
        setCasillasVacias();
    }

    /**
     * Set casillas vacías
     */
    let setCasillasVacias = () => {

        //Recorremos casillas / Fichas
        BOXES.forEach(c => {
            c.b = false;

            j1.fichas.forEach(f => {
                if (f.c === c.c) c.b = true;
            });
            j2.fichas.forEach(f => {
                if (f.c === c.c) c.b = true;
            });
        })
    }

    /**
     * Valida si realizo un Triki
     * @param {*} j 
     */
    let triki = (j) => {
        let triki;

        TRIKI_ARR.forEach(t => {
            let tk = 0;
            j.fichas.forEach(f => {
                if (f.c != null) {
                    if (t.c.indexOf(f.c) >= 0) {
                        tk += 1;
                    }
                }
            });

            //Triki
            if (tk === 3 && j.triki.indexOf(t.id) < 0) {
                triki = t;
                return;
            }
        });

        //Asigna Triki a jugador y muestra en pantalla
        if (triki) {
            j.setTriki(triki.id);
            let strTriki;
            strTriki = "Jugador: " + j.codigo + "\n";
            strTriki = strTriki + "Triki: " + triki.id + "\n";
            strTriki = strTriki + "Casillas: " + triki.c + "\n";

            alert(strTriki);
            alert("Arrastra una ficha rival para eliminar del juego")
        }
        return triki;
    }

    //Función anónima evento MouseMove
    tablerocanvas.addEventListener('mousemove', (e) => {
        if (!arrastrar) {
            return;
        } else {

            //Obtiene posición mouse
            let m = oMousePos(tablerocanvas, e);

            //Mueve fichas
            j1.fichas.forEach(f => {
                if (f.move) setPosFicha(j1, f, m);
            });
            j2.fichas.forEach(f => {
                if (f.move) setPosFicha(j2, f, m);
            });
        }
        draw();
    });

    //Función anónima evento MouseUp
    tablerocanvas.addEventListener("mouseup", (e) => {
        if (arrastrar) arrastrar = false;

        //Obtiene posición mouse
        let m = oMousePos(tablerocanvas, e, false);

        //Resetea posición fichas en movimiento
        j1.fichas.forEach(f => {
            if (f.move)
                setPosFichaCasilla(j1, f, m);
        });
        j2.fichas.forEach(f => {
            if (f.move)
                setPosFichaCasilla(j2, f, m);
        });

        //Dibuja de nuevo los objetos de CANVAS
        draw();

        //Valida TRIKI
        triki(j1);
        triki(j2);
    });

    //Función anónima evento MouseDown
    tablerocanvas.addEventListener("mousedown", (e) => {
        arrastrar = true;
        j1.resetMove();
        j2.resetMove();

        //Obtiene posición mouse
        let m = oMousePos(tablerocanvas, e);

        //Obtiene posición fichas jugador 1
        j1.fichas.forEach(f => {
            if (Math.abs(m.x - f.x) < 10 && Math.abs(m.y - f.y) < 10) {
                j1.turno = true;
                f.move = true;
            }
        });

        //Obtiene posición fichas jugador 2
        j2.fichas.forEach(f => {
            if (Math.abs(m.x - f.x) < 10 && Math.abs(m.y - f.y) < 10) {
                j2.turno = true;
                f.move = true;
            }
        });
    });

    //Función anónima evento DblClick
    tablerocanvas.addEventListener("dblclick", (e) => {
        arrastrar = false;
        j1.resetMove();
        j2.resetMove();

        //Obtiene posición mouse
        let m = oMousePos(tablerocanvas, e);

        //Obtiene posición fichas jugador 1
        j1.fichas.forEach(f => {
            if (Math.abs(m.x - f.x) < 10 && Math.abs(m.y - f.y) < 10) {
                console.log(f.id);
                j1.deleteFicha(f.id);
            }
        });

        //Obtiene posición fichas jugador 2
        j2.fichas.forEach(f => {
            if (Math.abs(m.x - f.x) < 10 && Math.abs(m.y - f.y) < 10) {
                console.log(f.id);
                j2.deleteFicha(f.id)
            }
        });

        draw();
    });
}

//Inicializa
init();
