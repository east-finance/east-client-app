import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import moment from 'moment'
// import 'moment/locale/ru'

import ruLocales from './locales/ru.json'
import enLocales from './locales/en.json'

export const DefaultLocale = 'ru'
export const DefaultNamespace = 'common'
export const getAvailableLocales = () => {
  return [
    { lang: 'ru', icon: 'rus', alias: 'Русский' },
    { lang: 'en', icon: 'eng', alias: 'English' }
  ]
}

export const set3rdPartyLocale = (lang: string): void => {
  if (lang.includes('-')) {
    lang = lang.split('-')[0]
  }
  moment.locale(lang)
}

export const initI18n = (): void => {
  i18n.use(LanguageDetector).init(
    {
      interpolation: { escapeValue: false },
      lng: DefaultLocale,
      fallbackLng: DefaultLocale,
      defaultNS: DefaultNamespace,
      resources: {
        ru: { common: ruLocales },
        en: { common: enLocales }
      }
    },
    err => {
      if (err === null) {
        // set3rdPartyLocale(i18n.language)
      }
    }
  )
}
