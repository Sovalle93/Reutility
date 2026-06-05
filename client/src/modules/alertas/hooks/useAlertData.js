import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { getAlertas, getAlertaById, createAlerta, updateAlertaStatus } from '../../../services/api';

export const useAlertData = (alertaId = null, usuario = null) => {
    const [alertas, setAlertas] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const isMounted = useRef(true);

    const loadAlertas = useCallback(async (showLoading = false) => {
        if (!isMounted.current) return;

        if (showLoading) {
            setLoading(true);
            setError('');
        } else {
            setRefreshing(true);
        }

        try {
            const data = await getAlertas();
            if (!isMounted.current) return;
            setAlertas(data);
        } catch {
            if (isMounted.current) {
                setError('Error al cargar alertas');
                toast.error('Error al cargar alertas');
            }
        } finally {
            if (isMounted.current) {
                if (showLoading) {
                    setLoading(false);
                } else {
                    setRefreshing(false);
                }
            }
        }
    }, []);

    const loadAlertaDetail = useCallback(async (showLoading = false) => {
        if (!alertaId) return;
        if (!isMounted.current) return;

        if (showLoading) {
            setLoading(true);
            setError('');
        } else {
            setRefreshing(true);
        }

        try {
            const data = await getAlertaById(alertaId);
            if (!isMounted.current) return;
            setAlerta(data);
        } catch {
            if (isMounted.current) {
                setError('Error al cargar la alerta');
                toast.error('Error al cargar la alerta');
            }
        } finally {
            if (isMounted.current) {
                if (showLoading) {
                    setLoading(false);
                } else {
                    setRefreshing(false);
                }
            }
        }
    }, [alertaId]);

    useEffect(() => {
        isMounted.current = true;

        if (alertaId) {
            loadAlertaDetail(true);
        } else {
            loadAlertas(true);
        }

        return () => {
            isMounted.current = false;
        };
    }, [alertaId, loadAlertas, loadAlertaDetail]);

    const submitAlerta = async (formData) => {
        const toastId = toast.loading('📸 Enviando alerta...');

        try {
            await createAlerta(formData);
            toast.success('¡Alerta enviada! El equipo municipal la revisará pronto', { id: toastId });
            await loadAlertas(false);
            return { success: true };
        } catch (error) {
            toast.error(error.message || 'Error al enviar alerta', { id: toastId });
            return { success: false, error: error.message };
        }
    };

    const updateStatus = async (status, notas = '') => {
        if (!alerta) return { success: false };
        const toastId = toast.loading('Actualizando estado...');

        try {
            const updated = await updateAlertaStatus(alerta.id, { status, notas });
            if (!isMounted.current) return { success: true };
            setAlerta(updated);
            toast.success('Estado actualizado', { id: toastId });
            await loadAlertas(false);
            return { success: true };
        } catch (error) {
            toast.error(error.message || 'Error al actualizar', { id: toastId });
            return { success: false, error: error.message };
        }
    };

    return {
        alertas,
        alerta,
        loading,
        refreshing,
        error,
        submitAlerta,
        updateStatus,
        refetch: alertaId ? loadAlertaDetail : loadAlertas
    };
};
