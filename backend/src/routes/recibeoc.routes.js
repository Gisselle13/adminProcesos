const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recibeoc.controller');

// ─── RECIBEOC (registros activos) ───────────────────────────────────────────
// GET    /api/recibeoc                          → todos los registros
// GET    /api/recibeoc/folio/:folio             → todos los renglones de un folio
// GET    /api/recibeoc/:folio/:renglon          → un registro específico
// PUT    /api/recibeoc/:folio/:renglon          → actualizar registro
// DELETE /api/recibeoc/:folio/:renglon          → eliminar y hacer backup

router.get('/', ctrl.getAll);
router.get('/folio/:folio', ctrl.getByFolio);
router.get('/:folio/:renglon', ctrl.getByFolioRenglon);
router.put('/:folio/:renglon', ctrl.update);
router.delete('/:folio/:renglon', ctrl.remove);

// ─── RECIBEOC_BACKUP (registros eliminados) ──────────────────────────────────
// GET    /api/recibeoc/backup                   → todos los registros del backup
// GET    /api/recibeoc/backup/folio/:folio      → backup filtrado por folio
// POST   /api/recibeoc/backup/:folio/:renglon   → recuperar registro del backup

router.get('/backup', ctrl.getBackup);
router.get('/backup/folio/:folio', ctrl.getBackupByFolio);
router.post('/backup/:folio/:renglon/restore', ctrl.restore);

module.exports = router;
