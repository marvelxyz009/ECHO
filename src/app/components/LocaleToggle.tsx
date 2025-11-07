'use client';

import { useLocale } from '@/i18n/LocaleProvider';
import { supportedLocales } from '@/locales';

const LocaleToggle = () => {
  const { locale, setLocale, t, ready } = useLocale();

  if (!ready) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-echo-accent/20 bg-black/40 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-echo-accent/80">
      <span>{t('ui.localeToggle.label')}</span>
      <div className="flex items-center gap-1">
        {supportedLocales.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`rounded-full px-2 py-0.5 transition ${locale === code ? 'bg-echo-accent/30 text-echo-glow' : 'text-echo-accent/60 hover:text-echo-glow/80'}`}
          >
            {code === 'vi' ? t('ui.localeToggle.optionVi') : t('ui.localeToggle.optionEn')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocaleToggle;

