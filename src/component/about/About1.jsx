import { getImageUrl } from '../../util'
import styles from './about.module.css'

export const About1 = () => {
  return (
    <section className={styles.container} id="about">
      <section className={styles.leftContainer}>
        <h1 className={styles.title}>My Skills</h1>
        <img
          className={styles.aboutImage}
          src={getImageUrl('hero/02.jpg')}
          alt="Khalil Amrani"
        />
      </section>

      <section className={styles.content}>
        <ul className={styles.aboutItems}>
          <li>JavaScript</li>
          <li>React</li>
          <li>Node.js</li>
          <li>Next.js</li>
          <li>MongoDB</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Java</li>
          <li>Oracle</li>
          <li>Python</li>
        </ul>
        <p className={styles.nepo}>
          Master&apos;s graduate in computer science, driven by a deep passion
          for web development and machine learning. Skilled in creating
          responsive, intuitive web applications and seamlessly integrating
          machine learning models to elevate user experiences. Eager to apply
          my expertise and innovative mindset in a dynamic role, where I can
          contribute to cutting-edge projects and drive impactful results.
        </p>
      </section>
    </section>
  )
}
