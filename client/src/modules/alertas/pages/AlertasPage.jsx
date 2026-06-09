import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getAlertas } from '../../../services/api';
import { AlertaCard } from '../components/AlertaCard';
import { Link } from 'react-router-dom';

export const AlertasPage = () => {
    const { usuario } = useAuth();
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todas');

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                const data = await getAlertas();
                setAlertas(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlertas();
    }, []);

    const alertasFiltradas = alertas.filter(alerta => {
        if (filter === 'todas') return true;
        return alerta.estado === filter;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                    ⚠️ Alertas Ciudadanas
                </h1>
                <p className="text-gray-600">
                    Reportes de mantenimiento, seguridad y limpieza en las plazas
                </p>
            </div>

            {/* Mensaje condicional para usuarios no autenticados */}
            {!usuario && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
                    <p className="text-blue-800">
                        🔐 Para reportar una alerta, debes{' '}
                        <Link to="/login" className="font-semibold underline hover:text-blue-900">
                            iniciar sesión
                        </Link>{' '}
                        o{' '}
                        <Link to="/register" className="font-semibold underline hover:text-blue-900">
                            registrarte
                        </Link>
                    </p>
                </div>
            )}

            {/* Botón para crear alerta - solo usuarios autenticados */}
            {usuario && (
                <div className="mb-6">
                    <Link to="/alertas/nueva">
                        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2">
                            <span className="text-xl">+</span>
                            Reportar nueva alerta
                        </button>
                    </Link>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('todas')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filter === 'todas' 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilter('pendiente')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filter === 'pendiente' 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        ⏳ Pendientes
                    </button>
                    <button
                        onClick={() => setFilter('en_progreso')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filter === 'en_progreso' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        🚧 En progreso
                    </button>
                    <button
                        onClick={() => setFilter('resuelto')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filter === 'resuelto' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        ✅ Resueltas
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-pulse">Cargando alertas...</div>
                </div>
            )}

            {/* Lista de alertas */}
            {!loading && alertasFiltradas.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No hay alertas en esta categoría</p>
                    {usuario && (
                        <Link to="/alertas/nueva">
                            <button className="mt-4 text-emerald-600 hover:underline">
                                + Reportar primera alerta
                            </button>
                        </Link>
                    )}
                </div>
            )}

            {!loading && alertasFiltradas.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {alertasFiltradas.map(alerta => (
                        <AlertaCard
                            key={alerta.id}
                            alerta={alerta}
                            showActions={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};