import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAlertData } from '../hooks/useAlertData';
import { AlertDetail } from '../components/AlertDetail';
import { useState } from 'react';

export const AlertDetailPage = () => {
    const { id } = useParams();
    const { usuario } = useAuth();
    const { alerta, loading, error, updateStatus } = useAlertData(id);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (status, notas) => {
        setIsUpdating(true);
        const result = await updateStatus(status, notas);
        setIsUpdating(false);
        return result;
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">📋</div>
                    <p className="text-gray-600">Cargando alerta...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-12 text-red-600">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!alerta) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-600">Alerta no encontrada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => window.history.back()}
                className="mb-6 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2"
            >
                ← Volver
            </button>
            <AlertDetail
                alerta={alerta}
                usuario={usuario}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
            />
        </div>
    );
};
