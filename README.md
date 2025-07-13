# Reto Simulacro SPA

Este proyecto es una **Single Page Application (SPA)** desarrollada para la administración de usuarios y cursos. Utiliza `Vite` como bundler moderno, `JSON Server` como backend simulado y está escrita principalmente en HTML, CSS y JavaScript.

## 📁 Estructura del Proyecto

```
Reto-simulacro-spa-main/
├── css/               # Estilos CSS
├── js/                # Módulos JS organizados por funcionalidad
├── public/            # Páginas estáticas HTML
├── index.html         # Página principal
├── script.js          # Script principal de la SPA
├── db.json            # Base de datos falsa para JSON Server
├── server.js          # Servidor backend con JSON Server y CORS
├── package.json       # Configuración del proyecto y dependencias
└── .gitignore         # Archivos ignorados por Git
```

## 🚀 Características

- Interfaz de administración tipo panel.
- Gestión de usuarios y cursos.
- SPA con rutas manejadas desde el frontend.
- Autenticación simulada.
- Backend simulado con `json-server`.
- Estilo moderno con estructura de dashboard lateral.

## 🛠️ Instalación

1. Clona el repositorio o descomprime este archivo.
2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor backend:

```bash
node server.js
```

4. En otra terminal, inicia el entorno de desarrollo:

```bash
npm run dev
```

5. Abre la aplicación en tu navegador en `http://localhost:5173`.

## 🧪 Dependencias

- [Vite](https://vitejs.dev/)
- [JSON Server](https://github.com/typicode/json-server)
- [CORS](https://www.npmjs.com/package/cors)

## 📄 Notas

- El archivo `db.json` contiene los datos simulados (usuarios, cursos, etc.).
- El login está basado en validación simulada desde el frontend.
- La navegación es controlada por JavaScript, sin recargar la página.

## 📌 Autor y Repositorio

Repositorio original: [https://github.com/Crismiau/Reto-SPA](https://github.com/Crismiau/Reto-SPA)
