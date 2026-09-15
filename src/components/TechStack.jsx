import React from 'react';
import { useTranslation } from 'react-i18next';

const technologies = [
  { name: 'React', level: 'Frontend' },
  { name: 'Node.js', level: 'Backend' },
  { name: 'MongoDB', level: 'Database' },
  { name: 'Express', level: 'Framework' },
  { name: 'TypeScript', level: 'Language' },
  { name: 'AWS', level: 'Cloud' },
  { name: 'Docker', level: 'DevOps' },
  { name: 'Tailwind', level: 'Design' },
];

const TechStack = () => {
  const { t } = useTranslation();

  return (
    <section id="stack" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">{t('techStack.title')}</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, i) => (
            <div 
              key={i} 
              className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center min-w-[120px]"
            >
              <span className="font-bold text-slate-800">{tech.name}</span>
              <span className="text-xs text-blue-500 uppercase mt-1 tracking-widest">{tech.level}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
