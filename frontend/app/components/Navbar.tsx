'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../../lib/api';

interface DecodedToken {
    id: number;
    role_id: number;
}

const Navbar = () => {
    const [user, setUser] = useState<{ id: number; role_id: number } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setUser({ id: decoded.id, role_id: decoded.role_id });
            } catch (error) {
                console.error('Token inválido:', error);
                logoutUser(); // Limpiar token inválido
            }
        }
    }, []);

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link href={user ? "/dashboard" : "/"} className="navbar-brand">DocuTrack</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link href="/dashboard" className="nav-link">Mis Solicitudes</Link>
                                </li>
                                {user.role_id === 2 && (
                                    <li className="nav-item">
                                        <Link href="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-link nav-link">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link href="/" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/register" className="nav-link">Registro</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;