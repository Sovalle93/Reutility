# Reutility 🌳

Plataforma municipal para la gestión colaborativa de espacios públicos.

---

## 🚀 Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React, Vite, Tailwind CSS, React Router, TanStack Query |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL |
| Autenticación | Google OAuth, JWT, bcrypt |

---

## 📋 Funcionalidades

- Visualización y búsqueda de plazas
- Calificaciones (1-5 estrellas)
- Comentarios (crear, editar, eliminar)
- Autenticación con Google o Email
- Perfil de usuario
- Notificaciones tipo toast

---

## 📁 Estructura

```
Reutility/
├── client/          # React frontend
├── server/          # Node.js backend
└── database/        # Scripts SQL
```

---

## 🔧 Instalación rápida

```bash
# Clonar
git clone https://github.com/Sovalle93/Reutility.git
cd Reutility

# Backend
cd server
npm install
cp .env.example .env  # Configurar variables
npm run dev

# Frontend (otra terminal)
cd client
npm install
npm run dev
```

---

## 🔐 Variables de entorno (backend)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=reutility_dev

JWT_SECRET=tu_clave_secreta
GOOGLE_CLIENT_ID=tu_id
GOOGLE_CLIENT_SECRET=tu_secreto
```

---

## 📊 Estado del proyecto

MVP funcional. Próximas features: roles, alertas, geolocalización, app móvil.

---

## 👥 Autor

Santiago Ovalle

---

## 📄 Licencia

Código abierto.
```