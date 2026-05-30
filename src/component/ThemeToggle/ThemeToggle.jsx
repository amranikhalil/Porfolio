import { HiSun, HiMoon } from 'react-icons/hi'
import { useTheme } from '../../hooks/useTheme'
import styles from './ThemeToggle.module.css'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <HiSun /> : <HiMoon />}
    </button>
  )
}
