const contenedor: HTMLDivElement = document.querySelector("#contenedor");
const ampliarLienzo: HTMLCanvasElement = document.querySelector("#lienzo");
const btnAmpliar: HTMLButtonElement = document.querySelector("#btnAmpliar");

function ampliar() {

    contenedor.style.width = "100%";
    contenedor.style.height = "100vh";
    contenedor.style.margin = "0";

    ampliarLienzo.style.width = "100%";
    ampliarLienzo.style.height = "100vh";
    ampliarLienzo.style.backgroundSize = "cover";
    ampliarLienzo.style.backgroundRepeat = "No-repeat";


    btnAmpliar.innerHTML = "Reducir Canvas";
    btnAmpliar.style.position = "fixed";
    btnAmpliar.style.top = "10px";
    btnAmpliar.style.left = "10px";
    btnAmpliar.style.zIndex = "1";

    btnAmpliar.setAttribute("onClick", "reducir()");

}

function reducir() {

    contenedor.style.width = "1000px";
    contenedor.style.height = "500px";
    contenedor.style.margin = "5vh auto";

    ampliarLienzo.style.width = "1000px";
    ampliarLienzo.style.height = "500px";



    btnAmpliar.innerHTML = "Ampliar Canvas";
    btnAmpliar.style.position = "relative";
    btnAmpliar.style.top = "0";
    btnAmpliar.style.left = "0";
    btnAmpliar.style.zIndex = "0";

    btnAmpliar.setAttribute("onClick", "ampliar()");

}