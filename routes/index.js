const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasController');
const { oauth2Client, getAuthUrl } = require('../config/googleAuth');

// Rutas para citas
router.post('/citas', citasController.crearCita);
router.get('/citas', citasController.obtenerCitas);
router.delete('/citas/:id', citasController.eliminarCita);
router.get('/google-calendar/events', citasController.obtenerEventos);

// Ruta para redirigir a Google para la autenticación
router.get('/auth/google', (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

// Ruta para manejar el callback de Google y obtener el token de acceso
router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.send('Autenticación exitosa');
    } catch (error) {
        res.status(500).send('Error de autenticación');
    }
});

module.exports = router;



