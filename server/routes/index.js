const express = require('express');
const router = express.Router();

router.use('/usuarios', require('./usuarios'));
router.use('/login', require('./login'));
router.use('/gerencias', require('./gerencias'));
router.use('/grupos', require('./grupos'));
// app.use(require('./categoria'));
// app.use(require('./producto'));
// app.use(require('./upload'));
// app.use(require('./imagenes'));


module.exports = router;