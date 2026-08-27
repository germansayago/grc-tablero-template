# AGENTS.md — Cómo trabajar en este tablero

Esto es un **tablero estático**: HTML, CSS y JS que el navegador entiende
directo. No hay build, no hay backend. Se publica tal cual, así que todo lo
que esté en el repo queda visible para cualquiera que entre.

El diseño ya está resuelto y es compartido con los tableros de todo el
equipo. Tu trabajo es el contenido y los datos; el sistema visual te lo dan
hecho para que no tengas que decidirlo cada vez.

---

## 1. Dónde va cada cosa

| Querés… | Va en |
|---|---|
| Estructura y textos del tablero | `index.html` |
| Cargar datos y mostrarlos | `js/tablero.js` |
| Tus datos ya agregados | `datos/` |
| Un estilo propio de este tablero | `css/tablero.css` |
| Cambiar la estética de todo el tablero | los **valores** de `css/tokens.css` |

Esos cinco son tuyos: editalos con confianza, no hace falta pedir permiso.

### Si necesitás un componente que el sistema no tiene

Escribilo en **`css/tablero.css`**. Ese archivo se carga último y es local a
este tablero. No lo metas en `componentes.css`: eso es lo compartido, y si
cada uno le agrega cosas, los tableros del equipo dejan de parecerse entre sí
— que es exactamente lo que esta plantilla existe para evitar.

Si lo que escribiste le sirve a todos, decilo: se sube a `componentes.css` y
pasa a ser parte del sistema.

---

## 2. Lo que ya está resuelto (reusalo, no lo rehagas)

- **Modo claro/oscuro.** Sigue el sistema operativo solo, y el botón
  `#boton-tema` del header permite elegirlo a mano. Si armás una página
  nueva, copiá el header entero: el botón, el `<script>` anti-titileo del
  `<head>` y `js/tema.js` van juntos, o ninguno.
- **Tipografía, íconos, botones, estados, tarjetas.** Están todos, en vivo,
  en `guia-diseno.html` — abrila antes de escribir CSS nuevo, es probable que
  lo que necesitás ya exista.
- **Íconos:** `<span class="icono">nombre</span>`, con el nombre de
  [fonts.google.com/icons](https://fonts.google.com/icons).
- **Contraste de color.** La paleta ya pasó una auditoría WCAG AA. Dos cosas
  que conviene saber para no romperla sin darte cuenta:
  - `--marca` es para **fondos**; si el celeste va a ser el **texto**, usá
    `--marca-enlace` (el oficial no tiene contraste suficiente como texto).
  - En `.estado--*` el color va al fondo y al punto, **nunca al texto** — el
    texto usa `--texto`. Si le ponés el color del estado, para que pase
    contraste hay que oscurecerlo hasta que el amarillo se ve marrón.

  El detalle está en `ACCESIBILIDAD.md`.

---

## 3. Las reglas que no se negocian

Estas tres son las que sí importan de verdad, porque los errores son caros o
irreversibles:

1. **Ninguna credencial en el repo. Nunca.** Ni claves, ni tokens, ni cadenas
   de conexión, ni `.env`. Si hace falta consultar una base, la consulta se
   corre afuera y acá entra solo el resultado agregado.
2. **Se publica el resumen, no la fila.** Nada que identifique a una persona
   (nombre, DNI, domicilio, expediente, salud…). Y **regla de los 5**: si un
   cruce da menos de 5 casos, no publiques esa celda. Un dato personal
   publicado no se despublica.
3. **Todo se carga desde el repo.** Ningún `<link>`, `<script>` o `<img>`
   apuntando a internet: se descarga y va en `css/`, `js/` o `assets/`. (Un
   `<a href>` a un sitio externo sí está bien — eso es un link para leer, no
   un recurso que la página carga.)

El detalle de 1 y 2 está en `SECURITY.md`. Si un archivo de datos que te
pasaron tiene información de personas, no lo proceses: avisá y acordá cómo
agregarlo.

---

## 4. Dos decisiones que todavía no están tomadas

No las resuelvas por tu cuenta — avisá y se define en conjunto:

- **Librería de gráficos.** Todavía no hay una elegida. Mientras tanto, los
  números van en tarjetas `.kpi` o en una tabla.
- **Íconos de los ODS** (`assets/img/ods/`): se usan tal cual. No se
  recolorean ni se deforman, es marca registrada de la ONU.

---

## 5. Antes de cerrar una tarea

1. Ninguna clave ni dato personal en lo que tocaste.
2. Nada cargado desde internet.
3. El tablero abre y se ve, sin errores en la consola.
4. El botón de modo oscuro sigue cambiando el tablero entero.
5. Si agregaste un color, pasa contraste en los dos temas
   ([WebAIM](https://webaim.org/resources/contrastchecker/) alcanza).

Y decí en una línea qué tocaste y por qué.

---

## 6. Cuando dudes

Sobre **qué datos se pueden publicar**, la respuesta por defecto es **no
publicar y preguntar**. Un tablero feo se corrige; un dato personal
publicado, no. Nadie se molesta por una pregunta.

Sobre **todo lo demás** (dónde poner un estilo, cómo estructurar el HTML, si
conviene una tabla o unas tarjetas): decidí vos y seguí. Si te equivocás se
corrige, y avanzar vale más que consultar cada paso.
