
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    role_id: number;
    iat: number;
    exp: number;
}

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AdminAuthComponent = (props: P) => {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.replace('/'); // Redirigir al login si no hay token
                return;
            }

            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                // role_id 2 es para ADMIN
                if (decodedToken.role_id !== 2) {
                    router.replace('/dashboard'); // Redirigir si no es admin
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Error decodificando el token:', error);
                router.replace('/'); // Redirigir si el token es inválido
            }

        }, [router]);

        if (!isAuthorized) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    return AdminAuthComponent;
};

export default withAdminAuth;
