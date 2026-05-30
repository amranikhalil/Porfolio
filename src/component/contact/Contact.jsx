import { getImageUrl } from '../../util'
import styles from './Contact.module.css'

const CONTACT_LINKS = [
  {
    href: 'mailto:khalilamrani715@gmail.com',
    label: 'Email Khalil',
    icon: 'contact/emailIcon.png',
  },
  {
    href: 'https://github.com/amranikhalil',
    label: 'GitHub profile',
    icon: 'contact/githubIcon.png',
  },
  {
    href: 'https://www.linkedin.com/in/khalil-amrani-b19010228/',
    label: 'LinkedIn profile',
    icon: 'contact/linkedinIcon.png',
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
        {CONTACT_LINKS.map(({ href, label, icon }) => (
          <li key={href}>
            <a
              href={href}
              aria-label={label}
              {...(isExternal(href) && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              style={{ backgroundImage: `url(${getImageUrl(icon)})` }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
