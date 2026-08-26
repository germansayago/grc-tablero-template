/* ==========================================================================
   tablero.js — EL ÚNICO ARCHIVO QUE TENÉS QUE TOCAR.

   Acá va la lógica de TU tablero: cargar tus datos y dibujar tus gráficos.
   El diseño, los colores y el formato ya vienen resueltos por el design
   system (css/tokens.css + js/charts.js). Vos solo decís qué mostrar.

   Este ejemplo carga datos/ejemplo.json y arma cuatro gráficos. Usalo de
   molde: reemplazá el JSON por el tuyo y ajustá las llamadas a Grafico.crear.
   ========================================================================== */

// 1) Cargá tus datos. Deben ser datos YA AGREGADOS y publicables
//    (ver SECURITY.md). Nunca pongas acá una clave ni una fila por persona.
async function iniciar() {
  try {
    const respuesta = await fetch('datos/ejemplo.json');
    if (!respuesta.ok) { throw new Error('No pude cargar los datos (' + respuesta.status + ')'); }
    const datos = await respuesta.json();

    pintarFecha(datos.actualizado);
    pintarKpis(datos.kpis);

    // 2) Un gráfico de líneas con dos series (evolución en el tiempo).
    Grafico.crear('#g-evolucion', {
      tipo: 'lineas',
      titulo: 'Evolución mensual',
      etiquetas: datos.evolucion.meses,
      series: [
        { nombre: 'Iniciados', valores: datos.evolucion.iniciados },
        { nombre: 'Resueltos', valores: datos.evolucion.resueltos }
      ]
    });

    // 3) Barras: comparar categorías (forma simple, una serie).
    Grafico.crear('#g-areas', {
      tipo: 'barras',
      titulo: 'Trámites por área',
      datos: datos.porArea
    });

    // 4) Dona: composición / porcentajes.
    Grafico.crear('#g-canales', {
      tipo: 'dona',
      titulo: 'Trámites por canal',
      datos: datos.canales
    });

  } catch (error) {
    mostrarError(error.message);
  }
}

/* --- Ayudantes de presentación (podés dejarlos como están) --------------- */

function pintarFecha(fecha) {
  const el = document.getElementById('actualizado');
  if (el && fecha) { el.textContent = 'Datos actualizados al ' + fecha; }
}

function pintarKpis(kpis) {
  const cont = document.getElementById('indicadores');
  if (!cont || !kpis) { return; }
  cont.innerHTML = kpis.map(k => `
    <div class="kpi">
      <p class="etiqueta">${escapar(k.etiqueta)}</p>
      <p class="valor">${Grafico.formatearNumero(k.valor)}</p>
      <p class="detalle">${escapar(k.detalle || '')}</p>
    </div>`).join('');
}

function mostrarError(mensaje) {
  const main = document.querySelector('main .contenedor');
  if (main) {
    main.innerHTML = '<div class="error"><strong>No se pudo mostrar el tablero.</strong><br>'
      + escapar(mensaje) + '</div>';
  }
}

/* Evita que un texto de los datos rompa el HTML (buena práctica siempre). */
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

document.addEventListener('DOMContentLoaded', iniciar);
