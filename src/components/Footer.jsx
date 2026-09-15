import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tighter italic">Remote P</h2>
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Abeke-abo" className="p-2 bg-slate-900 rounded-lg hover:text-blue-500 transition-colors" target="_blank" rel="noreferrer"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/abzal-kundyzbaev-530b05320/" className="p-2 bg-slate-900 rounded-lg hover:text-blue-500 transition-colors" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">{t('footer.servicesTitle')}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors">{t('footer.web')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('footer.mobile')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('footer.design')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('footer.devops')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">{t('footer.companyTitle')}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#portfolio" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">{t('footer.contacts')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">{t('footer.contactTitle')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><Mail size={16} /> aba.kundyzbaev@gmail.com</li>
              <li className="flex items-center gap-3"><Phone size={16} /> +7 (701) 052-47-17</li>
              <li className="flex items-center gap-3"><MapPin size={16} /> {t('footer.address')}</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          © {new Date().getFullYear()} RemoteP Agency. {t('footer.rights')}
          <div className="flex gap-8">
            <a href="#" className="hover:text-white underline decoration-slate-800 underline-offset-4">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white underline decoration-slate-800 underline-offset-4">{t('footer.offer')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
