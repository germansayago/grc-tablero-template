# Accesibilidad

Un tablero de un organismo público lo puede necesitar leer cualquiera: alguien
con baja visión, con daltonismo, que navega solo con teclado, o que usa un
lector de pantalla. Además, para el Estado no es opcional — la
[Ley 26.653](https://www.argentina.gob.ar/normativa/nacional/ley-26653-131400)
de Accesibilidad de la Información en Páginas Web alcanza a los organismos
públicos. Este documento explica qué ya está resuelto en el design system y
qué hay que cuidar al sumar algo nuevo.

El estándar de referencia es **WCAG 2.1, nivel AA** — el que usa la ley y el
que pide la mayoría de las auditorías públicas.

---

## 1. Contraste de color (lo más importante y lo más fácil de romper)

Todo texto tiene que distinguirse de su fondo. La regla técnica:

- **Texto normal:** contraste mínimo **4.5:1**
- **Texto grande** (≥24px, o ≥19px si es negrita) **o íconos/bordes que son
  la única señal de algo interactivo:** mínimo **3:1**

Esto **ya se revisó y se corrigió** en toda la paleta de `css/tokens.css`
(agosto 2026) — varios colores oficiales del organismo, tal cual, no pasaban
este mínimo. El detalle completo de qué fallaba y por qué está en el
historial de git (commit "Auditoría de contraste WCAG AA..."), pero la parte
que necesitás saber para seguir trabajando es esta:

### El celeste institucional está duplicado a propósito

| Color | Para FONDOS (con texto encima) | Para cuando el color ES el texto |
|---|---|---|
| Celeste institucional | `--marca` | `--marca-enlace` |

**Por qué existen los dos:** el celeste oficial de riocuarto.gob.ar no tiene
contraste suficiente para funcionar en los dos roles con un solo valor.
`--marca` funciona como fondo grande con texto encima (el header,
`.boton--primario`); pero si ese mismo celeste pasa a ser el color del
*texto* (un link, `.boton--sutil`), no se lee bien sobre un fondo claro —
por eso existe `--marca-enlace`, una versión más oscura, solo para eso.

**Regla práctica:** antes de escribir `color: var(--marca)` o
`background: var(--marca)`, preguntate qué es el celeste ahí — ¿un fondo, o
el texto mismo? Fondo → `--marca`. Texto → `--marca-enlace`.

### Las etiquetas de estado (`.estado--ok/--alerta/--grave`) usan fondo sólido, no un tinte

La primera versión de este ajuste oscurecía el color de estado y lo usaba
como texto sobre un tinte pastel del mismo color — la forma más común de
hacer una "etiqueta" en un design system. El problema: para que un amarillo
pase 4.5:1 *como texto*, hay que oscurecerlo tanto que deja de leerse como
amarillo — terminaba pareciendo marrón. Un "alerta" que no se reconoce como
alerta de un vistazo es un problema real de uso, no solo estético.

La solución: el color de estado (`--ok`, `--alerta`, `--grave`) es el
**fondo sólido** de la etiqueta, tal cual, sin oscurecer — así se sigue
viendo verde, amarillo o rojo de verdad. El contraste lo pone el color del
*texto* encima: blanco donde alcanza (`--ok`, `--grave`) o
`--texto-fijo-oscuro` donde el fondo es demasiado claro para el blanco
(`--alerta`). Los tres pasan 4.5:1 así, sin perder el color real.

**Si agregás un estado nuevo:** no repitas el patrón "texto de color sobre
tinte pastel" — probá primero fondo sólido + texto blanco, y si no alcanza
4.5:1, fondo sólido + `--texto-fijo-oscuro`. Casi siempre alguno de los dos
funciona, porque ahí el contraste lo decide un blanco o un negro puro contra
un solo color, no dos tonos parecidos entre sí.

### Si agregás un color nuevo

No lo agregues sin revisar el contraste contra donde va a aparecer. La forma
más fácil, sin instalar nada: **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)**
— pegás los dos colores (el del texto y el del fondo) y te dice si pasa o no,
para texto normal y para texto grande. Si no pasa, oscurecé (en fondo claro)
o aclará (en fondo oscuro) el color hasta que pase — no hace falta que sea
exacto, con que cumpla el mínimo alcanza.

---

## 2. Qué más ya está resuelto

- **HTML semántico:** `<header>`, `<main>`, `<footer>`, jerarquía de títulos
  (`<h1>`, `<h2>`...). Un lector de pantalla entiende la estructura de la
  página sin que hagas nada.
- **Botones y controles con foco visible:** al navegar con teclado (Tab), se
  ve un contorno claro alrededor del elemento activo (`:focus-visible` en
  `css/componentes.css`).
- **El botón de modo oscuro tiene `aria-label`**, así un lector de pantalla
  dice qué hace, no solo que es un botón sin nombre.
- **`lang="es"`** declarado en cada página, para que el lector de pantalla
  use la pronunciación correcta.
- **El estado de los datos no depende solo del color.** Las etiquetas
  (`.estado`) siempre llevan texto ("Vencido", "En regla"), nunca solo un
  punto de color — así alguien con daltonismo igual entiende qué significan.

## 3. Qué falta (pendiente, no bloqueante)

- **Link "saltar al contenido"** antes del header, para que alguien que
  navega con teclado no tenga que pasar por el header en cada página.
- **`prefers-reduced-motion`:** respetar la preferencia del sistema de quien
  desactivó las animaciones (afecta sobre todo a futuros gráficos, si vuelven).

Si vas a trabajar en alguno de estos dos puntos, avisá antes — no son
urgentes, pero conviene coordinarlos.

---

## 4. Antes de dar por terminado un cambio visual

Preguntate:

1. ¿Agregué o cambié algún color? → revisalo con WebAIM Contrast Checker.
2. ¿Agregué texto sobre un color de marca o de estado? → ¿usé la variable
   correcta (fondo vs. texto)?
3. ¿Se puede navegar con teclado (Tab) hasta ahí y se ve dónde está el foco?
4. ¿La información que agregué se entiende sin el color (por ejemplo, si
   alguien no distingue rojo de verde)?

Si alguna respuesta te genera dudas, preguntá antes de publicar — igual que
con los datos personales en `SECURITY.md`.
