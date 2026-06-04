# Reutility 🌳

**Plataforma municipal para la gestión colaborativa de espacios públicos**

Reutility es una aplicación web y móvil (futuro) que conecta a ciudadanos con sus plazas urbanas, permitiendo calificar, comentar, reportar alertas y colaborar en el mantenimiento de los espacios públicos.

## 🚀 Demo actual (MVP)

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Estado:** 1 plaza piloto (Plaza de Armas, Santiago)

## 📋 Funcionalidades implementadas

- ✅ Visualización de plazas
- ✅ Sistema de calificaciones (1-5 estrellas)
- ✅ Comentarios ciudadanos
- ✅ Cálculo automático de rating promedio
- ✅ Arquitectura modular escalable

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL, pg (node-postgres) |
| Estado | TanStack Query (React Query) |
| Estilos | Tailwind CSS v3 |

## 📁 Estructura del proyecto
Reutility/
├── client/ # Frontend React
│ ├── src/
│ │ ├── modules/ # Módulos por dominio
│ │ │ └── plazas/ # Módulo de plazas
│ │ ├── shared/ # Componentes compartidos
│ │ └── services/ # Conexión a API
│ └── package.json
├── server/ # Backend Node.js
│ ├── config/ # Configuración DB
│ ├── index.js # Servidor Express
│ └── package.json
└── database/ # Scripts SQL (no incluido)


## 🔧 Instalación y ejecución local

### Requisitos previos

- Node.js (v18 o superior)
- PostgreSQL (v16)
- Git

### Configuración de la base de datos

```sql
-- Crear base de datos
CREATE DATABASE reutility_dev;

-- Crear tabla plazas
CREATE TABLE plazas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    direccion TEXT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    descripcion TEXT,
    rating_promedio DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    plaza_id INTEGER REFERENCES plazas(id),
    usuario_nombre VARCHAR(100) DEFAULT 'Anónimo',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

Configuración del backend
bash

cd server
npm install
# Configurar conexión a PostgreSQL en config/db.js
node index.js

Configuración del frontend
bash

cd client
npm install

Acceso a la aplicación

    Frontend: http://localhost:5173

    Backend API: http://localhost:5000/api/plazas

📊 Próximas funcionalidades (hoja de ruta)

    Autenticación de usuarios (Google + Email)

    Integración con ClaveÚnica (opcional)

    Sistema de roles (ciudadano, inspector, fiscalizador)

    Alertas ciudadanas (basura, mantenimiento, vandalismo)

    Fiscalizaciones municipales con actas

    Ranking de plazas por municipio

    App móvil con Expo (comparte código con web)

    Geolocalización en tiempo real

    Subida de fotos y evidencias

    Notificaciones push

🏗️ Arquitectura

El proyecto está diseñado para escalar a una aplicación completa con:

    Monorepo (futuro) para compartir código entre web y móvil

    Multi-tenant por municipio

    Roles y permisos granulares

    Alta concurrencia con índices optimizados

📝 Licencia

Este proyecto es de código abierto.
👥 Autores

    Santiago Ovalle - Desarrollo inicial

🙏 Agradecimientos

    Municipalidad de Santiago por la inspiración

    Comunidad open source por las herramientas
