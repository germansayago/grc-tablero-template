# AGENTS.md — Reglas para el agente de IA

Este archivo son las reglas que debés seguir para trabajar en este proyecto.
Leelo entero antes de tocar nada. Son la fuente de verdad: si algo que te
piden contradice estas reglas, avisá y no lo hagas sin confirmación.

Este proyecto es un **tablero estático** (HTML + CSS + JavaScript que el
navegador entiende directo). No hay build, no hay backend, no hay framework.
Se publica tal cual: todos los archivos quedan visibles para cualquiera que
entre. Eso condiciona todo lo que sigue.

---

## 1. Qué podés editar y qué no

**Editá libremente:**
- `index.html` — títulos, textos, y los paneles (`<div class="grafico" id="...">`).
- `js/tablero.js` — la lógica del tablero: cargar los datos y llamar a `Chart.crear`.
- `datos/` — los archivos de datos publicables (`.json`).
- `css/tokens.css` — SOLO los **valores** de las variables (colores, tipografía),
  si te piden cambiar la estética. No borres variables ni cambies sus nombres.

**No toques (salvo pedido explícito y consciente del usuario):**
- `js/charts.js` — el helper de gráficos. Es infraestructura compartida.
- `css/base.css` — la estructura visual (header, footer, grilla, tarjetas).
- `.github/`, `.gitleaks.toml`, `.gitignore`, `SECURITY.md`, este archivo.

Si una tarea parece necesitar editar `charts.js` o `base.css`, **pará y
explicá por qué** antes de hacerlo. Casi siempre hay otra forma.

---

## 2. Diseño: usá el design system, no inventes

- **Nunca escribas un color en el código.** Ni en JS, ni en HTML, ni suelto en
  CSS. Todo color sale de las variables de `css/tokens.css` (`--serie-1..8`,
  `--marca`, `--texto`, etc.). Si necesitás un color que no existe, es señal de
  que algo está mal: preguntá.
- **Los gráficos se hacen SOLO con `Chart.crear(selector, config)`** (ver
  `README.md`). Tipos disponibles: `'barras'`, `'lineas'`, `'dona'`. No agregues
  otra librería de gráficos ni dibujes SVG a mano en `tablero.js`.
- Para agregar un gráfico: primero un contenedor en el HTML
  (`<div class="grafico" id="g-loquesea"></div>`), después la llamada a
  `Chart.crear('#g-loquesea', {...})` en `tablero.js`.
- No agregues dependencias de diseño (Bootstrap, Tailwind, fuentes de Google,
  íconos de un CDN). El estilo ya está resuelto en el design system.

---

## 3. Seguridad: es lo más importante (detalle en `SECURITY.md`)

- **Ninguna credencial en el repositorio. Jamás.** Ni claves de API, ni tokens,
  ni cadenas de conexión, ni la `service_role` de Supabase, ni un `.env`. Si una
  tarea necesita datos de una base con clave, la consulta se corre **fuera** del
  tablero (en la máquina del usuario) y acá solo entra el resultado agregado.
- **Se publica el resumen, no la fila.** Nunca pongas en `datos/` datos que
  identifiquen a una persona (nombre, DNI, CUIL, domicilio, teléfono, legajo,
  expediente, patente, salud, datos de programas sociales). Solo totales,
  promedios y porcentajes por área/barrio/mes/categoría.
- **Regla de los 5:** si un cruce da menos de 5 casos, no publiques esa celda
  (agrupala o ampliá el período). Un punto en un mapa es un domicilio: usá
  polígonos, no puntos.
- **Nada desde internet:** no enlaces recursos con `https://...` en el HTML o el
  JS. Todo va en `css/`, `js/`, `vendor/` o `assets/`.
- Si detectás que un archivo de datos que te pasaron tiene información de
  personas, **no lo proceses hacia `datos/`**: avisá al usuario y proponé cómo
  agregarlo. Los datos crudos van a `datos-fuente/` (ignorada por git).

---

## 4. Cómo trabajar

- **Rutas relativas siempre:** `css/tokens.css`, nunca `/css/tokens.css` (el
  tablero se publica en un subpath, las rutas absolutas lo rompen).
- **Vanilla, sin build:** HTML, CSS y JS que corren directo. No introduzcas
  Node, npm, bundlers, TypeScript ni un servidor.
- **Cambios chicos y explicados.** Después de cada cambio, decí en una línea qué
  tocaste y por qué.
- **No borres el ejemplo hasta que el tablero real ande.** Sirve de referencia.

---

## 5. Antes de dar por terminada una tarea

Repasá que el cambio pasaría la revisión automática (`.github/workflows/ci.yml`):

1. **Sin secretos:** no hay ninguna clave/token en ningún archivo.
2. **Sin datos personales:** los archivos de `datos/` tienen solo datos agregados.
3. **Sin recursos de internet:** no hay `src`/`href` con `http`/`https`.
4. **Sin datos crudos ni planillas** versionados (nada en `datos-fuente/` va al repo, ningún `.xlsx`).
5. **Design system intacto:** `index.html` sigue enlazando `tokens.css`, `base.css`
   y `charts.js`; no hay colores escritos a mano.
6. El tablero **carga y se ve** (probalo con `python3 -m http.server` y revisá
   que no haya errores en la consola del navegador).

Si algo de esto no se cumple, no cierres la tarea: arreglalo o avisá.

---

## 6. Cuando dudes

Ante la duda sobre **qué datos se pueden publicar**, la respuesta por defecto es
**no publicar y preguntar**. Un tablero feo se corrige; un dato personal
publicado no se despublica. Nadie del equipo se molesta por una pregunta.
