import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { usePerfilData } from '../hooks/usePerfilData';

const ESTADO_BADGES = {
    'pendiente':  { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Pendiente' },
    'en_revision': { color: 'bg-blue-100 text-blue-800', label: '🔍 En revisión' },
    'en_progreso': { color: 'bg-purple-100 text-purple-800', label: '🚧 En progreso' },
    'resuelto':   { color: 'bg-green-100 text-green-800', label: '✅ Resuelto' },
    'rechazado':  { color: 'bg-red-100 text-red-800', label: '❌ Rechazado' },
};

const CATEGORIA_ICONS = {
    basura: '🗑️', mantenimiento: '🔧', vandalismo: '🎨',
    seguridad: '👮', iluminacion: '💡', otro: '📝',
};

export const PerfilPage = () => {
    const { usuario, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('reviews');
    const { misReviews, misAlertas, loadingReviews, loadingAlertas } = usePerfilData(usuario);

    if (!usuario) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Debes iniciar sesión para ver tu perfil</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
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

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                    {[
                        { key: 'reviews', label: `📝 Mis Comentarios (${misReviews.length})` },
                        { key: 'alertas', label: `⚠️ Mis Alertas (${misAlertas.length})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 px-6 py-3 text-center font-semibold transition-all duration-200 ${
                                activeTab === key
                                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                                    : 'text-gray-500 hover:text-emerald-500'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Reviews tab */}
                <div className={`p-6 ${activeTab === 'reviews' ? 'block' : 'hidden'}`}>
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
                                                <span key={i} className={`text-sm ${i < review.rating ? 'text-emerald-500' : 'text-gray-300'}`}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{review.comentario}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(review.created_at).toLocaleDateString('es-CL', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alertas tab */}
                <div className={`p-6 ${activeTab === 'alertas' ? 'block' : 'hidden'}`}>
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
                                const estado = ESTADO_BADGES[alerta.estado] ?? { color: 'bg-gray-100 text-gray-800', label: alerta.estado };
                                return (
                                    <div key={alerta.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xl">{CATEGORIA_ICONS[alerta.categoria] ?? '⚠️'}</span>
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
