const ReviewItem = ({ review, isOwnReview, onDelete, deleting }) => {
    return (
        <div className="border-b border-gray-200 pb-4 last:border-0 animate-fadeIn transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">
                        {review.usuario_nombre || 'Anónimo'}
                        {isOwnReview && (
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                                Tu opinión
                            </span>
                        )}
                    </span>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-base transition-all duration-200 ${
                                i < review.rating ? 'text-emerald-500 scale-110' : 'text-gray-300'
                            }`}>
                                ★
                            </span>
                        ))}
                    </div>
                </div>
                <span className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('es-CL')}
                </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
            
            {isOwnReview && (
                <button
                    onClick={() => onDelete(review.id)}
                    disabled={deleting}
                    className={`mt-3 text-sm flex items-center gap-1.5 transition-all duration-200 ${
                        deleting
                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                            : 'text-red-600 hover:text-red-800 hover:gap-2 active:scale-95'
                    }`}
                >
                    {deleting ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Eliminando...</span>
                        </>
                    ) : (
                        <>
                            <span>🗑️</span>
                            <span>Eliminar</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export const ReviewList = ({ reviews, userReviewId, onDelete, deletingReviewId }) => {
    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-4">Opiniones de la comunidad</h2>
                <p className="text-gray-500 text-center py-6">No hay opiniones aún. Sé el primero en comentar.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Opiniones de la comunidad
                <span className="text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {reviews.length}
                </span>
            </h2>
            <div className="space-y-5">
                {reviews.map((review, index) => (
                    <div
                        key={review.id}
                        style={{
                            animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
                        }}
                    >
                        <ReviewItem
                            review={review}
                            isOwnReview={userReviewId === review.id}
                            onDelete={onDelete}
                            deleting={deletingReviewId === review.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};