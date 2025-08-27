
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas las rutas en este archivo requieren que el usuario sea ADMIN
router.use(protect, admin);

// Ruta para obtener todas las solicitudes
// GET /api/admin/requests
router.get('/requests', adminController.getAllRequests);

// Ruta para obtener una solicitud específica y sus documentos
// GET /api/admin/requests/:id
router.get('/requests/:id', adminController.getRequestById);

// Ruta para actualizar el estado de una solicitud
// PUT /api/admin/requests/:id/status
router.put('/requests/:id/status', adminController.updateRequestStatus);

// Ruta para descargar un documento adjunto
// GET /api/admin/documents/:id
router.get('/documents/:id', adminController.downloadAttachedDocument);

module.exports = router;
