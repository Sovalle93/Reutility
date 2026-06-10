import { useAuth } from '../../../hooks/useAuth';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAdminMutations } from '../hooks/useAdminMutations';
import { StatsCards } from '../components/StatsCards';
import { CreateUserForm } from '../components/CreateUserForm';
import { UserTable } from '../components/UserTable';

export const AdminPanel = () => {
    const { usuario } = useAuth();
    const { users, municipios, isLoading } = useAdminUsers();
    const { createUser, isCreating, updateUser, pendingUpdateId, deleteUser } = useAdminMutations();

    if (usuario?.rol !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <p className="text-red-600 font-medium">No tienes acceso a esta sección</p>
                </div>
            </div>
        );
    }

    const handleCreate = (formData, onSuccess) => {
        createUser(formData, { onSuccess });
    };

    const handleDelete = (userId, nombre) => {
        if (!window.confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
        deleteUser(userId);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-emerald-800">Panel de Administración</h1>
                <p className="text-gray-500 mt-1">Gestión de usuarios y permisos del sistema</p>
            </div>

            <StatsCards users={users} />

            <CreateUserForm
                municipios={municipios}
                onSubmit={handleCreate}
                isCreating={isCreating}
            />

            <UserTable
                users={users}
                municipios={municipios}
                currentUserId={usuario?.id}
                isLoading={isLoading}
                onUpdate={updateUser}
                onDelete={handleDelete}
                pendingUpdateId={pendingUpdateId}
            />
        </div>
    );
};
