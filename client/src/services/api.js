const API_URL = 'http://localhost:5000/api';

export const getPlazas = async () => {
    const response = await fetch(`${API_URL}/plazas`);
    return response.json();
};

export const getPlazaById = async (id) => {
    const response = await fetch(`${API_URL}/plazas/${id}`);
    return response.json();
};

export const getReviewsByPlaza = async (plazaId) => {
    const response = await fetch(`${API_URL}/plazas/${plazaId}/reviews`);
    return response.json();
};

export const createReview = async (plazaId, reviewData) => {
    const response = await fetch(`${API_URL}/plazas/${plazaId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
    });
    return response.json();
};