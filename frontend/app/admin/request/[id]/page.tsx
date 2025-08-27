
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequestById, updateRequestStatus } from '../../../../lib/api';
import withAdminAuth from '../../../components/auth/withAdminAuth';

// Tipos de datos
interface Document {
    id: number;
    original_name: string;
}
interface RequestDetails {
    id: number;
    full_name: string;
    details: string;
    status: string;
    created_at: string;
    documents: Document[];
}

// --- Componente de la Página ---
const AdminRequestDetailPage = () => {
    const [request, setRequest] = useState<RequestDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Efecto para cargar los datos de la solicitud
    useEffect(() => {
        if (id) {
            const fetchRequest = async () => {
                try {
                    const data = await getRequestById(id);
                    setRequest(data);
                } catch (err: any) {
                    setError(err.message || 'Error al cargar la solicitud.');
                } finally {
                    setLoading(false);
                }
            };
            fetchRequest();
        }
    }, [id, router]); // Añadimos router a las dependencias

    // Función para manejar la actualización de estado
    const handleStatusUpdate = async (newStatus: string) => {
        if (!id) return;
        try {
            await updateRequestStatus(id, newStatus);
            alert(`Estado actualizado a: ${newStatus}`);
            // Forzar la recarga de los datos de la página actual
            router.refresh();
        } catch (err: any) {
            alert(err.message || 'Error al actualizar el estado.');
        }
    };

    // Renderizado condicional para carga y errores
    if (loading) return <div className="text-center"><p>Cargando detalles de la solicitud...</p></div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!request) return <div className="alert alert-warning">No se encontró la solicitud.</div>;

    // --- JSX del Componente ---
    return (
        <div>
            <h1 className="mb-4">Detalle de la Solicitud #{request.id}</h1>

            {/* Tarjeta de Datos del Solicitante */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header">Datos del Solicitante</div>
                <div className="card-body">
                    <p><strong>Nombre:</strong> {request.full_name}</p>
                    <p><strong>Estado Actual:</strong> <span className={`badge bg-info`}>{request.status}</span></p>
                    <p><strong>Detalles:</strong> {request.details}</p>
                    <p><strong>Fecha de Solicitud:</strong> {new Date(request.created_at).toLocaleString()}</p>
                </div>
            </div>

            {/* Tarjeta de Documentos Adjuntos (sin enlace) */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header">Documentos Adjuntos</div>
                <ul className="list-group list-group-flush">
                    {request.documents.map(doc => (
                        <li key={doc.id} className="list-group-item">
                            📄 {doc.original_name} (solo visible para el admin)
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tarjeta de Acciones del Administrador (con botones rediseñados) */}
            <div className="card shadow-sm">
                <div className="card-header">Acciones del Administrador</div>
                <div className="card-body">
                    <p className="card-title">Cambiar estado de la solicitud:</p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-start">
                        <button onClick={() => handleStatusUpdate('En Validación')} className="btn btn-primary px-4">En Validación</button>
                        <button onClick={() => handleStatusUpdate('Emitido')} className="btn btn-success px-4">Emitir Certificado</button>
                        <button onClick={() => handleStatusUpdate('Rechazado')} className="btn btn-danger px-4">Rechazar</button>
                        <button onClick={() => handleStatusUpdate('Requiere Corrección')} className="btn btn-warning px-4">Pedir Corrección</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAdminAuth(AdminRequestDetailPage);
