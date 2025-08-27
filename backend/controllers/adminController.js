
const db = require('../db');
const fs = require('fs');
const path = require('path');

// Obtener todas las solicitudes
exports.getAllRequests = async (req, res) => {
    try {
        // Unir requests con users para obtener el email del solicitante
        const requests = await db.query(`
            SELECT r.id, r.full_name, r.status, r.created_at, u.email
            FROM requests r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(requests.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Obtener una solicitud por ID
exports.getRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener detalles de la solicitud
        const requestResult = await db.query('SELECT * FROM requests WHERE id = $1', [id]);
        if (requestResult.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }
        const request = requestResult.rows[0];

        // Obtener documentos adjuntos
        const documentsResult = await db.query('SELECT id, original_name, mime_type FROM documents WHERE request_id = $1', [id]);
        const documents = documentsResult.rows;

        res.json({ ...request, documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Actualizar el estado de una solicitud
exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validar el estado
    const allowedStatus = ['Aprobar', 'Rechazar', 'Pedir Corrección', 'En Validación', 'Emitido'];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: 'Estado no válido.' });
    }

    // El estado "Aprobar" internamente cambia a "En Validación" o el admin puede ponerlo directo en "Emitido"
    let finalStatus = status;
    if(status === 'Aprobar') finalStatus = 'En Validación';
    if(status === 'Rechazar') finalStatus = 'Rechazado';
    if(status === 'Pedir Corrección') finalStatus = 'Requiere Corrección';


    try {
        const updatedRequest = await db.query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
            [finalStatus, id]
        );

        if (updatedRequest.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada.' });
        }

        res.json(updatedRequest.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Descargar un documento adjunto por un admin
exports.downloadAttachedDocument = async (req, res) => {
    const { id } = req.params; // ID del documento

    try {
        const docResult = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ message: 'Documento no encontrado.' });
        }

        const document = docResult.rows[0];
        const filePath = path.join(__dirname, '..', document.file_path);

        // Verificar que el archivo existe
        if (fs.existsSync(filePath)) {
            res.download(filePath, document.original_name);
        } else {
            res.status(404).json({ message: 'Archivo no encontrado en el servidor.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};
