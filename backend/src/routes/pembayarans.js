const router = require('express').Router();
const PembayaranController = require('../controllers/pembayaranController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, PembayaranController.getAll);
router.post('/', auth, authorize('masyarakat'), PembayaranController.create);
router.put('/:id/verify', auth, authorize('petugas', 'admin'), PembayaranController.verify);

module.exports = router;
