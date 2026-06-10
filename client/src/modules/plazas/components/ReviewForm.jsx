import { useState, useEffect } from 'react';
import { validateReview } from '../../../schemas/reviewSchema';
import toast from 'react-hot-toast';

const Spinner = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ReviewForm = ({ usuario, existingReview, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comentario, setComentario] = useState(existingReview?.comentario || '');
    const [submitted, setSubmitted] = useState(false);
    const [toastId, setToastId] = useState(null);

    useEffect(() => {
        setRating(existingReview?.rating || 0);
        setComentario(existingReview?.comentario || '');
        setSubmitted(false);
    }, [existingReview]);
    
    useEffect(() => {
        if (isSubmitting && !toastId) {
            const id = toast.loading(
                existingReview ? '✏️ Actualizando tu comentario...' : '💬 Agregando tu comentario...',
                { duration: Infinity }
            );
            setToastId(id);
        } else if (!isSubmitting && toastId) {
            toast.dismiss(toastId);
            setToastId(null);
        }
    }, [isSubmitting, toastId, existingReview]);
    
    const isEditMode = !!existingReview;
    const isRatingValid = rating > 0;
    const isComentarioValid = comentario.trim().length > 0;
    const isFormValid = isRatingValid && isComentarioValid;

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        
        const validation = validateReview({ rating, comentario });
            if (!validation.success) {
                // Tomar el primer error
                const firstError = validation.error.errors[0]?.message || 'Datos inválidos';
                toast.error(firstError);
                return;
            }
        
        onSubmit(rating, comentario);
    };

    if (!usuario) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar mi opinión' : 'Dejar mi opinión'}</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">
                        Para dejar una opinión debes <a href="/login" className="font-semibold underline">iniciar sesión</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 transition-colors duration-200">
                {isEditMode ? 'Editar mi opinión' : 'Dejar mi opinión'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div className="mb-6 transition-opacity duration-200">
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        Calificación
                        {submitted && !isRatingValid && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                disabled={isSubmitting}
                                className={`text-4xl transition-all duration-200 transform ${
                                    star <= rating
                                        ? 'text-emerald-500 scale-110'
                                        : 'text-gray-300 hover:text-emerald-400 hover:scale-105'
                                } ${isSubmitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Comentario */}
                <div className="mb-6 transition-opacity duration-200">
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        Comentario
                        {submitted && !isComentarioValid && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                            submitted && !isComentarioValid
                                ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                        rows="4"
                        placeholder="¿Qué opinas de esta plaza?"
                    />
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 flex items-center gap-2 ${
                        isFormValid && !isSubmitting
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            <span>Guardando...</span>
                        </>
                    ) : (
                        isEditMode ? 'Actualizar opinión' : 'Enviar opinión'
                    )}
                </button>
            </form>
        </div>
    );
};