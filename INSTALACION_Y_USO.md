# Sistema de Logística de Devoluciones - PMN

Plataforma completa de gestión de devoluciones de productos con control de garantía, análisis de estado y evaluación técnica.

## 🎯 Características Implementadas

### ✅ Backend (Node.js + Express)
- ✅ Autenticación JWT con roles (cliente, operador_logistica, evaluador_tecnico, admin)
- ✅ Middleware de seguridad para verificar token y roles
- ✅ API RESTful completa con 16+ endpoints
- ✅ Validación automática de garantía
- ✅ Detección de inconsistencias entre motivo declarado y estado real
- ✅ Sistema de evaluación técnica
- ✅ Documentación Swagger (http://localhost:3000/api-docs)

### ✅ Frontend (React + Chakra UI)
- ✅ Sistema de autenticación completo
- ✅ Contexto de autenticación (AuthContext)
- ✅ Rutas protegidas por rol
- ✅ Formularios para crear solicitudes
- ✅ Tablas de visualización de solicitudes
- ✅ Panel de operador de logística
- ✅ Panel de evaluador técnico
- ✅ Interfaz responsiva (tema oscuro)

## 📋 Flujo de Devoluciones

1. **Cliente solicita devolución**
   - Ingresa número de pedido y motivo
   - Sistema valida garantía automáticamente

2. **Operador de Logística recepciona**
   - Registra estado real del producto
   - Sistema detecta inconsistencias

3. **Área de Evaluación Técnica analiza**
   - Revisa discrepancias si las hay
   - Determina resolución (reparación, reemplazo, reembolso, rechazo)

4. **Cliente recibe notificación**
   - Visualiza resolución final

## 🚀 Instalación y Uso

### Backend

```bash
cd backend

# Copiar archivo de configuración
cp .env.example .env

# Instalar dependencias
npm install

# Iniciar servidor
npm run dev
```

**URL Base:** http://localhost:3000

**Swagger Docs:** http://localhost:3000/api-docs

### Frontend

```bash
cd frontend/PMN

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**URL:** http://localhost:5173

## 🔑 Usuarios de Prueba

Para registrarse, selecciona uno de los siguientes roles:

| Rol | Permisos | Acciones |
|-----|----------|----------|
| Cliente | Crear solicitudes, ver propias | Nueva devolución, mis solicitudes |
| Operador Logística | Registrar recepción | Ver todas las solicitudes, registrar estado |
| Evaluador Técnico | Evaluar técnicamente | Ver solicitudes, determinar resolución |
| Admin | Acceso total | Todo |

## 📝 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Solicitudes
- `POST /api/solicitud` - Crear solicitud de devolución (cliente)
- `GET /api/solicitudes` - Listar todas las solicitudes (operadores)
- `GET /api/solicitudes/:id` - Ver detalles de solicitud
- `GET /api/mis-solicitudes/:id_cliente` - Mis solicitudes (cliente)
- `POST /api/solicitudes/:id/revision-logistica` - Registrar recepción (operador)
- `POST /api/solicitudes/:id/evaluacion-tecnica` - Evaluar técnicamente (evaluador)

### Otros
- `GET /api/clientes` - Listar clientes
- `GET /api/productos` - Listar productos
- `GET /api/pedidos` - Listar pedidos
- `GET /api/garantias` - Listar garantías

## 🔐 Seguridad

### ✅ Implementado
- JWT con expiración de 7 días
- Verificación de tokens en rutas protegidas
- Control de acceso basado en roles
- Headers con autenticación en todas las llamadas
- Protección de rutas en el frontend

### ⚠️ Para Producción
1. Cambiar `JWT_SECRET` en `.env` a un valor seguro
2. Usar HTTPS
3. Implementar CORS restrictivo
4. Agregar rate limiting
5. Validar todas las entradas

## 📁 Estructura del Proyecto

```
backend/
├── controllers/        # Lógica de rutas
├── services/          # Lógica de negocio
├── middleware/        # Autenticación y validación
├── routes/            # Definición de rutas
├── app.js             # Configuración Express
├── db.js              # Conexión a BD
└── .env.example       # Variables de entorno

frontend/PMN/
├── src/
│   ├── pages/         # Componentes de páginas
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Contextos (AuthContext)
│   ├── services/      # Llamadas a API
│   ├── App.jsx        # Ruteador principal
│   └── main.jsx       # Punto de entrada
```

## 🎨 Características UI

- Tema oscuro moderno
- Tablas responsivas
- Formularios validados
- Badges de estado con colores
- Mensajes de feedback (toast)
- Barra de usuario con logout
- Navegación intuitiva

## 📊 Estados de Solicitud

| Estado | Significado |
|--------|-------------|
| Aprobada | Pasa validación de garantía |
| Rechazada | Falla validación de garantía |
| Recepcionada | Operador registró estado |
| En revisión | Detectada inconsistencia |
| Reparación aprobada | Resolución: reparar |
| Reemplazo aprobado | Resolución: reemplazar |
| Reembolso aprobado | Resolución: reembolso |

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- Bcrypt
- Swagger JSDoc

### Frontend
- React 18
- Chakra UI
- React Router
- Context API

## 📝 Variables de Entorno

### Backend `.env`
```
JWT_SECRET=your-secret-key
SUPABASE_URL=your-supabase-url
SUPABASE_PUBLISHABLE_KEY=your-key
NODE_ENV=development
PORT=3000
```

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:3000
```

## ⚡ Próximas Mejoras

- [ ] Notificaciones por correo
- [ ] Auditoría de cambios
- [ ] Exportar reportes a PDF
- [ ] Búsqueda y filtrado avanzado
- [ ] Historial de cambios por solicitud
- [ ] Dashboard de estadísticas
- [ ] Integración con sistema de pagos

## 📧 Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.

---

**Desarrollado por:** Amanda García y Franco Araya
**Última actualización:** 2026-06-21
