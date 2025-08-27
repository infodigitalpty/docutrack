
const db = require('../db');
const PDFDocument = require('pdfkit');

// Crear una nueva solicitud
exports.createRequest = async (req, res) => {
    const { fullName, details } = req.body;
    const userId = req.user.id;

    if (!fullName || !details) {
        return res.status(400).json({ message: 'Nombre completo y detalles son requeridos.' });
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Se requiere al menos un documento.' });
    }

    try {
        // Iniciar una transacción
        await db.query('BEGIN');

        // Insertar la solicitud en la tabla 'requests'
        const newRequest = await db.query(
            'INSERT INTO requests (user_id, full_name, details) VALUES ($1, $2, $3) RETURNING id',
            [userId, fullName, details]
        );
        const requestId = newRequest.rows[0].id;

        // Insertar los documentos en la tabla 'documents'
        for (const file of req.files) {
            await db.query(
                'INSERT INTO documents (request_id, file_path, original_name, mime_type) VALUES ($1, $2, $3, $4)',
                [requestId, file.path, file.originalname, file.mimetype]
            );
        }

        // Confirmar la transacción
        await db.query('COMMIT');

        res.status(201).json({ message: 'Solicitud creada exitosamente.', requestId });

    } catch (error) {
        // Revertir la transacción en caso de error
        await db.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al crear la solicitud.' });
    }
};

// Obtener el historial de solicitudes de un usuario
exports.getUserRequests = async (req, res) => {
    const userId = req.user.id;

    try {
        const requests = await db.query('SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(requests.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

// Descargar un certificado emitido
exports.downloadCertificate = async (req, res) => {
    const requestId = req.params.id;
    const userId = req.user.id;

    try {
        // Verificar que la solicitud pertenece al usuario y ha sido emitida
        const requestResult = await db.query(
            'SELECT * FROM requests WHERE id = $1 AND user_id = $2',
            [requestId, userId]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada o no pertenece al usuario.' });
        }

        const request = requestResult.rows[0];

        if (request.status !== 'Emitido') {
            return res.status(403).json({ message: 'El certificado no puede ser descargado hasta que la solicitud sea emitida.' });
        }

        // Generar el PDF
        const doc = new PDFDocument();
        const fileName = `Certificado-${request.full_name.replace(/ /g, '_')}-${requestId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        doc.pipe(res);

        // Contenido del PDF (simple)
        doc.fontSize(25).text('Certificado Oficial', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('Este documento certifica que:');
        doc.moveDown();
        doc.fontSize(20).text(request.full_name, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Con ID de solicitud: ${request.id}`);
        doc.text(`Ha completado exitosamente el trámite con fecha de emisión: ${new Date(request.updated_at).toLocaleDateString()}.`);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el PDF.' });
    }
};
