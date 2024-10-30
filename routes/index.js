const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');

router.post('/citas', citasController.crearCita);
router.get('/citas', citasController.obtenerCitas);
router.delete('/citas/:id', citasController.eliminarCita);

module.exports = router;

