import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { getAlertas, updateAlertaStatus } from '../../../services/api';
import { AlertaCard } from '../components/AlertaCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const FiscalizadorPanel = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [alertas, setAlertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todas');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                const data = await getAlertas();
                setAlertas(data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error al cargar alertas');
            } finally {
                setLoading(false);
            }
        };
        fetchAlertas();
    }, []);

    const handleStatusChange = async (alertaId, nuevoEstado) => {
        setUpdatingId(alertaId);
        try {
            await updateAlertaStatus(alertaId, nuevoEstado);
            setAlertas(prev => prev.map(a => 
                a.id === alertaId ? { ...a, estado: nuevoEstado } : a
            ));
            toast.success(`Alerta actualizada a: ${nuevoEstado}`);
        } catch (error) {
            toast.error('Error al actualizar');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success('Sesión cerrada');
        navigate('/login');
    };

    const alertasFiltradas = alertas.filter(alerta => {
        if (filter === 'todas') return true;
        return alerta.estado === filter;
    });

    const estadisticas = {
        total: alertas.length,
        pendiente: alertas.filter(a => a.estado === 'pendiente').length,
        en_progreso: alertas.filter(a => a.estado === 'en_progreso').length,
        resuelto: alertas.filter(a => a.estado === 'resuelto').length
    };

    if (!usuario || (usuario.rol !== 'fiscalizador' && usuario.rol !== 'admin' && usuario.rol !== 'municipal_worker')) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">No tienes acceso a esta sección</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header con botón de logout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                        👮 Panel de Fiscalización
                    </h1>
                    <p className="text-gray-600">
                        Gestiona y actualiza el estado de las alertas ciudadanas
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                        👤 {usuario.nombre} • {usuario.rol === 'fiscalizador' ? 'Fiscalizador' : usuario.rol === 'municipal_worker' ? 'Trabajador Municipal' : 'Administrador'}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">{estadisticas.total}</div>
                    <div className="text-sm text-gray-500">Total alertas</div>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendiente}</div>
                    <div className="text-sm text-yellow-600">Pendientes</div>
                </div>
                <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{estadisticas.en_progreso}</div>
                    <div className="text-sm text-purple-600">En progreso</div>
                </div>
                <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.resuelto}</div>
                    <div className="text-sm text-green-600">Resueltas</div>
                </div>
            </div>

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

            {/* Lista de alertas */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-pulse">Cargando alertas...</div>
                </div>
            ) : alertasFiltradas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No hay alertas en esta categoría</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {alertasFiltradas.map(alerta => (
                        <AlertaCard
                            key={alerta.id}
                            alerta={alerta}
                            showActions={true}
                            onStatusChange={handleStatusChange}
                            isUpdating={updatingId === alerta.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};