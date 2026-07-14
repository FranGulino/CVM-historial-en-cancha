# El Fortín Digital — Historial en Cancha 🚀

🏢 Plataforma Web de Registro, Asistencia y Analítica del Hincha

El Fortín Digital es una solución web full-stack diseñada bajo una arquitectura moderna para los simpatizantes del Club Villa Mitre. El sistema funciona como el núcleo operativo del hincha, permitiéndole registrar de manera exacta su presencia en cada jornada deportiva (sea de local, visitante o a la distancia) y visualizar métricas de fidelidad y rendimiento en tiempo real basadas en los resultados reales del equipo.

La plataforma se conecta a un motor relacional en la nube para sincronizar dinámicamente el fixture del Torneo Federal A 2026 y las estadísticas acumuladas del usuario de forma instantánea.

---

## 📸 Interfaz del Sistema (Mística & Estadísticas)

| Dashboard General & Portal | Fixture & Control de Asistencia |
| :---: | :---: |
| **Sección Institucional** <br> *Cuenta regresiva en tiempo real, bienvenida interactiva y geolocalización del templo de Maipú y Necochea.* | **Fixture Federal A** <br> *Filtros avanzados por sede/resultado, buscador semántico y registro condicional según la localía.* |
| <img src="https://github.com/user-attachments/assets/daeb3760-b7d6-453f-9ce1-1bb7f5d104f6" width="100%" /> | <img src="https://github.com/user-attachments/assets/bb26902f-b8e2-41e6-a4fa-0626d3517ddb" width="100%" /> |

| Panel de Socio & Historial | Ecosistema del Hincha |
| :---: | :---: |
| **Perfil del Hincha** <br> *Métricas de efectividad de puntos, cálculo de fidelidad en tiempo real, carnet digital de socio (mostrando Partidos de Local y Viajes de Visitante), Tabla de Posiciones de la Hinchada (ranking de fidelidad) y tabla de asistencias.* | **Características de la Plataforma** <br><br> 🟢 **Autenticación Segura:** Sesiones con Clerk Auth integradas al flujo relacional.<br><br>⚫ **Base de Datos Serverless:** Persistencia robusta y ágil en Neon PostgreSQL.<br><br>🏆 **Ranking de Fidelidad:** Tabla de posiciones interactiva en tiempo real entre todos los hinchas registrados en la app.<br><br>🏟️ **Viajes de Visitante:** Registro exacto de viajes y partidos presenciales afuera del Fortín, sumando para tu rango de socio.<br><br>🟢 **Diseño UI Premium:** Modo oscuro inmersivo con Tailwind CSS diseñado a medida para el Villero. |
| <img src="https://github.com/user-attachments/assets/8c5b193f-00fb-4c8c-a4b7-d0bd7fe0b99c" width="100%" /> | *“A Villa Mitre yo lo sigo siempre a todos lados...”* <br><br> Este sistema representa la bitácora oficial de los simpatizantes del Tricolor. Un registro formal, exhaustivo y estético de cada paso que damos alentando al más grande del sur argentino. |

---

## 🛠️ Tech Stack (Ecosistema Tecnológico)

* **Framework:** Next.js (App Router) con TypeScript para garantizar tipado estricto y excelente performance en la renderización del servidor.
* **Base de Datos:** PostgreSQL administrado y hospedado de forma elástica en la nube mediante Neon Database.
* **ORM:** Prisma ORM para el modelado relacional de datos, control de de las tablas y consultas declarativas.
* **Autenticación:** Clerk Auth para la gestión segura de sesiones de usuarios y vinculación única de perfiles de hinchas con su ID de socio.
* **Estilos:** Tailwind CSS con una paleta de colores personalizada que respeta fielmente la identidad del Club (verde bosque, blanco y negro antracita).
* **Despliegue:** Vercel.

---

## 🧠 Desafíos Técnicos Resueltos & Arquitectura

### 1. Adaptación Dinámica de UI en Base a Reglas de Negocio (Localía)
Uno de los puntos clave de UX fue asegurar que los botones de acción para el hincha no permitieran registrar estados inconsistentes (como marcar *"Fui a la cancha"* en un partido que se jugaba a cientos de kilómetros de distancia de local).
* Se programó una capa lógica que evalúa dinámicamente la propiedad `sede` (Local/Visitante) de cada partido obtenido desde Neon DB.
* En base a este estado, el componente de React muta de forma condicional para renderizar el botón `🏟️ Fui a la cancha` o `✈️ De visitante`, garantizando la consistencia semántica en la bitácora del usuario.

### 2. Sincronización Segura de Usuarios Extensibles con Clerk Metadata
Para evitar la duplicación de datos sensibles y mantener la aplicación liviana, no se almacenan contraseñas ni datos personales en la base de datos de PostgreSQL.
* Toda la autenticación e información del perfil corre sobre la infraestructura segura de Clerk.
* Para generar la tarjeta de socio digital única (carnet), se consume de forma segura el ID de usuario de Clerk y se procesa del lado del servidor para generar un hash alfanumérico único para el usuario, simulando un número de credencial de socio inmutable.

### 3. Navegación Móvil de Alto Rendimiento (Mobile-First Floating Navigation)
Para maximizar el espacio de lectura en dispositivos móviles y replicar la experiencia de usuario de una aplicación móvil nativa (PWA):
* Se implementó un componente de navegación flotante tipo píldora (`bottom-tab`) fijado en la parte inferior de la pantalla (`fixed bottom-6`).
* Se utilizó un diseño híbrido con propiedades de CSS avanzadas como `backdrop-blur-md` y opacidades dinámicas sobre una paleta verde-oscura, logrando un efecto translúcido que permite leer el contenido del fixture por detrás al hacer scroll.
* Los enlaces de navegación (Club 🏛️, Partidos ⚽, Perfil 👤) calculan asíncronamente la ruta activa (`pathname`) para iluminar únicamente el ícono del módulo actual, evitando renderizados innecesarios.

---

## 🧑‍💻 Desarrollador
* **Franco Gulino** - *Sistemas / Desarrollador Full-Stack*
