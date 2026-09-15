import { Link, Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('auth.forbiddenTitle')}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{t('auth.forbiddenMessage')}</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-colors"
            >
              {t('nav.profile')}
            </Link>
            <Link
              to="/"
              className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600 transition-colors"
            >
              {t('auth.backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
