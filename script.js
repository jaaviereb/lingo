const teclas = document.querySelectorAll(".tecla");
const celdas = document.querySelectorAll(".celda");

let palabraObjetivo = "";
let filaActual = 0;
let posicionActual = 0;
let palabraActual = "";
const letrasPorPalabra = 5;
const totalFilas = 5;

// === OBTENER PALABRA DESDE API ===
async function obtenerPalabra() {
  try {
    const respuesta = await fetch("http://185.60.43.155:3000/api/word/1");
    const data = await respuesta.json();
    // Ajustar según formato real de la API:
    palabraObjetivo = (data.word || data[0] || "").toUpperCase();
    console.log("Palabra objetivo:", palabraObjetivo);
  } catch (error) {
    console.error("Error al obtener la palabra:", error);
  }
}

// Iniciar juego
obtenerPalabra();

// === FUNCIÓN PARA ESCRIBIR LETRAS ===
function escribirLetra(letra) {
  if (filaActual >= totalFilas) return;

  if (palabraActual.length < letrasPorPalabra) {
    const indice = filaActual * letrasPorPalabra + posicionActual;
    const celda = celdas[indice];
    if (!celda) return;

    celda.textContent = letra.toUpperCase();
    celda.style.backgroundColor = "#bfbfbf";
    celda.style.color = "#fff";

    palabraActual += letra.toUpperCase();
    posicionActual++;
  }

  if (palabraActual.length === letrasPorPalabra) {
    comprobarPalabra();
  }
}

// === FUNCIÓN PARA COMPROBAR LA PALABRA ===
function comprobarPalabra() {
  if (!palabraObjetivo) {
    console.warn("Palabra objetivo no cargada aún.");
    return;
  }

  const letrasObjetivo = palabraObjetivo.split("");
  const letrasIntento = palabraActual.split("");

  for (let i = 0; i < letrasPorPalabra; i++) {
  const indice = filaActual * letrasPorPalabra + i;
  const celda = celdas[indice];

  if (letrasIntento[i] === letrasObjetivo[i]) {
    celda.style.backgroundColor = "#6aaa64"; // verde
  } else if (letrasObjetivo.includes(letrasIntento[i])) {
    celda.style.backgroundColor = "#cfa03bff"; // amarillo
  } else {
    celda.style.backgroundColor = "#cc3d3d"; // rojo
  }

  celda.style.color = "#fff";
}


  if (palabraActual === palabraObjetivo) {
    setTimeout(() => alert("¡Correcto!"), 300);
    filaActual = totalFilas;
    return;
  }

  filaActual++;
  posicionActual = 0;
  palabraActual = "";

  if (filaActual >= totalFilas) {
    setTimeout(() => alert(`Fin del juego. La palabra era: ${palabraObjetivo}`), 300);
  }
}

// === TECLADO FÍSICO ===
document.addEventListener("keydown", (e) => {
  const letra = e.key.toUpperCase();
  if (/^[A-ZÑ]$/.test(letra)) {
    escribirLetra(letra);
  }
});

// === TECLADO EN PANTALLA ===
teclas.forEach((tecla) => {
  tecla.addEventListener("click", () => {
    const letra = tecla.textContent.trim();
    escribirLetra(letra);
  });
});
