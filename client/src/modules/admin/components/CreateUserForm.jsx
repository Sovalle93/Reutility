import { useState } from 'react';
import toast from 'react-hot-toast';
import { ROLE_OPTIONS, requiresMunicipio, getPasswordStrength } from '../utils/adminHelpers';
import { validateAdminCreateUser } from '../../../schemas/userSchema';

const INITIAL = { nombre: '', email: '', password: '', rol: 'fiscalizador', municipio_id: '' };

const inputClass = (hasError) =>
    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        hasError ? 'border-red-400' : 'border-gray-300'
    }`;

/**
 * @param {{ municipios: Array, onSubmit: Function, isCreating: boolean }} props
 */
export const CreateUserForm = ({ municipios, onSubmit, isCreating }) => {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleRolChange = (e) => {
        const newRol = e.target.value;
        setForm(prev => ({ ...prev, rol: newRol, municipio_id: requiresMunicipio(newRol) ? prev.municipio_id : '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = validateAdminCreateUser(form);
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach(err => {
                if (err.path.length > 0) fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            toast.error(result.error.errors[0].message);
            return;
        }
        setErrors({});
        onSubmit(form, () => setForm(INITIAL));
    };

    const strength = getPasswordStrength(form.password);

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Crear nuevo usuario</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" noValidate>

                <div>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={form.nombre}
                        onChange={(e) => set('nombre', e.target.value)}
                        className={inputClass(errors.nombre)}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        className={inputClass(errors.email)}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Contraseña (mín. 8 caracteres)"
                        value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        className={inputClass(errors.password)}
                    />
                    {form.password && (
                        <div className="mt-2">
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-colors ${
                                            i < strength.score ? strength.color : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
                        </div>
                    )}
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                    <select
                        value={form.rol}
                        onChange={handleRolChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>

                {requiresMunicipio(form.rol) && (
                    <div>
                        <select
                            value={form.municipio_id}
                            onChange={(e) => set('municipio_id', e.target.value)}
                            className={inputClass(errors.municipio_id)}
                        >
                            <option value="">Seleccionar municipio</option>
                            {municipios.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                        {errors.municipio_id && <p className="text-red-500 text-xs mt-1">{errors.municipio_id}</p>}
                    </div>
                )}

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isCreating ? 'Creando...' : '+ Crear usuario'}
                    </button>
                </div>
            </form>
        </div>
    );
};
