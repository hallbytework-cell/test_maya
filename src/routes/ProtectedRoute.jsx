import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-blue-600">Checking authentication...</p>
      </div>
    );
  }

  if (user) {
    return <Outlet />; 
  } 
  return <Navigate to="/login" replace />; 
};

export default ProtectedRoute;
