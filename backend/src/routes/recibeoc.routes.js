const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recibeoc.controller');

// GET    /api/recibeoc              → todos los registros
// GET    /api/recibeoc/:id          → por ID
// GET    /api/recibeoc/folio/:folio → por folio
// PUT    /api/recibeoc/:id          → actualizar
// DELETE /api/recibeoc/:id          → eliminar (con backup)

router.get('/', ctrl.getAll);
router.get('/folio/:folio', ctrl.getByFolio);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
