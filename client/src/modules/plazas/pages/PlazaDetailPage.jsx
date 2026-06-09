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
    const { plaza, reviews, userReview, loading, error, submitReview, removeReview } = usePlazaData(id, usuario);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determinar permisos según rol
    const puedeComentar = !usuario || usuario.rol === 'ciudadano' || usuario.rol === 'admin';
    const esFiscalizador = usuario?.rol === 'fiscalizador' || usuario?.rol === 'municipal_worker';

    const handleSubmit = async (rating, comentario) => {
        if (!puedeComentar) {
            toast.error('No tienes permisos para comentar plazas');
            return;
        }
        
        setIsSubmitting(true);
        const result = await submitReview(rating, comentario, !!userReview);
        setIsSubmitting(false);
        
        if (!result.success) {
            toast.error(result.error);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!puedeComentar) {
            toast.error('No tienes permisos para eliminar comentarios');
            return;
        }
        
        const confirmar = window.confirm('¿Eliminar tu comentario? Esta acción no se puede deshacer.');
        if (!confirmar) return;
        
        const result = await removeReview(reviewId);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <PlazaInfo plaza={plaza} />
            
            {/* Mensaje para fiscalizadores */}
            {esFiscalizador && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
                    <p className="text-yellow-800">
                        👮 Como fiscalizador, no puedes comentar o calificar plazas. 
                        Tu función principal es gestionar alertas en el <strong>Panel de Fiscalización</strong>.
                    </p>
                </div>
            )}
            
            {/* Formulario de comentarios - solo para ciudadanos y admin */}
            {puedeComentar ? (
                <ReviewForm 
                    usuario={usuario}
                    existingReview={userReview}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            ) : (
                esFiscalizador && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-center">
                        <p className="text-gray-500">
                            🔒 Los comentarios están deshabilitados para cuentas de fiscalización
                        </p>
                    </div>
                )
            )}
            
            <ReviewList 
                reviews={reviews}
                userReviewId={userReview?.id}
                onDelete={handleDelete}
            />
        </div>
    );
};