import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import { HiExternalLink } from 'react-icons/hi'
import projects from '../../data/project.json'
import { Navbar } from '../Navbar/Navbar'
import { Contact } from '../contact/Contact'
import { getImageUrl } from '../../util'
import styles from './detail.module.css'

export const Detail = () => {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  const [imageIndex, setImageIndex] = useState(0)

  if (!project || !project.detail) {
    return (
      <>
        <Navbar />
        <main id="main">
          <div className={styles.wraper}>
            <h1>Project not found</h1>
            <p>
              The project you&apos;re looking for doesn&apos;t have a detail
              page yet. <Link to="/">Back home</Link>.
            </p>
          </div>
          <Contact />
        </main>
      </>
    )
  }

  const { title, intro, purpose, images, metrics, publication } = project.detail

  const swapRight = () =>
    setImageIndex((i) => Math.min(i + 1, images.length - 1))
  const swapLeft = () => setImageIndex((i) => Math.max(i - 1, 0))

  return (
    <>
      <Navbar />
      <main id="main">
        <article className={styles.wraper}>
          <h1>{title}</h1>
          <p>{intro}</p>

          {metrics && metrics.length > 0 && (
            <ul className={styles.metrics}>
              {metrics.map(({ value, label }) => (
                <li key={label} className={styles.metric}>
                  <span className={styles.metricValue}>{value}</span>
                  <span className={styles.metricLabel}>{label}</span>
                </li>
              ))}
            </ul>
          )}

          {images && images.length > 0 && (
            <div className={styles.imageWraper}>
              <div className={styles.images}>
                <AnimatePresence initial={false}>
                  {images.slice(imageIndex, imageIndex + 1).map((image) => (
                    <motion.img
                      key={image}
                      src={getImageUrl(`projects/${image}`)}
                      alt={`${title} screenshot ${imageIndex + 1} of ${images.length}`}
                      initial={{ opacity: 0, x: 200 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -200 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {images.length > 1 && (
                <div className={styles.carouselControl}>
                  <button
                    onClick={swapLeft}
                    disabled={imageIndex === 0}
                    aria-label="Previous image"
                  >
                    <GoChevronLeft />
                  </button>
                  <button
                    onClick={swapRight}
                    disabled={imageIndex >= images.length - 1}
                    aria-label="Next image"
                  >
                    <GoChevronRight />
                  </button>
                </div>
              )}
            </div>
          )}

          <h2>Project purpose and goal</h2>
          <p>{purpose}</p>

          {publication && (
            <aside className={styles.publication}>
              <span className={styles.publicationBadge}>Publication</span>
              <h3>{publication.title}</h3>
              <p className={styles.publicationMeta}>
                {publication.authors} · {publication.venue} · {publication.year}
              </p>
              {publication.url && publication.url !== 'REPLACE_WITH_PAPER_URL' && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.publicationLink}
                >
                  Read the paper <HiExternalLink />
                </a>
              )}
            </aside>
          )}
        </article>
        <Contact />
      </main>
    </>
  )
}
