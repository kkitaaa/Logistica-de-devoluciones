import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const credenciales = localStorage.getItem(
      "credenciales_temp"
    );

    if (credenciales) {
      const datos = JSON.parse(credenciales);

      setCorreo(datos.correo || "");
      setPassword(datos.password || "");

      localStorage.removeItem(
        "credenciales_temp"
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "usuario",
          JSON.stringify(data.usuario)
        );

        setMensaje(
          `Bienvenido ${data.usuario.nombre}`
        );

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMensaje(
          data.error ||
            "Error al iniciar sesión"
        );
      }
    } catch (error) {
      setMensaje(
        "Error de conexión con el servidor"
      );
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
          width: 380,
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
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Correo</label>

          <input
            type="email"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
            }
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
              boxSizing: "border-box",
            }}
          />

          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
              boxSizing: "border-box",
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
              ? "Ingresando..."
              : "Iniciar Sesión"}
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

export default Login;