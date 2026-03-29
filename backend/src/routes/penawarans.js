const router = require('express').Router();
const PenawaranController = require('../controllers/penawaranController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, PenawaranController.getAll);
router.post('/', auth, authorize('masyarakat'), PenawaranController.create);

module.exports = router;
