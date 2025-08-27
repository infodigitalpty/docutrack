'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRequestById, updateRequestStatus, API_URL } from '../../../../lib/api';
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

    const handleStatusUpdate = async (newStatus: string) => { /* ... (código sin cambios) ... */ };

    const handleDocumentDownload = async (docId: number, docName: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/documents/${docId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('No se pudo descargar el documento.');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = docName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!request) return <p>No se encontró la solicitud.</p>;

    return (
        <div>
            <h1>Detalle de la Solicitud #{request.id}</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card mb-4">
                {/* ... (código sin cambios) ... */}
            </div>

            <div className="card mb-4">
                <div className="card-header">Documentos Adjuntos</div>
                <ul className="list-group list-group-flush">
                    {request.documents.map(doc => (
                        <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {doc.original_name}
                            <button onClick={() => handleDocumentDownload(doc.id, doc.original_name)} className="btn btn-sm btn-secondary">
                                Descargar
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card">
                 {/* ... (código sin cambios) ... */}
            </div>
        </div>
    );
};

export default withAdminAuth(AdminRequestDetailPage);