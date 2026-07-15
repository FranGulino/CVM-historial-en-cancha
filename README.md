# El Fortín Digital — Historial en Cancha 🚀

🏢 Plataforma Web de Registro, Asistencia y Analítica del Hincha

El Fortín Digital es una solución web full-stack diseñada bajo una arquitectura moderna para los simpatizantes del Club Villa Mitre. El sistema funciona como el núcleo operativo del hincha, permitiéndole registrar de manera exacta su presencia en cada jornada deportiva (sea de local, visitante o a la distancia) y visualizar métricas de fidelidad y rendimiento en tiempo real basadas en los resultados reales del equipo.

La plataforma se conecta a un motor relacional en la nube para sincronizar dinámicamente el fixture del Torneo Federal A 2026 y las estadísticas acumuladas del usuario de forma instantánea.

---

## 🌐 Demo En Vivo

Podés acceder a la versión de producción aquí: **[El Fortín Digital (Vercel)](https://tu-app-de-vercel.vercel.app)** *(Reemplazar con tu URL real)*

Si no querés registrarte con tu cuenta personal, podés iniciar sesión con estas credenciales de prueba para ver la plataforma con estadísticas reales de asistencia, racha del hincha y ranking ya precargados:
*   **Usuario (Username):** `invitadofortin`
*   **Contraseña:** `Fortin2026`

---

## 📸 Interfaz del Sistema (Mística & Estadísticas)

| Dashboard General & Portal | El Asistente: DT Inteligente 🤖 |
| :---: | :---: |
| **Sección Institucional** <br> *Cuenta regresiva en tiempo real, bienvenida interactiva y geolocalización del templo de Maipú y Necochea.* | **Chatbot del Vestuario** <br> *Asistente interactivo con IA (Gemini) en formato widget flotante, con preguntas sugeridas y respuestas con mística villera.* |
| <img width="1830" height="3952" alt="cvm-historial-en-cancha vercel app_" src="https://github.com/user-attachments/assets/2b0e4249-cdb6-4df0-9229-e01069e8acd1" /> | <img width="1830" height="3952" alt="cvm-historial-en-cancha vercel app_ (1)" src="https://github.com/user-attachments/assets/cd2f997b-6f3d-4784-975e-e5c3e0c471a0" /> |

| Control de Asistencia | Ecosistema del Hincha |
| :---: | :---: |
| **Fixture Federal A** <br> *Filtros avanzados por sede/resultado, buscador semántico y registro condicional según la localía de cada partido.* | **Características de la Plataforma** <br><br> 🟢 **Autenticación Segura:** Sesiones con Clerk Auth integradas al flujo relacional.<br><br>⚫ **Base de Datos Serverless:** Persistencia robusta y ágil en Neon PostgreSQL.<br><br>🏆 **Ranking de Fidelidad:** Tabla de posiciones interactiva en tiempo real entre todos los hinchas registrados.<br><br>🏟️ **Viajes de Visitante:** Registro de viajes y partidos presenciales afuera del Fortín, sumando para tu rango de socio.<br><br>🟢 **Diseño UI Premium:** Modo oscuro inmersivo con Tailwind CSS diseñado a medida para el Villero. |
| <img width="1830" height="4714" alt="cvm-historial-en-cancha vercel app_ (2)" src="https://github.com/user-attachments/assets/660dc323-4644-4940-ab31-1809c603a699" /> | <img width="1830" height="4332" alt="cvm-historial-en-cancha vercel app_ (3)" src="https://github.com/user-attachments/assets/d4296051-7bdf-4d29-ad30-de0c0e986506" /> |

---

## 🛠️ Tech Stack (Ecosistema Tecnológico)

* **Framework:** Next.js (App Router) con TypeScript para garantizar tipado estricto y excelente performance en la renderización del servidor.
* **Inteligencia Artificial:** API de Google Gemini (SDK `@google/generative-ai`) para el motor del chatbot.
* **Base de Datos:** PostgreSQL administrado y hospedado de forma elástica en la nube mediante Neon Database.
* **ORM:** Prisma ORM para el modelado relacional de datos, control de las tablas y consultas de bases de datos.
* **Autenticación:** Clerk Auth para la gestión segura de sesiones de usuarios y vinculación única de perfiles de hinchas con su ID de socio.
* **Estilos:** Tailwind CSS con una paleta de colores personalizada que respeta fielmente la identidad del Club (verde bosque, blanco y negro antracita).
* **Despliegue:** Vercel.

---

## 🧠 Desafíos Técnicos Resueltos & Arquitectura

### 1. Integración de IA Contextualizada (Patrón RAG con Gemini)
En lugar de implementar un chatbot con respuestas preprogramadas o dejar que la IA simule datos libres de internet, implementamos un flujo de **Generación Aumentada por Recuperación (RAG)**:
* El backend en `app/api/chat/route.ts` intercepta la sesión del usuario a través de Clerk y consulta en tiempo real la base de datos de Neon DB para extraer estadísticas del hincha (su racha de asistencia actual) y la fecha de los partidos del fixture.
* Esta información se inyecta dinámicamente en el *System Prompt* de Gemini junto a un filtro sanitario institucional de Villa Mitre que impide que el bot invente datos o hable de temas ajenos al club, garantizando respuestas 100% precisas, seguras y contextualizadas.

### 2. Adaptación Dinámica de UI en Base a Reglas de Negocio (Localía)
Uno de los puntos clave de UX fue asegurar que los botones de acción para el hincha no permitieran registrar estados inconsistentes (como marcar *"Fui a la cancha"* en un partido que se jugaba a cientos de kilómetros de distancia de local).
* Se programó una capa lógica que evalúa dinámicamente la propiedad `sede` (Local/Visitante) de cada partido obtenido desde Neon DB.
* En base a este estado, el componente de React muta de forma condicional para renderizar el botón `🏟️ Fui a la cancha` o `✈️ De visitante`, garantizando la consistencia semántica en la bitácora del usuario.

### 3. Sincronización Segura de Usuarios Extensibles con Clerk Metadata
Para evitar la duplicación de datos sensibles y mantener la aplicación liviana, no se almacenan contraseñas ni datos personales en la base de datos de PostgreSQL.
* Toda la autenticación e información del perfil corre sobre la infraestructura segura de Clerk.
* Para generar la tarjeta de socio digital única (carnet), se consume de forma segura el ID de usuario de Clerk y se procesa del lado del servidor para generar un hash alfanumérico único para el usuario, simulando un número de credencial de socio inmutable.

### 4. Navegación Móvil de Alto Rendimiento (Mobile-First Floating Navigation)
Para maximizar el espacio de lectura en dispositivos móviles y replicar la experiencia de usuario de una aplicación móvil nativa (PWA):
* Se implementó un componente de navegación flotante tipo píldora (`bottom-tab`) fijado en la parte inferior de la pantalla (`fixed bottom-6`).
* Se utilizó un diseño híbrido con propiedades de CSS avanzadas como `backdrop-blur-md` y opacidades dinámicas sobre una paleta verde-oscura, logrando un efecto translúcido que permite leer el contenido del fixture por detrás al hacer scroll.
* Los enlaces de navegación (Club 🏛️, Partidos ⚽, Perfil 👤) calculan asíncronamente la ruta activa (`pathname`) para iluminar únicamente el ícono del módulo actual, evitando renderizados innecesarios.

---

## 🧑‍💻 Desarrollador
* **Franco Gulino** - *Sistemas / Desarrollador Full-Stack*
