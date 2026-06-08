import { useState, useEffect } from 'react';
import { getRanking, getMunicipios } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export const RankingPage = () => {
    const [ranking, setRanking] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [municipios, setMunicipios] = useState([]);
    const [selectedMunicipio, setSelectedMunicipio] = useState('');
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                const data = await getMunicipios();
                setMunicipios(data);
            } catch (error) {
                console.error('Error cargando municipios:', error);
            }
        };
        fetchMunicipios();
    }, []);

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            try {
                const data = await getRanking(selectedMunicipio || null, 20);
                setRanking(data.ranking || []);
                setEstadisticas(data.estadisticas);
            } catch (error) {
                console.error('Error cargando ranking:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, [selectedMunicipio]);

    const getMedallaColor = (posicion) => {
        switch(posicion) {
            case 1: return 'from-yellow-500 to-amber-600';
            case 2: return 'from-gray-400 to-gray-500';
            case 3: return 'from-amber-600 to-amber-700';
            default: return 'from-emerald-500 to-emerald-600';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-emerald-800 mb-3 flex items-center justify-center gap-2">
                    🏆 Ranking de Plazas
                </h1>
                <p className="text-gray-600">
                    Descubre las plazas mejor valoradas por la comunidad
                </p>
            </div>

            {/* Filtro y estadísticas */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-gray-700 font-semibold">📍 Municipio:</label>
                        <select
                            value={selectedMunicipio}
                            onChange={(e) => setSelectedMunicipio(e.target.value)}
                            className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Todos los municipios</option>
                            {municipios.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>
                    
                    {estadisticas && (
                        <div className="flex gap-6 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{estadisticas.total_plazas}</div>
                                <div className="text-gray-500">Plazas evaluadas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{estadisticas.promedio_general || 0}</div>
                                <div className="text-gray-500">Promedio general</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-pulse text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <div className="text-gray-500">Cargando ranking...</div>
                    </div>
                </div>
            )}

            {/* Ranking List */}
            {!loading && ranking.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">No hay plazas registradas en este municipio</p>
                </div>
            )}

            {!loading && ranking.length > 0 && (
                <div className="space-y-4">
                    {ranking.map((plaza) => (
                        <div
                            key={plaza.id}
                            className={`group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer
                                ${hoveredCard === plaza.id ? 'shadow-xl transform scale-[1.02]' : 'hover:shadow-lg'}`}
                            onMouseEnter={() => setHoveredCard(plaza.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => navigate(`/plazas/${plaza.id}`)}
                        >
                            <div className="flex items-center p-4 md:p-6">
                                {/* Posición */}
                                <div className="flex-shrink-0 w-16 md:w-20 text-center">
                                    {plaza.medalla ? (
                                        <div className="text-3xl md:text-4xl animate-bounce">
                                            {plaza.medalla}
                                        </div>
                                    ) : (
                                        <div className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${getMedallaColor(plaza.posicion)} bg-clip-text text-transparent`}>
                                            #{plaza.posicion}
                                        </div>
                                    )}
                                </div>

                                {/* Información principal */}
                                <div className="flex-1 ml-4 md:ml-6">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                                        {plaza.nombre}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-500">
                                            📍 {plaza.municipio_nombre || 'Municipio no asignado'}
                                        </span>
                                        <span className="text-sm text-gray-400">•</span>
                                        <span className="text-sm text-gray-500">
                                            💬 {plaza.total_reviews} {plaza.total_reviews === 1 ? 'reseña' : 'reseñas'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-1">
                                        {plaza.descripcion || 'Sin descripción'}
                                    </p>
                                </div>

                                {/* Rating */}
                                <div className="flex-shrink-0 text-right ml-4">
                                    <div className="flex items-center gap-1 bg-emerald-50 px-3 py-2 rounded-lg">
                                        <span className="text-2xl text-emerald-500">★</span>
                                        <span className="text-xl font-bold text-emerald-700">
                                            {plaza.rating_display || plaza.rating_promedio || 0}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {plaza.total_reviews === 0 ? 'Sin reseñas' : 'Puntuación'}
                                    </div>
                                </div>

                                {/* Flecha */}
                                <div className="flex-shrink-0 ml-4 text-gray-400 group-hover:text-emerald-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer con animación */}
            {!loading && ranking.length > 0 && (
                <div className="text-center mt-8 text-sm text-gray-400 animate-pulse">
                    🏆 Basado en {ranking.reduce((acc, p) => acc + p.total_reviews, 0)} reseñas de la comunidad
                </div>
            )}
        </div>
    );
};