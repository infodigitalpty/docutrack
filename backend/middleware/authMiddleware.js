
const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, 'tu_secreto_jwt'); // Usar el mismo secreto

            // Obtener usuario del token y adjuntarlo a la request (sin la contraseña)
            req.user = await db.query('SELECT id, email, role_id FROM users WHERE id = $1', [decoded.id]);
            if (req.user.rows.length === 0) {
                return res.status(401).json({ message: 'Usuario no encontrado.' });
            }
            req.user = req.user.rows[0];

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, sin token' });
    }
};

// Middleware para verificar si el usuario es ADMIN
exports.admin = (req, res, next) => {
    // El role_id para ADMIN es 2, según database.sql
    if (req.user && req.user.role_id === 2) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, requiere rol de Administrador.' });
    }
};
