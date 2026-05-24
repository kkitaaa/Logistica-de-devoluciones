import mysql from "mysql2/promise";

// Conexión a la BD
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "logistica_devoluciones"
});

export default connection;