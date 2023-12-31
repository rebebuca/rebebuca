import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ENtranslation from './locales/en/translation.json'
import zhCNtranslation from './locales/zh-CN/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: ENtranslation
    },
    ch: {
      translation: zhCNtranslation
    }
  },
  lng: 'ch'
})
