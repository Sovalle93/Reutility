import { useState, useEffect } from 'react';
import { ROLE_OPTIONS, requiresMunicipio } from '../utils/adminHelpers';

/**
 * @param {{
 *   user: object,
 *   currentUserId: number,
 *   municipios: Array,
 *   onUpdate: Function,
 *   onDelete: Function,
 *   isUpdating: boolean,
 * }} props
 */
export const UserRow = ({ user, currentUserId, municipios, onUpdate, onDelete, isUpdating }) => {
    const [local, setLocal] = useState({ rol: user.rol, municipio_id: user.municipio_id ?? '' });

    useEffect(() => {
        setLocal({ rol: user.rol, municipio_id: user.municipio_id ?? '' });
    }, [user.rol, user.municipio_id]);

    const hasChanges =
        local.rol !== user.rol ||
        String(local.municipio_id ?? '') !== String(user.municipio_id ?? '');

    const isSelf = user.id === currentUserId;
    const isAdmin = user.rol === 'admin';

    const handleRolChange = (e) => {
        const newRol = e.target.value;
        setLocal(prev => ({
            rol: newRol,
            municipio_id: requiresMunicipio(newRol) ? prev.municipio_id : '',
        }));
    };

    const handleSave = () => onUpdate({ userId: user.id, data: local });

    const handleCancel = () =>
        setLocal({ rol: user.rol, municipio_id: user.municipio_id ?? '' });

    const handleDelete = () => onDelete(user.id, user.nombre);

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{user.nombre}</div>
            </td>
            <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>

            <td className="px-6 py-4">
                <select
                    value={local.rol}
                    onChange={handleRolChange}
                    disabled={isSelf}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {ROLE_OPTIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
            </td>

            <td className="px-6 py-4">
                {requiresMunicipio(local.rol) ? (
                    <select
                        value={local.municipio_id}
                        onChange={(e) => setLocal(prev => ({ ...prev, municipio_id: e.target.value }))}
                        disabled={isSelf}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Sin municipio</option>
                        {municipios.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                ) : (
                    <span className="text-gray-500 text-sm">{user.municipio_nombre || '—'}</span>
                )}
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : hasChanges ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 border border-gray-300 text-gray-600 text-xs font-medium rounded hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        !isAdmin && !isSelf && (
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                                Eliminar
                            </button>
                        )
                    )}
                </div>
            </td>
        </tr>
    );
};
