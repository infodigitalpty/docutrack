
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const AuthComponent = (props: P) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.replace('/'); // Redirigir al login si no hay token
            } else {
                setIsAuthenticated(true);
            }
        }, [router]);

        // Renderizar un loader o nada mientras se verifica la autenticación
        if (!isAuthenticated) {
            return (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
