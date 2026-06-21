const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Rutas
const devolucionRoutes = require('./routes/devoluciones.routes');

app.use('/api', devolucionRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
  console.log('Swagger disponible en http://localhost:3000/api-docs');
});