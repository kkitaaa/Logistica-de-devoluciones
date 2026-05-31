import React, { useState } from "react";

function Devolucion() {
  const [idPedido, setIdPedido] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:3000/api/devolucion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_pedido: idPedido, motivo }),
      });

      const data = await res.json();
      setMensaje(data.mensaje || data.error || "Sin respuesta");
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
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
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Solicitar Devolución
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
            {cargando ? "Enviando..." : "Procesar Devolución"}
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
      </div>
    </div>
  );
}

export default Devolucion;