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
- **Frases de películas**: activable desde el panel de frases, mete al
  reparto citas de Rocky Balboa, The Pursuit of Happyness, Gladiator,
  Coach Carter, Braveheart y otras — mismo estilo de energía "levántate y
  ve por ello".
- **Vigía anti-scroll**: detecta cuánto tiempo llevas fuera de la app (ver
  limitación técnica abajo) y, si vuelves después de X minutos, te
  pregunta si fue scroll en redes. Si dices que sí, te muestra una frase de
  película y (si configuraste Groq) un mensaje generado por IA, y te reta a
  escribir la tarea productiva que vas a hacer en vez de seguir scrolleando.
  Todo queda en un historial.
- **Voz en el idioma/acento que elijas**: español (España), español
  (Latinoamérica), inglés (UK) o inglés (US) — usa las voces de síntesis de
  voz instaladas en tu navegador/dispositivo. Las frases de películas se
  leen en el idioma que elijas (traducción propia al español, no un doblaje
  oficial). No se reproduce audio real de las películas, solo texto leído
  por la voz sintética del navegador.
- **Escenas de YouTube**: pega el link de un video de YouTube o YouTube
  Music (una escena, una canción, lo que sea) y se incrusta con el
  reproductor oficial de YouTube durante la alarma y el reto del vigía, sin
  descargar ni redistribuir nada.

Todo se guarda en `localStorage` del navegador (alarmas, frases, diario,
configuración e historial del vigía); las fotos/videos son solo de la
sesión actual por ahora.

### Limitación importante del Vigía

Una app web (o una PWA instalada en el móvil) **no tiene forma de ver qué
otra app estás usando** — eso vive fuera de su sandbox. Lo que sí puede
detectar, con la API de visibilidad del navegador, es cuánto tiempo estuvo
esta pestaña/app en segundo plano. Por eso el Vigía funciona así: "llevas
X minutos fuera de aquí, ¿fue scroll?" en vez de "detecté que abriste
TikTok 12 minutos". Es una aproximación honesta con las herramientas de una
web app; ver más abajo cómo llevarlo a detección real por app.

## IA (Groq, gratis)

El "empujón" motivacional del Vigía puede generarse con IA en vez de ser
siempre la misma frase. Se reutiliza el mismo proveedor que ya usa
`NADA-AMORES-Y-TRAICIONES` para no pagar: **Groq**, con tier gratuito y sin
tarjeta de crédito (30 consultas/minuto, 1000/día en el momento de
escribir esto — verificar en https://console.groq.com).

```bash
cp .env.example .env.local
# rellena VITE_GROQ_API_KEY con tu key de https://console.groq.com
```

Si no configuras la key, la app sigue funcionando normal: el Vigía usa
solo las frases de películas, sin llamar a ningún modelo.

⚠️ Igual que en el otro proyecto: Vite inyecta esta key en el bundle del
cliente en texto plano. Sirve para uso local o para tu propio dispositivo;
no la despliegues en un sitio público sin poner la llamada detrás de un
backend/proxy que la esconda.

### Sobre las "Escenas de YouTube"

El link lo eliges y lo pegas tú — la app no busca ni sugiere videos por su
cuenta. Esto es deliberado: no automatizamos la búsqueda de contenido
sensible (por ejemplo, videos de personas en situaciones de sufrimiento
real) para usarlo como "combustible motivacional". Si quieres ese tipo de
contraste para tu diario de gratitud, puedes pegar tú mismo el link de una
fuente en la que confíes (una ONG, un documental) — la decisión y la
responsabilidad de qué mostrar quedan de tu lado.

## Ideas para siguientes pasos

- Detección real por app: para eso se necesita una app nativa de Android
  con el permiso `PACKAGE_USAGE_STATS` (Digital Wellbeing) — algo que una
  web/PWA no puede pedir. Sería un proyecto aparte (o envolver esta app con
  Capacitor + un plugin nativo) si se quiere ir por ese camino.
- Persistir fotos/videos (IndexedDB) para que sobrevivan al recargar.
- Notificaciones push / PWA para que la alarma suene aunque la pestaña esté
  cerrada.
- Estadísticas del diario de gratitud y del vigía (rachas, tareas más
  repetidas, etc).

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

Construido con React + Vite + TypeScript.
