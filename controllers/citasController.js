const Cita = require('../models').Cita;

exports.crearCita = async (req, res) => {
    try {
        const { cliente, propiedad, fecha, hora, agenteId } = req.body;
        const nuevaCita = await Cita.create({ cliente, propiedad, fecha, hora, agenteId });
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.findAll();
        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

exports.eliminarCita = async (req, res) => {
    try {
        await Cita.destroy({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};
