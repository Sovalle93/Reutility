import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
    getAdminUsuarios,
    createAdminUsuario,
    updateAdminUsuario,
    deleteAdminUsuario,
    getMunicipios,
} from '../../../services/api';

const ROLES = [
    { value: 'ciudadano', label: 'Ciudadano' },
    { value: 'fiscalizador', label: 'Fiscalizador' },
    { value: 'municipal_worker', label: 'Trabajador Municipal' },
    { value: 'admin', label: 'Administrador' },
];

const INITIAL_FORM = { email: '', nombre: '', password: '', rol: 'fiscalizador', municipio_id: '' };

const requiresMunicipio = (rol) => rol === 'fiscalizador' || rol === 'municipal_worker';

export const AdminPanel = () => {
    const { usuario } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState({});

    const fetchUsuarios = async () => {
        const users = await getAdminUsuarios();
        setUsuarios(users);
    };

    useEffect(() => {
        if (usuario?.rol !== 'admin') return;

        const fetchData = async () => {
            try {
                const [users, muns] = await Promise.all([
                    getAdminUsuarios(),
                    getMunicipios(),
                ]);
                setUsuarios(users);
                setMunicipios(muns);
            } catch {
                toast.error('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [usuario]);

    const validateForm = () => {
        const errors = {};
        if (!form.nombre.trim()) errors.nombre = 'El nombre es requerido';
        if (!form.email.trim()) errors.email = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido';
        if (!form.password) errors.password = 'La contraseña es requerida';
        else if (form.password.length < 8) errors.password = 'Mínimo 8 caracteres';
        if (requiresMunicipio(form.rol) && !form.municipio_id) errors.municipio_id = 'Selecciona un municipio';
        return errors;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        setSubmitting(true);
        try {
            await createAdminUsuario(form);
            toast.success('Usuario creado exitosamente');
            setForm(INITIAL_FORM);
            await fetchUsuarios();
        } catch (error) {
            toast.error(error.message || 'Error al crear usuario');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateUsuario = async (userId, data) => {
        try {
            await updateAdminUsuario(userId, data);
            toast.success('Usuario actualizado');
            await fetchUsuarios();
        } catch (error) {
            toast.error(error.message || 'Error al actualizar usuario');
        }
    };

    const handleDeleteUsuario = async (userId, nombre) => {
        if (!window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
        try {
            await deleteAdminUsuario(userId);
            toast.success('Usuario eliminado');
            await fetchUsuarios();
        } catch (error) {
            toast.error(error.message || 'Error al eliminar usuario');
        }
    };

    if (usuario?.rol !== 'admin') {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 font-medium">No tienes acceso a esta sección</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-8">Panel de Administración</h1>

            {/* Crear usuario */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Crear nuevo usuario</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña (mín. 8 caracteres)"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                    </div>
                    <div>
                        <select
                            value={form.rol}
                            onChange={(e) => setForm({ ...form, rol: e.target.value, municipio_id: '' })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>
                    {requiresMunicipio(form.rol) && (
                        <div>
                            <select
                                value={form.municipio_id}
                                onChange={(e) => setForm({ ...form, municipio_id: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${formErrors.municipio_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Seleccionar municipio</option>
                                {municipios.map(m => (
                                    <option key={m.id} value={m.id}>{m.nombre}</option>
                                ))}
                            </select>
                            {formErrors.municipio_id && <p className="text-red-500 text-xs mt-1">{formErrors.municipio_id}</p>}
                        </div>
                    )}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? 'Creando...' : 'Crear usuario'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista de usuarios */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-6 border-b">Usuarios del sistema</h2>
                {loading ? (
                    <p className="p-6 text-center text-gray-500">Cargando usuarios...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuarios.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.nombre}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.rol}
                                                onChange={(e) => handleUpdateUsuario(user.id, { rol: e.target.value, municipio_id: user.municipio_id })}
                                                disabled={user.id === usuario?.id}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {requiresMunicipio(user.rol) ? (
                                                <select
                                                    value={user.municipio_id || ''}
                                                    onChange={(e) => handleUpdateUsuario(user.id, { rol: user.rol, municipio_id: e.target.value || null })}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="">Sin municipio</option>
                                                    {municipios.map(m => (
                                                        <option key={m.id} value={m.id}>{m.nombre}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-gray-500">{user.municipio_nombre || '-'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.rol !== 'admin' && user.id !== usuario?.id && (
                                                <button
                                                    onClick={() => handleDeleteUsuario(user.id, user.nombre)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {usuarios.length === 0 && (
                            <p className="p-6 text-center text-gray-500">No hay usuarios registrados</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
