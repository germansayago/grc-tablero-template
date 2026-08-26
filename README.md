# Template de tableros — Equipo de Estadísticas

Plantilla para crear tableros con datos, todos con el **mismo diseño** y las
**mismas reglas de seguridad**. Vos te ocupás de tus datos; el diseño, los
colores y los chequeos de seguridad ya vienen resueltos.

> **¿Primera vez?** Andá directo a [Empezar](#empezar-tu-primer-tablero) más abajo.

---

## Qué hay acá adentro

```
index.html          el tablero (la página). Editás títulos y paneles.
guia-diseno.html    el sistema de diseño: colores, tipografía, botones, gráficos.
css/
  tokens.css        ← la paleta y la tipografía. Se toca SOLO acá.
  base.css          header, footer, grilla, tarjetas. Casi nunca se toca.
  componentes.css   botones, estados y clases de texto. Casi nunca se toca.
js/
  charts.js         el helper de gráficos (envuelve a Chart.js). NO se toca.
  tablero.js        ← TU lógica: cargar datos y dibujar. El archivo que editás.
vendor/             librerías de terceros (Chart.js), guardadas en el repo. NO se toca.
datos/              tus datos publicables (.json), ya agregados.
datos-fuente/       datos crudos — NO se suben (está en .gitignore).
assets/img/         imágenes y el logo.
SECURITY.md         las 3 reglas de seguridad. Leelo una vez.
AGENTS.md           las reglas que sigue el agente de IA. La fuente de verdad.
.github/workflows/  la revisión automática que corre en GitHub.
```

> **¿Usás un agente de IA (Claude Code, Cursor, Antigravity) para armar el
> tablero?** Ya lee `AGENTS.md` solo al abrir la carpeta: conoce el design
> system y las reglas de seguridad sin que se las expliques. Pedile igual, al
> empezar: *"Leé AGENTS.md antes de tocar nada"*.

Regla mental: **tocás `index.html`, `js/tablero.js`, `css/tokens.css` y `datos/`.
El resto ya funciona.**

---

## Empezar tu primer tablero

1. **Creá tu repo** desde este template: botón verde **"Use this template" →
   "Create a new repository"** en GitHub. Ponele un nombre (ej. `tablero-tramites`).
   Vas a tener tu propia copia, con el diseño y la seguridad ya adentro.

2. **Cloná tu repo** y abrilo en tu editor.

3. **Vé el ejemplo funcionando.** Abrí `index.html` en el navegador (o, mejor,
   levantá un servidor local para que cargue el JSON):

   ```bash
   python3 -m http.server 8000
   ```

   y entrá a `http://localhost:8000`. Vas a ver un tablero de ejemplo completo.

4. **Poné tus datos.** Reemplazá `datos/ejemplo.json` por tu archivo (ya
   agregado, sin datos de personas — ver `SECURITY.md`).

5. **Editá `js/tablero.js`.** Es el único archivo con lógica. Cambiá el nombre
   del JSON y ajustá las llamadas a `Chart.crear(...)` para tus gráficos.

6. **Editá los textos de `index.html`:** el título, la bajada y los títulos de
   cada panel.

7. **Subí el cambio.** Al hacer push, GitHub revisa solo que no se filtre
   ninguna clave y que el tablero cumpla las reglas. Verde = listo para publicar
   en Dokploy.

---

## Cómo se hace un gráfico

Todo pasa por una sola función, `Grafico.crear(selector, config)`. Por debajo
usa **Chart.js** (guardado en `vendor/`, no se carga de internet), pero vos no
lo tocás: los colores y el estilo salen solos del design system.

```js
// Barras (una serie) — comparar categorías
Grafico.crear('#g-areas', {
  tipo: 'barras',
  datos: [
    { etiqueta: 'Obras',    valor: 520 },
    { etiqueta: 'Ambiente', valor: 300 }
  ]
});

// Líneas (una o varias series) — evolución en el tiempo
Grafico.crear('#g-evolucion', {
  tipo: 'lineas',                  // 'area' para el mismo gráfico con relleno
  etiquetas: ['Ene', 'Feb', 'Mar'],
  series: [
    { nombre: 'Iniciados', valores: [280, 310, 295] },
    { nombre: 'Resueltos', valores: [210, 245, 260] }
  ]
});

// Dona — composición / porcentajes
Grafico.crear('#g-canales', {
  tipo: 'dona',
  datos: [
    { etiqueta: 'Web', valor: 900 },
    { etiqueta: 'App', valor: 320 }
  ]
});
```

Tipos: `barras`, `lineas`, `area`, `dona`. Para que un gráfico aparezca, en
`index.html` tiene que haber un contenedor con ese id:
`<div class="grafico" id="g-areas"></div>`. Para un caso muy particular podés
pasar `opciones: {...}` (se fusiona con Chart.js), pero usalo poco.

**Botones y textos:** usá las clases `.boton` (+ `.boton--primario`, etc.) y
`.titulo-*`. Todas están, en vivo, en **[`guia-diseno.html`](guia-diseno.html)**
(abrila en el navegador).

---

## Modo oscuro

Ya viene resuelto en la plantilla, no hay que hacer nada. El tablero sigue el
modo del sistema operativo del visitante solo, y además tiene un botón (◐) en
la esquina del header para elegirlo a mano — la elección queda guardada en ese
navegador. Los gráficos se redibujan solos con los colores correctos al
cambiar. Si armás una página nueva a partir de `index.html`, copiá el header
completo (incluye el botón y el script anti-titileo del `<head>`) y el
`<script src="js/tema.js">` del final.

---

## Cambiar los colores o el logo (para el que arma el estándar)

- **Paleta y tipografía:** `css/tokens.css`. Cambiás los valores de arriba y
  cambia todo el tablero, incluidos los gráficos y el modo oscuro.
- **Nombre del organismo / header:** el texto está en `index.html` (sección
  `<header>`); el color, en `--marca` dentro de `css/tokens.css`.
- **Logo:** reemplazá `assets/img/logo.svg` por el oficial (mismo nombre).

---

## Seguridad

Tres reglas, explicadas en **[`SECURITY.md`](SECURITY.md)**. En una línea:
**ninguna clave en el repo, se publica el resumen y no la fila, y todo se carga
desde el repo (nada de internet).** GitHub lo revisa solo en cada cambio.
