const Cita = require('../models').Cita;
const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleAuth');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Función para crear una cita
exports.crearCita = async (req, res) => {
    try {
        const { cliente, propiedad, fecha, hora, agenteId } = req.body;
        const nuevaCita = await Cita.create({ cliente, propiedad, fecha, hora, agenteId });
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

// Función para obtener todas las citas
exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll();
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

// Función para eliminar una cita
exports.eliminarCita = async (req, res) => {
    try {
        await Cita.destroy({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};

// Función para obtener eventos del calendario de Google
exports.obtenerEventos = async (req, res) => {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    calendar.events.list(
        {
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        },
        (err, response) => {
            if (err) return res.status(500).send('Error al listar eventos');
            const events = response.data.items;
            res.json(events);
        }
    );
};

exports.crearEvento = async (req, res) => {
    const { summary, location, description, startDateTime, endDateTime } = req.body;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: summary,
        location: location,
        description: description,
        start: {
            dateTime: startDateTime,
            timeZone: 'America/Argentina/Buenos_Aires', // Ajusta la zona horaria según tu ubicación
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'America/Argentina/Buenos_Aires',
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el evento en el calendario' });
    }
};

exports.eliminarEvento = async (req, res) => {
    const { eventId } = req.params;
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        res.status(200).send('Evento eliminado correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el evento' });
    }
};

// Función para enviar SMS
const enviarSMS = async (cita) => {
    const mensaje = `Recordatorio: Tiene una cita el ${cita.fecha} a las ${cita.hora} en la propiedad ${cita.propiedad}`;
    try {
        await client.messages.create({
            body: mensaje,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: cita.clienteTelefono,
        });
        console.log('SMS enviado correctamente');
    } catch (error) {
        console.error('Error al enviar SMS:', error);
    }
};