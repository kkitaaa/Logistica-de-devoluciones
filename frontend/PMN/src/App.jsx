import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home";
import Devolucion from "./pages/solicitud";
import Solicitudes from "./pages/solicitudes.devolucion";
import SolicitudDetalle from "./pages/solicitud.detalle";
import Login from "./pages/login";
import Register from "./pages/registro";
import MisSolicitudes from "./pages/mis.solicitudes";
import OperadorSolicitudes from "./pages/operador.solicitudes";

function App() {
  return (
    <Routes>
      {/* Registro */}
      <Route path="/" element={<Register />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute rolesPermitidos={['cliente', 'operador_logistica', 'evaluador_tecnico', 'admin']}>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Crear devolución */}
      <Route
        path="/devolucion"
        element={
          <ProtectedRoute rolesPermitidos={['cliente', ]}>
            <Devolucion />
          </ProtectedRoute>
        }
      />

      {/* Lista de solicitudes (admin/operador) */}
      <Route
        path="/solicitudes"
        element={
          <ProtectedRoute rolesPermitidos={['operador_logistica', 'evaluador_tecnico', 'admin']}>
            <Solicitudes />
          </ProtectedRoute>
        }
      />

      {/* Detalle de solicitud */}
      <Route
        path="/solicitudes/:id"
        element={
          <ProtectedRoute>
            <SolicitudDetalle />
          </ProtectedRoute>
        }
      />

      {/* Mis solicitudes */}
      <Route
        path="/mis-solicitudes"
        element={
          <ProtectedRoute rolesPermitidos={['cliente']}>
            <MisSolicitudes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operador/solicitudes"
        element={
          <ProtectedRoute rolesPermitidos={["operador_logistica"]}>
            <OperadorSolicitudes />
          </ProtectedRoute>
        }
/>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

  );
}

export default App;