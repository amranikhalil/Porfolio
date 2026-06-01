import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import styles from './Contact.module.css'

const CONTACT_LINKS = [
  {
    href: 'mailto:khalilamrani715@gmail.com',
    label: 'Email Khalil',
    Icon: FaEnvelope,
  },
  {
    href: 'https://github.com/amranikhalil',
    label: 'GitHub profile',
    Icon: FaGithub,
  },
  {
    href: 'https://www.linkedin.com/in/khalil-amrani-b19010228/',
    label: 'LinkedIn profile',
    Icon: FaLinkedin,
  },
]

const isExternal = (href) => href.startsWith('http')

export const Contact = () => {
  return (
    <section className={styles.container} id="contact">
      <div className={styles.content}>
        <h2>Get in touch</h2>
        <p>Feel free to reach out — I&apos;m open to opportunities.</p>
      </div>

      <ul className={styles.contact}>
        {CONTACT_LINKS.map(({ href, label, Icon }) => (
          <li key={href}>
            <a
              href={href}
              aria-label={label}
              {...(isExternal(href) && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
