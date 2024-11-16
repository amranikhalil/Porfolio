import {useEffect,useRef} from 'react'
import { getImageUrl } from '../../util'
import styles from './Hero.module.css'
import Typed from 'typed.js'
import { Cloude } from '../about/Claude'

export const Hero = () => {
  const elTitle = useRef()
  const elDescription = useRef()
 
  useEffect(() => {
    const typedTitle = new Typed(elTitle.current, {
      strings: ['Hi I\'m KHALIL, I am software <br> engineer'],
      typeSpeed: 50,
      backSpeed: 40,
      showCursor:false
    });
    const typedDescription = new Typed(elDescription.current, {
      strings: [' I am full stack developper with 2 years experience'],
      typeSpeed: 50,
      startDelay:4000,
      showCursor:false
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typedTitle.destroy();
      typedDescription.destroy()
    };
  }, []);

  return (
    <section className= {styles.container} id='hero'>
        <div className={styles.content}>
            <h2 className={styles.title} ref={elTitle}>   </h2>
            <p className={styles.description } ref={elDescription}>  </p>
            {/* <a  className={styles.contact}href='khalilamrani715@gmail.com'> contact me</a> */}
        </div>
        {/* <img className={styles.heroImg} src={getImageUrl('hero/02.jpg')}/> */}
    </section>
  )
}