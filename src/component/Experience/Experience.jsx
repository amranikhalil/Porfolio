import {useEffect} from 'react'
import styles from './Experience.module.css'
import { getImageUrl } from '../../util'
import skills from '../../data/skill.json'
import history from '../../data/history.json'
import AOS from 'aos'
import 'aos/dist/aos.css';


export const Experience = () => {
    useEffect(()=>{
        AOS.init({
            duration:1000,
            once:false,
            offset:200
        })
    },[])
  return (
    <section className={styles.container} id="experience">
        <h2 className={styles.title}> EXPERIENCE</h2>
        <div className={styles.content}>
            <div className={styles.skills}>
                {skills.map((skill,id)=>{
                    return(
                           <div className={styles.skill} key={id}>
                            <img src={getImageUrl(skill.imageSrc)} alt="" />
                            <p>{skill.title}</p>
                           </div>
                    )
                })}
            </div>
            <ul className= {styles.history}>
                {
                    history.map((history,id)=>{
                        return(
                        <li className= {styles.historyItems} key={id}>
                            <img src={getImageUrl(history.imageSrc)} alt="" />
                            <div className= {styles.historyItem} > 
                                <div>
                                    <h3> {history.role},{history.organisation}</h3>
                                    <p>`{history.startDate}- {history.endDate}`</p>
                                </div>
                                <ul className= {styles.experience}>
                                {history.experiences.map((exp,id)=>{
                                    return(
                                        <li key={id}>
                                            {exp}
                                        </li>
                                    )
                                })}
                                </ul>
                            </div>
                        </li>                       
                         )
                    })
                }
            </ul>
        </div>
    </section>
  )
}
