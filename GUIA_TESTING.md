# 🧪 Guía de Testing - Sistema de Logística de Devoluciones

Guía de validación funcional para verificar el flujo completo del sistema según los roles definidos.

---

## ⚙️ Prerrequisitos

Verificar que todos los servicios estén ejecutándose:

### Backend

```bash
cd backend
npm install
npm run dev

✅ API disponible en: http://localhost:3000

✅ Swagger disponible en: http://localhost:3000/api-docs

Frontend
cd frontend/pmn
npm install
npm run dev

✅ Aplicación disponible en: http://localhost:5173

🔐 Test 1: Autenticación
Registro de Usuario Cliente
1. Ir a http://localhost:5173
2. Seleccionar "Crear cuenta"
3. Completar:

   - Nombre: Juan Cliente
   - Correo: juan@test.com
   - Contraseña: 123456
   - Teléfono: 987654321

4. Presionar "Registrarse"

✅ Se muestra mensaje de registro exitoso.
✅ El usuario queda almacenado en la base de datos.
Inicio de Sesión
1. Ingresar correo y contraseña.

   - Correo: juan@test.com
   - Contraseña: 123456

2. Presionar "Iniciar sesión"

✅ Se genera un token JWT.
✅ Se almacena la sesión en localStorage.
✅ Se redirige al Home.
✅ Se muestra el nombre del usuario autenticado.
🏠 Test 2: Home Dinámico por Rol
Cliente
1. Iniciar sesión como cliente.

✅ Visualiza:

- Crear devolución
- Mis solicitudes
Operador de Logística
1. Iniciar sesión como operador_logistica.

✅ Visualiza:

- Recepcionar solicitudes
- Ver solicitudes
Evaluador Técnico
1. Iniciar sesión como evaluador_tecnico.

✅ Visualiza:

- Evaluar solicitudes
- Ver solicitudes
👤 Test 3: Cliente - Crear Solicitud
Ver Pedidos
1. Ingresar a "Mis pedidos".

✅ Se muestran únicamente los pedidos asociados al cliente autenticado.
Crear Solicitud de Devolución
1. Ir a "Crear devolución".
2. Seleccionar un pedido.
3. Ingresar motivo.

Ejemplo:

- Pedido: #5
- Motivo: Producto defectuoso

4. Presionar "Enviar solicitud".

✅ Se registra la solicitud.
✅ El sistema valida la garantía.
✅ El estado inicial se almacena correctamente.
Ver Mis Solicitudes
1. Ingresar a "Mis solicitudes".

✅ Se muestran únicamente las solicitudes del cliente.
✅ Se visualiza:

- ID
- Fecha
- Motivo
- Estado
🚚 Test 4: Operador de Logística
Acceso al Panel
1. Iniciar sesión con rol operador_logistica.

Datos: benja@test.cl
       1234

✅ El acceso está permitido.
✅ Se visualizan todas las solicitudes del sistema.
Registrar Recepción
1. Abrir una solicitud.
2. Seleccionar estado físico:

- Nuevo
- Usado
- Defectuoso
- Dañado

3. Ingresar observación.
4. Presionar "Registrar recepción".

✅ Se almacena:

- Estado del producto
- Observación
- Inconsistencia

✅ El estado de la solicitud se actualiza.
Detección de Inconsistencias
1. Crear una solicitud con motivo:

"Producto defectuoso"

2. Registrar recepción con estado:

"Dañado"

✅ El sistema detecta inconsistencia.
✅ La solicitud cambia a estado "En revisión".
👨‍🔬 Test 5: Evaluación Técnica
Acceso al Panel
1. Iniciar sesión con rol evaluador_tecnico.

Datos: franco@test.cl
       1234

✅ Puede acceder al módulo de evaluación.
Registrar Resolución
1. Abrir una solicitud en revisión.
2. Seleccionar resolución:

- Reparación
- Reemplazo
- Reembolso
- Rechazo

3. Agregar observación técnica.
4. Guardar evaluación.

✅ Se registra la resolución.
✅ El estado final se actualiza correctamente.
🔒 Test 6: Control de Acceso
Usuario sin Sesión
1. Cerrar sesión.
2. Intentar acceder manualmente a:

/home

✅ Redirige automáticamente a /login.
Restricción por Rol
1. Iniciar sesión como cliente.
2. Intentar acceder a:

/operador
/evaluacion

✅ Se muestra "Acceso denegado".
Restricción de Datos
1. Iniciar sesión como cliente.
2. Intentar consultar solicitudes de otro cliente.

✅ El backend responde con error 403.
🔄 Test 7: Flujo Completo
Escenario Completo
Paso 1: Cliente
1. Crear solicitud de devolución.

✅ Solicitud registrada.
Paso 2: Operador Logístico
1. Recepcionar producto.
2. Registrar estado físico.

✅ Se detecta consistencia o inconsistencia.
Paso 3: Evaluador Técnico
1. Revisar la solicitud.
2. Registrar resolución.

✅ Estado final actualizado.
Paso 4: Cliente
1. Revisar "Mis solicitudes".

✅ Visualiza la resolución final.
📄 Test 8: Swagger
Acceso a la Documentación
1. Ir a:

http://localhost:3000/api-docs

✅ Se muestran todos los endpoints.
Probar Login
POST /api/auth/login

{
  "correo": "juan@test.com",
  "password": "123456"
}

✅ Devuelve token JWT.

🐛 Test 9: Casos de Error
Credenciales Incorrectas
1. Ingresar contraseña errónea.

✅ Se muestra mensaje de error.
Token Inválido
1. Modificar el token en localStorage.
2. Realizar una petición.

✅ El backend responde 401.
Campos Vacíos
1. Enviar formularios incompletos.

✅ El frontend valida.
✅ El backend responde error 400.
✅ Checklist Final
 Registro de usuarios funcional
 Inicio de sesión funcional
 Cierre de sesión funcional
 JWT almacenado correctamente
 Home dinámico según rol
 Cliente crea solicitudes
 Cliente visualiza sus solicitudes
 Operador registra recepción
 Sistema detecta inconsistencias
 Evaluador registra resolución
 Estados cambian correctamente
 Protección de rutas funcional
 Restricción por roles funcional
 Swagger operativo
 Validaciones frontend y backend correctas
🆘 Solución de Problemas
El frontend no conecta al backend
Verificar:

- Backend ejecutándose en puerto 3000
- Variable VITE_API_URL
- Consola del navegador (F12)
Error 401
- Verificar token JWT
- Cerrar sesión
- Limpiar localStorage
- Iniciar sesión nuevamente
Error 403
- Verificar el rol del usuario
- Revisar middleware verificarRol()
No aparecen solicitudes
- Verificar datos en la base de datos
- Revisar respuesta de /api/solicitudes
- Confirmar permisos del usuario

Resultado esperado: el flujo Cliente → Operador → Evaluador debe completarse sin errores y con actualización correcta de estados.