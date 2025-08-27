
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequestById, updateRequestStatus } from '../../../../lib/api';
import withAdminAuth from '../../../components/auth/withAdminAuth';

interface Document {
    id: number;
    original_name: string;
    mime_type: string;
}

interface RequestDetails {
    id: number;
    full_name: string;
    details: string;
    status: string;
    created_at: string;
    documents: Document[];
}

const AdminRequestDetailPage = () => {
    const [request, setRequest] = useState<RequestDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

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
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!id) return;
        try {
            await updateRequestStatus(id, newStatus);
            alert(`Estado actualizado a: ${newStatus}`);
            router.refresh(); // Recargar la data de la página
        } catch (err: any) {
            alert(err.message || 'Error al actualizar el estado.');
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!request) return <p>No se encontró la solicitud.</p>;

    return (
        <div>
            <h1>Detalle de la Solicitud #{request.id}</h1>
            <div className="card mb-4">
                <div className="card-header">Datos del Solicitante</div>
                <div className="card-body">
                    <p><strong>Nombre:</strong> {request.full_name}</p>
                    <p><strong>Estado Actual:</strong> <span className="badge bg-info">{request.status}</span></p>
                    <p><strong>Detalles:</strong> {request.details}</p>
                    <p><strong>Fecha de Solicitud:</strong> {new Date(request.created_at).toLocaleString()}</p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header">Documentos Adjuntos</div>
                <ul className="list-group list-group-flush">
                    {request.documents.map(doc => (
                        <li key={doc.id} className="list-group-item">
                            <a href={`http://localhost:5000/api/admin/documents/${doc.id}`} target="_blank" rel="noopener noreferrer">
                                {doc.original_name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card">
                <div className="card-header">Acciones del Administrador</div>
                <div className="card-body">
                    <p>Cambiar estado de la solicitud:</p>
                    <div className="btn-group" role="group">
                        <button onClick={() => handleStatusUpdate('En Validación')} className="btn btn-primary">En Validación</button>
                        <button onClick={() => handleStatusUpdate('Emitido')} className="btn btn-success">Emitir</button>
                        <button onClick={() => handleStatusUpdate('Rechazado')} className="btn btn-danger">Rechazar</button>
                        <button onClick={() => handleStatusUpdate('Requiere Corrección')} className="btn btn-warning">Pedir Corrección</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAdminAuth(AdminRequestDetailPage);
