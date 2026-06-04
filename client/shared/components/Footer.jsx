export function Footer() {
  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Reutility */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🌳</span>
              Reutility
            </h3>
            <p className="text-emerald-200 text-sm">
              Conectando ciudadanos con sus espacios públicos para construir comunidades más verdes y participativas.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/plazas" className="text-emerald-200 hover:text-white transition">Explorar plazas</a></li>
              <li><a href="/ranking" className="text-emerald-200 hover:text-white transition">Ranking ciudadano</a></li>
              <li><a href="/alertas" className="text-emerald-200 hover:text-white transition">Reportar alerta</a></li>
              <li><a href="/about" className="text-emerald-200 hover:text-white transition">Sobre el proyecto</a></li>
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Comunidad</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/colaborar" className="text-emerald-200 hover:text-white transition">Cómo colaborar</a></li>
              <li><a href="/guia" className="text-emerald-200 hover:text-white transition">Guía de uso</a></li>
              <li><a href="/preguntas" className="text-emerald-200 hover:text-white transition">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>📧 hola@reutility.cl</li>
              <li>📱 +56 2 1234 5678</li>
              <li>📍 Santiago, Chile</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-6 text-center text-sm text-emerald-300">
          <p>&copy; {new Date().getFullYear()} Reutility. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}