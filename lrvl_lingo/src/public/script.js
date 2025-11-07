document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente");
  generarPalabra();
});

const teclas = document.querySelectorAll(".tecla");
const celdas = document.querySelectorAll(".celda");

let palabraObjetivo = "";
let filaActual = 0;
let posicionActual = 0;
let palabraActual = "";
const letrasPorPalabra = 5;
const totalFilas = 5;

// === OBTENER PALABRA DESDE LARAVEL (DOCKER) ===
async function generarPalabra() {
  console.log("Solicitando palabra aleatoria al backend Laravel...");
  try {
    const response = await fetch("/palabrasRandom");
    if (!response.ok) throw new Error("Error al obtener palabra desde Laravel");
    const palabra = await response.json();
    palabraObjetivo = palabra.diccionario.toUpperCase();
    console.log("Palabra objetivo recibida:", palabraObjetivo);
  } catch (error) {
    console.error("Error al generar palabra:", error);
  }
}

// === VERIFICAR SI EXISTE EN DICCIONARIO EXTERNO ===
async function verificarDiccionario(palabra) {
  try {
    const response = await fetch(`http://185.60.43.155:3000/api/check/${palabra}`);
    if (!response.ok) throw new Error("Error en la API de verificación");
    const data = await response.json();
    const existe = data.exists ?? data.existe ?? false;
    return existe;
  } catch (error) {
    console.error("Error al verificar palabra:", error);
    return false;
  }
}

// === MAPA DE TECLAS ===
const mapaTeclas = {};
teclas.forEach((tecla) => {
  const letra = tecla.textContent.trim().toUpperCase();
  mapaTeclas[letra] = tecla;
});

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

// === ESCRIBIR LETRA ===
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

// === BORRAR LETRA ===
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

// === COMPROBAR PALABRA ===
async function comprobarPalabra() {
  if (!palabraObjetivo) return;

  const existe = await verificarDiccionario(palabraActual);
  if (!existe) {
    alert("Esa palabra no existe en el diccionario.");

    for (let i = 0; i < letrasPorPalabra; i++) {
      const indice = filaActual * letrasPorPalabra + i;
      const celda = celdas[indice];
      celda.textContent = "";
      celda.style.backgroundColor = "";
      celda.style.color = "";
    }

    palabraActual = "";
    posicionActual = 0;
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
    // Sumar puntos al usuario autenticado
    await fetch('/score/sumar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      credentials: 'same-origin',
      body: JSON.stringify({})
    });

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

console.log("Script del juego inicializado correctamente");
