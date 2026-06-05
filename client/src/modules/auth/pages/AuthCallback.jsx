import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export const AuthCallback = () => {
    const { fetchUserData, usuario } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const redirectTo = localStorage.getItem('authRedirect') || '/perfil';

        const verify = async () => {
            if (usuario) {
                localStorage.removeItem('authRedirect');
                navigate(redirectTo, { replace: true });
                return;
            }

            const fetchedUser = await fetchUserData();
            if (!active) return;

            if (fetchedUser) {
                localStorage.removeItem('authRedirect');
                navigate(redirectTo, { replace: true });
            } else {
                navigate('/login?error=callback_failed', { replace: true });
            }
        };

        verify();

        return () => {
            active = false;
        };
    }, [fetchUserData, usuario, navigate]);

    return (
        <div className="text-center py-12">
            <div className="text-2xl mb-4">🔄</div>
            <p className="text-gray-600">Autenticando con Google...</p>
            <p className="text-sm text-gray-400 mt-2">Procesando autenticación...</p>
        </div>
    );
};