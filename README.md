```text
 ██████╗██╗  ██╗██████╗ ██╗███████╗██████╗ ███████╗██╗   ██╗
██╔════╝██║  ██║██╔══██╗██║╚══███╔╝██╔══██╗██╔════╝██║   ██║
██║     ███████║██████╔╝██║  ███╔╝ ██║  ██║█████╗  ██║   ██║
██║     ██╔══██║██╔══██╗██║ ███╔╝  ██║  ██║██╔══╝  ╚██╗ ██╔╝
╚██████╗██║  ██║██║  ██║██║███████╗██████╔╝███████╗ ╚████╔╝ 
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═════╝ ╚══════╝  ╚═══╝  
```

# Christian Romero (ChrizDev) - Portfolio Profesional 🚀

¡Bienvenido a mi repositorio de portafolio y CV digital! Este proyecto aloja el código fuente de mi landing page interactiva y mi hoja de vida imprimible y responsive, rediseñado para destacar mi enfoque en el desarrollo de software moderno con especialización en **Inteligencia Artificial y Automatización de Procesos**.

---

## 👤 Perfil Profesional

Soy un **Junior Software Developer** enfocado en la automatización de procesos mediante la aplicación de Inteligencia Artificial. Cuento con experiencia en el diseño e implementación de sistemas de gestión documental inteligente, logrando extraer información estructurada a partir de fuentes de datos complejas y no estructuradas.

### 🌟 Mis Diferenciales Técnicos:
* **Orquestación de IA:** Integración estratégica de LLMs comerciales y open-source (Groq, Gemini), OCR Multimodal y Prompt Engineering para entornos empresariales de alta exigencia.
* **Arquitectura de Software Resiliente:** Aplicación práctica de patrones de diseño de tolerancia a fallos (como *Circuit Breaker*) para garantizar la continuidad del software frente a cuellos de botella y límites de APIs externas (e.g. Rate Limits 429).
* **Soluciones Full Stack Integrales:** Diseño de bases de datos seguras con Supabase, esquemas PostgreSQL estructurados, anonimización de datos y despliegue rápido de interfaces web o móviles.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnologías Clave |
| :--- | :--- |
| **AI & Automation** | AI Orchestration (Groq/Gemini), OCR Multimodal, Prompt Engineering, Resiliencia de Sistemas |
| **Full Stack Development** | JavaScript (React), Node.js, Python, HTML5/CSS3, Flutter (Flame Engine), REST APIs, UI Nativa (CustomTkinter) |
| **Database & Architecture** | Supabase (PostgreSQL), SQL, Diseño de Esquemas, Trazabilidad de Datos, Auditoría de Sistemas |
| **Tecnologías Adaptativas** | Capacidad de rápida adopción a nuevos lenguajes, frameworks y stacks según las necesidades del negocio |

---

## 📂 Estructura del Proyecto

El código está organizado en dos copias sincronizadas (raíz y `public_html`) para garantizar la compatibilidad con servidores estáticos y herramientas de compilación local:

* `public_html/index.html` - La landing page interactiva con animaciones dinámicas de entrada e incrementos numéricos en scroll.
* `public_html/resumen.html` - Plantilla del CV imprimible optimizada. Se adapta como diseño fluido para móviles y tabletas, pero genera un formato A4 perfecto para guardarse como PDF al imprimir.
* `public_html/assets/` - Directorio de recursos:
  * `css/custom.css` - Estilos personalizados, paleta de colores para el Modo Oscuro y ajustes de responsividad móvil.
  * `js/custom.js` - Lógica de traducción dinámica (ES/EN), interruptor de Modo Oscuro, formulario de contacto asíncrono y animaciones GSAP/ScrollTrigger.

---

## 🚀 Características del Frontend

* **Animaciones de Alto Rendimiento:** Transiciones e incrementos numéricos implementados con **GSAP (GreenSock)** y controlados por el scroll a través de **ScrollTrigger**, optimizados con recálculos dinámicos en carga para evitar desfases.
* **Modo Oscuro Dinámico:** Implementación nativa con CSS Variables y persistencia en `localStorage`.
* **Soporte Multilingüe:** Cambios instantáneos de idioma (Español/Inglés) sin recargar la página.
* **Responsive Total:** Diseñado bajo Bootstrap 4.x y adaptado con CSS nativo para verse impecable desde smartphones de 320px de ancho hasta monitores UltraWide.

---

## 🛠️ Configuración Local

Si deseas correr este proyecto en tu entorno local para desarrollo:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Clona este repositorio e instala las dependencias de desarrollo:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo local con recarga automática en vivo (BrowserSync):
   ```bash
   npm start
   ```

---
Creado con 💻 por **Christian Romero (ChrizDev)**.
[Visita mi Perfil de GitHub](https://github.com/ChrisEna07)
