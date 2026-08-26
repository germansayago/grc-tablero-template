/* ==========================================================================
   tablero.js — EL ÚNICO ARCHIVO QUE TENÉS QUE TOCAR.

   Acá va la lógica de TU tablero: cargar tus datos y mostrarlos. El diseño
   (colores, tipografía, botones, tarjetas) ya viene resuelto — usá las
   clases de css/componentes.css (ver guia-diseno.html para verlas todas).

   Todavía no hay una librería de gráficos elegida para la plantilla. Mientras
   tanto, para mostrar números podés usar tarjetas .kpi (ver guia-diseno.html)
   o una tabla. Si tu tablero necesita gráficos, avisá antes de sumar una
   librería por tu cuenta — se define en conjunto (ver AGENTS.md).
   ========================================================================== */

async function iniciar() {
  try {
    // 1) Cargá tus datos. Deben ser datos YA AGREGADOS y publicables
    //    (ver SECURITY.md). Nunca pongas acá una clave ni una fila por persona.
    //
    // const respuesta = await fetch('datos/tu-archivo.json');
    // if (!respuesta.ok) { throw new Error('No pude cargar los datos (' + respuesta.status + ')'); }
    // const datos = await respuesta.json();
    //
    // 2) Mostralos en el HTML (tarjetas .kpi, una tabla, lo que necesites).

  } catch (error) {
    mostrarError(mensajeDeError(error));
  }
}

/* --- Ayudantes de presentación (podés dejarlos como están) --------------- */

/* Si el archivo se abrió con doble clic (protocolo file://), fetch() no
   puede traer los datos y el error real es críptico. Acá lo cambiamos por
   uno que dice qué hacer. */
function mensajeDeError(error) {
  if (location.protocol === 'file:') {
    return 'Este archivo se abrió directo desde la carpeta (doble clic) y por eso no puede cargar los datos. '
      + 'Corré "python3 -m http.server" en esta carpeta y abrí http://localhost:8000 en el navegador '
      + '— ver README.md.';
  }
  return error.message;
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
