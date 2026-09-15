import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Flag,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  NEW: { className: 'bg-blue-50 text-blue-700 border-blue-100', icon: MessageSquare },
  IN_PROGRESS: { className: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock3 },
  CLOSED: { className: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 },
};

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  MEDIUM: 'bg-violet-50 text-violet-700 border-violet-100',
  HIGH: 'bg-red-50 text-red-700 border-red-100',
};

const getLatestComment = (request) => {
  if (!request.comments || request.comments.length === 0) return null;

  return request.comments[request.comments.length - 1];
};

const formatDate = (value, locale, noDateText) => {
  if (!value) return noDateText;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: '',
  });

  const roleLabel = user?.role === 'ADMIN' ? t('auth.roleAdmin') : t('auth.roleUser');
  const isAdmin = user?.role === 'ADMIN';
  const dateLocale = i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU';
  const statusLabels = useMemo(() => ({
    NEW: { ...statusStyles.NEW, label: t('status.new') },
    IN_PROGRESS: { ...statusStyles.IN_PROGRESS, label: t('status.inProgress') },
    CLOSED: { ...statusStyles.CLOSED, label: t('status.closed') },
  }), [t]);
  const priorityLabels = useMemo(() => ({
    LOW: { className: priorityStyles.LOW, label: t('priority.low') },
    MEDIUM: { className: priorityStyles.MEDIUM, label: t('priority.medium') },
    HIGH: { className: priorityStyles.HIGH, label: t('priority.high') },
  }), [t]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      name: current.name || user?.name || '',
      email: current.email || user?.email || '',
    }));
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/contacts/my');
        setRequests(response.data);
      } catch {
        setError(t('profile.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [t]);

  const stats = useMemo(() => ({
    total: requests.length,
    new: requests.filter((request) => request.status === 'NEW').length,
    inProgress: requests.filter((request) => request.status === 'IN_PROGRESS').length,
    closed: requests.filter((request) => request.status === 'CLOSED').length,
  }), [requests]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await api.post('/contacts', formData);
      setRequests((current) => [response.data, ...current]);
      setFormData((current) => ({ ...current, message: '' }));
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <Link to="/" className="text-2xl font-bold tracking-tighter italic text-slate-900">
                Remote<span className="text-blue-600"> P</span>
              </Link>
              <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
                {isAdmin ? t('profile.adminTitle') : t('auth.profileTitle')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {isAdmin
                  ? t('profile.adminSubtitle')
                  : t('profile.userSubtitle')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  <LayoutDashboard size={18} />
                  {t('profile.adminPanel')}
                </Link>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-600"
              >
                <Home size={18} />
                {t('auth.backHome')}
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserRound size={30} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-black text-slate-900">{user?.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('auth.accountData')}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <UserRound size={16} />
                  {t('auth.name')}
                </div>
                <p className="break-words text-base font-bold text-slate-900">{user?.name}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Mail size={16} />
                  {t('auth.email')}
                </div>
                <p className="break-words text-base font-bold text-slate-900">{user?.email}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <ShieldCheck size={16} />
                  {t('auth.role')}
                </div>
                <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200">{t('profile.accessRights')}</p>
              <h3 className="mt-3 text-2xl font-black">{roleLabel}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {isAdmin ? t('auth.adminRoleHint') : t('auth.userRoleHint')}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              <LogOut size={18} />
              {t('nav.logout')}
            </button>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Plus size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{t('profile.createTitle')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('profile.createHint')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                required
                placeholder={t('profile.requestNamePlaceholder')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                required
                placeholder="Email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
              />
              <textarea
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                required
                rows={5}
                placeholder={t('profile.requestMessagePlaceholder')}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
              />

              <button
                disabled={submitStatus === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
              >
                {submitStatus === 'sending' ? t('profile.sending') : t('profile.submit')}
                <Send size={18} />
              </button>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                  <CheckCircle2 size={18} />
                  {t('profile.createSuccess')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  <AlertCircle size={18} />
                  {t('profile.createError')}
                </div>
              )}
            </div>
          </form>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">{t('profile.myRequests')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('profile.requestsHint')}</p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
                  <p className="text-base text-slate-900">{stats.total}</p>
                  {t('profile.total')}
                </div>
                <div className="rounded-xl bg-blue-50 px-3 py-2 text-blue-700">
                  <p className="text-base">{stats.new}</p>
                  {t('status.new')}
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                  <p className="text-base">{stats.inProgress}</p>
                  {t('status.inProgress')}
                </div>
                <div className="rounded-xl bg-green-50 px-3 py-2 text-green-700">
                  <p className="text-base">{stats.closed}</p>
                  {t('profile.done')}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm font-semibold text-slate-500">
                {t('profile.loading')}
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                <AlertCircle size={18} />
                {error}
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <MessageSquare className="mx-auto mb-3 text-slate-400" size={32} />
                <p className="font-bold text-slate-800">{t('profile.emptyTitle')}</p>
                <p className="mt-2 text-sm text-slate-500">{t('profile.emptySubtitle')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => {
                  const status = statusLabels[request.status] || statusLabels.NEW;
                  const priority = priorityLabels[request.priority] || priorityLabels.MEDIUM;
                  const latestComment = getLatestComment(request);
                  const statusHistory = request.statusHistory?.slice(-3).reverse() || [];
                  const StatusIcon = status.icon;

                  return (
                    <article key={request.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}>
                            <StatusIcon size={15} />
                            {status.label}
                          </span>
                          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${priority.className}`}>
                            <Flag size={15} />
                            {priority.label}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {formatDate(request.createdAt, dateLocale, t('status.noDate'))}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">{request.message}</p>
                      {latestComment && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                          <p className="text-xs font-bold uppercase text-blue-700">{t('profile.adminComment')}</p>
                          <p className="mt-1 text-sm leading-6 text-blue-900 whitespace-pre-wrap">{latestComment.comment}</p>
                        </div>
                      )}
                      {statusHistory.length > 0 && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                          <p className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                            <History size={14} />
                            {t('profile.statusHistory')}
                          </p>
                          <div className="mt-3 space-y-2">
                            {statusHistory.map((history) => {
                              const oldLabel = history.oldStatus ? statusLabels[history.oldStatus]?.label : null;
                              const newLabel = statusLabels[history.newStatus]?.label || history.newStatus;

                              return (
                                <div key={history.id} className="flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                                  <span className="font-bold text-slate-700">
                                    {oldLabel ? `${oldLabel} -> ${newLabel}` : newLabel}
                                  </span>
                                  <span className="text-slate-400">
                                    {history.changedByUserName || t('profile.systemUser')} · {formatDate(history.createdAt, dateLocale, t('status.noDate'))}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
