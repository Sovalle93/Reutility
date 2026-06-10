import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAlertas, updateAlertaStatus } from '../../../services/api';

/**
 * Hook for fiscalizador/admin alert management.
 * Provides the alertas list and a status mutation that auto-invalidates the cache.
 */
export const useAlertasGestion = () => {
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState(null);

    const { data: alertas = [], isLoading } = useQuery({
        queryKey: ['alertas'],
        queryFn: () => getAlertas(),
    });

    const { mutate } = useMutation({
        mutationFn: ({ alertaId, nuevoEstado }) =>
            updateAlertaStatus(alertaId, nuevoEstado),
        onMutate: ({ alertaId }) => setUpdatingId(alertaId),
        onSuccess: (_, { nuevoEstado }) => {
            queryClient.invalidateQueries({ queryKey: ['alertas'] });
            toast.success(`Alerta actualizada a: ${nuevoEstado}`);
        },
        onError: () => toast.error('Error al actualizar'),
        onSettled: () => setUpdatingId(null),
    });

    const handleStatusChange = (alertaId, nuevoEstado) =>
        mutate({ alertaId, nuevoEstado });

    return { alertas, isLoading, handleStatusChange, updatingId };
};
