document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente");
  generarPalabra();
  iniciarTemporizador();
});

const teclas = document.querySelectorAll(".tecla");
const celdas = document.querySelectorAll(".celda");
const temporizadorEl = document.getElementById("temporizador");

let palabraObjetivo = "";
let filaActual = 0;
let posicionActual = 0;
let palabraActual = "";
const letrasPorPalabra = 5;
const totalFilas = 5;
let tiempoRestante = 30;
let intervaloTemporizador;

// === OBTENER PALABRA DESDE LARAVEL (DOCKER) ===
async function generarPalabra() {
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
    return data.exists ?? data.existe ?? false;
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

// === TEMPORIZADOR POR LÍNEA ===
function iniciarTemporizador() {
  clearInterval(intervaloTemporizador);
  tiempoRestante = 30;
  temporizadorEl.textContent = `Tiempo restante por fila: ${tiempoRestante}s`;

  intervaloTemporizador = setInterval(() => {
    tiempoRestante--;
    temporizadorEl.textContent = `Tiempo restante por fila: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(intervaloTemporizador);
      perderIntentoPorTiempo();
    }
  }, 1000);
}

function perderIntentoPorTiempo() {
  for (let i = 0; i < letrasPorPalabra; i++) {
    const indice = filaActual * letrasPorPalabra + i;
    const celda = celdas[indice];
    celda.style.backgroundColor = "#999";
    celda.style.color = "#fff";
  }
  filaActual++;
  posicionActual = 0;
  palabraActual = "";

  if (filaActual < totalFilas) {
    iniciarTemporizador();
  } else {
    setTimeout(() => alert(`Fin del juego. La palabra era: ${palabraObjetivo}`), 300);
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
    celda.textContent = "";
    celda.style.backgroundColor = "";
    celda.style.color = "";
    palabraActual = palabraActual.slice(0, -1);
  }
}

// === COMPROBAR PALABRA ===
// Se verifica si la palabra introducida existe en el diccionario.
// Luego se comparan letra por letra con la palabra objetivo para asignar colores
// (verde: correcta, amarillo: posición incorrecta, rojo: no existe).
// Si es correcta, se envía puntuación al backend mediante una llamada autenticada.
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

  clearInterval(intervaloTemporizador);

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

  // Si el jugador acierta, se notifica al backend para sumar puntuación (autenticado con token CSRF)
  if (palabraActual === palabraObjetivo) {
    await fetch("/score/sumar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
      },
      credentials: "same-origin",
      body: JSON.stringify({}),
    });

    setTimeout(() => alert("¡Correcto!"), 300);
    filaActual = totalFilas;
    return;
  }

  filaActual++;
  posicionActual = 0;
  palabraActual = "";

  if (filaActual < totalFilas) {
    iniciarTemporizador();
  } else {
    setTimeout(() => alert(`Fin del juego. La palabra era: ${palabraObjetivo}`), 300);
  }
}

// === TECLADO FÍSICO ===
// Captura la entrada del teclado físico: letras, borrar con Backspace.
document.addEventListener("keydown", (e) => {
  const letra = e.key.toUpperCase();
  if (/^[A-ZÑ]$/.test(letra)) {
    escribirLetra(letra);
  } else if (e.key === "Backspace") {
    borrarLetra();
  }
});

// === TECLADO EN PANTALLA ===
// Asocia clics del teclado virtual con las mismas funciones de escritura o borrado.
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
