import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthCallback } from './modules/auth/pages/AuthCallback';
import { Layout } from './shared/layouts/Layout';
import { HomePage } from './modules/plazas/pages/HomePage';
import { PlazasPage } from './modules/plazas/pages/PlazasPage';
import { PlazaDetailPage } from './modules/plazas/pages/PlazaDetailPage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { PerfilPage } from './modules/auth/pages/PerfilPage';
import { AlertasPage } from './modules/alertas/pages/AlertasPage';
import { AlertDetailPage } from './modules/alertas/pages/AlertDetailPage';
import { RankingPage } from './modules/plazas/pages/RankingPage';

const RutaProtegida = ({ children }) => {
    const { usuario, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="text-center py-12">Verificando sesión...</div>;
    if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
};

function App() {
    return (
        <Layout>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/plazas" element={<PlazasPage />} />
                <Route path="/plazas/:id" element={<PlazaDetailPage />} />
                <Route path="/alertas" element={<AlertasPage />} />
                <Route path="/alertas/:id" element={<AlertDetailPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Rutas protegidas */}
                <Route path="/perfil" element={
                    <RutaProtegida>
                        <PerfilPage />
                    </RutaProtegida>
                } />
                
                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
}

export default App;