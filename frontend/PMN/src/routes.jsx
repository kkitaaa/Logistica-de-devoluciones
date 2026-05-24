import { Routes, Route } from "react-router-dom";
import Devolucion from "./pages/devolucion.jsx";
import Solicitudes from "./pages/Solicitudes";
import SolicitudDetalle from "./pages/SolicitudDetalle";
import Home from "./pages/home.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/solicitudes" element={<Solicitudes />} />
      <Route path="/solicitudes/:id" element={<SolicitudDetalle />} />
      <Route path="/devolucion" element={<Devolucion />} />
    </Routes>
  );
}