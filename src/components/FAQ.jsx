import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group gap-4"
      >
        <span className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{q}</span>
        {isOpen ? <Minus className="text-blue-600 shrink-0" /> : <Plus className="text-slate-400 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-slate-600 leading-relaxed text-lg">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true });

  return (
    <section id="faq" className="py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 italic">{t('faq.title')}</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
          {faqs.map((item) => <FAQItem key={item.q} {...item} />)}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
