const pool = require('../db/connection');

// ─── OBTENER TODAS LAS ÓRDENES ────────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ordencompra ORDER BY folio DESC, renglon'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAll ordencompra:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── OBTENER POR FOLIO ────────────────────────────────────────────────────────
const getByFolio = async (req, res) => {
  const { folio } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ordencompra WHERE folio = ? ORDER BY renglon',
      [folio]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getByFolio ordencompra:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── OBTENER POR ESTATUS ──────────────────────────────────────────────────────
const getByEstatus = async (req, res) => {
  const { estatus } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ordencompra WHERE estatus = ? ORDER BY folio DESC',
      [estatus]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getByEstatus ordencompra:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getByFolio, getByEstatus };
