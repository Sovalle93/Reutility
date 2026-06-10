import { useQuery } from '@tanstack/react-query';
import { getAdminUsuarios, getMunicipios } from '../../../services/api';

/**
 * Fetches admin users list and municipios in parallel.
 * Both results are cached independently by React Query.
 */
export const useAdminUsers = () => {
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['admin-users'],
        queryFn: getAdminUsuarios,
    });

    const { data: municipios = [] } = useQuery({
        queryKey: ['municipios'],
        queryFn: getMunicipios,
        staleTime: 10 * 60 * 1000,
    });

    return { users, municipios, isLoading, error };
};
