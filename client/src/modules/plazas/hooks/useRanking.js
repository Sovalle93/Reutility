import { useQuery } from '@tanstack/react-query';
import { getRanking, getMunicipios } from '../../../services/api';

/**
 * Fetches ranking data and municipios list.
 * @param {string|number|null} municipioId
 * @param {number} limit
 */
export const useRanking = (municipioId = null, limit = 20) => {
    const { data: rankingData, isLoading } = useQuery({
        queryKey: ['ranking', municipioId, limit],
        queryFn: () => getRanking(municipioId || null, limit),
    });

    const { data: municipios = [] } = useQuery({
        queryKey: ['municipios'],
        queryFn: getMunicipios,
        staleTime: 10 * 60 * 1000,
    });

    return {
        ranking: rankingData?.ranking ?? [],
        estadisticas: rankingData?.estadisticas ?? null,
        municipios,
        isLoading,
    };
};
