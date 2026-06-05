export const PlazaInfo = ({ plaza }) => {
    return (
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
    );
};