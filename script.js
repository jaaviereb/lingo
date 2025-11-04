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
    palabraObjetivo = (data.word || data[0] || "").toUpperCase();
    console.log("Palabra objetivo:", palabraObjetivo);
  } catch (error) {
    console.error("Error al obtener la palabra:", error);
  }
}

obtenerPalabra();

// === MAPA DE TECLAS PARA CAMBIAR COLORES ===
const mapaTeclas = {};
teclas.forEach((tecla) => {
  const letra = tecla.textContent.trim().toUpperCase();
  mapaTeclas[letra] = tecla;
});

// === FUNCIÓN PARA ACTUALIZAR COLOR DE UNA TECLA ===
function actualizarTecla(letra, estado) {
  const tecla = mapaTeclas[letra];
  if (!tecla) return;

  const colorActual = tecla.style.backgroundColor;
  if (colorActual === "rgb(106, 170, 100)") return;

  if (estado === "correcta") {
    tecla.style.backgroundColor = "#6aaa64";
    tecla.style.color = "#fff";
  } else if (estado === "posicionIncorrecta") {
    if (colorActual !== "rgb(204, 61, 61)") {
      tecla.style.backgroundColor = "#cfa03b";
      tecla.style.color = "#fff";
    }
  } else if (estado === "noExiste") {
    tecla.style.backgroundColor = "#cc3d3d";
    tecla.style.color = "#fff";
  }
}

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

// === FUNCIÓN PARA BORRAR LETRAS ===
function borrarLetra() {
  if (posicionActual > 0) {
    posicionActual--;
    const indice = filaActual * letrasPorPalabra + posicionActual;
    const celda = celdas[indice];
    if (!celda) return;

    celda.textContent = "";
    celda.style.backgroundColor = "";
    celda.style.color = "";
    palabraActual = palabraActual.slice(0, -1);
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
    const letra = letrasIntento[i];

    if (letra === letrasObjetivo[i]) {
      celda.style.backgroundColor = "#6aaa64";
      actualizarTecla(letra, "correcta");
    } else if (letrasObjetivo.includes(letra)) {
      celda.style.backgroundColor = "#cfa03b";
      actualizarTecla(letra, "posicionIncorrecta");
    } else {
      celda.style.backgroundColor = "#cc3d3d";
      actualizarTecla(letra, "noExiste");
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
  } else if (e.key === "Backspace") {
    borrarLetra();
  }
});

// === TECLADO EN PANTALLA ===
teclas.forEach((tecla) => {
  tecla.addEventListener("click", () => {
    const letra = tecla.textContent.trim();

    if (letra === "⌫") {
      borrarLetra();
    } else {
      escribirLetra(letra);
    }
  });
});
