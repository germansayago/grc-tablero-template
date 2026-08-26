/* ==========================================================================
   charts.js — Helper de gráficos del design system.

   Dibuja gráficos en SVG, sin ninguna librería externa. Toma los colores de
   las variables --serie-1..8 de tokens.css, así todos los tableros salen con
   la misma estética y respetan el modo claro/oscuro sin tocar este archivo.

   USO (desde tablero.js):

     Chart.crear('#mi-panel', {
       tipo: 'barras',                 // 'barras' | 'lineas' | 'dona'
       datos: [                        // forma simple: una serie
         { etiqueta: 'Enero',   valor: 120 },
         { etiqueta: 'Febrero', valor: 98  }
       ]
     });

     // Varias series (para 'lineas' o 'barras' agrupadas):
     Chart.crear('#otro-panel', {
       tipo: 'lineas',
       etiquetas: ['Ene', 'Feb', 'Mar'],
       series: [
         { nombre: 'Iniciados', valores: [120, 98, 140] },
         { nombre: 'Resueltos', valores: [80, 90, 110] }
       ]
     });

   No necesitás entender lo que sigue: se usa siempre igual, con Chart.crear.
   ========================================================================== */

const Chart = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const nf = new Intl.NumberFormat('es-AR');

  /* --- Utilidades internas ------------------------------------------------ */

  function leerVar(nombre, porDefecto) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
    return v || porDefecto;
  }

  function colorSerie(i) {
    return leerVar('--serie-' + ((i % 8) + 1), '#2a78d6');
  }

  function nodo(tag, attrs, texto) {
    const n = document.createElementNS(NS, tag);
    if (attrs) { for (const k in attrs) n.setAttribute(k, attrs[k]); }
    if (texto != null) n.textContent = texto;
    return n;
  }

  /* Convierte cualquiera de las dos formas de entrada a { etiquetas, series }. */
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

  /* Elige marcas "redondas" para el eje Y (0, 50, 100, ...). */
  function marcasEje(maximo, cantidad) {
    if (maximo <= 0) { return [0, 1]; }
    const bruto = maximo / cantidad;
    const mag = Math.pow(10, Math.floor(Math.log10(bruto)));
    const norm = bruto / mag;
    const paso = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    const marcas = [];
    for (let v = 0; v <= maximo + paso * 0.001; v += paso) { marcas.push(v); }
    return marcas;
  }

  function leyenda(contenedor, series) {
    if (series.length < 2 && !series[0].nombre) { return; }
    const cont = document.createElement('div');
    cont.className = 'grafico-leyenda';
    series.forEach((s, i) => {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.background = colorSerie(i);
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(s.nombre || ('Serie ' + (i + 1))));
      cont.appendChild(item);
    });
    contenedor.appendChild(cont);
  }

  /* --- Dibujo de cada tipo ------------------------------------------------ */

  const ANCHO = 640, ALTO = 320;
  const M = { top: 16, right: 16, bottom: 40, left: 52 };

  function ejes(svg, marcas, xMap, plot) {
    const suave = leerVar('--texto-suave', '#57564f');
    const borde = leerVar('--borde', '#e2e1dc');
    marcas.forEach(m => {
      const y = plot.y0 - (m / plot.maximo) * plot.alto;
      svg.appendChild(nodo('line', { x1: M.left, y1: y, x2: ANCHO - M.right, y2: y,
        stroke: borde, 'stroke-width': 1 }));
      svg.appendChild(nodo('text', { x: M.left - 8, y: y + 4, 'text-anchor': 'end',
        'font-size': 11, fill: suave }, nf.format(m)));
    });
  }

  function etiquetasX(svg, etiquetas, xCentro, y) {
    const suave = leerVar('--texto-suave', '#57564f');
    const paso = Math.ceil(etiquetas.length / 12);   // no encimar textos
    etiquetas.forEach((et, i) => {
      if (i % paso !== 0) { return; }
      svg.appendChild(nodo('text', { x: xCentro(i), y: y, 'text-anchor': 'middle',
        'font-size': 11, fill: suave }, et));
    });
  }

  function base(datos) {
    const maximo = Math.max(1, ...datos.series.flatMap(s => s.valores));
    const marcas = marcasEje(maximo, 4);
    const tope = marcas[marcas.length - 1];
    const y0 = ALTO - M.bottom;
    return { maximo: tope, marcas, y0, alto: (ALTO - M.bottom) - M.top };
  }

  function dibujarBarras(svg, datos) {
    const plot = base(datos);
    ejes(svg, plot.marcas, null, plot);
    const n = datos.etiquetas.length;
    const anchoGrupo = (ANCHO - M.left - M.right) / Math.max(1, n);
    const ns = datos.series.length;
    const anchoBarra = (anchoGrupo * 0.72) / ns;
    const xCentro = i => M.left + anchoGrupo * i + anchoGrupo / 2;

    datos.series.forEach((s, si) => {
      s.valores.forEach((v, i) => {
        const h = (v / plot.maximo) * plot.alto;
        const x = xCentro(i) - (anchoGrupo * 0.72) / 2 + anchoBarra * si;
        const r = svg.appendChild(nodo('rect', {
          x, y: plot.y0 - h, width: Math.max(1, anchoBarra - 2), height: h,
          rx: 3, fill: colorSerie(si)
        }));
        r.appendChild(nodo('title', {}, (s.nombre ? s.nombre + ' · ' : '') + datos.etiquetas[i] + ': ' + nf.format(v)));
      });
    });
    etiquetasX(svg, datos.etiquetas, xCentro, ALTO - M.bottom + 20);
  }

  function dibujarLineas(svg, datos) {
    const plot = base(datos);
    ejes(svg, plot.marcas, null, plot);
    const n = datos.etiquetas.length;
    const xCentro = i => n <= 1 ? (M.left + (ANCHO - M.left - M.right) / 2)
      : M.left + ((ANCHO - M.left - M.right) / (n - 1)) * i;

    datos.series.forEach((s, si) => {
      const col = colorSerie(si);
      const puntos = s.valores.map((v, i) => xCentro(i) + ',' + (plot.y0 - (v / plot.maximo) * plot.alto));
      svg.appendChild(nodo('polyline', {
        points: puntos.join(' '), fill: 'none', stroke: col,
        'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }));
      s.valores.forEach((v, i) => {
        const cy = plot.y0 - (v / plot.maximo) * plot.alto;
        const c = svg.appendChild(nodo('circle', { cx: xCentro(i), cy, r: 3.5, fill: col }));
        c.appendChild(nodo('title', {}, (s.nombre ? s.nombre + ' · ' : '') + datos.etiquetas[i] + ': ' + nf.format(v)));
      });
    });
    etiquetasX(svg, datos.etiquetas, xCentro, ALTO - M.bottom + 20);
  }

  function dibujarDona(svg, datos) {
    const s = datos.series[0];
    const total = s.valores.reduce((a, b) => a + b, 0) || 1;
    const cx = ANCHO / 2, cy = ALTO / 2, rExt = 120, rInt = 68;
    let ang = -Math.PI / 2;
    s.valores.forEach((v, i) => {
      const frac = v / total;
      const fin = ang + frac * Math.PI * 2;
      const grande = frac > 0.5 ? 1 : 0;
      const x1 = cx + rExt * Math.cos(ang),  y1 = cy + rExt * Math.sin(ang);
      const x2 = cx + rExt * Math.cos(fin),  y2 = cy + rExt * Math.sin(fin);
      const x3 = cx + rInt * Math.cos(fin),  y3 = cy + rInt * Math.sin(fin);
      const x4 = cx + rInt * Math.cos(ang),  y4 = cy + rInt * Math.sin(ang);
      const d = `M ${x1} ${y1} A ${rExt} ${rExt} 0 ${grande} 1 ${x2} ${y2} `
              + `L ${x3} ${y3} A ${rInt} ${rInt} 0 ${grande} 0 ${x4} ${y4} Z`;
      const p = svg.appendChild(nodo('path', { d, fill: colorSerie(i) }));
      p.appendChild(nodo('title', {}, datos.etiquetas[i] + ': ' + nf.format(v)
        + ' (' + Math.round(frac * 100) + '%)'));
      ang = fin;
    });
    svg.appendChild(nodo('text', { x: cx, y: cy - 4, 'text-anchor': 'middle',
      'font-size': 26, 'font-weight': 600, fill: leerVar('--texto', '#14140f') }, nf.format(total)));
    svg.appendChild(nodo('text', { x: cx, y: cy + 18, 'text-anchor': 'middle',
      'font-size': 12, fill: leerVar('--texto-suave', '#57564f') }, 'Total'));
  }

  /* --- API pública -------------------------------------------------------- */

  function crear(selector, config) {
    const contenedor = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!contenedor) { console.error('Chart.crear: no encontré el contenedor', selector); return; }

    const datos = normalizar(config);
    contenedor.innerHTML = '';
    contenedor.classList.add('grafico');

    const svg = nodo('svg', {
      viewBox: `0 0 ${ANCHO} ${ALTO}`, role: 'img',
      'aria-label': config.titulo || 'Gráfico'
    });
    contenedor.appendChild(svg);

    if (config.tipo === 'lineas')      { dibujarLineas(svg, datos); }
    else if (config.tipo === 'dona')   { dibujarDona(svg, datos); }
    else                               { dibujarBarras(svg, datos); }

    if (config.tipo === 'dona') { leyendaDona(contenedor, datos); }
    else { leyenda(contenedor, datos.series); }
  }

  function leyendaDona(contenedor, datos) {
    const cont = document.createElement('div');
    cont.className = 'grafico-leyenda';
    datos.etiquetas.forEach((et, i) => {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      swatch.style.background = colorSerie(i);
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(et));
      cont.appendChild(item);
    });
    contenedor.appendChild(cont);
  }

  /* Redibuja todos los gráficos registrados cuando cambia claro/oscuro. */
  const registro = [];
  function crearYRecordar(selector, config) {
    registro.push({ selector, config });
    crear(selector, config);
  }
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      registro.forEach(r => crear(r.selector, r.config));
    });
  }

  return { crear: crearYRecordar, formatearNumero: v => nf.format(v) };
})();
