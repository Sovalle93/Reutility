import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const Spinner = () => (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const AlertForm = ({ usuario, onSubmit, isSubmitting }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('basura');
    const [imagen, setImagen] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);

    const categorias = [
        { value: 'basura', label: '🗑️ Basura/Suciedad', emoji: '🗑️' },
        { value: 'mantenimiento', label: '🔧 Mantenimiento/Daño', emoji: '🔧' },
        { value: 'vandalismo', label: '✏️ Vandalismo', emoji: '✏️' },
        { value: 'seguridad', label: '🚨 Seguridad', emoji: '🚨' },
        { value: 'iluminacion', label: '💡 Iluminación', emoji: '💡' },
        { value: 'otro', label: '📋 Otro', emoji: '📋' }
    ];

    const isTituloValid = titulo.trim().length > 0;
    const isDescripcionValid = descripcion.trim().length > 0;
    const isImageValid = imagen !== null;
    const isFormValid = isTituloValid && isDescripcionValid && isImageValid;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen debe ser menor a 5MB');
                return;
            }
            setImagen(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!isFormValid) {
            toast.error('Por favor completa todos los campos y sube una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('categoria', categoria);
        formData.append('imagen', imagen);

        const result = await onSubmit(formData);

        if (result.success) {
            setTitulo('');
            setDescripcion('');
            setCategoria('basura');
            setImagen(null);
            setPreviewUrl(null);
            setSubmitted(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!usuario) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Reportar una alerta</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">
                        Para reportar una alerta debes <a href="/login" className="font-semibold underline">iniciar sesión</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-1">Reportar una alerta</h2>
            <p className="text-gray-600 mb-6">Ayuda a mejorar nuestras plazas reportando problemas</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Categoría */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        Tipo de alerta
                        {submitted && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categorias.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategoria(cat.value)}
                                disabled={isSubmitting}
                                className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                                    categoria === cat.value
                                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-emerald-300'
                                } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Título */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        Título
                        {submitted && !isTituloValid && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        disabled={isSubmitting}
                        maxLength="100"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                            submitted && !isTituloValid
                                ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                        placeholder="Ej: Basura en la entrada"
                    />
                    <p className="text-xs text-gray-500 mt-1">{titulo.length}/100</p>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        Descripción
                        {submitted && !isDescripcionValid && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        disabled={isSubmitting}
                        maxLength="500"
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                            submitted && !isDescripcionValid
                                ? 'border-red-500 focus:ring-2 focus:ring-red-300'
                                : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                        rows="4"
                        placeholder="Describe el problema con detalles..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{descripcion.length}/500</p>
                </div>

                {/* Imagen Upload */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                        📸 Foto del problema
                        {submitted && !isImageValid && (
                            <span className="text-red-500 text-sm animate-pulse">(requerido)</span>
                        )}
                    </label>

                    {previewUrl ? (
                        <div className="relative mb-3">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg border-2 border-emerald-300"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagen(null);
                                    setPreviewUrl(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                disabled={isSubmitting}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                            submitted && !isImageValid
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-gray-700 font-semibold">Sube una foto</p>
                            <p className="text-xs text-gray-500 mt-1">Máximo 5MB (JPG, PNG)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isSubmitting}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`w-full px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        isFormValid && !isSubmitting
                            ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            <span>Enviando alerta...</span>
                        </>
                    ) : (
                        <>
                            📤 Enviar alerta
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
