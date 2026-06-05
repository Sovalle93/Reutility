import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usePlazaData } from '../hooks/usePlazaData';
import { PlazaInfo } from '../components/PlazaInfo';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const PlazaDetailPage = () => {
    const { id } = useParams();
    const { usuario } = useAuth();
    const { plaza, reviews, userReview, loading, refreshing, error, submitReview, removeReview } = usePlazaData(id, usuario);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingReviewId, setDeletingReviewId] = useState(null);

    const handleSubmit = async (rating, comentario) => {
        setIsSubmitting(true);
        const result = await submitReview(rating, comentario, !!userReview);
        setIsSubmitting(false);

        if (!result.success) {
            toast.error(result.error);
        }
    };

    const askDeleteConfirmation = () => new Promise((resolve) => {
        toast.custom((t) => (
            <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-4 text-left">
                <p className="text-gray-900 font-semibold mb-3">¿Eliminar tu comentario?</p>
                <p className="text-sm text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(false);
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            toast.dismiss(t.id);
                            resolve(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'bottom-center'
        });
    });

    const handleDelete = async (reviewId) => {
        const confirmed = await askDeleteConfirmation();
        if (!confirmed) return;

        setDeletingReviewId(reviewId);
        const result = await removeReview(reviewId);
        setDeletingReviewId(null);

        if (!result.success) {
            toast.error(result.error);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    if (!plaza) {
        return <div className="text-center py-12">Plaza no encontrada</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <PlazaInfo plaza={plaza} />
            {refreshing && (
                <div className="text-sm text-gray-600 mb-6 flex items-center gap-2 animate-pulse">
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Actualizando comentarios...</span>
                </div>
            )}
            <ReviewForm 
                usuario={usuario}
                existingReview={userReview}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
            <ReviewList 
                reviews={reviews}
                userReviewId={userReview?.id}
                onDelete={handleDelete}
                deletingReviewId={deletingReviewId}
            />
        </div>
    );
};