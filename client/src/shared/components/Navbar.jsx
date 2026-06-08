import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
    const { usuario } = useAuth();

    return (
        <nav className="bg-emerald-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl">🌳</span>
                            <span className="text-xl font-bold text-white">Reutility</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/plazas" className="text-white hover:text-emerald-200">Plazas</Link>
                        <Link to="/alertas" className="text-white hover:text-emerald-200">Alertas</Link>
                        <Link to="/ranking" className="text-white hover:text-emerald-200">Ranking</Link>

                        {usuario ? (
                            <div className="flex items-center gap-4">
                                <Link to="/perfil" className="text-white hover:text-emerald-200">
                                    👤 {usuario.nombre}
                                </Link>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50">
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