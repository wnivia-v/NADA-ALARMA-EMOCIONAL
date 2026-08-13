# Guía de mentoría — NADA Alarma Emocional

Documento de estudio para explicar el proyecto en la sesión de mentoría:
qué es, por qué existe, cómo está construido, y cómo defender las
decisiones que se tomaron (incluyendo sus límites).

---

## 1. El pitch en 30 segundos

> "NADA Alarma Emocional" es una alarma que, en vez de solo hacer ruido,
> te obliga a un pequeño ejercicio mental de gratitud para apagarla, te
> da un empujón de energía con frases de películas y voz, y además vigila
> cuando te vas a hacer scroll en redes sociales para retarte a convertir
> ese tiempo en algo productivo.

Dos problemas reales que ataca:
1. Despertar sin ganas / sin energía emocional para empezar el día.
2. Perder horas haciendo scroll sin darte cuenta, en vez de usar ese
   tiempo en algo que te acerque a tus metas.

## 2. El problema (el "por qué")

- Las alarmas normales apagan el ruido, pero no cambian tu estado de
  ánimo. Te levantas igual de desanimado que antes de que sonara.
- El scroll en redes sociales (TikTok, Instagram) consume tiempo que
  podría ir a tareas productivas, y muchas veces no nos damos cuenta de
  cuánto tiempo pasó hasta que ya es tarde.
- La motivación externa (frases, voz, videos) ayuda a "romper el patrón"
  en el momento exacto en que más se necesita: al despertar, o justo
  después de una sesión larga de scroll.

## 3. Cómo funciona (flujo de usuario)

1. **Configuras una alarma** (hora, días de la semana, nombre).
2. **Personalizas el contenido**: frases propias, frases de películas
   (opcional), el idioma/acento de la voz, y opcionalmente escenas de
   YouTube/TikTok que quieras ver cuando suene.
3. **Suena la alarma**: pantalla completa, sirena real (sonido
   sintetizado) + vibración + voz leyendo frases + video si configuraste
   uno. No se apaga hasta que **escribes algo por lo que estás
   agradecido hoy**.
4. **Mientras usas el celular durante el día**, el "Vigía anti-scroll"
   detecta cuando vuelves a la app después de haber estado un buen rato
   fuera (cambiaste de pestaña/app). Te pregunta si fue scroll en redes;
   si dices que sí, te muestra una frase motivadora y te reta a escribir
   qué vas a hacer en vez de seguir scrolleando.
5. Todo el historial (gratitud, sesiones de scroll resueltas) queda
   guardado como un diario.

## 4. Funcionalidades clave

| Funcionalidad | Qué hace | Cómo está construida |
|---|---|---|
| Alarmas | Hora, nombre, días de repetición | `useAlarmClock` compara la hora actual contra las alarmas cada 5s |
| Reto de gratitud | No se apaga la alarma sin escribir algo | Botón "Apagar" deshabilitado hasta que el textarea tiene texto |
| Voz multi-idioma | Lee las frases en el acento que elijas | Web Speech API (`SpeechSynthesisUtterance`), 4 locales: es-ES, es-419, en-GB, en-US |
| Frases de películas | Citas cortas y atribuidas (Rocky, Gladiator, etc.) | Array curado con traducción propia al español, no doblaje oficial |
| Escenas de YouTube/TikTok | Videos reales incrustados durante la alarma | Embeds oficiales (`<iframe>` de YouTube, `blockquote` + script de TikTok); acepta también links cortos de TikTok resolviéndolos con su oEmbed público |
| Vigía anti-scroll | Detecta tiempo fuera de la app y te reta | Page Visibility API mide cuánto estuvo oculta la pestaña |
| IA (empujón motivacional) | Mensaje personalizado generado, no siempre el mismo texto | Groq (tier gratuito), mismo proveedor que el otro proyecto del equipo |
| Sonido + vibración + Wake Lock | La alarma suena de verdad y la pantalla no se apaga sola | Web Audio API (sirena sintetizada), Vibration API, Screen Wake Lock API |
| PWA instalable | Se agrega como app al celular, funciona offline | `vite-plugin-pwa` (manifest + service worker) |
| Todo se guarda localmente | No hay servidor ni base de datos | `localStorage` del navegador |

## 5. Stack tecnológico

- **React 19 + TypeScript + Vite** — frontend, sin backend.
- **Web APIs nativas del navegador** en vez de librerías externas:
  - `SpeechSynthesis` (voz)
  - `Web Audio API` (sonido de alarma)
  - `Vibration API`
  - `Screen Wake Lock API`
  - `Page Visibility API` (vigía anti-scroll)
- **Groq** como proveedor de IA (tier gratuito, sin tarjeta) — mismo
  patrón que ya usaba el otro proyecto del equipo, para no pagar.
- **vite-plugin-pwa** para convertir la app en instalable/offline.
- **localStorage** como única "base de datos" — cero infraestructura.

**Por qué este stack:** cero costo de hosting/backend, todo corre en el
navegador del usuario, y usa únicamente APIs web estándar en vez de
dependencias pesadas. Fácil de defender ante un mentor que pregunte "¿por
qué no un backend?": porque no hace falta para lo que resuelve el
proyecto, y mantiene el proyecto simple y gratis de operar.

## 6. Arquitectura del código (carpetas)

```
src/
  components/     Componentes de UI (uno por función: alarmas, frases,
                   videos, vigía, etc.)
  hooks/          Lógica con estado reutilizable (useAlarmClock,
                   useFocusWatchdog, useWakeLock)
  services/       Integraciones con APIs del navegador o externas
                   (voz, sonido de alarma, Groq)
  data/           Contenido curado (frases de películas, conceptos)
  storage.ts      Toda la persistencia en localStorage, centralizada
  types.ts        Los tipos de TypeScript de todo el dominio
  utils.ts        Funciones puras reutilizables (ids, parseo de URLs)
```

**Patrón usado:** cada pieza de estado persistente tiene su propio hook
(`useAlarmClock`, `useFocusWatchdog`) que encapsula la lógica y expone
solo lo que la UI necesita. Los componentes son "tontos" — reciben props
y disparan callbacks, no acceden a `localStorage` directamente.

## 7. Decisiones de diseño (y cómo defenderlas)

**"¿Por qué no hay backend?"**
Porque nada de lo que hace la app necesita compartir datos entre
dispositivos o usuarios — todo es personal y local. Un backend añadiría
costo y complejidad sin resolver un problema real del usuario.

**"¿Por qué frases de películas y no contenido 100% original?"**
Porque el objetivo es la energía emocional inmediata, y las frases de
películas ya tienen ese peso cultural. Se usaron citas cortas (una o dos
frases), con atribución clara a la película y el personaje, y traducción
propia al español (no un doblaje oficial) — un uso razonable de citas
breves, no una reproducción de contenido con derechos de autor.

**"¿Por qué no se automatizó la búsqueda de videos/contenido?"**
Decisión consciente: la app no busca ni sugiere contenido por su cuenta
(ni videos de YouTube/TikTok, ni contenido sensible). El usuario decide
qué pegar. Esto evita dos problemas: (1) atribuir citas o contenido que
no se pudo verificar contra una fuente primaria, y (2) automatizar la
búsqueda de contenido sensible (por ejemplo, videos de personas en
situaciones de sufrimiento real) para usarlo como "combustible
motivacional" — eso se consideró y se descartó explícitamente por razones
éticas.

**"¿Por qué se incluyó a un influencer controvertido (El Temach)?"**
Se agregó solo un concepto/mantra corto ("Modo Guerra") inspirado en su
marca personal — no una cita textual, porque no se pudo verificar
ninguna frase suya contra una fuente primaria. El README documenta
explícitamente que es una figura pública controvertida, para que quien
use la app decida con esa información si lo deja activado.

## 8. Limitaciones honestas (mejor decirlas tú antes de que las pregunten)

1. **La alarma no está 100% garantizada con el teléfono bloqueado toda la
   noche.** Ningún sitio web/PWA puede prometer eso — es una restricción
   del sistema operativo (Android/iOS suspenden pestañas en segundo plano
   para ahorrar batería), no algo resoluble con más código. Mitigación:
   Wake Lock mientras la app está en primer plano, y se recomienda dejar
   el teléfono cargando con la app abierta, o usar una sola alarma nativa
   como respaldo.
2. **El "vigía anti-scroll" no sabe qué app usaste**, solo cuánto tiempo
   estuviste fuera de esta pestaña. Detectar el uso real de TikTok/
   Instagram requeriría una app nativa con permisos especiales de Android
   (`PACKAGE_USAGE_STATS`), algo que una web no puede pedir.
3. **Las fotos/videos que subes a la biblioteca de medios no persisten**
   entre recargas (solo viven en la sesión del navegador) — es un TODO
   pendiente (migrar a IndexedDB).
4. **La API key de IA (Groq) queda visible en el bundle del navegador**
   si se despliega públicamente — válido para uso personal/local, no para
   un despliegue público sin backend intermedio.

Presentar estas limitaciones como decisiones informadas (no como
descuidos) suele dar mejor impresión en una mentoría que ocultarlas.

## 9. Preguntas que probablemente te haga el mentor

**"¿Cómo pruebas que funciona?"**
Se probó cada funcionalidad en navegador real (Playwright): se configuró
una alarma para la hora exacta y se verificó que sonara, vibrara, mostrara
el video y no se pudiera apagar sin escribir la gratitud; se probó el
flujo completo del vigía; se probaron los links de YouTube y TikTok
(incluyendo links cortos). Todo compila sin errores de TypeScript y sin
errores de consola.

**"¿Qué pasa si no configuro la IA?"**
La app funciona igual — usa solo las frases de películas y las propias,
sin necesidad de ninguna key. La IA es un "plus" opcional, no un
requisito.

**"¿Cómo escalarías esto?"**
Convertirlo en app nativa (Capacitor/Android) para lograr una alarma que
suene con el teléfono bloqueado; mover el almacenamiento de fotos/videos
a IndexedDB; agregar estadísticas del diario de gratitud.

**"¿Qué tan seguro es guardar todo en localStorage?"**
Es privado por diseño — nada sale del dispositivo del usuario, no hay
servidor que pueda filtrar datos. La contrapartida es que no hay backup
automático ni sincronización entre dispositivos.

## 10. Guion de demo sugerido (5 minutos)

1. Mostrar la pantalla principal y explicar los paneles rápido (10s c/u).
2. Agregar una alarma para "ahora mismo" (o usar el botón "Probar la
   pantalla ahora" del vigía para simular sin esperar).
3. Dejar que suene: mostrar sonido + vibración + voz + frase de película.
4. Intentar apagarla sin escribir nada (mostrar que el botón está
   deshabilitado) y luego completarla.
5. Mostrar el diario de gratitud con la entrada recién agregada.
6. Simular el vigía anti-scroll y completar el reto de "qué vas a hacer".
7. Cerrar mostrando el README con la sección de limitaciones — refuerza
   que el equipo entiende los límites técnicos de lo que construyó.

## 11. Roadmap (si preguntan "¿qué sigue?")

- App nativa (Capacitor) para alarma confiable con teléfono bloqueado.
- IndexedDB para persistir fotos/videos entre sesiones.
- Estadísticas del diario de gratitud y del vigía (rachas, tendencias).
- Soporte de más idiomas/acentos de voz.
- Íconos de PWA con diseño final (los actuales son un placeholder).

## 12. Glosario rápido

- **PWA (Progressive Web App):** una página web que se puede "instalar"
  como si fuera una app nativa (ícono, funciona offline).
- **Service Worker:** un script que corre en segundo plano en el
  navegador y permite cachear archivos para que la app funcione sin
  internet.
- **Web Audio API:** API del navegador para generar/reproducir sonido
  mediante código, sin archivos de audio.
- **Wake Lock API:** API del navegador para pedir que la pantalla no se
  apague automáticamente.
- **oEmbed:** un estándar que usan plataformas como YouTube/TikTok para
  que otros sitios puedan incrustar su contenido de forma oficial, sin
  descargarlo.
- **localStorage:** almacenamiento simple del navegador, persiste entre
  sesiones pero es local a ese dispositivo/navegador.
