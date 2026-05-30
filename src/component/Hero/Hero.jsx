import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { getImageUrl } from '../../util'
import styles from './Hero.module.css'

export const Hero = () => {
  const elDescription = useRef(null)

  useEffect(() => {
    const typed = new Typed(elDescription.current, {
      strings: [
        'I build web applications.',
        'I work with machine learning.',
        'I ship products end-to-end.',
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 1800,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    })

    return () => typed.destroy()
  }, [])

  return (
    <section className={styles.container} id="hero">
      <div className={styles.content}>
        <p className={styles.greeting}>Hi, I&apos;m</p>
        <h1 className={styles.title}>Khalil Amrani.</h1>
        <h2 className={styles.subtitle}>
          Software engineer — <span ref={elDescription}></span>
        </h2>
        <p className={styles.lede}>
          Master&apos;s graduate in computer science, building responsive web
          apps and integrating machine learning models to elevate user
          experience.
        </p>

        <div className={styles.actions}>
          <a href="#contact" className={styles.primary}>
            Get in touch
          </a>
          <a href="#project" className={styles.secondary}>
            View projects →
          </a>
        </div>
      </div>

      <img
        className={styles.heroImg}
        src={getImageUrl('hero/02.jpg')}
        alt="Khalil Amrani"
        width="320"
        height="400"
        loading="eager"
      />
    </section>
  )
}
