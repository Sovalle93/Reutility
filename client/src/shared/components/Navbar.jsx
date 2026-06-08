import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
    const { usuario } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-emerald-700 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                            <span className="text-2xl">🌳</span>
                            <span className="text-xl font-bold text-white">Reutility</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/plazas" className="text-white hover:text-emerald-200 transition">
                            Plazas
                        </Link>
                        <Link to="/alertas" className="text-white hover:text-emerald-200 transition">
                            Alertas
                        </Link>
                        <Link to="/ranking" className="text-white hover:text-emerald-200 transition">
                            Ranking
                        </Link>

                        {usuario ? (
                            <div className="flex items-center gap-4">
                                <Link to="/perfil" className="text-white hover:text-emerald-200 transition">
                                    👤 {usuario.nombre}
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition">
                                    Iniciar Sesión
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button (Hamburguesa) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-emerald-200 focus:outline-none transition-colors"
                            aria-label="Menú"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="flex flex-col space-y-3">
                        <Link
                            to="/plazas"
                            className="text-white hover:text-emerald-200 transition py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🏛️ Plazas
                        </Link>
                        <Link
                            to="/alertas"
                            className="text-white hover:text-emerald-200 transition py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            ⚠️ Alertas
                        </Link>
                        <Link
                            to="/ranking"
                            className="text-white hover:text-emerald-200 transition py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🏆 Ranking
                        </Link>

                        {usuario ? (
                            <>
                                <Link
                                    to="/perfil"
                                    className="text-white hover:text-emerald-200 transition py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    👤 Mi Perfil
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <button className="w-full bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition">
                                    Iniciar Sesión
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};