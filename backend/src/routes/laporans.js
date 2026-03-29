const router = require('express').Router();
const LaporanController = require('../controllers/laporanController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin', 'petugas'), LaporanController.get);

module.exports = router;
