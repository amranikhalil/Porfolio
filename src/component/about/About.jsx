import {useEffect} from 'react'
import { getImageUrl } from '../../util'
import styles from './about.module.css'
import AOS from 'aos'
import { Cloude } from './Claude'

export const About = () => {
  useEffect(()=>{
    AOS.init({
      duration:1000,
      once:false,
      delay: 200
    })
  })
  return (
    <>
    <section className={styles.container} id="about" >
        <h1 className={styles.title}>My Skills</h1>
        <section className={styles.content}>
          <ul className= {styles.aboutItems}>
            <li className= {styles.aboutItem}>
             <div className= {styles.aboutItemText}>
                    <h3> frontend developer</h3>
                    <p> I'am front-end developer with experience in building responsive and 
                        optimized site
                    </p>
             </div>
            </li>
            <li className= {styles.aboutItem}>
             <div className= {styles.aboutItemText}>
                {/* <img src={getImageUrl('about/serverIcon.png')} alt="" /> */}
                <div>
                    <h3> frontend developer</h3>
                    <p> I'am front-end developer with experience in building responsive and 
                        optimized site
                    </p>
                </div>
             </div>
            </li>
            <li className= {styles.aboutItem}>
             <div className= {styles.aboutItemText}>
                {/* <img src={getImageUrl('about/uiIcon.png')} alt="" /> */}
                <div>
                    <h3> frontend developer</h3>
                    <p> I'am front-end developer with experience in building responsive and 
                        optimized site
                    </p>
                </div>
             </div>
            </li>
          </ul>

        </section>
        
    </section>
    </>
  )
}
