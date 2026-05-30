import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#project', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
]

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={styles.nav}>
      <a className={styles.title} href="/" onClick={closeMenu}>
        Khalil
      </a>

      <button
        type="button"
        className={styles.menubtn}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
      >
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      <ul
        id="primary-nav"
        onClick={closeMenu}
        className={`${styles.menuItems} ${menuOpen ? styles.menuOpen : ''}`}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
