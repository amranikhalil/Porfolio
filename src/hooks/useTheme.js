import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'theme'
const THEMES = { LIGHT: 'light', DARK: 'dark' }

const getInitialTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
    return stored
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? THEMES.DARK : THEMES.LIGHT
}

export const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))
  }, [])

  return { theme, toggleTheme }
}
