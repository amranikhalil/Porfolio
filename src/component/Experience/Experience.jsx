import { getImageUrl } from '../../util'
import skills from '../../data/skill.json'
import history from '../../data/history.json'
import styles from './Experience.module.css'

export const Experience = () => {
  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>EXPERIENCE</h2>
      <div className={styles.content}>
        <div className={styles.skills}>
          {skills.map((skill) => (
            <div className={styles.skill} key={skill.title}>
              <img src={getImageUrl(skill.imageSrc)} alt={`${skill.title} logo`} />
              <p>{skill.title}</p>
            </div>
          ))}
        </div>

        <ul className={styles.history}>
          {history.map((entry) => (
            <li
              className={styles.historyItems}
              key={`${entry.organisation}-${entry.startDate}`}
            >
              <img
                src={getImageUrl(entry.imageSrc)}
                alt={`${entry.organisation} logo`}
              />
              <div className={styles.historyItem}>
                <div>
                  <h3>
                    {entry.role}, {entry.organisation}
                  </h3>
                  <p>
                    {entry.startDate} — {entry.endDate}
                  </p>
                </div>
                <ul className={styles.experience}>
                  {entry.experiences.map((exp) => (
                    <li key={exp}>{exp}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
