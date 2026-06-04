import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPlazaById, getReviewsByPlaza, createReview } from '../../../services/api'

export function PlazaDetailPage() {
  const { id } = useParams()
  const [plaza, setPlaza] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [comentario, setComentario] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plazaData, reviewsData] = await Promise.all([
          getPlazaById(id),
          getReviewsByPlaza(id)
        ])
        setPlaza(plazaData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      await createReview(id, {
        rating,
        comentario,
        usuario_nombre: 'Anónimo'
      })
      
      // Recargar reviews
      const newReviews = await getReviewsByPlaza(id)
      setReviews(newReviews)
      
      // Actualizar promedio de la plaza
      const updatedPlaza = await getPlazaById(id)
      setPlaza(updatedPlaza)
      
      // Limpiar formulario
      setComentario('')
      setRating(5)
      
    } catch (error) {
      console.error('Error enviando review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>
  }

  if (!plaza) {
    return <div className="text-center py-12">Plaza no encontrada</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Información de la plaza */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">{plaza.nombre}</h1>
        <p className="text-gray-600 mb-4">{plaza.municipio} • {plaza.direccion}</p>
        
        <div className="flex items-center mb-4">
          <span className="text-2xl text-emerald-500 mr-2">★</span>
          <span className="text-2xl font-bold">{parseFloat(plaza.rating_promedio).toFixed(1)}</span>
          <span className="text-gray-500 ml-2">({plaza.total_reviews} reviews)</span>
        </div>
        
        <p className="text-gray-700">{plaza.descripcion}</p>
      </div>

      {/* Formulario para agregar review */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Deja tu opinión</h2>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-emerald-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="4"
              required
              placeholder="¿Qué opinas de esta plaza?"
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {submitting ? 'Enviando...' : 'Enviar opinión'}
          </button>
        </form>
      </div>

      {/* Lista de reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Opiniones de la comunidad</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500">No hay opiniones aún. Sé el primero en comentar.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.usuario_nombre}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-emerald-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('es-CL')}
                  </span>
                </div>
                <p className="text-gray-700">{review.comentario}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}