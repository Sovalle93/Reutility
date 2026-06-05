import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { getPlazaById, getReviewsByPlaza, createReview, updateReview, deleteReview, getUserReview } from '../../../services/api';

export const usePlazaData = (plazaId, usuario) => {
    const [plaza, setPlaza] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const isMounted = useRef(true);

    const loadData = useCallback(async (showLoading = false) => {
        if (!isMounted.current) return;

        if (showLoading) {
            setLoading(true);
            setError('');
        } else {
            setRefreshing(true);
        }

        try {
            const [plazaData, reviewsData] = await Promise.all([
                getPlazaById(plazaId),
                getReviewsByPlaza(plazaId)
            ]);

            if (!isMounted.current) return;

            setPlaza(plazaData);
            setReviews(reviewsData);

            if (usuario) {
                const userReviewData = await getUserReview(plazaId);
                if (!isMounted.current) return;

                if (userReviewData?.id) {
                    setUserReview(userReviewData);
                } else {
                    setUserReview(null);
                }
            } else {
                setUserReview(null);
            }
        } catch {
            if (isMounted.current) {
                setError('Error al cargar los datos');
                toast.error('Error al cargar la plaza');
            }
        } finally {
            if (isMounted.current) {
                if (showLoading) {
                    setLoading(false);
                } else {
                    setRefreshing(false);
                }
            }
        }
    }, [plazaId, usuario]);

    useEffect(() => {
        isMounted.current = true;

        const processData = async () => {
            await loadData(true);
        };

        processData();

        return () => {
            isMounted.current = false;
        };
    }, [loadData]);

    const submitReview = async (rating, comentario, editMode) => {
        const toastId = toast.loading(editMode ? 'Actualizando opinión...' : 'Publicando tu opinión...');

        try {
            if (editMode && userReview) {
                await updateReview(userReview.id, { rating, comentario });
                toast.success('¡Opinión actualizada!', { id: toastId });
            } else {
                await createReview(plazaId, { rating, comentario });
                toast.success('¡Gracias por tu opinión!', { id: toastId });
            }
            await loadData(false);
            return { success: true };
        } catch {
            toast.error('Error al guardar. Intenta nuevamente', { id: toastId });
            return { success: false, error: 'Error al guardar tu opinión' };
        }
    };

    const removeReview = async (reviewId) => {
        const toastId = toast.loading('Eliminando comentario...');

        try {
            await deleteReview(reviewId);
            toast.success('Comentario eliminado', { id: toastId });
            await loadData(false);
            return { success: true };
        } catch {
            toast.error('Error al eliminar', { id: toastId });
            return { success: false, error: 'Error al eliminar' };
        }
    };

    return {
        plaza,
        reviews,
        userReview,
        loading,
        refreshing,
        error,
        submitReview,
        removeReview
    };
};