
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllRequests } from '../../../lib/api';
import withAdminAuth from '../../components/auth/withAdminAuth';

interface Request {
    id: number;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
}

const AdminDashboardPage = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getAllRequests();
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
            <h1>Panel de Administración</h1>
            <p>Aquí puedes ver y gestionar todas las solicitudes de los usuarios.</p>

            {loading && <p>Cargando...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="card">
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Solicitante</th>
                                    <th>Email</th>
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
                                        <td>{req.email}</td>
                                        <td>{req.status}</td>
                                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <Link href={`/admin/request/${req.id}`} className="btn btn-sm btn-info">
                                                Ver Detalles
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAdminAuth(AdminDashboardPage);
