const tabla = document.getElementById('tabla');
tabla.className = 'tabla-contenedor';

for (let i = 1; i <= 25; i++) {
  const celda = document.createElement('div');
  celda.className = 'celda';
  celda.textContent = i;
  tabla.appendChild(celda);
}


