import { useAuth } from '../../../hooks/useAuth';
import { useAlertData } from '../hooks/useAlertData';
import { AlertForm } from '../components/AlertForm';
import { AlertList } from '../components/AlertList';

export const AlertasPage = () => {
    const { usuario } = useAuth();
    const { alertas, loading, error, submitAlerta } = useAlertData();

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-12">
                    <div className="text-4xl mb-4 animate-bounce">📋</div>
                    <p className="text-gray-600">Cargando alertas...</p>
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

    return (
        <div className="max-w-6xl mx-auto">
            {usuario && (
                <div>
                    <AlertForm usuario={usuario} onSubmit={submitAlerta} isSubmitting={false} />
                    <hr className="my-12" />
                </div>
            )}
            <AlertList
                alertas={alertas}
                userAlertIds={usuario ? alertas
                    .filter(a => a.usuario_id === usuario.id)
                    .map(a => a.id) : []}
            />
        </div>
    );
};
