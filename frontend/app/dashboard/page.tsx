
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserRequests } from '../../lib/api';
import withAuth from '../components/auth/withAuth';

// Definir el tipo para una solicitud
interface Request {
    id: number;
    full_name: string;
    status: string;
    created_at: string;
}

const DashboardPage = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getUserRequests();
                setRequests(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar las solicitudes.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Solicitudes</h1>
                <Link href="/request-certificate" className="btn btn-primary">
                    + Nueva Solicitud
                </Link>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="card">
                    <div className="card-body">
                        {requests.length === 0 ? (
                            <p>No tienes solicitudes todavía.</p>
                        ) : (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre Completo</th>
                                        <th>Estado</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr key={req.id}>
                                            <td>{req.id}</td>
                                            <td>{req.full_name}</td>
                                            <td>
                                                <span className={`badge bg-${req.status === 'Emitido' ? 'success' : 'secondary'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                            <td>
                                                {req.status === 'Emitido' && (
                                                    <a href={`http://localhost:5000/api/requests/${req.id}/download`} className="btn btn-sm btn-success" target="_blank" rel="noopener noreferrer">
                                                        Descargar PDF
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(DashboardPage);
