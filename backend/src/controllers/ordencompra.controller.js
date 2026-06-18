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

// ─── OBTENER UN RENGLÓN POR FOLIO + RENGLON ──────────────────────────────────
const getByFolioRenglon = async (req, res) => {
  const { folio, renglon } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ordencompra WHERE folio = ? AND renglon = ?',
      [folio, renglon]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getByFolioRenglon ordencompra:', err);
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

// ─── ACTUALIZAR RENGLÓN POR FOLIO + RENGLON ──────────────────────────────────
const update = async (req, res) => {
  const { folio, renglon } = req.params;
  const {
    claveg, claves, clavec, clavedp, depto,
    forden, horden, fcancelada, motivocan,
    clavepro, concepto, cantidad, precio,
    xtotal, moneda, estatus, provedor,
    nsemana, observa1, observa2, observa3,
    genera, umedida, porcentaje, subtotal,
    descuento, iva, ttotal, folioexp,
    fexpini, fexpfin, fentrega
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE ordencompra SET
        claveg = ?, claves = ?, clavec = ?, clavedp = ?, depto = ?,
        forden = ?, horden = ?, fcancelada = ?, motivocan = ?,
        clavepro = ?, concepto = ?, cantidad = ?, precio = ?,
        xtotal = ?, moneda = ?, estatus = ?, provedor = ?,
        nsemana = ?, observa1 = ?, observa2 = ?, observa3 = ?,
        genera = ?, umedida = ?, porcentaje = ?, subtotal = ?,
        descuento = ?, iva = ?, ttotal = ?, folioexp = ?,
        fexpini = ?, fexpfin = ?, fentrega = ?
       WHERE folio = ? AND renglon = ?`,
      [
        claveg, claves, clavec, clavedp, depto,
        forden, horden, fcancelada, motivocan,
        clavepro, concepto, cantidad, precio,
        xtotal, moneda, estatus, provedor,
        nsemana, observa1, observa2, observa3,
        genera, umedida, porcentaje, subtotal,
        descuento, iva, ttotal, folioexp,
        fexpini, fexpfin, fentrega,
        folio, renglon
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });

    res.json({ success: true, message: 'Orden de compra actualizada correctamente' });
  } catch (err) {
    console.error('update ordencompra:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getByFolio, getByFolioRenglon, getByEstatus, update };
