import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiMongodb,
  SiHtml5,
  SiCss3,
  SiPython,
  SiOracle,
  SiTypescript,
  SiExpress,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import history from '../../data/history.json'
import { getImageUrl } from '../../util'
import styles from './Experience.module.css'

const SKILLS = [
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', Icon: SiNextdotjs, color: '#000000' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Express', Icon: SiExpress, color: '#000000' },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { name: 'Python', Icon: SiPython, color: '#3776AB' },
  { name: 'Java', Icon: FaJava, color: '#E76F00' },
  { name: 'Oracle', Icon: SiOracle, color: '#C74634' },
  { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', Icon: SiCss3, color: '#1572B6' },
]

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>

      <div className={styles.skillsGroup}>
        <h3 className={styles.subTitle}>What I work with</h3>
        <ul className={styles.skills}>
          {SKILLS.map(({ name, Icon, color }) => (
            <li
              className={styles.skill}
              key={name}
              style={{ '--skill-color': color }}
            >
              <Icon className={styles.skillIcon} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </div>

      {history.length > 0 && (
        <div className={styles.historyGroup}>
          <h3 className={styles.subTitle}>Where I&apos;ve worked</h3>
          <ul className={styles.history}>
            {history.map((entry) => (
              <li
                className={styles.historyItem}
                key={`${entry.organisation}-${entry.startDate}`}
              >
                {entry.imageSrc && (
                  <img
                    src={getImageUrl(entry.imageSrc)}
                    alt={`${entry.organisation} logo`}
                    className={styles.historyLogo}
                  />
                )}
                <div className={styles.historyBody}>
                  <h4>
                    {entry.role} <span>· {entry.organisation}</span>
                  </h4>
                  <p className={styles.historyDate}>
                    {entry.startDate} — {entry.endDate}
                  </p>
                  <ul className={styles.bullets}>
                    {entry.experiences.map((exp) => (
                      <li key={exp}>{exp}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
