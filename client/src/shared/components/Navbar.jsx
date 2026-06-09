import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
    const { usuario } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Determinar qué puede ver según rol
    const isFiscalizador = usuario?.rol === 'fiscalizador';
    const isMunicipalWorker = usuario?.rol === 'municipal_worker';
    const isAdmin = usuario?.rol === 'admin';
    const isCitizen = usuario?.rol === 'ciudadano' || !usuario?.rol;

    const puedeVerPlazas = !isFiscalizador; // Fiscalizador NO ve plazas
    const puedeVerAlertas = !isFiscalizador;
    const puedeVerRanking = !isFiscalizador; // Fiscalizador NO ve ranking
    const puedeVerPerfil = !isFiscalizador; // Fiscalizador NO ve perfil (tiene panel propio)
    const puedeVerPanelFiscalizador = isFiscalizador || isMunicipalWorker || isAdmin;
    const puedeVerAdminPanel = isAdmin;

    return (
        <nav className="bg-emerald-700 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={isFiscalizador ? "/fiscalizador" : "/"} className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                            <span className="text-2xl">🌳</span>
                            <span className="text-xl font-bold text-white">Reutility</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {puedeVerPlazas && (
                            <Link to="/plazas" className="text-white hover:text-emerald-200 transition">
                                Plazas
                            </Link>
                        )}
                        {puedeVerAlertas && (
                            <Link to="/alertas" className="text-white hover:text-emerald-200 transition">
                                Alertas
                            </Link>
                        )}
                        {puedeVerRanking && (
                            <Link to="/ranking" className="text-white hover:text-emerald-200 transition">
                                Ranking
                            </Link>
                        )}
                        {puedeVerPanelFiscalizador && (
                            <Link to="/fiscalizador" className="text-white hover:text-emerald-200 transition">
                                👮 Panel Fiscalizador
                            </Link>
                        )}
                        {puedeVerAdminPanel && (
                            <Link to="/admin" className="text-white hover:text-emerald-200 transition">
                                👑 Admin
                            </Link>
                        )}

                        {usuario ? (
                            <div className="flex items-center gap-4">
                                {puedeVerPerfil && (
                                    <Link to="/perfil" className="text-white hover:text-emerald-200 transition">
                                        👤 {usuario.nombre}
                                    </Link>
                                )}
                                {!puedeVerPerfil && isFiscalizador && (
                                    <span className="text-white/80 text-sm">
                                        👮 {usuario.nombre}
                                    </span>
                                )}
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
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-3">
                        {puedeVerPlazas && (
                            <Link to="/plazas" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                🏛️ Plazas
                            </Link>
                        )}
                        {puedeVerAlertas && (
                            <Link to="/alertas" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                ⚠️ Alertas
                            </Link>
                        )}
                        {puedeVerRanking && (
                            <Link to="/ranking" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                🏆 Ranking
                            </Link>
                        )}
                        {puedeVerPanelFiscalizador && (
                            <Link to="/fiscalizador" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                👮 Panel Fiscalizador
                            </Link>
                        )}
                        {puedeVerAdminPanel && (
                            <Link to="/admin" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                👑 Admin
                            </Link>
                        )}

                        {usuario ? (
                            <>
                                {puedeVerPerfil && (
                                    <Link to="/perfil" className="text-white hover:text-emerald-200 transition py-2" onClick={toggleMenu}>
                                        👤 Mi Perfil
                                    </Link>
                                )}
                                {!puedeVerPerfil && isFiscalizador && (
                                    <span className="text-white/80 py-2 text-sm">
                                        👮 {usuario.nombre}
                                    </span>
                                )}
                            </>
                        ) : (
                            <Link to="/login" onClick={toggleMenu}>
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