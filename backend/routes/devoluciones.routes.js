const express = require('express');
const { procesarDevolucion } = require('../controllers/devoluciones.controller');
const router = express.Router();

router.post('/devolucion', procesarDevolucion);

module.exports = router;
