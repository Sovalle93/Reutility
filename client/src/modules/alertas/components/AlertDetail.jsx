import { useState } from 'react';
import toast from 'react-hot-toast';

export const AlertDetail = ({ alerta, usuario, onUpdateStatus, isUpdating }) => {
    const [notas, setNotas] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showStatusForm, setShowStatusForm] = useState(false);

    const categorias = {
        'basura': { emoji: '🗑️', label: 'Basura/Suciedad' },
        'mantenimiento': { emoji: '🔧', label: 'Mantenimiento/Daño' },
        'vandalismo': { emoji: '✏️', label: 'Vandalismo' },
        'seguridad': { emoji: '🚨', label: 'Seguridad' },
        'iluminacion': { emoji: '💡', label: 'Iluminación' },
        'otro': { emoji: '📋', label: 'Otro' }
    };

    const statuses = {
        'pendiente': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: '⏳ Pendiente', icon: '⏳' },
        'en_revision': { color: 'bg-blue-100 text-blue-800 border-blue-300', label: '👀 En revisión', icon: '👀' },
        'resuelto': { color: 'bg-green-100 text-green-800 border-green-300', label: '✅ Resuelto', icon: '✅' },
        'rechazado': { color: 'bg-red-100 text-red-800 border-red-300', label: '❌ Rechazado', icon: '❌' }
    };

    const isMunicipalWorker = usuario?.rol === 'municipal_worker' || usuario?.rol === 'admin';
    const cat = categorias[alerta.categoria] || categorias['otro'];
    const status = statuses[alerta.estado] || statuses['pendiente'];

    const handleStatusUpdate = async () => {
        if (!selectedStatus) {
            toast.error('Selecciona un estado');
            return;
        }

        const result = await onUpdateStatus(selectedStatus, notas);
        if (result.success) {
            setSelectedStatus('');
            setNotas('');
            setShowStatusForm(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Imagen */}
            <div className="w-full h-96 bg-gray-200 overflow-hidden">
                {alerta.imagen_url ? (
                    <img
                        src={alerta.imagen_url}
                        alt={alerta.titulo}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-6xl">
                        {cat.emoji}
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-4xl">{cat.emoji}</span>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-800">{alerta.titulo}</h1>
                                    <p className="text-gray-600 mt-1">{cat.label}</p>
                                </div>
                                <span className={`text-sm font-semibold px-4 py-2 rounded-full border-2 whitespace-nowrap ${status.color}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-2">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{alerta.descripcion}</p>
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg mb-6">
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Reportado por</p>
                                <p className="text-gray-800 font-medium">{alerta.usuario_nombre}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Fecha</p>
                                <p className="text-gray-800 font-medium">
                                    {new Date(alerta.created_at).toLocaleDateString('es-CL')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Prioridad</p>
                                <p className="text-gray-800 font-medium">Alta</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 font-semibold">Ref. ID</p>
                                <p className="text-gray-800 font-medium">#{alerta.id}</p>
                            </div>
                        </div>

                        {/* Notas anteriores */}
                        {alerta.notas && (
                            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-bold text-blue-900 mb-2">📝 Notas del equipo municipal</h3>
                                <p className="text-blue-800 text-sm">{alerta.notas}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Estado y Acciones */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                            <h3 className="font-bold text-gray-800 mb-4">Estado de la alerta</h3>

                            <div className={`p-4 rounded-lg mb-6 border-2 text-center ${status.color}`}>
                                <div className="text-3xl mb-2">{status.icon}</div>
                                <p className="font-bold">{status.label}</p>
                            </div>

                            {isMunicipalWorker && (
                                <>
                                    {!showStatusForm ? (
                                        <button
                                            onClick={() => setShowStatusForm(true)}
                                            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition font-semibold"
                                        >
                                            ✏️ Actualizar estado
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nuevo estado
                                                </label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="">Selecciona...</option>
                                                    <option value="en_revision">En revisión</option>
                                                    <option value="resuelto">Resuelto</option>
                                                    <option value="rechazado">Rechazado</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Notas (opcional)
                                                </label>
                                                <textarea
                                                    value={notas}
                                                    onChange={(e) => setNotas(e.target.value)}
                                                    maxLength="200"
                                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    rows="3"
                                                    placeholder="Comunica acciones tomadas..."
                                                />
                                                <p className="text-xs text-gray-500 mt-1">{notas.length}/200</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleStatusUpdate}
                                                    disabled={isUpdating || !selectedStatus}
                                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition font-semibold"
                                                >
                                                    {isUpdating ? 'Actualizando...' : 'Actualizar'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowStatusForm(false);
                                                        setSelectedStatus('');
                                                        setNotas('');
                                                    }}
                                                    disabled={isUpdating}
                                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
