const { listarGarantias } = require('../services/garantia.services');

async function obtenerGarantias(req, res) {
  try {
    const garantias = await listarGarantias();
    res.json(garantias);
  } catch (error) {
    console.error('Error al obtener garantías:', error);
    res.status(500).json({ error: 'Error al obtener garantías' });
  }
}

module.exports = { obtenerGarantias };
