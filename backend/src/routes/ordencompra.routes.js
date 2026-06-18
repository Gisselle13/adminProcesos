const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordencompra.controller');

// GET  /api/ordencompra                       → todas
// GET  /api/ordencompra/folio/:folio          → por folio (todos sus renglones)
// GET  /api/ordencompra/:folio/:renglon       → un renglón específico
// GET  /api/ordencompra/estatus/:estatus      → por estatus
// PUT  /api/ordencompra/:folio/:renglon       → actualizar renglón

router.get('/', ctrl.getAll);
router.get('/folio/:folio', ctrl.getByFolio);
router.get('/estatus/:estatus', ctrl.getByEstatus);
router.get('/:folio/:renglon', ctrl.getByFolioRenglon);
router.put('/:folio/:renglon', ctrl.update);

module.exports = router;
