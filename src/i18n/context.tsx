import React, { createContext, useContext, useMemo } from 'react';
import {
  ORBMOBILE_I18N_MESSAGES,
  type OrbmobileLocale,
  type OrbmobileMessageKey,
  type OrbmobileMessageParams,
  type OrbmobileLocaleMessages,
} from './messages';

export interface OrbmobileI18nContextValue {
  locale: OrbmobileLocale;
  t: (key: OrbmobileMessageKey, params?: OrbmobileMessageParams) => string;
}

export interface OrbmobileI18nProviderProps {
  locale?: OrbmobileLocale;
  messages?: Partial<Record<OrbmobileLocale, Partial<OrbmobileLocaleMessages>>>;
  children: React.ReactNode;
}

const interpolate = (template: string, params?: OrbmobileMessageParams): string => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value === undefined || value === null ? '' : String(value);
  });
};

const defaultContext: OrbmobileI18nContextValue = {
  locale: 'en',
  t: (key, params) => interpolate(ORBMOBILE_I18N_MESSAGES.en[key] || key, params),
};

const OrbmobileI18nContext = createContext<OrbmobileI18nContextValue>(defaultContext);

export const OrbmobileI18nProvider = ({
  locale = 'en',
  messages,
  children,
}: OrbmobileI18nProviderProps) => {
  const value = useMemo<OrbmobileI18nContextValue>(() => {
    const localeMessages = ORBMOBILE_I18N_MESSAGES[locale] || ORBMOBILE_I18N_MESSAGES.en;
    const localeOverrides = messages?.[locale] || {};
    const merged = { ...ORBMOBILE_I18N_MESSAGES.en, ...localeMessages, ...localeOverrides };

    return {
      locale,
      t: (key, params) => interpolate(merged[key] || key, params),
    };
  }, [locale, messages]);

  return <OrbmobileI18nContext.Provider value={value}>{children}</OrbmobileI18nContext.Provider>;
};

export const useOrbmobileI18n = (): OrbmobileI18nContextValue => useContext(OrbmobileI18nContext);

