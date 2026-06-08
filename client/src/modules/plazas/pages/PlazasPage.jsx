import { useState, useEffect } from 'react'
import { getPlazas } from '../../../services/api'
import { useNavigate } from 'react-router-dom'
import { MunicipioSelector } from '../components/MunicipioSelector'
import { useAuth } from '../../../hooks/useAuth'

export function PlazasPage() {
  const [plazas, setPlazas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [municipioFilter, setMunicipioFilter] = useState(null)
  const { usuario } = useAuth()
  const navigate = useNavigate()

  // Load municipio filter from localStorage on mount
  useEffect(() => {
    const savedMunicipioFilter = localStorage.getItem('plaza_municipio_filter');
    if (savedMunicipioFilter) {
      setMunicipioFilter(parseInt(savedMunicipioFilter));
    }
  }, []);

  useEffect(() => {
    const fetchPlazas = async () => {
      try {
        const data = await getPlazas(municipioFilter)
        setPlazas(data)
      } catch (error) {
        console.error('Error cargando plazas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlazas()
  }, [municipioFilter])

  const handleMunicipioChange = (newMunicipioId) => {
    setMunicipioFilter(newMunicipioId);
    // Persist selection to localStorage
    if (newMunicipioId) {
      localStorage.setItem('plaza_municipio_filter', newMunicipioId);
    } else {
      localStorage.removeItem('plaza_municipio_filter');
    }
  }

  const plazasFiltradas = plazas.filter(plaza =>
    plaza.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <div className="text-gray-600">Cargando plazas...</div>
        </div>
      </div>
    )
  }

  // For fiscalizadores and municipal_workers, show their municipality
  const isFiscalizador = usuario?.rol === 'fiscalizador' || usuario?.rol === 'municipal_worker';
  const showMunicipioBadge = isFiscalizador && usuario?.municipio_nombre;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header centrado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Plazas disponibles</h1>
        <p className="text-gray-600">Explora y califica las plazas de tu ciudad</p>
        {showMunicipioBadge && (
          <p className="text-sm text-emerald-700 mt-2 font-semibold">
            📍 Municipio: {usuario.municipio_nombre}
          </p>
        )}
      </div>

      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
        {/* Search bar */}
        <div className="w-full md:flex-1">
          <input
            type="text"
            placeholder="🔍 Buscar plaza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Municipio selector - only show for ciudadanos and admins */}
        {!isFiscalizador && (
          <div className="w-full md:w-auto">
            <MunicipioSelector 
              value={municipioFilter} 
              onSelect={handleMunicipioChange}
              showLabel={true}
            />
          </div>
        )}
      </div>

      {/* Grid de plazas */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plazasFiltradas.map(plaza => (
          <div key={plaza.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{plaza.nombre}</h3>
              <p className="text-emerald-600 text-sm mb-2">📍 {plaza.municipio_nombre || plaza.municipio}</p>
              <div className="flex items-center mb-3">
                <div className="flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                  <span className="text-emerald-500 mr-1">★</span>
                  <span className="font-semibold text-emerald-700">{parseFloat(plaza.rating_promedio).toFixed(1)}</span>
                  <span className="text-gray-400 text-sm ml-1">/5</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plaza.descripcion}</p>
              <button 
                onClick={() => navigate(`/plazas/${plaza.id}`)}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
              >
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje sin resultados */}
      {plazasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500">No se encontraron plazas con "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-2 text-emerald-600 hover:underline text-sm"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  )
}