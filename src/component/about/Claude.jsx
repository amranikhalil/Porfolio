import { motion } from 'framer-motion'
import { getImageUrl } from '../../util'
import styles from './about.module.css'

const driftLeftToRight = {
  initial: { x: '10%' },
  animate: {
    x: '90vw',
    scale: [1, 0.8, 1],
    y: [0, 30, 0],
    transition: { duration: 50, repeat: Infinity, ease: 'linear' },
  },
}

const driftRightToLeft = {
  initial: { scale: 1, x: '120%' },
  animate: {
    x: '-100vw',
    scale: [1, 0.8, 1],
    y: [0, 20, 0],
    transition: { duration: 50, repeat: Infinity, ease: 'linear' },
  },
}

export const Cloud = () => {
  return (
    <div className={styles.cloudContainer} aria-hidden="true">
      <motion.div
        className={styles.cloud1}
        variants={driftLeftToRight}
        initial="initial"
        animate="animate"
      >
        <span className={styles.icon}>
          <img src={getImageUrl('skills/react.png')} alt="" />
        </span>
      </motion.div>

      <motion.div
        className={styles.cloud2}
        variants={driftRightToLeft}
        initial="initial"
        animate="animate"
      >
        <span className={styles.icon}>
          <img src={getImageUrl('skills/node.png')} alt="" />
        </span>
      </motion.div>

      <motion.div
        className={styles.cloud3}
        variants={driftLeftToRight}
        initial="initial"
        animate="animate"
      >
        <span className={styles.icon}>
          <img src={getImageUrl('skills/mongodb.png')} alt="" />
        </span>
      </motion.div>
    </div>
  )
}
