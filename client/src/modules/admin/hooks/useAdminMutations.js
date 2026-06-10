import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createAdminUsuario, updateAdminUsuario, deleteAdminUsuario } from '../../../services/api';

/**
 * Provides create, update, and delete mutations for admin user management.
 * All mutations invalidate the ['admin-users'] query on success.
 * `pendingUpdateId` tracks which user row is currently being saved.
 */
export const useAdminMutations = () => {
    const queryClient = useQueryClient();
    const [pendingUpdateId, setPendingUpdateId] = useState(null);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

    const { mutate: createUser, isPending: isCreating } = useMutation({
        mutationFn: createAdminUsuario,
        onSuccess: () => { invalidate(); toast.success('Usuario creado exitosamente'); },
        onError: (err) => toast.error(err.message || 'Error al crear usuario'),
    });

    const { mutate: updateUser } = useMutation({
        mutationFn: ({ userId, data }) => updateAdminUsuario(userId, data),
        onMutate: ({ userId }) => setPendingUpdateId(userId),
        onSuccess: () => { invalidate(); toast.success('Usuario actualizado'); },
        onError: (err) => toast.error(err.message || 'Error al actualizar usuario'),
        onSettled: () => setPendingUpdateId(null),
    });

    const { mutate: deleteUser } = useMutation({
        mutationFn: deleteAdminUsuario,
        onSuccess: () => { invalidate(); toast.success('Usuario eliminado'); },
        onError: (err) => toast.error(err.message || 'Error al eliminar usuario'),
    });

    return { createUser, isCreating, updateUser, pendingUpdateId, deleteUser };
};
