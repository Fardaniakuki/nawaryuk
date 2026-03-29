const router = require('express').Router();
const BarangController = require('../controllers/barangController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, BarangController.getAll);
router.get('/:id', auth, BarangController.getById);
router.post('/', auth, authorize('admin', 'petugas'), BarangController.create);
router.put('/:id', auth, authorize('admin', 'petugas'), BarangController.update);
router.delete('/:id', auth, authorize('admin', 'petugas'), BarangController.delete);

module.exports = router;
