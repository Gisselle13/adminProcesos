const pool = require('../db/connection');

// ─── OBTENER TODOS LOS REGISTROS ────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, o.depto, o.forden
       FROM recibeoc r
       LEFT JOIN ordencompra o
         ON r.claveg = o.claveg
        AND r.claves = o.claves
        AND r.clavec = o.clavec
        AND r.clavedp = o.clavedp
        AND r.folio = o.folio
        AND r.renglon = o.renglon
       ORDER BY r.id DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getAll recibeoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── OBTENER UN REGISTRO POR ID ──────────────────────────────────────────────
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM recibeoc WHERE id = ?', [id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getById recibeoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ACTUALIZAR REGISTRO ─────────────────────────────────────────────────────
const update = async (req, res) => {
  const { id } = req.params;
  const {
    folio, cantidad, frecibida, hrecibida, renglon, factura,
    observacion, nosemana, umedida, precio, claveg, claves,
    clavedp, clavec, clavepro, material, provedor, usuario,
    horaini, horafin, fechafac, estatus
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE recibeoc SET
        folio = ?, cantidad = ?, frecibida = ?, hrecibida = ?,
        renglon = ?, factura = ?, observacion = ?, nosemana = ?,
        umedida = ?, precio = ?, claveg = ?, claves = ?,
        clavedp = ?, clavec = ?, clavepro = ?, material = ?,
        provedor = ?, usuario = ?, horaini = ?, horafin = ?,
        fechafac = ?, estatus = ?
       WHERE id = ?`,
      [
        folio, cantidad, frecibida, hrecibida,
        renglon, factura, observacion, nosemana,
        umedida, precio, claveg, claves,
        clavedp, clavec, clavepro, material,
        provedor, usuario, horaini, horafin,
        fechafac, estatus,
        id
      ]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });

    res.json({ success: true, message: 'Registro actualizado correctamente' });
  } catch (err) {
    console.error('update recibeoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ELIMINAR REGISTRO (con backup automático) ───────────────────────────────
const remove = async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Obtener el registro antes de eliminar
    const [rows] = await conn.query('SELECT * FROM recibeoc WHERE id = ?', [id]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    const registro = rows[0];

    // 2. Insertar en tabla de backup
    await conn.query(
      `INSERT INTO recibeoc_backup (
        id_original, folio, cantidad, frecibida, hrecibida, renglon, factura,
        observacion, nosemana, umedida, precio, claveg, claves, clavedp,
        clavec, clavepro, material, provedor, usuario, horaini, horafin,
        fechafac, estatus, fecha_eliminacion, eliminado_por
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        registro.id, registro.folio, registro.cantidad, registro.frecibida,
        registro.hrecibida, registro.renglon, registro.factura, registro.observacion,
        registro.nosemana, registro.umedida, registro.precio, registro.claveg,
        registro.claves, registro.clavedp, registro.clavec, registro.clavepro,
        registro.material, registro.provedor, registro.usuario, registro.horaini,
        registro.horafin, registro.fechafac, registro.estatus,
        req.body.eliminado_por || 'sistema'
      ]
    );

    // 3. Eliminar el registro original
    await conn.query('DELETE FROM recibeoc WHERE id = ?', [id]);

    await conn.commit();
    res.json({ success: true, message: 'Registro eliminado y respaldado correctamente' });
  } catch (err) {
    await conn.rollback();
    console.error('remove recibeoc:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
};

// ─── BUSCAR POR FOLIO ────────────────────────────────────────────────────────
const getByFolio = async (req, res) => {
  const { folio } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM recibeoc WHERE folio = ? ORDER BY renglon',
      [folio]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('getByFolio recibeoc:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, update, remove, getByFolio };
