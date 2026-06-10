import { UserRow } from './UserRow';

const COLUMNS = ['Nombre', 'Email', 'Rol', 'Municipio', 'Acciones'];

const SkeletonRow = () => (
    <tr>
        {COLUMNS.map(col => (
            <td key={col} className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
        ))}
    </tr>
);

/**
 * @param {{
 *   users: Array,
 *   municipios: Array,
 *   currentUserId: number,
 *   isLoading: boolean,
 *   onUpdate: Function,
 *   onDelete: Function,
 *   pendingUpdateId: number|null,
 * }} props
 */
export const UserTable = ({ users, municipios, currentUserId, isLoading, onUpdate, onDelete, pendingUpdateId }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Usuarios del sistema</h2>
            <span className="text-sm text-gray-400">{users.length} registros</span>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {COLUMNS.map(col => (
                            <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading
                        ? Array.from({ length: 4 }, (_, i) => <SkeletonRow key={i} />)
                        : users.map(user => (
                            <UserRow
                                key={user.id}
                                user={user}
                                currentUserId={currentUserId}
                                municipios={municipios}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                isUpdating={pendingUpdateId === user.id}
                            />
                        ))
                    }
                </tbody>
            </table>

            {!isLoading && users.length === 0 && (
                <div className="py-16 text-center">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-gray-500">No hay usuarios registrados</p>
                </div>
            )}
        </div>
    </div>
);
