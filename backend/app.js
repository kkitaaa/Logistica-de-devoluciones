const express = require('express');
const devolucionRoutes = require('./routes/devolucionRoutes');

const app = express();
app.use(express.json());

app.use('/api', devolucionesRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
