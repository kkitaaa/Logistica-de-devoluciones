const mysql = require('mysql2');

// Conexión a la BD
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'logistica_devoluciones'
});