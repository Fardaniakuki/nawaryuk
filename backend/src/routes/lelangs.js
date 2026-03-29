const router = require('express').Router();
const LelangController = require('../controllers/lelangController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, LelangController.getAll);
router.get('/:id', auth, LelangController.getById);
router.post('/', auth, authorize('admin'), LelangController.create);
router.put('/:id/tutup', auth, authorize('admin'), LelangController.tutup);
router.delete('/:id', auth, authorize('admin'), LelangController.delete);

module.exports = router;
