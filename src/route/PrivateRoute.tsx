import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = () => {
  const isAuth = useAuthStore((s) => !!s.accessToken);
  const initialized = useAuthStore((s) => s.initialized);

  // Пока auth-store инициализируется — показываем null (или спиннер)
  if (!initialized) return null;

  // Если не авторизован — редирект на Home
  if (!isAuth) return <Navigate to="/auth" replace />;

  // Если авторизован — рендерим приватные маршруты
  return <Outlet />;
};

export default PrivateRoute;
