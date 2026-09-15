import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const images = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
];

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const fallbackProjects = useMemo(() => (
    t('portfolio.items', { returnObjects: true }).map((project, index) => ({
      id: project.title,
      title: project.title,
      category: project.category,
      description: project.desc,
      imageUrl: images[index],
    }))
  ), [t]);
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    let active = true;

    api.get(`/content/portfolio?lang=${i18n.language}`)
      .then((response) => {
        if (active && Array.isArray(response.data) && response.data.length > 0) {
          setProjects(response.data);
        }
      })
      .catch(() => {
        if (active) {
          setProjects(fallbackProjects);
        }
      });

    return () => {
      active = false;
    };
  }, [fallbackProjects, i18n.language]);

  return (
    <section id="portfolio" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight italic">
            {t('portfolio.title')}
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-8 mx-auto"></div>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed mx-auto">
            {t('portfolio.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={project.imageUrl || images[index]}
                  alt={project.title}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-white text-2xl font-bold mt-2">{project.title}</h3>
                  {project.technologies && (
                    <p className="mt-2 text-xs font-semibold text-slate-200">{project.technologies}</p>
                  )}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed px-4 text-center">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
