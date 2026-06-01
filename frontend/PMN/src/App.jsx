import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Devolucion from "./pages/solicitud";
import Solicitudes from "./pages/solicitudes.devolucion";
import SolicitudDetalle from "./pages/solicitud.detalle";
import Login from "./pages/login";
import Register from "./pages/registro";
import MisSolicitudes from "./pages/mis.solicitudes";

function App() {
  return (
    <Routes>
      {/* Registro */}
      <Route path="/" element={<Register />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Home */}
      <Route path="/home" element={<Home />} />

      {/* Crear devolución */}
      <Route path="/devolucion" element={<Devolucion />} />

      {/* Lista de solicitudes */}
      <Route path="/solicitudes" element={<Solicitudes />} />

      {/* Detalle de solicitud */}
      <Route path="/solicitudes/:id" element={<SolicitudDetalle />} />

      {/* Mis solicitudes */}
      <Route path="/mis-solicitudes" element={<MisSolicitudes />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;