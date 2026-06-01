import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [numero_telefonico, setNumeroTelefonico] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            correo,
            password,
            numero_telefonico,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "credenciales_temp",
          JSON.stringify({
            correo,
            password,
          })
        );

        navigate("/login");
      } else {
        setMensaje(data.error || "Error al registrar");
      }
    } catch (error) {
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
        background: "#0f0f0f",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 420,
          padding: 25,
          borderRadius: 12,
          background: "#1a1a1a",
          color: "white",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Registro de Usuario
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre</label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#111",
              color: "white",
            }}
          />

          <label>Correo</label>

          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#111",
              color: "white",
            }}
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: 15,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#111",
              color: "white",
            }}
          />

          <label>Número Telefónico</label>

          <input
            type="tel"
            value={numero_telefonico}
            onChange={(e) =>
              setNumeroTelefonico(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              marginBottom: 20,
              borderRadius: 6,
              border: "1px solid #555",
              background: "#111",
              color: "white",
            }}
          />

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 6,
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {cargando
              ? "Registrando..."
              : "Crear Cuenta"}
          </button>
        </form>

        {mensaje && (
          <div
            style={{
              marginTop: 15,
              padding: 10,
              borderRadius: 6,
              background: "#111",
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

export default Register;