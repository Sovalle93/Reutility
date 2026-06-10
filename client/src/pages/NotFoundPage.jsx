import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="text-9xl font-bold text-emerald-200 mb-4">404</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
            <p className="text-gray-500 mb-8">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link 
                to="/" 
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
                Volver al inicio
            </Link>
        </div>
    );
};