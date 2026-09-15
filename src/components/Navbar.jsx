import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, Menu, UserPlus, UserRound, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.portfolio'), href: '#portfolio' },
    { name: t('nav.faq'), href: '#faq' },
    { name: t('nav.contacts'), href: '#contact' },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'kz' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const handleScrollClick = (event, href) => {
    event.preventDefault();
    setMenuOpen(false);

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navTextClass = scrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white';
  const outlineButtonClass = scrolled
    ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600'
    : 'border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-900';

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${
      scrolled ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className={`text-2xl font-bold tracking-tighter italic transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}
          >
            Remote<span className="text-blue-600"> P</span>
          </Link>

          <div className="hidden lg:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleScrollClick(event, link.href)}
                className={`text-sm font-medium transition-colors ${navTextClass}`}
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={toggleLanguage}
              className={`text-xs font-bold px-2 py-1 border rounded transition-all ${outlineButtonClass}`}
            >
              {i18n.language === 'ru' ? 'KZ' : 'RU'}
            </button>

            <button
              onClick={(event) => handleScrollClick(event, '#contact')}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                scrolled
                  ? 'bg-slate-900 text-white hover:bg-blue-600'
                  : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {t('nav.startProject')}
            </button>

            <div className="h-8 w-px bg-slate-200/60" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${outlineButtonClass}`}
                >
                  <UserRound size={17} />
                  {t('nav.profile')}
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${outlineButtonClass}`}
                  >
                    <LayoutDashboard size={17} />
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${outlineButtonClass}`}
                >
                  <LogOut size={17} />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${outlineButtonClass}`}
                >
                  <LogIn size={17} />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  <UserPlus size={17} />
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((current) => !current)}
            className={`lg:hidden p-2 rounded-xl transition-all ${
              scrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
            }`}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10">
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleScrollClick(event, link.href)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {link.name}
                </a>
              ))}

              <button
                onClick={toggleLanguage}
                className="px-4 py-3 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('nav.switchTo')}
              </button>

              <button
                onClick={(event) => handleScrollClick(event, '#contact')}
                className="px-4 py-3 rounded-xl text-left text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                {t('nav.startProject')}
              </button>

              <div className="my-2 h-px bg-slate-100" />

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UserRound size={17} />
                    {t('nav.profile')}
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={17} />
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LogIn size={17} />
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus size={17} />
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
