
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRequest } from '../../lib/api';
import withAuth from '../components/auth/withAuth';

const RequestCertificatePage = () => {
    const [fullName, setFullName] = useState('');
    const [details, setDetails] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName || !details || !files || files.length === 0) {
            setError('Todos los campos son requeridos.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('details', details);
        for (let i = 0; i < files.length; i++) {
            formData.append('documents', files[i]);
        }

        try {
            await createRequest(formData);
            alert('Solicitud enviada exitosamente.');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al enviar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Solicitar Certificado</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="details" className="form-label">Detalles de la Solicitud</label>
                            <textarea
                                className="form-control"
                                id="details"
                                rows={3}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                required
                                disabled={loading}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="documents" className="form-label">Adjuntar Documentos (PDF, JPG)</label>
                            <input
                                type="file"
                                className="form-control"
                                id="documents"
                                onChange={handleFileChange}
                                multiple
                                required
                                disabled={loading}
                                accept=".pdf,.jpg,.jpeg"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default withAuth(RequestCertificatePage);
