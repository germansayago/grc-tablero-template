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
- `index.html` — títulos, textos, y el contenido de tu tablero.
- `js/tablero.js` — la lógica del tablero: cargar los datos y mostrarlos.
- `datos/` — tus datos publicables, en el formato que prefieras.
- `css/tokens.css` — SOLO los **valores** de las variables (colores, tipografía),
  si te piden cambiar la estética. No borres variables ni cambies sus nombres.

**No toques (salvo pedido explícito y consciente del usuario):**
- `js/tema.js` — el interruptor de modo claro/oscuro del header. Ya anda solo.
- `css/base.css`, `css/componentes.css`, `css/fuentes.css` y `css/iconos.css` —
  estructura visual, componentes (botones, etc.), tipografía e íconos.
- `assets/fonts/` — tipografía e íconos de terceros. Nunca se edita.
- `assets/img/ods/` — íconos oficiales de la ONU. No se recolorean ni se
  deforman (ver su `LEEME.md`); se usan tal cual o no se usan.
- `guia-diseno.html` — página de referencia del sistema de diseño, no de tu
  tablero. Se puede mirar y copiar de ahí, no editar.
- `.github/`, `.gitleaks.toml`, `.gitignore`, `SECURITY.md`, `ACCESIBILIDAD.md`, este archivo.

Si una tarea parece necesitar editar `tema.js` o `base.css`, **pará y explicá
por qué** antes de hacerlo. Casi siempre hay otra forma.

**El modo oscuro ya está resuelto: no lo reimplementes.** El tablero sigue el
tema del sistema operativo solo, y el botón `#boton-tema` del header (que ya
viene en `index.html`) permite elegirlo a mano. Si copiás/adaptás el header
para otro archivo (por ejemplo una segunda página), llevate también el botón,
el script inline anti-titileo del `<head>` y el `<script src="js/tema.js">`
— los tres juntos, o ninguno.

Para ver el design system completo (colores, tipografía, botones, estados),
abrí `guia-diseno.html`.

---

## 2. Diseño: usá el design system, no inventes

- **Nunca escribas un color en el código.** Ni en JS, ni en HTML, ni suelto en
  CSS. Todo color sale de las variables de `css/tokens.css` (`--marca`, `--texto`,
  etc.). Si necesitás un color que no existe, es señal de que algo está mal:
  preguntá.
- **`--marca` / `--marca-enlace` no son intercambiables.** `--marca` es el
  celeste oficial, para FONDOS (header, botones). `--marca-enlace` es una
  versión más oscura, solo para cuando ese celeste ES el texto (links,
  `.boton--sutil`) — el oficial no tiene contraste suficiente para eso. Si
  vas a usar el celeste como color de texto sobre un fondo claro, usá
  `--marca-enlace`; si es un fondo, `--marca`.
- **Las etiquetas de estado (`.estado--ok/--alerta/--grave`) usan fondo
  SÓLIDO con el color real**, no un tinte pastel — así "alerta" se ve
  amarillo de verdad, no marrón. El contraste lo pone el color del texto
  (blanco o `--texto-fijo-oscuro`, ya elegido para cada uno), no el tono del
  color de fondo. No cambies esto a un `color-mix` tenue "para que se vea
  más suave": ya se probó y perdía legibilidad semántica.
- El porqué completo de estas decisiones y cómo repetir la verificación de
  contraste están en `ACCESIBILIDAD.md`.
- **Si agregás o cambiás un color, revisá el contraste antes de cerrar la
  tarea** (ver `ACCESIBILIDAD.md`, sección 1) — con
  [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
  alcanza. No repitas el error que ya se corrigió: un color de marca lindo
  pero ilegible.
- Los botones usan la clase `.boton` (+ variante); la tipografía, las clases
  `.titulo-*`. No inventes estilos: mirá `guia-diseno.html`.
- No agregues dependencias de diseño (Bootstrap, Tailwind, fuentes de Google,
  íconos de un CDN). El estilo ya está resuelto.
- **Todavía no hay una librería de gráficos elegida para la plantilla.** Si una
  tarea pide un gráfico, **no sumes ninguna por tu cuenta** (ni Chart.js, ni
  D3, ni SVG a mano) — avisá y esperá que se decida en conjunto. Mientras
  tanto, mostrá los números en tarjetas `.kpi` o en una tabla.

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
  Node, npm, bundlers ni TypeScript.
- **Cómo cargás tus datos es tu decisión** (`fetch` a un `.json`, un `<script>`
  con un objeto JS, lo que te convenga). Si usás `fetch`, avisá al usuario que
  para probarlo va a necesitar un servidor local (el archivo no va a andar
  con doble clic) — no es un problema, solo algo para saber de antemano.
- **Cambios chicos y explicados.** Después de cada cambio, decí en una línea qué
  tocaste y por qué.

---

## 5. Antes de dar por terminada una tarea

Repasá que el cambio pasaría la revisión automática (`.github/workflows/ci.yml`):

1. **Sin secretos:** no hay ninguna clave/token en ningún archivo.
2. **Sin datos personales:** los archivos de `datos/` tienen solo datos agregados.
3. **Sin recursos de internet:** no hay `src`/`href` con `http`/`https`.
4. **Sin datos crudos ni planillas** versionados (nada en `datos-fuente/` va al repo, ningún `.xlsx`).
5. **Design system intacto:** `index.html` sigue enlazando `fuentes.css`, `tokens.css`,
   `base.css` y `tema.js`, y conserva el botón `#boton-tema`; no hay colores
   escritos a mano.
6. El tablero **carga y se ve** (abriendo el `.html` directo, o con un
   servidor local si tu `tablero.js` usa `fetch`) y no hay errores en la
   consola del navegador. Probá también el botón de modo oscuro: el tablero
   entero tiene que cambiar de tema.
7. **Si agregaste o cambiaste un color:** pasa el contraste mínimo (ver
   `ACCESIBILIDAD.md`) en los dos temas.

Si algo de esto no se cumple, no cierres la tarea: arreglalo o avisá.

---

## 6. Cuando dudes

Ante la duda sobre **qué datos se pueden publicar**, la respuesta por defecto es
**no publicar y preguntar**. Un tablero feo se corrige; un dato personal
publicado no se despublica. Nadie del equipo se molesta por una pregunta.
