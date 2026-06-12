const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const { db }     = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recibeoc
// Todos los registros de recibeoc con join a ordencompra
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/recibeoc', (req, res) => {
  const sql = `
    SELECT r.*,
           o.depto,
           o.forden
    FROM recibeoc r
    LEFT JOIN ordencompra o
           ON r.claveg  = o.claveg
          AND r.claves  = o.claves
          AND r.clavec  = o.clavec
          AND r.clavedp = o.clavedp
          AND r.folio   = o.folio
          AND r.renglon = o.renglon
    ORDER BY r.id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recibeoc/folio/:folio
// Registros de recibeoc filtrados por folio
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/recibeoc/folio/:folio', (req, res) => {
  const { folio } = req.params;
  const sql = `
    SELECT * FROM recibeoc
    WHERE folio = ?
    ORDER BY renglon
  `;
  db.query(sql, [folio], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recibeoc/:id
// Un registro por ID
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/recibeoc/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM recibeoc WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(rows[0]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/recibeoc/:id
// Actualizar un registro de recibeoc
// ─────────────────────────────────────────────────────────────────────────────
app.put('/api/recibeoc/:id', (req, res) => {
  const { id } = req.params;
  const {
    folio, cantidad, frecibida, hrecibida, renglon, factura,
    observacion, nosemana, umedida, precio, claveg, claves,
    clavedp, clavec, clavepro, material, provedor, usuario,
    horaini, horafin, fechafac, estatus
  } = req.body;

  const sql = `
    UPDATE recibeoc SET
      folio       = ?,
      cantidad    = ?,
      frecibida   = ?,
      hrecibida   = ?,
      renglon     = ?,
      factura     = ?,
      observacion = ?,
      nosemana    = ?,
      umedida     = ?,
      precio      = ?,
      claveg      = ?,
      claves      = ?,
      clavedp     = ?,
      clavec      = ?,
      clavepro    = ?,
      material    = ?,
      provedor    = ?,
      usuario     = ?,
      horaini     = ?,
      horafin     = ?,
      fechafac    = ?,
      estatus     = ?
    WHERE id = ?
  `;

  db.query(sql, [
    folio, cantidad, frecibida, hrecibida, renglon, factura,
    observacion, nosemana, umedida, precio, claveg, claves,
    clavedp, clavec, clavepro, material, provedor, usuario,
    horaini, horafin, fechafac, estatus,
    id
  ], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ message: 'Registro actualizado correctamente' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/recibeoc/:id
// Eliminar registro y guardarlo en recibeoc_backup
// ─────────────────────────────────────────────────────────────────────────────
app.delete('/api/recibeoc/:id', (req, res) => {
  const { id } = req.params;
  const eliminado_por = req.body.eliminado_por || 'sistema';

  // 1. Buscar el registro original
  db.query('SELECT * FROM recibeoc WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });

    const r = rows[0];

    // 2. Insertar en backup
    const sqlBackup = `
      INSERT INTO recibeoc_backup (
        id_original, folio, cantidad, frecibida, hrecibida,
        renglon, factura, observacion, nosemana, umedida, precio,
        claveg, claves, clavedp, clavec, clavepro, material,
        provedor, usuario, horaini, horafin, fechafac, estatus,
        fecha_eliminacion, eliminado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    db.query(sqlBackup, [
      r.id, r.folio, r.cantidad, r.frecibida, r.hrecibida,
      r.renglon, r.factura, r.observacion, r.nosemana, r.umedida, r.precio,
      r.claveg, r.claves, r.clavedp, r.clavec, r.clavepro, r.material,
      r.provedor, r.usuario, r.horaini, r.horafin, r.fechafac, r.estatus,
      eliminado_por
    ], (errBackup) => {
      if (errBackup) return res.status(500).json(errBackup);

      // 3. Eliminar el original
      db.query('DELETE FROM recibeoc WHERE id = ?', [id], (errDel) => {
        if (errDel) return res.status(500).json(errDel);
        res.json({ message: 'Registro eliminado y respaldado correctamente' });
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ordencompra
// Todas las órdenes de compra
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/ordencompra', (req, res) => {
  db.query(
    'SELECT * FROM ordencompra ORDER BY folio DESC, renglon',
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ordencompra/folio/:folio
// Órdenes de compra por folio
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/ordencompra/folio/:folio', (req, res) => {
  const { folio } = req.params;
  db.query(
    'SELECT * FROM ordencompra WHERE folio = ? ORDER BY renglon',
    [folio],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({ error: 'Orden no encontrada' });
      res.json(rows);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ordencompra/estatus/:estatus
// Órdenes de compra por estatus
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/ordencompra/estatus/:estatus', (req, res) => {
  const { estatus } = req.params;
  db.query(
    'SELECT * FROM ordencompra WHERE estatus = ? ORDER BY folio DESC',
    [estatus],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 AdminProcesos API corriendo en http://localhost:${PORT}`);
});
