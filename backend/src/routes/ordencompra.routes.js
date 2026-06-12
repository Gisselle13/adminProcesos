const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordencompra.controller');

// GET /api/ordencompra                    → todas
// GET /api/ordencompra/folio/:folio       → por folio
// GET /api/ordencompra/estatus/:estatus   → por estatus

router.get('/', ctrl.getAll);
router.get('/folio/:folio', ctrl.getByFolio);
router.get('/estatus/:estatus', ctrl.getByEstatus);

module.exports = router;
