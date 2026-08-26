/* ==========================================================================
   tablero.js — EL ÚNICO ARCHIVO QUE TENÉS QUE TOCAR.

   Acá va la lógica de TU tablero: cargar tus datos y mostrarlos. El diseño
   (colores, tipografía, botones, tarjetas) ya viene resuelto — usá las
   clases de css/componentes.css (ver guia-diseno.html para verlas todas).

   Cómo cargués tus datos es tu decisión (fetch a un JSON, un <script> con
   un objeto JS, lo que te convenga). Lo único no negociable es de dónde
   pueden venir esos datos: ver SECURITY.md antes de escribir nada acá.

   Todavía no hay una librería de gráficos elegida para la plantilla. Mientras
   tanto, para mostrar números podés usar tarjetas .kpi (ver guia-diseno.html)
   o una tabla. Si tu tablero necesita gráficos, avisá antes de sumar una
   librería por tu cuenta — se define en conjunto (ver AGENTS.md).
   ========================================================================== */

function iniciar() {
  try {
    // Tu lógica acá: cargá los datos y mostralos.

  } catch (error) {
    mostrarError(error.message);
  }
}

/* --- Ayudantes de presentación (podés dejarlos como están) --------------- */

function pintarKpis(kpis) {
  const cont = document.getElementById('indicadores');
  if (!cont || !kpis) { return; }
  cont.innerHTML = kpis.map(k => `
    <div class="kpi">
      <p class="etiqueta">${escapar(k.etiqueta)}</p>
      <p class="valor">${escapar(String(k.valor))}</p>
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
