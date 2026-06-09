import { Link } from 'react-router-dom';

const ESTADO_CONFIG = {
    'pendiente': { color: 'bg-yellow-100 text-yellow-800', label: '⏳ Pendiente', orden: 1 },
    'en_revision': { color: 'bg-blue-100 text-blue-800', label: '🔍 En revisión', orden: 2 },
    'en_progreso': { color: 'bg-purple-100 text-purple-800', label: '🚧 En progreso', orden: 3 },
    'resuelto': { color: 'bg-green-100 text-green-800', label: '✅ Resuelto', orden: 4 },
    'rechazado': { color: 'bg-red-100 text-red-800', label: '❌ Rechazado', orden: 5 }
};

const CATEGORIA_ICONO = {
    'basura': '🗑️',
    'mantenimiento': '🔧',
    'vandalismo': '🎨',
    'seguridad': '👮',
    'iluminacion': '💡',
    'otro': '📝'
};

export const AlertaCard = ({ alerta, showActions = false, onStatusChange, isUpdating = false }) => {
    const getEstadoConfig = (estado) => ESTADO_CONFIG[estado] || ESTADO_CONFIG['pendiente'];
    const estadoConfig = getEstadoConfig(alerta.estado);

    const estadosDisponibles = Object.entries(ESTADO_CONFIG).map(([key, config]) => ({
        value: key,
        label: config.label,
        orden: config.orden
    })).sort((a, b) => a.orden - b.orden);

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            <div className="p-5">
                {/* Header con categoría y título */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{CATEGORIA_ICONO[alerta.categoria] || '⚠️'}</span>
                        <Link 
                            to={`/alertas/${alerta.id}`}
                            className="font-semibold text-gray-800 hover:text-emerald-600 transition"
                        >
                            {alerta.titulo}
                        </Link>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoConfig.color}`}>
                        {estadoConfig.label}
                    </span>
                </div>

                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{alerta.descripcion}</p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span>📍 {alerta.plaza_nombre || 'Plaza no especificada'}</span>
                    <span>👤 {alerta.usuario_nombre || 'Anónimo'}</span>
                    <span>📅 {new Date(alerta.created_at).toLocaleDateString('es-CL')}</span>
                </div>

                {/* Nota si existe */}
                {alerta.notas_actualizacion && (
                    <div className="bg-gray-50 rounded p-2 mb-3 text-xs text-gray-600">
                        📌 Nota: {alerta.notas_actualizacion}
                    </div>
                )}

                {/* Foto si existe */}
                {alerta.foto_url && (
                    <a 
                        href={alerta.foto_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs hover:underline inline-block mb-3"
                    >
                        📷 Ver foto adjunta
                    </a>
                )}

                {/* Actions para fiscalizador/admin */}
                {showActions && onStatusChange && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <label className="block text-xs font-semibold text-gray-600 mb-2">
                            Actualizar estado:
                        </label>
                        <select
                            value={alerta.estado}
                            onChange={(e) => onStatusChange(alerta.id, e.target.value)}
                            disabled={isUpdating}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                        >
                            {estadosDisponibles.map((estado) => (
                                <option key={estado.value} value={estado.value}>
                                    {estado.label}
                                </option>
                            ))}
                        </select>
                        {isUpdating && (
                            <p className="text-xs text-gray-400 mt-1">Actualizando...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};