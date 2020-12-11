var canvas = document.querySelector("#lienzo");

var ctx = canvas.getContext("2d");

var canvas2 = document.querySelector("#lienzoFichas");

var ctx2 = canvas.getContext("2d");





ctx.beginPath();
ctx.strokeRect(20, 20, 790, 460);
ctx.strokeRect(90, 90, 650, 320);
ctx.strokeRect(150, 150, 520, 200);

//linea adg
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(150, 150);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea beh
ctx.beginPath();
ctx.moveTo(20, 250);
ctx.lineTo(150, 250);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea cfi
ctx.beginPath();
ctx.moveTo(20, 480);
ctx.lineTo(150, 350);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea jkl
ctx.beginPath();
ctx.moveTo(410, 20);
ctx.lineTo(410, 150);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea mno
ctx.beginPath();
ctx.moveTo(410, 350);
ctx.lineTo(410, 480);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea psv
ctx.beginPath();
ctx.moveTo(670, 150);
ctx.lineTo(810, 20);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea qtx
ctx.beginPath();
ctx.moveTo(670, 250);
ctx.lineTo(810, 250);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();
//linea suy
ctx.beginPath();
ctx.moveTo(670, 350);
ctx.lineTo(810, 480);
ctx.lineWidth = 1;
ctx.strokeStyle="black";
ctx.stroke();


//Circulo a
ctx.beginPath();
ctx.arc(20, 20, 19, 0, 2 * Math.PI);
//Relleno
ctx.font='15px sans-serif';
ctx.fillText("A",20,20);
ctx.fillStyle="lightBlue";
ctx.fill();


//Contorno
ctx.strokeStyle= "purple";
ctx.lineWidth=3;
ctx.stroke();


//Circulo b
ctx.beginPath();
ctx.arc(20, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("B",20,250);


//Circulo c
ctx.beginPath();
ctx.arc(20, 480, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("C",20,480);

//Circulo d//
ctx.beginPath();
ctx.arc(90, 90, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("D",90,90);

//Circulo g//
ctx.beginPath();
ctx.arc(150, 150, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("G",150,150);
//Circulo e//
ctx.beginPath();
ctx.arc(90, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("E",90,250);
//Circulo f//
ctx.beginPath();
ctx.arc(90, 410, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("F",90,410);
//Circulo h//
ctx.beginPath();
ctx.arc(150, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("H",150,250);
//Circulo i//
ctx.beginPath();
ctx.arc(150, 350, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("I",150,350);
//Circulo J
ctx.beginPath();
ctx.arc(410, 20, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("J",410,20);
//Circulo K
ctx.beginPath();
ctx.arc(410, 90, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("K",410,90);
//Circulo L
ctx.beginPath();
ctx.arc(410, 150, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("L",410,150);
//Circulo M
ctx.beginPath();
ctx.arc(410, 350, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("M",410,350);
//Circulo N
ctx.beginPath();
ctx.arc(410, 410, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("N",410,410);
//Circulo O
ctx.beginPath();
ctx.arc(410, 480, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("O",410,480);
//Circulo P
ctx.beginPath();
ctx.arc(670, 150, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("P",670,150);
//Circulo Q
ctx.beginPath();
ctx.arc(670, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("Q",670,250);
//Circulo R
ctx.beginPath();
ctx.arc(670, 350, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("R",670,350); 
//Circulo S
ctx.beginPath();
ctx.arc(740, 90, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("S",740,90); 
//Circulo T
ctx.beginPath();
ctx.arc(740, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("T",740,250); 
//Circulo U
ctx.beginPath();
ctx.arc(740, 410, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("U",740,410); 

//Circulo V
ctx.beginPath();
ctx.arc(810, 20, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("V",810,20);
//Circulo X
ctx.beginPath();
ctx.arc(810, 250, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("X",810,250);

//Circulo Y
ctx.beginPath();
ctx.arc(810, 480, 19, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();
ctx.fillText("Y",810,480);


















