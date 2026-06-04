export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero section - actualizado a verde */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">
          🌳 Bienvenido a Reutility
        </h1>
        <p className="text-xl mb-6">
          Descubre, califica y colabora en el mantenimiento de las plazas de tu ciudad
        </p>
        <a 
          href="/plazas" 
          className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition"
        >
          Explorar plazas cercanas
        </a>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-800">Califica plazas</h3>
          <p className="text-gray-600">Comparte tu experiencia y ayuda a otros ciudadanos a encontrar los mejores espacios</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-800">Reporta alertas</h3>
          <p className="text-gray-600">Notifica sobre mantenimiento, incidentes o mejoras necesarias en tu plaza</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-800">Ranking ciudadano</h3>
          <p className="text-gray-600">Descubre las mejores plazas según la opinión de tu comunidad</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-emerald-50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-700">150+</div>
            <div className="text-sm text-gray-600">Plazas registradas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">2,500+</div>
            <div className="text-sm text-gray-600">Opiniones ciudadanas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">45+</div>
            <div className="text-sm text-gray-600">Alertas resueltas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-700">8</div>
            <div className="text-sm text-gray-600">Municipios aliados</div>
          </div>
        </div>
      </div>
    </div>
  )
}