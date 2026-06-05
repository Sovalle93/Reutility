import { useAuth } from '../../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMisReviews } from '../../../services/api';

export const PerfilPage = () => {
    const { usuario, logout } = useAuth();
    const [misReviews, setMisReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const fetchMisReviews = async () => {
            if (!usuario) {
                if (active) setLoading(false);
                return;
            }

            try {
                const data = await getMisReviews();
                if (active) setMisReviews(data);
            } catch (err) {
                console.error('Error cargando comentarios:', err);
                if (active) setError('No se pudieron cargar tus comentarios');
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchMisReviews();

        return () => {
            active = false;
        };
    }, [usuario]);

    if (!usuario) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Debes iniciar sesión para ver tu perfil</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Información del usuario */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-emerald-800 mb-4">Mi Perfil</h1>
                <div className="space-y-3">
                    <p><span className="font-semibold">Nombre:</span> {usuario.nombre}</p>
                    <p><span className="font-semibold">Email:</span> {usuario.email}</p>
                    <p><span className="font-semibold">Rol:</span> {usuario.rol || 'ciudadano'}</p>
                </div>
                <button
                    onClick={logout}
                    className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Cerrar sesión
                </button>
            </div>

            {/* Mis comentarios */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Mis comentarios ({misReviews.length})</h2>
                
                {loading ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500">Cargando tus comentarios...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-4">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : misReviews.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500">Aún no has comentado ninguna plaza.</p>
                        <Link to="/plazas" className="text-emerald-600 hover:underline mt-2 inline-block">
                            🔍 Explorar plazas para comentar
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {misReviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <a href={`/plazas/${review.plaza_id}`} className="font-semibold text-emerald-700 hover:underline">
                                            {review.plaza_nombre}
                                        </a>
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};