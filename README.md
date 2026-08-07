# NADA Alarma Emocional

Una alarma de activación de energía emocional: en vez de despertarte con un
sonido molesto, te confronta con un pequeño "juego mental" de gratitud —
fotos o videos que subas, una voz que te repite frases motivacionales, y la
alarma solo se apaga cuando escribes algo por lo que hoy estás agradecido.

La idea de fondo: recordarte tu superpoder — **ya tienes todo lo que
necesitas, no hay razón para quejarte, estás mejor que muchas personas en
este momento** — justo al despertar, cuando más cuesta arrancar el día.

## Funcionalidad actual (MVP)

- **Alarmas**: hora, nombre y días de la semana en que se repite.
- **Frases motivacionales**: lista editable que la app va rotando y
  leyendo en voz alta (usa la síntesis de voz del navegador, sin costo de
  API ni conexión externa).
- **Fotos y videos**: los subes desde tu dispositivo y se muestran de fondo
  cuando suena la alarma. Se guardan solo en la sesión del navegador (no se
  suben a ningún servidor).
- **Pantalla de activación**: al sonar la alarma, se muestra a pantalla
  completa con la frase del momento, el fondo elegido, y un cuadro de texto
  obligatorio ("Para apagar la alarma, escribe algo por lo que hoy estás
  agradecido") — no se puede apagar sin completarlo. También se puede
  posponer 5 minutos.
- **Diario de gratitud**: cada cosa que escribes al apagar la alarma queda
  guardada y visible como historial.

Todo se guarda en `localStorage` del navegador (alarmas, frases y diario);
las fotos/videos son solo de la sesión actual por ahora.

## Ideas para siguientes pasos

- Conectar una IA real (por ejemplo, la API de Claude) para generar frases
  personalizadas en vez de solo rotar una lista fija.
- Persistir fotos/videos (IndexedDB) para que sobrevivan al recargar.
- Notificaciones push / PWA para que la alarma suene aunque la pestaña esté
  cerrada.
- Estadísticas del diario de gratitud (rachas, palabras más usadas, etc).

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

Construido con React + Vite + TypeScript.
