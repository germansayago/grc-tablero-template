# vendor/ — librerías de terceros, guardadas en el repo

Acá van las librerías que usa el tablero, **descargadas** (no enlazadas desde
internet). Así el tablero no depende de ningún servidor externo y cumple la
regla de seguridad "todo desde el repo".

## chart.umd.js

- **Qué es:** Chart.js, la librería que dibuja los gráficos.
- **Versión:** 4.4.4 · Licencia MIT · https://www.chartjs.org
- **No la edites.** Y no la uses directamente: los gráficos se hacen con el
  helper `Grafico.crear(...)` de `js/charts.js`, que ya le aplica la paleta del
  tablero. Ver `README.md` y `AGENTS.md`.

### Para actualizarla (solo quien mantiene el template)

```bash
curl -sL -o vendor/chart.umd.js \
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.js"
```
