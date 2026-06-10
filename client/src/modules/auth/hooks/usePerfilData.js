import { useQuery } from '@tanstack/react-query';
import { getMisReviews, getMisAlertas } from '../../../services/api';

/**
 * Fetches the authenticated user's reviews and reported alerts in parallel.
 * Queries are disabled until `usuario` is truthy.
 * @param {object|null} usuario
 */
export const usePerfilData = (usuario) => {
    const { data: misReviews = [], isLoading: loadingReviews } = useQuery({
        queryKey: ['mis-reviews'],
        queryFn: getMisReviews,
        enabled: !!usuario,
    });

    const { data: misAlertas = [], isLoading: loadingAlertas } = useQuery({
        queryKey: ['mis-alertas'],
        queryFn: getMisAlertas,
        enabled: !!usuario,
    });

    return { misReviews, misAlertas, loadingReviews, loadingAlertas };
};
