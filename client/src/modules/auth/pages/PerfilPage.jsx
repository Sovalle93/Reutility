import { useAuth } from '../../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { getMisReviews, getMisAlertas } from '../../../services/api';
import { Link } from 'react-router-dom';

export const PerfilPage = () => {
    const { usuario, logout } = useAuth();
    const [misReviews, setMisReviews] = useState([]);
    const [misAlertas, setMisAlertas] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [loadingAlertas, setLoadingAlertas] = useState(true);
    const [activeTab, setActiveTab] = useState('reviews');

    useEffect(() => {
        const fetchMisReviews = async () => {
            if (!usuario) {
                setLoadingReviews(false);
                return;
            }
            
            try {
                const data = await getMisReviews();
                setMisReviews(data);
            } catch (error) {
                console.error('Error cargando comentarios:', error);
            } finally {
                setLoadingReviews(false);
            }
        };
        
        fetchMisReviews();
    }, [usuario]);

    useEffect(() => {
        const fetchMisAlertas = async () => {
            if (!usuario) {
                setLoadingAlertas(false);
                return;
            }
            
            try {
                const data = await getMisAlertas();
                setMisAlertas(data);
            } catch (error) {
                console.error('Error cargando alertas:', error);
            } finally {
                setLoadingAlertas(false);
            }
        };
        
        fetchMisAlertas();
    }, [usuario]);

    const getEstadoBadge = (estado) => {
        const estados = {
            'pendiente': { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Pendiente' },
            'en_revision': { color: 'bg-blue-100 text-blue-800', label: '🔍 En revisión' },
            'en_progreso': { color: 'bg-purple-100 text-purple-800', label: '🚧 En progreso' },
            'resuelto': { color: 'bg-green-100 text-green-800', label: '✅ Resuelto' },
            'rechazado': { color: 'bg-red-100 text-red-800', label: '❌ Rechazado' }
        };
        return estados[estado] || { color: 'bg-gray-100 text-gray-800', label: estado };
    };

    const getCategoriaIcon = (categoria) => {
        const iconos = {
            'basura': '🗑️',
            'mantenimiento': '🔧',
            'vandalismo': '🎨',
            'seguridad': '👮',
            'iluminacion': '💡',
            'otro': '📝'
        };
        return iconos[categoria] || '⚠️';
    };

    if (!usuario) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Debes iniciar sesión para ver tu perfil</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Información del usuario */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Mi Perfil</h1>
                        <div className="space-y-1">
                            <p><span className="font-semibold">Nombre:</span> {usuario.nombre}</p>
                            <p><span className="font-semibold">Email:</span> {usuario.email}</p>
                            <p><span className="font-semibold">Rol:</span> {usuario.rol || 'ciudadano'}</p>
                            {usuario.municipio_nombre && (
                                <p><span className="font-semibold">Municipio:</span> 📍 {usuario.municipio_nombre}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex-1 px-6 py-3 text-center font-semibold transition-all duration-200 ${
                            activeTab === 'reviews'
                                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                                : 'text-gray-500 hover:text-emerald-500'
                        }`}
                    >
                        📝 Mis Comentarios ({misReviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('alertas')}
                        className={`flex-1 px-6 py-3 text-center font-semibold transition-all duration-200 ${
                            activeTab === 'alertas'
                                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                                : 'text-gray-500 hover:text-emerald-500'
                        }`}
                    >
                        ⚠️ Mis Alertas ({misAlertas.length})
                    </button>
                </div>

                {/* Panel de Comentarios */}
                <div className={`p-6 transition-all duration-300 ${activeTab === 'reviews' ? 'block' : 'hidden'}`}>
                    <h2 className="text-xl font-bold mb-4">Mis comentarios</h2>
                    {loadingReviews ? (
                        <p className="text-gray-500 text-center py-8">Cargando...</p>
                    ) : misReviews.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Aún no has comentado ninguna plaza.</p>
                            <Link to="/plazas" className="text-emerald-600 hover:underline mt-2 inline-block">
                                🔍 Explorar plazas para comentar
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {misReviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                                    <Link to={`/plazas/${review.plaza_id}`} className="font-semibold text-emerald-700 hover:underline">
                                        {review.plaza_nombre}
                                    </Link>
                                    <div className="flex items-center gap-2 my-1">
                                        <span className="text-sm text-gray-600">Calificación:</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-sm ${i < review.rating ? 'text-emerald-500' : 'text-gray-300'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{review.comentario}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(review.created_at).toLocaleDateString('es-CL', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Panel de Alertas */}
                <div className={`p-6 transition-all duration-300 ${activeTab === 'alertas' ? 'block' : 'hidden'}`}>
                    <h2 className="text-xl font-bold mb-4">Mis alertas reportadas</h2>
                    {loadingAlertas ? (
                        <p className="text-gray-500 text-center py-8">Cargando...</p>
                    ) : misAlertas.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Aún no has reportado ninguna alerta.</p>
                            <Link to="/alertas" className="text-emerald-600 hover:underline mt-2 inline-block">
                                ⚠️ Reportar una alerta
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {misAlertas.map((alerta) => {
                                const estado = getEstadoBadge(alerta.estado);
                                return (
                                    <div key={alerta.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{getCategoriaIcon(alerta.categoria)}</span>
                                                    <h3 className="font-semibold text-gray-800">{alerta.titulo}</h3>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">{alerta.descripcion}</p>
                                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                    <span>📍 {alerta.plaza_nombre || 'Plaza no especificada'}</span>
                                                    <span>📅 {new Date(alerta.created_at).toLocaleDateString('es-CL')}</span>
                                                </div>
                                                {alerta.notas_actualizacion && (
                                                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                                                        📌 Nota: {alerta.notas_actualizacion}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estado.color}`}>
                                                    {estado.label}
                                                </span>
                                                {alerta.foto_url && (
                                                    <a 
                                                        href={alerta.foto_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 text-xs hover:underline"
                                                    >
                                                        📷 Ver foto
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};