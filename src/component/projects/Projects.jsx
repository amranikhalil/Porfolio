import projects from '../../data/project.json'
import { getImageUrl } from '../../util'
import styles from './Project.module.css'
import { useNavigate } from 'react-router-dom'

export const Projects = () => {
  const navigate = useNavigate()

  return (
    <section className={styles.container} id="project">
      <h2 className={styles.title}>Projects</h2>
      <ul className={styles.content}>
        {projects.map((project) => (
          <li className={styles.project} key={project.slug}>
            <div className={styles.leftWraper}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className={styles.skill}>
                {project.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              <div className={styles.contain}>
                {project.detail && (
                  <button
                    onClick={() => navigate(`/${project.slug}`)}
                    className={styles.view}
                  >
                    View project
                  </button>
                )}

                {project.website ? (
                  <button
                    onClick={() => window.open(project.website, '_blank', 'noopener,noreferrer')}
                    className={styles.live}
                  >
                    Demo
                  </button>
                ) : (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} source on GitHub`}
                    className={styles.source}
                    style={{
                      backgroundImage: `url(${getImageUrl('contact/githubIcon.png')})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}
              </div>
            </div>

            <div className={styles.imageWraper}>
              <img
                src={getImageUrl(project.imageSrc)}
                alt={`${project.title} screenshot`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
