import { Link } from 'react-router-dom'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-emerald-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌳</span>
              <span className="text-xl font-bold text-white">Reutility</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-emerald-200 transition">
              Inicio
            </Link>
            <Link to="/plazas" className="text-white hover:text-emerald-200 transition">
              Plazas
            </Link>
            <Link to="/ranking" className="text-white hover:text-emerald-200 transition">
              Ranking
            </Link>
            <Link to="/alertas" className="text-white hover:text-emerald-200 transition">
              Alertas
            </Link>
            <button className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition">
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-emerald-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-white hover:text-emerald-200 py-2 transition">
              Inicio
            </Link>
            <Link to="/plazas" className="block text-white hover:text-emerald-200 py-2 transition">
              Plazas
            </Link>
            <Link to="/ranking" className="block text-white hover:text-emerald-200 py-2 transition">
              Ranking
            </Link>
            <Link to="/alertas" className="block text-white hover:text-emerald-200 py-2 transition">
              Alertas
            </Link>
            <button className="w-full bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition">
              Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}