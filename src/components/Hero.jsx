import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const scrollToSection = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-slate-900 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {t('hero.title')} <br />
          <span className="text-blue-500"></span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-10">
          {t('hero.subtitle')}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => scrollToSection('#contact')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            {t('hero.btnDiscuss')} <ArrowRight size={20} />
          </button>
          <button
            onClick={() => scrollToSection('#portfolio')}
            className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-lg font-medium transition-all"
          >
            {t('hero.btnPortfolio')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
