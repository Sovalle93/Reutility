const API_URL = 'http://localhost:5000/api';

export const getRanking = async (municipioId = null, limit = 10) => {
    let url = `${API_URL}/ranking?limit=${limit}`;
    if (municipioId) {
        url += `&municipio_id=${municipioId}`;
    }
    const res = await fetch(url);
    return res.json();
};

// ===== MUNICIPIOS API =====
export const getMunicipios = async () => {
    const res = await fetch(`${API_URL}/municipios`);
    return res.json();
};

// ===== PLAZAS API =====
export const getPlazas = async (municipioId = null) => {
    let url = `${API_URL}/plazas`;
    if (municipioId) {
        url += `?municipio_id=${municipioId}`;
    }
    const res = await fetch(url);
    return res.json();
};

export const getPlazaById = async (id) => {
    const res = await fetch(`${API_URL}/plazas/${id}`);
    return res.json();
};

export const getReviewsByPlaza = async (plazaId) => {
    const res = await fetch(`${API_URL}/plazas/${plazaId}/reviews`);
    return res.json();
};

export const createReview = async (plazaId, reviewData) => {
    const res = await fetch(`${API_URL}/plazas/${plazaId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData)
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al guardar');
    }
    
    return res.json();
};

export const getUserReview = async (plazaId) => {
    const res = await fetch(`${API_URL}/plazas/${plazaId}/reviews/usuario`, {
        credentials: 'include'
    });
    if (res.status === 401) return null;
    return res.json();
};

export const updateReview = async (reviewId, reviewData) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al actualizar');
    }
    return res.json();
};

export const deleteReview = async (reviewId) => {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al eliminar');
    }
    
    return res.json();
};

export const getMisReviews = async () => {
    const res = await fetch(`${API_URL}/mis-reviews`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
};

// ===== ALERTAS API =====
export const getAlertas = async (status = null) => {
    const url = status ? `${API_URL}/alertas?status=${status}` : `${API_URL}/alertas`;
    const res = await fetch(url);
    return res.json();
};

export const getAlertaById = async (id) => {
    const res = await fetch(`${API_URL}/alertas/${id}`);
    return res.json();
};

export const createAlerta = async (formData) => {
    const res = await fetch(`${API_URL}/alertas`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al crear alerta');
    }
    
    return res.json();
};

export const updateAlertaStatus = async (alertaId, status) => {
    const res = await fetch(`${API_URL}/alertas/${alertaId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error al actualizar alerta');
    }
    
    return res.json();
};

export const getMisAlertas = async () => {
    const res = await fetch(`${API_URL}/mis-alertas`, {
        credentials: 'include'
    });

    if (!res.ok) {
        if (res.status === 401) return [];
        const error = await res.json();
        throw new Error(error.error || 'Error al obtener mis alertas');
    }

    return res.json();
};

