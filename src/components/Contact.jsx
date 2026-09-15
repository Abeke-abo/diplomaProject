import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    try {
      await api.post('/contacts', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              {t('form.title')}
            </h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg">
              {t('form.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('form.namePlaceholder')}
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-2 uppercase">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-2 uppercase">
                {t('form.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('form.messagePlaceholder')}
                required
                rows="4"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {status === 'sending' ? (
                t('form.sending')
              ) : (
                <>
                  {t('form.send')}
                  <Send size={20} />
                </>
              )}
            </motion.button>

            {status === 'success' && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-4 rounded-xl border border-green-100">
                <CheckCircle2 size={20} />
                {t('form.success')}
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 py-4 rounded-xl border border-red-100">
                <AlertCircle size={20} />
                {t('form.error')}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
