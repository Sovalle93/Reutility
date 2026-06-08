import { useEffect, useState } from 'react';

export const MunicipioSelector = ({ value, onSelect, disabled = false, showLabel = true }) => {
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/municipios');
                if (!res.ok) {
                    throw new Error('Error al cargar municipios');
                }
                const data = await res.json();
                setMunicipios(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching municipios:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMunicipios();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className="text-gray-600">Cargando municipios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-red-600">
                <span>Error: {error}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {showLabel && <label className="font-semibold text-gray-700">Municipio:</label>}
            <select
                value={value || ''}
                onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value) : null)}
                disabled={disabled}
                className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'
                }`}
            >
                <option value="">Ver todos los municipios</option>
                {municipios.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                        {mun.nombre} {mun.region ? `(${mun.region})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
};
