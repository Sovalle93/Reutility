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
import { FiscalizadorPanel } from './modules/alertas/pages/FiscalizadorPanel';
import { RegisterPage } from './modules/auth/pages/RegisterPage';
import { AdminPanel } from './modules/admin/pages/AdminPanel';
import { NotFoundPage } from './pages/NotFoundPage';

const RutaProtegida = ({ children, allowedRoles = [] }) => {
    const { usuario, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="text-center py-12">Verificando sesión...</div>;
    if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />;
    
    // Si hay roles permitidos y el usuario no tiene uno autorizado
    if (allowedRoles.length > 0 && !allowedRoles.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }
    
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
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Perfil - solo ciudadanos y admin */}
                <Route path="/perfil" element={
                    <RutaProtegida allowedRoles={['ciudadano', 'admin']}>
                        <PerfilPage />
                    </RutaProtegida>
                } />

                {/* Panel Fiscalizador - solo fiscalizador, municipal_worker y admin */}
                <Route path="/fiscalizador" element={
                    <RutaProtegida allowedRoles={['fiscalizador', 'municipal_worker', 'admin']}>
                        <FiscalizadorPanel />
                    </RutaProtegida>
                } />
                
                {/* Panel Admin - solo admin */}
                <Route path="/admin" element={
                    <RutaProtegida allowedRoles={['admin']}>
                        <AdminPanel />
                    </RutaProtegida>
                } />

                {/* Redirección por defecto */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
}

export default App;