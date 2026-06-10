import { useQuery } from '@tanstack/react-query';
import { getAlertas } from '../../../services/api';

/**
 * Fetches all alertas. Client-side filtering is handled by consumers.
 */
export const useAlertas = () => {
    const { data: alertas = [], isLoading } = useQuery({
        queryKey: ['alertas'],
        queryFn: () => getAlertas(),
    });

    return { alertas, isLoading };
};
