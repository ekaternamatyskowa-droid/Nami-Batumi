'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Locale, Translation } from '@/types'
import { translations } from '@/lib/translations'

interface LocaleContextType {
  locale: Locale
  t: Translation
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'ru',
  t: translations.ru,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru')

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
  }, [])

  const t = translations[locale]

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
