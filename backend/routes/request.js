
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Ruta para crear una nueva solicitud de certificado
// POST /api/requests
router.post('/', protect, upload.array('documents', 5), requestController.createRequest);

// Ruta para obtener el historial de solicitudes del usuario
// GET /api/requests
router.get('/', protect, requestController.getUserRequests);

// Ruta para que un usuario descargue su certificado emitido
// GET /api/requests/:id/download
router.get('/:id/download', protect, requestController.downloadCertificate);

module.exports = router;
