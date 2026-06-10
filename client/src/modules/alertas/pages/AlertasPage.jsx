import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { AlertaCard } from '../components/AlertaCard';
import { Link } from 'react-router-dom';
import { useAlertas } from '../hooks/useAlertas';

export const AlertasPage = () => {
    const { usuario } = useAuth();
    const [filter, setFilter] = useState('todas');
    const { alertas, isLoading } = useAlertas();

    const alertasFiltradas = alertas.filter(alerta =>
        filter === 'todas' ? true : alerta.estado === filter
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                    ⚠️ Alertas Ciudadanas
                </h1>
                <p className="text-gray-600">
                    Reportes de mantenimiento, seguridad y limpieza en las plazas
                </p>
            </div>

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

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-2">
                    {[
                        { value: 'todas', label: 'Todas', active: 'bg-emerald-600' },
                        { value: 'pendiente', label: '⏳ Pendientes', active: 'bg-yellow-500' },
                        { value: 'en_progreso', label: '🚧 En progreso', active: 'bg-purple-500' },
                        { value: 'resuelto', label: '✅ Resueltas', active: 'bg-green-500' },
                    ].map(({ value, label, active }) => (
                        <button
                            key={value}
                            onClick={() => setFilter(value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                filter === value
                                    ? `${active} text-white`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <div className="animate-pulse">Cargando alertas...</div>
                </div>
            )}

            {!isLoading && alertasFiltradas.length === 0 && (
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

            {!isLoading && alertasFiltradas.length > 0 && (
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
