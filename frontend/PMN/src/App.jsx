import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Devolucion from "./pages/devolucion";
import Solicitudes from "./pages/solicitudes.devolucion";
import SolicitudDetalle from "./pages/solicitud.detalle";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Crear devolución */}
      <Route path="/devolucion" element={<Devolucion />} />

      {/* Lista de solicitudes */}
      <Route path="/solicitudes" element={<Solicitudes />} />

      {/* Detalle de solicitud */}
      <Route path="/solicitudes/:id" element={<SolicitudDetalle />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;