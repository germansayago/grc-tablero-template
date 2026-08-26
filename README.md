# Template de tableros — Equipo de Estadísticas

Plantilla para crear tableros con datos, todos con el **mismo diseño** y las
**mismas reglas de seguridad**. Vos te ocupás de tus datos; el diseño, los
colores y los chequeos de seguridad ya vienen resueltos.

> **¿Primera vez?** Andá directo a [Empezar](#empezar-tu-primer-tablero) más abajo.

---

## Qué hay acá adentro

```
index.html          el tablero (la página). Editás títulos y paneles.
css/
  tokens.css        ← la paleta y la tipografía. Se toca SOLO acá.
  base.css          header, footer, grilla, tarjetas. Casi nunca se toca.
js/
  charts.js         el helper de gráficos. NO se toca.
  tablero.js        ← TU lógica: cargar datos y dibujar. El archivo que editás.
datos/              tus datos publicables (.json), ya agregados.
datos-fuente/       datos crudos — NO se suben (está en .gitignore).
assets/img/         imágenes y el logo.
SECURITY.md         las 3 reglas de seguridad. Leelo una vez.
.github/workflows/  la revisión automática que corre en GitHub.
```

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

Todo pasa por una sola función, `Chart.crear(selector, config)`. Los colores y
el estilo salen del design system: vos solo pasás los datos.

```js
// Barras (una serie) — comparar categorías
Chart.crear('#g-areas', {
  tipo: 'barras',
  datos: [
    { etiqueta: 'Obras',    valor: 520 },
    { etiqueta: 'Ambiente', valor: 300 }
  ]
});

// Líneas (una o varias series) — evolución en el tiempo
Chart.crear('#g-evolucion', {
  tipo: 'lineas',
  etiquetas: ['Ene', 'Feb', 'Mar'],
  series: [
    { nombre: 'Iniciados', valores: [280, 310, 295] },
    { nombre: 'Resueltos', valores: [210, 245, 260] }
  ]
});

// Dona — composición / porcentajes
Chart.crear('#g-canales', {
  tipo: 'dona',
  datos: [
    { etiqueta: 'Web', valor: 900 },
    { etiqueta: 'App', valor: 320 }
  ]
});
```

Para que un gráfico aparezca, en `index.html` tiene que haber un contenedor con
ese id: `<div class="grafico" id="g-areas"></div>`.

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
