import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  ExternalLink,
  Filter,
  Flag,
  History,
  Home,
  Inbox,
  LogOut,
  Mail,
  MessageSquare,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api, { API_BASE_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-100',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
  CLOSED: 'bg-green-50 text-green-700 border-green-100',
};

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  MEDIUM: 'bg-violet-50 text-violet-700 border-violet-100',
  HIGH: 'bg-red-50 text-red-700 border-red-100',
};

const getLeadId = (lead) => lead.id || lead._id;
const swaggerUrl = API_BASE_URL.replace(/\/api\/?$/, '') + '/swagger-ui.html';

const getLatestComment = (lead) => {
  if (!lead.comments || lead.comments.length === 0) return null;

  return lead.comments[lead.comments.length - 1];
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

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [healthStatus, setHealthStatus] = useState('checking');

  const adminData = user || JSON.parse(localStorage.getItem('user')) || { name: t('admin.defaultName') };
  const dateLocale = i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU';
  const statusOptions = useMemo(() => [
    { value: 'NEW', label: t('status.new'), className: statusStyles.NEW },
    { value: 'IN_PROGRESS', label: t('status.inProgress'), className: statusStyles.IN_PROGRESS },
    { value: 'CLOSED', label: t('status.closed'), className: statusStyles.CLOSED },
  ], [t]);
  const statusLabels = useMemo(() => statusOptions.reduce((result, status) => {
    result[status.value] = status;
    return result;
  }, {}), [statusOptions]);
  const priorityOptions = useMemo(() => [
    { value: 'LOW', label: t('priority.low'), className: priorityStyles.LOW },
    { value: 'MEDIUM', label: t('priority.medium'), className: priorityStyles.MEDIUM },
    { value: 'HIGH', label: t('priority.high'), className: priorityStyles.HIGH },
  ], [t]);
  const priorityLabels = useMemo(() => priorityOptions.reduce((result, priority) => {
    result[priority.value] = priority;
    return result;
  }, {}), [priorityOptions]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/contacts');
        setLeads(response.data);
      } catch {
        setError(t('admin.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [t]);

  useEffect(() => {
    api.get('/health')
      .then(() => setHealthStatus('active'))
      .catch(() => setHealthStatus('unavailable'));
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((lead) => lead.status === 'NEW').length,
      inProgress: leads.filter((lead) => lead.status === 'IN_PROGRESS').length,
      closed: leads.filter((lead) => lead.status === 'CLOSED').length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const latestComment = getLatestComment(lead);
      const matchesSearch = !query || [lead.name, lead.email, lead.message, lead.userName, lead.userEmail, latestComment?.comment]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDelete = async (lead) => {
    const id = getLeadId(lead);
    if (!window.confirm(t('admin.deleteConfirm'))) return;

    try {
      await api.delete(`/contacts/${id}`);
      setLeads((currentLeads) => currentLeads.filter((item) => getLeadId(item) !== id));
    } catch {
      alert(t('admin.deleteError'));
    }
  };

  const handleStatusChange = async (lead, status) => {
    const id = getLeadId(lead);
    setUpdatingId(id);

    try {
      const response = await api.patch(`/contacts/${id}/status`, { status });
      setLeads((currentLeads) => currentLeads.map((item) => (
        getLeadId(item) === id ? response.data : item
      )));
    } catch {
      alert(t('admin.statusError'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePriorityChange = async (lead, priority) => {
    const id = getLeadId(lead);
    setUpdatingId(id);

    try {
      const response = await api.patch(`/contacts/${id}`, { priority });
      setLeads((currentLeads) => currentLeads.map((item) => (
        getLeadId(item) === id ? response.data : item
      )));
    } catch {
      alert(t('admin.priorityError'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCommentSave = async (lead) => {
    const id = getLeadId(lead);
    const comment = (commentDrafts[id] || '').trim();
    if (!comment) return;

    setSavingId(id);

    try {
      const response = await api.patch(`/contacts/${id}`, { comment });
      setLeads((currentLeads) => currentLeads.map((item) => (
        getLeadId(item) === id ? response.data : item
      )));
      setCommentDrafts((current) => ({ ...current, [id]: '' }));
    } catch {
      alert(t('admin.commentError'));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-slate-950 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold tracking-tighter italic mb-8">
            Remote<span className="text-blue-500">P</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-md not-italic ml-2">CMS</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl mb-8 border border-slate-800">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate max-w-[160px]">{adminData.name}</p>
              <p className="text-xs text-slate-400 truncate max-w-[160px]">{adminData.email}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">ADMIN</p>
            </div>
          </div>

          <div className="mb-6 grid gap-2 text-sm">
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-xl bg-slate-900/70 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <UserCheck size={16} />
              {t('admin.cabinet')}
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl bg-slate-900/70 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Home size={16} />
              {t('admin.home')}
            </Link>
            <a
              href={swaggerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-slate-900/70 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <ExternalLink size={16} />
              {t('admin.swagger')}
            </a>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <span className="text-slate-400">{t('status.new')}</span>
              <span className="font-bold text-blue-300">{stats.new}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <span className="text-slate-400">{t('status.inProgress')}</span>
              <span className="font-bold text-amber-300">{stats.inProgress}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <span className="text-slate-400">{t('status.closed')}</span>
              <span className="font-bold text-green-300">{stats.closed}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-8 flex items-center justify-center gap-2 p-3 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all font-semibold text-sm"
        >
          <LogOut size={16} />
          {t('admin.logoutAccount')}
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('admin.title')}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {t('admin.subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              />
            </div>

            <div className="relative sm:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
              >
                <option value="ALL">{t('status.all')}</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{t('admin.totalRequests')}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <MessageSquare size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{t('status.new')}</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{stats.new}</p>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Inbox size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{t('status.inProgress')}</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inProgress}</p>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <Clock3 size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{t('admin.server')}</p>
              <p className={`text-lg font-bold mt-3 flex items-center gap-1.5 ${
                healthStatus === 'active' ? 'text-green-600' : healthStatus === 'checking' ? 'text-amber-600' : 'text-red-600'
              }`}>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  healthStatus === 'active' ? 'bg-green-500 animate-pulse' : healthStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                }`}></span>
                {healthStatus === 'active'
                  ? t('admin.active')
                  : healthStatus === 'checking'
                    ? t('admin.checking')
                    : t('admin.unavailable')}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${
              healthStatus === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {healthStatus === 'active' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
              {t('admin.loading')}
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500 flex flex-col items-center gap-2">
              <AlertCircle size={32} />
              <p className="font-bold">{error}</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              {t('admin.empty')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6 min-w-[180px]">{t('admin.client')}</th>
                    <th className="py-4 px-6 min-w-[280px]">{t('admin.message')}</th>
                    <th className="py-4 px-6 min-w-[190px]">{t('admin.account')}</th>
                    <th className="py-4 px-6 min-w-[210px]">{t('admin.status')}</th>
                    <th className="py-4 px-6 min-w-[160px]">{t('admin.date')}</th>
                    <th className="py-4 px-6 min-w-[240px] text-right">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredLeads.map((lead) => {
                    const id = getLeadId(lead);
                    const status = statusLabels[lead.status] || statusLabels.NEW;
                    const priority = priorityLabels[lead.priority] || priorityLabels.MEDIUM;
                    const latestComment = getLatestComment(lead);
                    const latestTelegram = lead.telegramNotifications?.[0];

                    return (
                      <tr key={id} className="hover:bg-slate-50/60 transition-colors align-top">
                        <td className="py-5 px-6">
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <User size={16} className="text-slate-400 shrink-0" />
                            <span>{lead.name}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-slate-500">
                            <Mail size={15} className="text-slate-400 shrink-0" />
                            <span className="break-all">{lead.email}</span>
                          </div>
                        </td>

                        <td className="py-5 px-6 max-w-xl">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                          {latestComment && (
                            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
                              <p className="text-xs font-bold uppercase text-blue-700">{t('admin.latestComment')}</p>
                              <p className="mt-1 text-sm leading-5 text-blue-900 whitespace-pre-wrap">{latestComment.comment}</p>
                              <p className="mt-2 text-xs text-blue-600">
                                {latestComment.adminName} - {formatDate(latestComment.createdAt, dateLocale, t('status.noDate'))}
                              </p>
                            </div>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                              <History size={13} />
                              {t('admin.historyCount')}: {lead.statusHistory?.length || 0}
                            </span>
                            {latestTelegram && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                {t('admin.telegramStatus')}: {latestTelegram.status}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-5 px-6">
                          {lead.userId ? (
                            <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2">
                              <div className="flex items-center gap-2 font-bold text-green-800">
                                <UserCheck size={16} />
                                <span>{lead.userName}</span>
                              </div>
                              <p className="mt-1 break-all text-xs text-green-700">{lead.userEmail}</p>
                            </div>
                          ) : (
                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                              <div className="flex items-center gap-2 font-bold text-slate-600">
                                <User size={16} />
                                <span>{t('admin.guest')}</span>
                              </div>
                              <p className="mt-1 text-xs text-slate-400">{t('admin.guestRequest')}</p>
                            </div>
                          )}
                        </td>

                        <td className="py-5 px-6">
                          <div className={`inline-flex mb-3 px-3 py-1 rounded-full border text-xs font-bold ${status.className}`}>
                            {status.label}
                          </div>
                          <select
                            value={lead.status || 'NEW'}
                            disabled={updatingId === id}
                            onChange={(event) => handleStatusChange(lead, event.target.value)}
                            className="block w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-60"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          <div className={`mt-3 inline-flex mb-3 px-3 py-1 rounded-full border text-xs font-bold ${priority.className}`}>
                            <Flag size={13} className="mr-1" />
                            {priority.label}
                          </div>
                          <select
                            value={lead.priority || 'MEDIUM'}
                            disabled={updatingId === id}
                            onChange={(event) => handlePriorityChange(lead, event.target.value)}
                            className="block w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-60"
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>

                        <td className="py-5 px-6 text-slate-500">
                          {formatDate(lead.createdAt, dateLocale, t('status.noDate'))}
                        </td>

                        <td className="py-5 px-6">
                          <div className="flex flex-col gap-3">
                            <textarea
                              value={commentDrafts[id] || ''}
                              onChange={(event) => setCommentDrafts((current) => ({
                                ...current,
                                [id]: event.target.value,
                              }))}
                              rows={3}
                              placeholder={t('admin.commentPlaceholder')}
                              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleCommentSave(lead)}
                                disabled={savingId === id || !(commentDrafts[id] || '').trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                title={t('admin.saveComment')}
                              >
                                <Save size={15} />
                                {t('admin.saveComment')}
                              </button>
                              <button
                                onClick={() => handleDelete(lead)}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                title={t('admin.deleteTitle')}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
