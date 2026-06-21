# Sistema de Logística de Devoluciones 🚚

Plataforma integral para gestionar devoluciones de productos con validación automática de garantía, análisis de estado y evaluación técnica.

## 📋 Estado del Proyecto

✅ **100% Funcional**
- ✅ Backend completamente implementado
- ✅ Frontend completamente implementado
- ✅ Autenticación JWT con roles
- ✅ Protección de rutas y datos
- ✅ Flujo completo de devoluciones

---

## 🚀 INICIO RÁPIDO

### 1. Preparar la Base de Datos

```bash
# Asegurarse de que MySQL esté corriendo (XAMPP o servicio)
# Ejecutar el script que está en bd.txt
```

### 2. Backend (Node + Express)

```bash
cd backend

# Copiar archivo de configuración
cp .env.example .env

# Instalar dependencias
npm install

# Levantar el servidor
npm run dev
```

✅ Backend en: http://localhost:3000
📚 API Docs: http://localhost:3000/api-docs

### 3. Frontend (React + Vite)

```bash
cd frontend/PMN

# Instalar dependencias
npm install

# Levantar desarrollo
npm run dev
```

✅ Frontend en: http://localhost:5173

### 4. Orden Correcto de Ejecución

```
1. MySQL / XAMPP (base de datos)
2. Backend (npm run dev en carpeta backend)
3. Frontend (npm run dev en carpeta frontend/PMN)
```

---

## 🔐 Autenticación y Roles

### Registrarse

1. Ir a http://localhost:5173
2. Llenar formulario con:
   - Nombre, correo, contraseña, teléfono
   - **Seleccionar rol:**
     - `cliente` - Crear y ver devoluciones
     - `operador_logistica` - Registrar recepción
     - `evaluador_tecnico` - Evaluar técnicamente
     - `admin` - Acceso total
3. Hacer clic en "Crear Cuenta"

### Iniciar Sesión

- Usar credenciales registradas
- Sistema guarda token automáticamente
- Acceso protegido según rol

---

## 📊 Flujo de Devoluciones

```
Cliente                 Operador Logística        Evaluador Técnico
   ↓                           ↓                           ↓
Solicitud Devolución → Registra Recepción → Evalúa Técnicamente
   ↓                           ↓                           ↓
Valida Garantía         Detecta Inconsistencias  Determina Resolución
   ↓                           ↓                           ↓
Aprobada/Rechazada      En Revisión              Reparación/Reemplazo
                                                  Reembolso/Rechazo
```

---

## 🔒 Seguridad Implementada

- ✅ **Autenticación JWT** - Tokens con expiración
- ✅ **Control de Roles** - Cada usuario solo ve/hace lo permitido
- ✅ **Rutas Protegidas** - Frontend redirige a login
- ✅ **Verificación de Token** - Backend valida cada request
- ✅ **Acceso por Cliente** - Clientes no pueden ver datos ajenos

---

## 📁 Estructura

```
Fase-2---PMN/
├── backend/
│   ├── controllers/        # Lógica de controladores
│   ├── services/           # Lógica de negocio
│   ├── middleware/         # Autenticación y validación
│   ├── routes/             # Definición de rutas
│   ├── app.js              # Servidor Express
│   └── .env.example        # Variables de entorno
│
├── frontend/PMN/
│   └── src/
│       ├── pages/          # Componentes de páginas
│       ├── components/     # Componentes reutilizables
│       ├── context/        # AuthContext (autenticación)
│       ├── services/       # Llamadas a API
│       └── App.jsx         # Rutas principales
│
├── INSTALACION_Y_USO.md    # Guía completa
└── CAMBIOS_IMPLEMENTADOS.md # Últimas actualizaciones
```

---

## 🎨 Características

### Para Clientes
- Crear solicitudes de devolución
- Ver estado de solicitudes
- Recibir resolución final

### Para Operadores
- Ver todas las solicitudes
- Registrar estado real del producto
- Sistema detecta automáticamente inconsistencias

### Para Evaluadores
- Analizar solicitudes con inconsistencias
- Determinar resolución final
- Registrar análisis técnico

### Para Admin
- Acceso completo a todas las funciones

---

## 📊 Endpoints Principales

| Método | Ruta | Autenticación | Rol |
|--------|------|---------------|-----|
| POST | `/api/auth/register` | No | Público |
| POST | `/api/auth/login` | No | Público |
| POST | `/api/solicitud` | Sí | cliente |
| GET | `/api/solicitudes` | Sí | operador/evaluador/admin |
| GET | `/api/mis-solicitudes/:id` | Sí | cliente |
| POST | `/api/solicitudes/:id/revision-logistica` | Sí | operador/admin |
| POST | `/api/solicitudes/:id/evaluacion-tecnica` | Sí | evaluador/admin |

---

## ⚙️ Configuración

### Backend `.env`

```env
JWT_SECRET=tu-secret-key-seguro
JWT_EXPIRES_IN=7d
SUPABASE_URL=tu_url_aqui
SUPABASE_PUBLISHABLE_KEY=tu_key_aqui
NODE_ENV=development
PORT=3000
```

### Frontend (Automático)

Por defecto: `http://localhost:3000`

---

## 🛠️ Tecnologías

### Backend
- Node.js & Express
- JWT para autenticación
- Bcrypt para contraseñas
- Swagger para documentación

### Frontend
- React 18
- Chakra UI para diseño
- React Router para navegación
- Context API para estado

---

## 📝 Notas Importantes

1. **Primera ejecución**: Asegúrate de tener MySQL corriendo
2. **Tokens**: El JWT dura 7 días
3. **Seguridad**: En producción, cambia JWT_SECRET a un valor seguro
4. **Persistencia**: Token y usuario se guardan en localStorage

---

## 📚 Documentación Adicional

- **[INSTALACION_Y_USO.md](INSTALACION_Y_USO.md)** - Guía completa
- **[CAMBIOS_IMPLEMENTADOS.md](CAMBIOS_IMPLEMENTADOS.md)** - Últimas actualizaciones
- **[API Swagger](http://localhost:3000/api-docs)** - Documentación interactiva

---

**Versión:** 1.0 Completa ✅
**Desarrollado por:** Amanda García y Franco Araya
**Última actualización:** 2026-06-21
