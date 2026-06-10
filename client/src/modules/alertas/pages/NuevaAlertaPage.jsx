import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { createAlerta } from '../../../services/api';
import { AlertForm } from '../components/AlertForm';
import toast from 'react-hot-toast';

export const NuevaAlertaPage = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await createAlerta(formData);
            toast.success('Alerta reportada exitosamente');
            navigate('/alertas');
            return { success: true };
        } catch (error) {
            toast.error(error.message || 'Error al reportar alerta');
            return { success: false };
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-6">
                <button 
                    onClick={() => navigate('/alertas')}
                    className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                    ← Volver a alertas
                </button>
            </div>
            <AlertForm 
                usuario={usuario}
                onSubmit={handleSubmit}
                isSubmitting={false}
            />
        </div>
    );
};