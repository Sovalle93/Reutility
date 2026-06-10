import { useQuery } from '@tanstack/react-query';
import { getPlazas } from '../../../services/api';

/**
 * Fetches plazas, optionally filtered by municipio.
 * @param {number|null} municipioId
 */
export const usePlazas = (municipioId = null) => {
    const { data: plazas = [], isLoading } = useQuery({
        queryKey: ['plazas', municipioId],
        queryFn: () => getPlazas(municipioId),
    });

    return { plazas, isLoading };
};
