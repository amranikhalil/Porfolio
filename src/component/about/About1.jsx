import { HiAcademicCap, HiCode, HiBriefcase } from 'react-icons/hi'
import styles from './about.module.css'

const HIGHLIGHTS = [
  {
    Icon: HiAcademicCap,
    title: 'Education',
    body: "Master's in Computer Science",
  },
  {
    Icon: HiCode,
    title: 'Focus',
    body: 'Web development & machine learning',
  },
  {
    Icon: HiBriefcase,
    title: 'Looking for',
    body: 'Software engineering roles',
  },
]

export const About1 = () => {
  return (
    <section className={styles.container} id="about">
      <div className={styles.inner}>
        <h2 className={styles.title}>About me</h2>

        <p className={styles.bio}>
          Master&apos;s graduate in computer science, driven by a deep passion
          for web development and machine learning. I build responsive,
          intuitive web applications and integrate ML models to elevate user
          experience.
        </p>
        <p className={styles.bio}>
          I&apos;m looking for a dynamic role where I can contribute to
          cutting-edge projects, grow alongside experienced engineers, and ship
          products that make an impact.
        </p>

        <ul className={styles.highlights}>
          {HIGHLIGHTS.map(({ Icon, title, body }) => (
            <li key={title} className={styles.highlight}>
              <Icon className={styles.highlightIcon} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
