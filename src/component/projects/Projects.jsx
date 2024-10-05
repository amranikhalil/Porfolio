import React from 'react'
import projects from '../../data/project.json'
import { getImageUrl } from '../../util'
import styles from './Project.module.css'
import { useNavigate } from "react-router-dom";

export const Projects = () => {
    const navigate=useNavigate()
  return (
    <section className={styles.container}id="project" >
        <h2 className={styles.title}>Project</h2>
        <ul className={styles.content}>
            {projects.map((project,id)=>{
                return(
                  <div className={styles.project} key={id}>
                      <div className={styles.leftWraper}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <ul className={styles.skill}>
                            {project.skills.map((skill,id)=>{
                                return(
                                    <li key={id}>
                                        {skill}
                                    </li>
                                )
                            })}
                            </ul>
                            <div className={styles.contain}>
                                <div>

                                <button 
                                onClick={()=>navigate(`/${project.slug}`)}
                                className={styles.view}>
                                    view project
                                </button>
                                <div className={styles.box}>  </div>
                                </div>
                              
                                {
                                    project.website!=''? (
                                        <button 
                                        onClick={()=> window.open (project.website,'_blank')}
                                        className={styles.live}
                                        > Demo 
                                        </button>
                                    ):
                                    
                                    <a
                                    href={project.source}
                                    className={styles.source}
                                    style={{
                                      backgroundImage: `url(${getImageUrl('contact/githubIcon.png')})`,
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      backgroundRepeat: 'no-repeat'
                                      
                                    }}
                                    >
                                    </a>

                                    
                                    
                                }
                                </div>
                              
                        </div>

                        <li className={ styles.imageWraper} key={id}>
                            <img src={getImageUrl(project.imageSrc)} alt="" />
                        </li>
                    </div>
                    
                )
            })}
        </ul>
    </section>
  )
}
