import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Devolucion() {
  const [idPedido, setIdPedido] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { usuario, obtenerHeaders } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      if (!usuario?.id_cliente) {
        navigate("/login");
        return;
      }

      const res = await fetch(apiUrl("/api/solicitud"), {
        method: "POST",
        headers: obtenerHeaders(),
        body: JSON.stringify({
          id_pedido: idPedido,
          motivo,
          id_cliente: usuario.id_cliente,
        }),
      });

      const data = await res.json();
      setMensaje(data.mensaje || data.error || "Sin respuesta");
      
      if (res.ok) {
        setTimeout(() => {
          navigate("/mis-solicitudes");
        }, 2000);
      }
    } catch (err) {
      setMensaje("Error de conexion con el servidor");
    }

    setCargando(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f0f0f, #1f1f1f, #2a2a2a)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          padding: 25,
          borderRadius: 12,
          background: "rgba(30, 30, 30, 0.9)",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          border: "1px solid #333",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#e0e0e0" }}>
          Solicitar Devolucion
        </h2>

        <form onSubmit={handleSubmit}>
          <label>ID del Pedido:</label>
          <input
            type="text"
            value={idPedido}
            onChange={(e) => setIdPedido(e.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #444",
              background: "#111",
              color: "white",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <label>Motivo:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            rows={4}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #444",
              background: "#111",
              color: "white",
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 6,
              border: "none",
              background: cargando ? "#444" : "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {cargando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>

        {mensaje && (
          <div
            style={{
              marginTop: 20,
              padding: 10,
              borderRadius: 6,
              background: "#1a1a1a",
              border: "1px solid #333",
              color: "#ddd",
              textAlign: "center",
            }}
          >
            {mensaje}
          </div>
        )}

        {mensaje && (
          <button
            type="button"
            onClick={() => navigate("/mis-solicitudes")}
            style={{
              width: "100%",
              marginTop: 12,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #333",
              background: "#111",
              color: "#ddd",
              cursor: "pointer",
            }}
          >
            Ver mis solicitudes
          </button>
        )}
      </div>
    </div>
  );
}

export default Devolucion;
