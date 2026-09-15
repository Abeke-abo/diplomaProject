import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Globe, Layout, Rocket, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const iconMap = {
  globe: <Globe className="text-blue-600" size={28} />,
  smartphone: <Smartphone className="text-indigo-600" size={28} />,
  layout: <Layout className="text-blue-500" size={28} />,
  cpu: <Cpu className="text-purple-600" size={28} />,
  code: <Code className="text-cyan-600" size={28} />,
  rocket: <Rocket className="text-orange-500" size={28} />,
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const fallbackServices = useMemo(() => (
    t('services.items', { returnObjects: true }).map((service, index) => ({
      id: service.title,
      title: service.title,
      description: service.desc,
      iconKey: ['globe', 'smartphone', 'layout', 'cpu', 'code', 'rocket'][index],
    }))
  ), [t]);
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    let active = true;

    api.get(`/content/services?lang=${i18n.language}`)
      .then((response) => {
        if (active && Array.isArray(response.data) && response.data.length > 0) {
          setServices(response.data);
        }
      })
      .catch(() => {
        if (active) {
          setServices(fallbackServices);
        }
      });

    return () => {
      active = false;
    };
  }, [fallbackServices, i18n.language]);

  const formatPrice = (value) => {
    if (!value) return '';

    return new Intl.NumberFormat(i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU').format(Number(value));
  };

  const formatPriceLabel = (value) => {
    const price = `${formatPrice(value)} ₸`;
    return i18n.language === 'kz'
      ? `${price} ${t('services.priceFrom')}`
      : `${t('services.priceFrom')} ${price}`;
  };

  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight italic">
            {t('services.title')}
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-8 mx-auto"></div>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id || service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="mb-8 p-4 bg-white w-fit rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                {iconMap[service.iconKey] || iconMap.globe}
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
              {(service.priceFrom || service.duration) && (
                <div className="mt-7 flex flex-wrap justify-center gap-2 text-xs font-bold">
                  {service.priceFrom && (
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                      {formatPriceLabel(service.priceFrom)}
                    </span>
                  )}
                  {service.duration && (
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">
                      {service.duration}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
