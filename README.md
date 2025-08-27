# DocuTrack - Sistema de Gestión de Trámites

DocuTrack es un prototipo de aplicación web full-stack diseñado para gestionar la solicitud y emisión de certificados digitales. Permite a los usuarios registrarse, enviar solicitudes con documentos adjuntos y dar seguimiento al estado de sus trámites. También incluye un panel de administración para la revisión y gestión de todas las solicitudes. Este proyecto fue desarrollado como una prueba técnica para demostrar habilidades en el desarrollo de aplicaciones web modernas, seguras y escalables.

## Características para Usuarios (Ciudadanos)
- Autenticación segura con registro y login usando JWT.
- Creación de solicitudes mediante formulario intuitivo con documentos adjuntos (PDF, JPG).
- Seguimiento del estado de cada trámite en un panel personal con estados como Recibido, En Validación, Emitido o Rechazado.
- Descarga del certificado final en formato PDF una vez emitido.

## Características para Administradores
- Panel de control centralizado con la lista de solicitudes.
- Revisión de detalles del solicitante y descarga de documentos.
- Gestión de estados para aprobar, rechazar o solicitar correcciones.
- Rutas protegidas con acceso exclusivo a usuarios con rol ADMIN.

## Stack Tecnológico
**Frontend:** Next.js (SSR), Bootstrap (diseño responsive), TypeScript (código robusto).  
**Backend:** Node.js, Express.js, PostgreSQL, JWT, Multer, PDFKit.

## Estructura del Proyecto
- /frontend: aplicación en Next.js.
- /backend: API REST con Node.js y Express.

## Instalación y Puesta en Marcha
### Prerrequisitos
- Node.js v18 o superior
- npm
- PostgreSQL

### Backend
1. cd backend
2. npm install
3. Crear base de datos 'docutrack' en PostgreSQL y ejecutar database.sql
4. Crear archivo .env con credenciales y JWT_SECRET
5. node index.js → http://localhost:5000

### Frontend
1. cd frontend
2. npm install
3. npm run dev → http://localhost:3000

## Uso del Sistema
Usuarios pueden registrarse, enviar solicitudes y dar seguimiento. Administradores gestionan solicitudes y estados.

## Estado del Proyecto
Prototipo funcional creado como prueba técnica, extensible para producción.

## Autor
Desarrollado por Abel Alexander Almanza  
📧 abelalmanza12@gmail.com  
🌐 GitHub: https://github.com/infodigitalpty
