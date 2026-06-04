import { useState, useEffect } from 'react'
import { getPlazas } from '../../../services/api'
import { useNavigate } from 'react-router-dom'

export function PlazasPage() {
  const [plazas, setPlazas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

const navigate = useNavigate()

  useEffect(() => {
    const fetchPlazas = async () => {
      try {
        const data = await getPlazas()
        setPlazas(data)
      } catch (error) {
        console.error('Error cargando plazas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlazas()
  }, [])

  const plazasFiltradas = plazas.filter(plaza =>
    plaza.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl">Cargando plazas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plazas disponibles</h1>
        <p className="text-gray-600">Explora y califica las plazas de tu ciudad</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar plaza..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plazasFiltradas.map(plaza => (
          <div key={plaza.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{plaza.nombre}</h3>
              <p className="text-gray-500 text-sm mb-2">{plaza.municipio}</p>
              <div className="flex items-center mb-3">
                <span className="text-emerald-500 mr-1">★</span>
                <span className="font-semibold">{parseFloat(plaza.rating_promedio).toFixed(1)}</span>
                <span className="text-gray-400 text-sm ml-1">/5</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{plaza.descripcion}</p>
                <button 
                  onClick={() => navigate(`/plazas/${plaza.id}`)}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Ver detalles
                </button>
            </div>
          </div>
        ))}
      </div>

      {plazasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron plazas</p>
        </div>
      )}
    </div>
  )
}