
const express = require('express');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// Configuración Swagger
const swaggerFiles = path.join(__dirname, 'routes', '*.js').replace(/\\/g, '/');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Devoluciones",
      version: "1.0.0",
      description: "Prototipo mínimo navegable para devoluciones"
    }
  },
  apis: [swaggerFiles],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
const devolucionRoutes = require('./routes/devoluciones.routes');
app.use('/api', devolucionRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
  console.log("Swagger disponible en http://localhost:3000/api-docs");
});
