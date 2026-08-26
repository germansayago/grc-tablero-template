/* ==========================================================================
   charts.js — Helper de gráficos del design system.

   Envuelve a Chart.js (vendor/chart.umd.js) en una función simple, Grafico.crear,
   que YA le aplica la paleta y la tipografía del tablero. Vos pasás los datos;
   los colores salen siempre de las variables --serie-1..8 de tokens.css, así
   todos los tableros se ven igual y respetan el modo claro/oscuro.

   Regla: en los tableros se usa SIEMPRE Grafico.crear, nunca `new Chart(...)`
   directo. Así ningún gráfico se sale del diseño.

   USO (desde tablero.js):

     Grafico.crear('#mi-panel', {
       tipo: 'barras',                 // 'barras' | 'lineas' | 'dona' | 'area'
       datos: [                        // forma simple: una serie
         { etiqueta: 'Enero',   valor: 120 },
         { etiqueta: 'Febrero', valor: 98  }
       ]
     });

     // Varias series (para 'lineas', 'barras' o 'area'):
     Grafico.crear('#otro-panel', {
       tipo: 'lineas',
       etiquetas: ['Ene', 'Feb', 'Mar'],
       series: [
         { nombre: 'Iniciados', valores: [120, 98, 140] },
         { nombre: 'Resueltos', valores: [80, 90, 110] }
       ]
     });

   Para un caso avanzado podés pasar `opciones: {...}` y se fusiona con las
   opciones de Chart.js. Usalo poco: rompe la uniformidad si te vas de tema.
   ========================================================================== */

const Grafico = (function () {
  const nf = new Intl.NumberFormat('es-AR');

  /* --- Utilidades de tema ------------------------------------------------- */

  function leerVar(nombre, porDefecto) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
    return v || porDefecto;
  }
  function colorSerie(i) { return leerVar('--serie-' + ((i % 8) + 1), '#009de0'); }

  /* Convierte las dos formas de entrada a { etiquetas, series }. */
  function normalizar(config) {
    if (Array.isArray(config.datos)) {
      return {
        etiquetas: config.datos.map(d => d.etiqueta),
        series: [{ nombre: config.nombre || '', valores: config.datos.map(d => Number(d.valor) || 0) }]
      };
    }
    return {
      etiquetas: config.etiquetas || [],
      series: (config.series || []).map(s => ({
        nombre: s.nombre || '',
        valores: (s.valores || []).map(v => Number(v) || 0)
      }))
    };
  }

  /* Combina dos objetos de opciones en profundidad (para `opciones`). */
  function fusionar(base, extra) {
    if (!extra) { return base; }
    for (const k in extra) {
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k])) {
        base[k] = fusionar(base[k] || {}, extra[k]);
      } else {
        base[k] = extra[k];
      }
    }
    return base;
  }

  /* --- Datasets según el tipo -------------------------------------------- */

  function datasets(tipo, datos) {
    const barra = (tipo === 'barras');
    const area  = (tipo === 'area');
    const dona  = (tipo === 'dona');

    if (dona) {
      // Una serie; un color por porción.
      const s = datos.series[0] || { valores: [] };
      return [{
        data: s.valores,
        backgroundColor: s.valores.map((_, i) => colorSerie(i)),
        borderColor: leerVar('--superficie', '#ffffff'),
        borderWidth: 2
      }];
    }

    return datos.series.map((s, i) => {
      const c = datos.series.length === 1 && barra ? colorSerie(0) : colorSerie(i);
      return {
        label: s.nombre || ('Serie ' + (i + 1)),
        data: s.valores,
        backgroundColor: barra ? c : (area ? c + '33' : c),   // 33 = ~20% alpha
        borderColor: c,
        borderWidth: barra ? 0 : 2.5,
        borderRadius: barra ? 4 : 0,
        fill: area,
        tension: 0.25,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: c
      };
    });
  }

  /* --- Opciones comunes (aplican la tipografía y los colores del tema) ---- */

  function opcionesBase(tipo, datos) {
    const texto = leerVar('--texto', '#14140f');
    const suave = leerVar('--texto-suave', '#57564f');
    const borde = leerVar('--borde', '#e2e1dc');
    const fuente = leerVar('--fuente', 'system-ui, sans-serif');
    const dona = (tipo === 'dona');
    const unaSerie = datos.series.length < 2;

    const o = {
      responsive: true,
      maintainAspectRatio: false,
      font: { family: fuente },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: dona || !unaSerie,        // sin leyenda si es una sola serie con barras/líneas
          position: 'bottom',
          labels: { color: suave, boxWidth: 12, boxHeight: 12, usePointStyle: true, font: { family: fuente } }
        },
        tooltip: {
          backgroundColor: leerVar('--superficie', '#ffffff'),
          titleColor: texto, bodyColor: texto,
          borderColor: borde, borderWidth: 1, padding: 10,
          titleFont: { family: fuente }, bodyFont: { family: fuente },
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y != null ? ctx.parsed.y
                      : ctx.parsed.x != null ? ctx.parsed.x : ctx.parsed;
              const etiqueta = dona ? ctx.label : ctx.dataset.label;
              return ' ' + etiqueta + ': ' + nf.format(v);
            }
          }
        }
      }
    };

    if (!dona) {
      o.scales = {
        x: {
          grid: { display: false },
          border: { color: borde },
          ticks: { color: suave, font: { family: fuente } }
        },
        y: {
          beginAtZero: true,
          grid: { color: borde },
          border: { display: false },
          ticks: { color: suave, font: { family: fuente }, callback: (v) => nf.format(v) }
        }
      };
    } else {
      o.cutout = '62%';
    }
    return o;
  }

  /* --- API pública -------------------------------------------------------- */

  const instancias = new Map();   // contenedor -> instancia de Chart
  const registro = [];            // para redibujar al cambiar claro/oscuro

  function tipoChartjs(tipo) {
    if (tipo === 'lineas' || tipo === 'area') { return 'line'; }
    if (tipo === 'dona') { return 'doughnut'; }
    return 'bar';
  }

  function dibujar(selector, config) {
    const cont = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!cont) { console.error('Grafico.crear: no encontré el contenedor', selector); return; }
    if (typeof Chart === 'undefined') { console.error('Grafico.crear: falta vendor/chart.umd.js'); return; }

    if (instancias.has(cont)) { instancias.get(cont).destroy(); }
    cont.innerHTML = '';
    cont.classList.add('grafico');
    const canvas = document.createElement('canvas');
    cont.appendChild(canvas);

    const datos = normalizar(config);
    const chart = new Chart(canvas, {
      type: tipoChartjs(config.tipo),
      data: { labels: datos.etiquetas, datasets: datasets(config.tipo, datos) },
      options: fusionar(opcionesBase(config.tipo, datos), config.opciones)
    });
    instancias.set(cont, chart);
  }

  function crear(selector, config) {
    registro.push({ selector, config });
    dibujar(selector, config);
  }

  // Redibujar cuando cambia el modo claro/oscuro: por el sistema operativo,
  // o porque el visitante tocó el botón del header (js/tema.js).
  function redibujarTodo() { registro.forEach(r => dibujar(r.selector, r.config)); }
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redibujarTodo);
  }
  document.addEventListener('tema:cambio', redibujarTodo);

  return { crear, formatearNumero: (v) => nf.format(v) };
})();
