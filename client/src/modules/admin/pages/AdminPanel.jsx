import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

export const AdminPanel = () => {
    const { usuario } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: '',
        nombre: '',
        password: '',
        rol: 'fiscalizador',
        municipio_id: ''
    });

    useEffect(() => {
        if (usuario?.rol !== 'admin') return;
        
        const fetchData = async () => {
            try {
                const [usersRes, munRes] = await Promise.all([
                    fetch('/api/admin/usuarios', { credentials: 'include' }),
                    fetch('/api/municipios')
                ]);
                const users = await usersRes.json();
                const muns = await munRes.json();
                setUsuarios(users);
                setMunicipios(muns);
            } catch (error) {
                toast.error('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [usuario]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error();
            toast.success('Usuario creado exitosamente');
            setForm({ email: '', nombre: '', password: '', rol: 'fiscalizador', municipio_id: '' });
            // Recargar lista
            const usersRes = await fetch('/api/admin/usuarios', { credentials: 'include' });
            setUsuarios(await usersRes.json());
        } catch (error) {
            toast.error('Error al crear usuario');
        }
    };

    const handleUpdateRole = async (userId, newRol, municipioId) => {
        try {
            const res = await fetch(`/api/admin/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ rol: newRol, municipio_id: municipioId })
            });
            if (!res.ok) throw new Error();
            toast.success('Rol actualizado');
            const usersRes = await fetch('/api/admin/usuarios', { credentials: 'include' });
            setUsuarios(await usersRes.json());
        } catch (error) {
            toast.error('Error al actualizar');
        }
    };

    if (usuario?.rol !== 'admin') {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">No tienes acceso a esta sección</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-8">Panel de Administración</h1>

            {/* Formulario para crear usuario */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Crear nuevo usuario</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                        required
                    />
                    <select
                        value={form.rol}
                        onChange={(e) => setForm({ ...form, rol: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="ciudadano">Ciudadano</option>
                        <option value="fiscalizador">Fiscalizador</option>
                        <option value="municipal_worker">Trabajador Municipal</option>
                        <option value="admin">Administrador</option>
                    </select>
                    {(form.rol === 'fiscalizador' || form.rol === 'municipal_worker') && (
                        <select
                            value={form.municipio_id}
                            onChange={(e) => setForm({ ...form, municipio_id: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Seleccionar municipio</option>
                            {municipios.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    )}
                    <button
                        type="submit"
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                        Crear usuario
                    </button>
                </form>
            </div>

            {/* Lista de usuarios */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-6 border-b">Usuarios del sistema</h2>
                {loading ? (
                    <p className="p-6 text-center">Cargando...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Municipio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuarios.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">{user.nombre}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.rol}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value, user.municipio_id)}
                                                className="px-2 py-1 border rounded text-sm"
                                            >
                                                <option value="ciudadano">Ciudadano</option>
                                                <option value="fiscalizador">Fiscalizador</option>
                                                <option value="municipal_worker">Trabajador</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">{user.municipio_nombre || '-'}</td>
                                        <td className="px-6 py-4">
                                            {user.rol !== 'admin' && (
                                                <button
                                                    onClick={() => {/* Implementar eliminar */}}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};