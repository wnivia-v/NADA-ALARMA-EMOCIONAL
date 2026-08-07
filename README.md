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
- **Escenas de YouTube y TikTok**: pega el link de un video de YouTube,
  YouTube Music o TikTok (una escena, una canción, un clip motivacional) y
  se incrusta con el reproductor oficial de esa plataforma durante la
  alarma y el reto del vigía, sin descargar ni redistribuir nada. Los links
  cortos de TikTok (vt.tiktok.com) no se pueden resolver desde el
  navegador; usa el link completo (tiktok.com/@usuario/video/...).
- **"Modo Guerra"**: un mantra corto inspirado en el concepto/marca personal
  de El Temach (Luis Castilleja), incluido en la rotación de frases junto
  con las de películas. Es una frase propia inspirada en su concepto, no
  una cita textual suya — no se encontró una fuente primaria verificable
  para atribuirle una cita exacta, así que no se inventó ninguna. Nota: es
  una figura pública controvertida (varios medios reportan críticas por
  contenido machista y dinámicas cuestionables con su comunidad de
  seguidores); inclúyelo o quítalo del panel de frases según tu criterio.

- **Alarma "con esteroides"**: cuando suena, ya no es solo la voz — hay un
  sonido de alarma real (sirena sintetizada, sin archivos de audio
  externos) en bucle hasta que la apagas, vibración en dispositivos
  compatibles, la pantalla no se apaga sola mientras hay una alarma armada
  (Wake Lock), y la app se puede instalar como PWA en el celular (ícono en
  el escritorio, funciona offline). La idea: que con esta alarma sola te
  baste, sin tener que poner diez en el reloj del teléfono.

Todo se guarda en `localStorage` del navegador (alarmas, frases, diario,
configuración e historial del vigía); las fotos/videos son solo de la
sesión actual por ahora.

### Qué tan confiable es la alarma (léelo antes de confiar en una sola)

Instalada como PWA, con la pantalla encendida o el Wake Lock activo, y el
teléfono sin bloquear manualmente, esta alarma suena fuerte, vibra y no se
detiene hasta que completas el reto de gratitud — así de directo.

Ahora la parte honesta: **ningún sitio web ni PWA puede garantizar que un
temporizador siga corriendo con el teléfono bloqueado y guardado**. Es una
restricción del sistema operativo (Android/iOS suspenden las pestañas en
segundo plano para ahorrar batería), no algo que se pueda resolver desde
JavaScript. El Wake Lock ayuda mientras la app está en primer plano y la
pantalla encendida, pero se libera en cuanto bloqueas el teléfono a mano.

Para depender de esta alarma con confianza real:
- Deja el teléfono cargando, con la pantalla accesible y la app abierta
  (no bloqueado) — así es como los relojes de alarma "de verdad" en la web
  logran sonar de forma confiable sin batería infinita.
- O, si quieres un respaldo cero-esfuerzo: pon **una sola** alarma nativa
  del teléfono a la misma hora (no diez) como disparador de emergencia; si
  esta app no llegó a sonar por estar el teléfono bloqueado, la nativa
  igual te despierta, y puedes abrir esta app para el resto de la
  experiencia (frases, gratitud, videos).
- Para una garantía real de "suena aunque el teléfono esté guardado y
  bloqueado toda la noche", el único camino es una app nativa de Android
  con `AlarmManager` (o iOS con permisos especiales de alertas críticas) —
  eso queda fuera de lo que una web/PWA puede prometer honestamente.

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
- Empaquetar como app nativa (Capacitor/Android) para lograr una alarma
  que suene incluso con el teléfono bloqueado — ver la sección de
  confiabilidad arriba.
- Estadísticas del diario de gratitud y del vigía (rachas, tareas más
  repetidas, etc).
- Íconos de PWA con diseño real (los actuales son un placeholder simple
  generado por código, no un diseño final).

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

Construido con React + Vite + TypeScript.
