/**
 * Casillas del tablero
 * @param {String} c Código de casilla
 * @param {Number} x Posición inicial en coordenada X
 * @param {Number} y Posición inicial en coordenada Y
 * @param {Boolean} b Indica si está ocupada
 */
export const BOXES = [{
    c: 'A',
    x: 20,
    y: 10,
    b: false
},
{
    c: 'B',
    x: 500,
    y: 10,
    b: false
},
{
    c: 'C',
    x: 980,
    y: 10,
    b: false
},
{
    c: 'D',
    x: 167,
    y: 84,
    b: false
},
{
    c: 'E',
    x: 500,
    y: 84,
    b: false
},
{
    c: 'F',
    x: 833,
    y: 84,
    b: false
},
{
    c: 'G',
    x: 314,
    y: 158,
    b: false
},
{
    c: 'H',
    x: 500,
    y: 158,
    b: false
},
{
    c: 'I',
    x: 686,
    y: 158,
    b: false
},
{
    c: 'J',
    x: 20,
    y: 250,
    b: false
},
{
    c: 'K',
    x: 167,
    y: 250,
    b: false
},
{
    c: 'L',
    x: 314,
    y: 250,
    b: false
},
{
    c: 'M',
    x: 686,
    y: 250,
    b: false
},
{
    c: 'N',
    x: 833,
    y: 250,
    b: false
},
{
    c: 'O',
    x: 980,
    y: 250,
    b: false
},
{
    c: 'P',
    x: 314,
    y: 342,
    b: false
},
{
    c: 'Q',
    x: 500,
    y: 342,
    b: false
},
{
    c: 'R',
    x: 686,
    y: 342,
    b: false
},
{
    c: 'S',
    x: 167,
    y: 416,
    b: false
},
{
    c: 'T',
    x: 500,
    y: 416,
    b: false
},
{
    c: 'U',
    x: 833,
    y: 416,
    b: false
},
{
    c: 'V',
    x: 20,
    y: 490,
    b: false
},
{
    c: 'W',
    x: 500,
    y: 490,
    b: false
},
{
    c: 'X',
    x: 980,
    y: 490,
    b: false
}];


/**
 * Triki del tablero
 * @param {Number} id Código de triki
 * @param {String} c Códigos de casillas
 */
 export const TRIKI_ARR = [{
    id: 1,
    c: ['A', 'B', 'C']
},
{
    Id: 2,
    c: ['A', 'D', 'G']
},
{
    Id: 3,
    c: ['A', 'J', 'V']
},
{
    Id: 4,
    c: ['B', 'E', 'H']
},
{
    Id: 5,
    c: ['C', 'F', 'I']
},
{
    Id: 6,
    c: ['C', 'O', 'X']
},
{
    id: 7,
    c: ['D', 'E', 'F']
},
{
    Id: 8,
    c: ['D', 'K', 'S']
},
{
    Id: 9,
    c: ['F', 'N', 'U']
},
{
    Id: 10,
    c: ['G', 'H', 'I']

},
{
    Id: 11,
    c: ['G', 'L', 'P']
},
{
    Id: 12,
    c: ['I', 'M', 'R']
},
{
    Id: 13,
    c: ['J', 'K', 'L']
},
{
    Id: 14,
    c: ['M', 'N', 'O']
},
{
    Id: 15,
    c: ['P', 'Q', 'R']

},
{
    Id: 16,
    c: ['P', 'S', 'V']
},
{
    Id: 17,
    c: ['S', 'T', 'U']
},
{
    Id: 18,
    c: ['V', 'W', 'X']
},
{
    Id: 19,
    c: ['Q', 'T', 'W']
},
{
    Id: 20,
    c: ['R', 'U', 'X']
}];