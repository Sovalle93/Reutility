import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthContext } from './authContext';

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    const fetchUserData = useCallback(async () => {
        if (isMounted.current) {
            setLoading(true);
        }

        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!isMounted.current) return null;

            if (!res.ok) {
                if (isMounted.current) {
                    setUsuario(null);
                    localStorage.removeItem('user_municipio_id');
                }
                return null;
            }

            const data = await res.json();
            if (isMounted.current) {
                setUsuario(data);
                // Persist municipio_id to localStorage for UI persistence
                if (data.municipio_id) {
                    localStorage.setItem('user_municipio_id', data.municipio_id);
                }
                console.log('✅ Usuario autenticado:', data.nombre, `(Municipio: ${data.municipio_nombre || 'No asignado'})`);
            }
            return data;
        } catch (error) {
            if (isMounted.current) {
                setUsuario(null);
                localStorage.removeItem('user_municipio_id');
            }
            return null;
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;

        const initializeAuth = async () => {
            await fetchUserData();
        };

        initializeAuth();

        return () => {
            isMounted.current = false;
        };
    }, [fetchUserData]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Credenciales inválidas');
            }

            await fetchUserData();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const registrar = async (email, password, nombre) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, nombre })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error en registro');
            }

            await fetchUserData();
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const loginWithGoogle = (redirectTo = '/') => {
        localStorage.setItem('authRedirect', redirectTo);
        window.location.href = `${API_URL}/auth/google`;
    };

    const logout = async () => {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (isMounted.current) {
            setUsuario(null);
            localStorage.removeItem('user_municipio_id');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            usuario, 
            loading, 
            fetchUserData,
            login, 
            registrar, 
            loginWithGoogle, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};