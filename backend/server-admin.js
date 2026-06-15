const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const { db }     = require('./db');
const https = require('https');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recibeoc
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
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/recibeoc/folio/:folio', (req, res) => {
  const { folio } = req.params;
  db.query(
    'SELECT * FROM recibeoc WHERE folio = ? ORDER BY renglon',
    [folio],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recibeoc/:id
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/recibeoc/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM recibeoc WHERE folio = ?', [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(rows[0]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/recibeoc/:id
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
// DELETE /api/recibeoc/:id  →  eliminar + backup
// ─────────────────────────────────────────────────────────────────────────────
app.delete('/api/recibeoc/:id', (req, res) => {
  const { id } = req.params;
  const eliminado_por = req.body.eliminado_por || 'sistema';

  db.query('SELECT * FROM recibeoc WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ error: 'Registro no encontrado' });

    const r = rows[0];

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

      db.query('DELETE FROM recibeoc WHERE id = ?', [id], (errDel) => {
        if (errDel) return res.status(500).json(errDel);
        res.json({ message: 'Registro eliminado y respaldado correctamente' });
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/ordencompra
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
// PUT /api/ordencompra/:folio/:renglon
// Actualizar un renglón de orden de compra (PK compuesta: folio + renglon)
// ─────────────────────────────────────────────────────────────────────────────
app.put('/api/ordencompra/:folio/:renglon', (req, res) => {
  const { folio, renglon } = req.params;
  const {
    forden, horden, fcancelada, motivocan, clavepro, concepto,
    cantidad, precio, xtotal, moneda, estatus, provedor, nsemana,
    observa1, observa2, observa3, genera, umedida, porcentaje,
    subtotal, descuento, iva, ttotal, folioexp, fexpini, fexpfin, fentrega
  } = req.body;

  const sql = `
    UPDATE ordencompra SET
      forden      = ?,
      horden      = ?,
      fcancelada  = ?,
      motivocan   = ?,
      clavepro    = ?,
      concepto    = ?,
      cantidad    = ?,
      precio      = ?,
      xtotal      = ?,
      moneda      = ?,
      estatus     = ?,
      provedor    = ?,
      nsemana     = ?,
      observa1    = ?,
      observa2    = ?,
      observa3    = ?,
      genera      = ?,
      umedida     = ?,
      porcentaje  = ?,
      subtotal    = ?,
      descuento   = ?,
      iva         = ?,
      ttotal      = ?,
      folioexp    = ?,
      fexpini     = ?,
      fexpfin     = ?,
      fentrega    = ?
    WHERE folio = ? AND renglon = ?
  `;

  db.query(sql, [
    forden, horden, fcancelada, motivocan, clavepro, concepto,
    cantidad, precio, xtotal, moneda, estatus, provedor, nsemana,
    observa1, observa2, observa3, genera, umedida, porcentaje,
    subtotal, descuento, iva, ttotal, folioexp, fexpini, fexpfin, fentrega,
    folio, renglon
  ], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Renglón no encontrado' });
    res.json({ message: 'Orden de compra actualizada correctamente' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


const PORT = 3007;

const options = {
  key: fs.readFileSync('/etc/pki/tls/certs/comando.mx.key'),
  cert: fs.readFileSync('/etc/pki/tls/certs/comando.mx.crt')
};

https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AdminProcesos API HTTPS corriendo en https://0.0.0.0:${PORT}`);
});