# 🧪 Guía de Testing - Sistema PMN

Una guía paso a paso para verificar que todas las funcionalidades funcionan correctamente.

---

## ⚙️ Prerequisitos

- ✅ MySQL corriendo (XAMPP)
- ✅ Backend ejecutándose (`npm run dev`)
- ✅ Frontend ejecutándose (`npm run dev`)

---

## 🔐 Test 1: Autenticación Básica

### Registrar Usuario Cliente

```
1. Ir a http://localhost:5173
2. Completar formulario:
   - Nombre: Franco Prueba
   - Correo: franco.prueba@test.com
   - Contraseña: 123456
   - Teléfono: 987654321
   - Tipo de Cuenta: Cliente
3. Hacer clic en "Crear Cuenta"
4. ✅ Ver mensaje "Registro exitoso"
```

### Iniciar Sesión

```
1. En la pantalla de login:
   - Correo: franco.prueba@test.com
   - Contraseña: 123456
2. Hacer clic en "Iniciar Sesión"
3. ✅ Redirige a /home
4. ✅ Muestra nombre del usuario
```

---

## 👨‍💼 Test 2: Cliente - Crear Solicitud

### Ir a Home

```
1. Ya estás en /home
2. ✅ Ver tarjeta "Crear devolución"
3. ✅ Ver botón "Cerrar Sesión"
```

### Crear Solicitud de Devolución

```
1. Hacer clic en "Crear devolución"
2. Completar:
   - ID Pedido: 1
   - Motivo: Producto defectuoso, no funciona
3. Hacer clic en "Enviar Solicitud"
4. ✅ Ver mensaje de respuesta (aprobada/rechazada según garantía)
5. ✅ Redirige a /mis-solicitudes
```

### Ver Mis Solicitudes

```
1. Ya estás en /mis-solicitudes
2. ✅ Ver tabla con solicitudes
3. ✅ Ver estado de solicitud (Aprobada, Rechazada, etc.)
4. ✅ Ver información de la solicitud
5. Hacer clic en solicitud para ver detalle
```

---

## 🚚 Test 3: Operador Logística

### Registrar Operador

```
1. Ir a http://localhost:5173
2. Registrarse con:
   - Nombre: Carlos Operador
   - Correo: carlos.operador@test.com
   - Contraseña: 123456
   - Teléfono: 987654321
   - Tipo de Cuenta: Operador de Logística
3. ✅ Registro exitoso
```

### Iniciar Sesión

```
1. Login con credenciales de operador
2. ✅ Redirige a /solicitudes (NO a /home)
3. ✅ Ver lista de todas las solicitudes
```

### Ver todas las Solicitudes

```
1. Estás en /solicitudes
2. ✅ Ver tabla con TODAS las solicitudes (no solo las del cliente)
3. ✅ Ver rol "operador_logistica"
4. Hacer clic en una solicitud
```

### Registrar Recepción

```
1. En detalle de solicitud:
2. ✅ Ver solo sección "Recepción Logística"
3. NO verá sección "Evaluación Técnica"
4. Seleccionar estado del producto:
   - Nuevo
   - Usado
   - Defectuoso
   - Dañado
   - Incompleto
5. Agregar observación (opcional)
6. Hacer clic en "Registrar Recepción"
7. ✅ Ver confirmación
8. ✅ Actualiza estado automáticamente
```

### Detectar Inconsistencia

```
1. Crear otra solicitud desde cliente con:
   - Motivo: "Producto defectuoso"
2. Como operador, registrar:
   - Estado real: "Dañado" (NO defectuoso)
3. ✅ Sistema detecta inconsistencia
4. ✅ Cambia estado a "En revisión"
```

---

## 👨‍🔬 Test 4: Evaluador Técnico

### Registrar Evaluador

```
1. Ir a http://localhost:5173
2. Registrarse con:
   - Nombre: Ana Evaluadora
   - Correo: ana.evaluadora@test.com
   - Contraseña: 123456
   - Teléfono: 987654321
   - Tipo de Cuenta: Evaluador Técnico
3. ✅ Registro exitoso
```

### Iniciar Sesión

```
1. Login con credenciales
2. ✅ Redirige a /solicitudes
3. ✅ Ver lista de solicitudes
```

### Evaluar Solicitud

```
1. Hacer clic en solicitud con inconsistencia
2. ✅ Ver solo sección "Evaluación Técnica"
3. NO verá sección "Recepción Logística"
4. Seleccionar resolución:
   - Reparación
   - Reemplazo
   - Reembolso
   - Rechazo
5. Agregar análisis técnico
6. Hacer clic en "Guardar Resolución"
7. ✅ Ver confirmación
8. ✅ Estado cambia según resolución
```

---

## 🔐 Test 5: Seguridad y Control de Acceso

### Protección de Rutas

```
1. Cerrar sesión (logout)
2. Intentar acceder a http://localhost:5173/home
3. ✅ Redirige automáticamente a /login
```

### Control de Datos de Cliente

```
1. Como Cliente:
   - Ir a /mis-solicitudes
   - ✅ Ve solo sus solicitudes
2. Como Operador:
   - Acceder a /api/mis-solicitudes/1 en consola
   - ✅ Si es diferente cliente, error 403
```

### Control de Roles

```
1. Como Cliente:
   - Intentar acceder a /solicitudes
   - ✅ Muestra "Acceso Denegado"
2. Como Operador:
   - Intentar registrar evaluación
   - ✅ Formulario no aparece
```

### Token Expirado

```
1. Editar token en localStorage
2. Hacer un request
3. ✅ Devuelve error 401
4. ✅ Redirige a login
```

---

## 📊 Test 6: Flujo Completo Integrado

### Escenario: Franco solicita devolución, Carlos recepciona, Ana evalúa

#### Paso 1: Cliente (Franco) crea solicitud

```
1. Login como franco.prueba@test.com
2. Ir a /devolucion
3. Crear solicitud:
   - ID Pedido: 2
   - Motivo: Producto viene dañado
4. ✅ Sistema valida garantía
5. ✅ Aprobada si está en plazo
```

#### Paso 2: Operador (Carlos) recepciona

```
1. Logout (Franco)
2. Login como carlos.operador@test.com
3. Ir a /solicitudes
4. ✅ Ver la solicitud de Franco
5. Ver detalle
6. Registrar recepción:
   - Estado real: Defectuoso (inconsistencia!)
7. ✅ Sistema detecta inconsistencia
```

#### Paso 3: Evaluador (Ana) evalúa

```
1. Logout (Carlos)
2. Login como ana.evaluadora@test.com
3. Ir a /solicitudes
4. ✅ Ver solicitud con inconsistencia
5. Ver detalle
6. Registrar evaluación:
   - Resolución: Reemplazo
   - Análisis: "Producto defectuoso por fábrica"
7. ✅ Estado cambia a "Reemplazo aprobado"
```

#### Paso 4: Cliente (Franco) ve resultado

```
1. Logout (Ana)
2. Login como franco.prueba@test.com
3. Ir a /mis-solicitudes
4. ✅ Ver solicitud con estado "Reemplazo aprobado"
5. ✅ Ver timeline de cambios en detalle
```

---

## 🐛 Test 7: Casos de Error

### Credenciales Inválidas

```
1. Intentar login con:
   - Correo: inexistente@test.com
   - Contraseña: 123456
2. ✅ Ver error "Usuario no encontrado"
```

### Contraseña Incorrecta

```
1. Login con correo válido pero contraseña incorrecta
2. ✅ Ver error "Contraseña incorrecta"
```

### Email Duplicado

```
1. Intentar registrar con email ya existente
2. ✅ Ver error "El correo ya está registrado"
```

### Datos Faltantes

```
1. Intentar enviar formulario vacío
2. ✅ Navegador valida campos requeridos
3. Backend también valida:
   - ✅ Error 400 si faltan datos
```

---

## 📈 Test 8: Swagger API

### Ver Documentación

```
1. Ir a http://localhost:3000/api-docs
2. ✅ Ver lista de todos los endpoints
3. ✅ Ver estructura de request/response
4. ✅ Ver códigos de error esperados
```

### Probar un Endpoint

```
1. En Swagger, buscar POST /api/auth/login
2. Hacer clic en "Try it out"
3. Ingresar JSON:
   {
     "correo": "franco.prueba@test.com",
     "password": "123456"
   }
4. Hacer clic en "Execute"
5. ✅ Ver respuesta con token
```

---

## ✅ Checklist Final

Marcar cuando todo funciona:

- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Cliente puede crear solicitud
- [ ] Operador ve todas las solicitudes
- [ ] Operador puede registrar recepción
- [ ] Sistema detecta inconsistencias
- [ ] Evaluador puede evaluar
- [ ] Estados cambian automáticamente
- [ ] Rutas están protegidas
- [ ] Control de acceso por rol funciona
- [ ] Formularios validan datos
- [ ] Swagger documentación funciona
- [ ] Mensajes de error son claros
- [ ] UI es responsiva

**Si todos los checks están ✅, el sistema está completamente funcional.**

---

## 🆘 Solución de Problemas

### Backend no conecta

```bash
# Verificar que MySQL está corriendo
# Verificar que backend está en puerto 3000
# Ver logs en terminal
```

### Frontend no ve backend

```bash
# Verificar VITE_API_URL en navegador
# Ir a Console (F12)
# Ver errores de red
```

### Token no funciona

```bash
# Limpiar localStorage
localStorage.clear()
# Rellenar de nuevo
# Verificar token en developer tools
```

### Solicitud rechazada sin razón

```bash
# Verificar que producto tiene garantía válida
# Verificar fechas en base de datos
# Ver logs del backend
```

---

**Éxito con el testing! 🎉**

Última actualización: 2026-06-21
