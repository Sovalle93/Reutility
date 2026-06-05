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
