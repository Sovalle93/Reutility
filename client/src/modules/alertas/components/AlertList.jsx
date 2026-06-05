import { Link } from 'react-router-dom';

const AlertItem = ({ alerta, isOwnAlert }) => {
    const categorias = {
        'basura': { emoji: '🗑️', label: 'Basura' },
        'mantenimiento': { emoji: '🔧', label: 'Mantenimiento' },
        'vandalismo': { emoji: '✏️', label: 'Vandalismo' },
        'seguridad': { emoji: '🚨', label: 'Seguridad' },
        'iluminacion': { emoji: '💡', label: 'Iluminación' },
        'otro': { emoji: '📋', label: 'Otro' }
    };

    const statuses = {
        'pendiente': { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Pendiente', icon: '⏳' },
        'en_revision': { color: 'bg-blue-100 text-blue-800', label: '👀 En revisión', icon: '👀' },
        'resuelto': { color: 'bg-green-100 text-green-800', label: '✅ Resuelto', icon: '✅' },
        'rechazado': { color: 'bg-red-100 text-red-800', label: '❌ Rechazado', icon: '❌' }
    };

    const cat = categorias[alerta.categoria] || categorias['otro'];
    const status = statuses[alerta.estado] || statuses['pendiente'];

    return (
        <Link to={`/alertas/${alerta.id}`}>
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 animate-fadeIn hover:border-emerald-300">
                <div className="flex h-40">
                    {/* Imagen */}
                    <div className="w-40 bg-gray-200 overflow-hidden flex-shrink-0">
                        {alerta.imagen_url ? (
                            <img
                                src={alerta.imagen_url}
                                alt={alerta.titulo}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-4xl">
                                {cat.emoji}
                            </div>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-2 mb-2">
                                <span className="text-2xl">{cat.emoji}</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{alerta.titulo}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{alerta.descripcion}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>👤 {alerta.usuario_nombre}</span>
                                <span>•</span>
                                <span>{new Date(alerta.created_at).toLocaleDateString('es-CL')}</span>
                                {isOwnAlert && (
                                    <>
                                        <span>•</span>
                                        <span className="text-emerald-600 font-semibold">Tu alerta</span>
                                    </>
                                )}
                            </div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const AlertList = ({ alertas, userAlertIds = [] }) => {
    if (alertas.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center animate-fadeIn">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-2xl font-bold mb-2">No hay alertas aún</h2>
                <p className="text-gray-600">Sé el primero en reportar un problema en las plazas</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold">Alertas activas</h2>
                <span className="text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                    {alertas.length}
                </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {alertas.map((alerta, index) => (
                    <div
                        key={alerta.id}
                        style={{
                            animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                        }}
                    >
                        <AlertItem
                            alerta={alerta}
                            isOwnAlert={userAlertIds.includes(alerta.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
