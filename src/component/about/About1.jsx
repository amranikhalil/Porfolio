import {useEffect} from 'react'
import { getImageUrl } from '../../util'
import styles from './about.module.css'
import AOS from 'aos'

export const About1 = () => {
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
        <section className={styles.leftContainer}>
            <h1 className={styles.title}>My Skills</h1>
            <img  className={styles.aboutImage} src={getImageUrl('hero/02.jpg')}/> 
        </section>

        <section className={styles.content}>
          <ul className= {styles.aboutItems}>
            <li >javascript</li>
            <li >React</li>
            <li >Nodejs</li>
            <li >NextJs</li>
            <li >MongoDb</li>
            <li >Html</li>
            <li >css</li>
            <li >Java</li>
            <li >Oracle</li>
            <li >Python</li>
          </ul>
          <p className={styles.nepo}>
            Master’s graduate in computer science. driven by a deep passion for web development and machine learning. Skilled in creating
            responsive, intuitive web applications and seamlessly integrating machine learning models to elevate user
            experiences. Eager to apply my expertise and innovative mindset in a dynamic role, where I can contribute
            to cutting-edge projects and drive impactful results.
          </p>

        </section>
        
    </section>
    </>
  )
}
