'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '../lib/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await loginUser({ email, password });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                <div className="card glass-card">
                    <div className="card-body p-4 p-sm-5">
                        <h1 className="card-title text-center mb-4">DocuTrack</h1>
                        <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    placeholder="Tu contraseña"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <Link href="/register" className="text-white-50">
                                ¿No tienes una cuenta? <span className="fw-bold text-white">Regístrate</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <div className="alert alert-light bg-transparent border-light text-white-50" role="alert">
                        <a href="https://github.com/infodigitalpty/docutrack" className="alert-link text-white" target="_blank" rel="noopener noreferrer">
                            Ver el código fuente de este proyecto en GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;