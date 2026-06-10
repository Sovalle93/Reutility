import { ROLE_LABELS } from '../utils/adminHelpers';

const ROLE_STYLES = {
    ciudadano:       'bg-blue-50 border-blue-100 text-blue-700',
    fiscalizador:    'bg-yellow-50 border-yellow-100 text-yellow-700',
    municipal_worker:'bg-purple-50 border-purple-100 text-purple-700',
    admin:           'bg-emerald-50 border-emerald-100 text-emerald-700',
};

/**
 * @param {{ users: Array }} props
 */
export const StatsCards = ({ users }) => {
    const countByRole = Object.keys(ROLE_LABELS).reduce((acc, rol) => {
        acc[rol] = users.filter(u => u.rol === rol).length;
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <div className="text-3xl font-bold text-gray-800">{users.length}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">Total usuarios</div>
            </div>
            {Object.entries(ROLE_LABELS).map(([rol, label]) => (
                <div key={rol} className={`rounded-xl shadow-sm border p-4 text-center ${ROLE_STYLES[rol]}`}>
                    <div className="text-3xl font-bold">{countByRole[rol]}</div>
                    <div className="text-xs font-medium mt-1">{label}</div>
                </div>
            ))}
        </div>
    );
};
