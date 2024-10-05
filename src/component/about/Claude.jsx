import {React,useState} from 'react'
import styles from './about.module.css'
import {motion, useAnimation} from 'framer-motion'
import { getImageUrl } from '../../util'

export const Cloude = () => {
    // const [isClicked, setIsClicked]=useState(false)
    // Cloud movement animation
    const cloudVariants = {
      initial: { x: '10%'},
      animate: {
        x: '90vw',
        scale:[1,0.8,1],
        y:[0,30,0],
        transition: {
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    };
  
    // Cloud size and position animation
    const cloudSizeVariants = {
      initial: { scale: 1, x:'120%' },
      animate: {
        scale: [1, 0.8, 1],
        y: [0, 20, 0],
        x:'-100vw',
        transition: {
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
        },
      },
    };
    // const styleIcon=()=>{
    //   setIsClicked(true)
    // }
  
    return (
      <div className={styles.cloudContainer}>
        <motion.div
          style={{ backgroundImage: `url(${getImageUrl('about/cloud.svg')})` }}
          className={styles.cloud1}
          variants={cloudVariants}
          initial="initial"
          animate="animate"
        >
          <span className={styles.icon}
            onClick={()=>styleIcon}
          > 
            <img src= {getImageUrl('contact/linkedinIcon.png')}></img>
          </span>
        </motion.div>
        <motion.div
          className={styles.cloud2}
          variants={cloudSizeVariants}
          initial="initial"
          animate="animate"
        >
        <span className={styles.icon}> 
          <img src= {getImageUrl('contact/emailIcon.png')}></img>
        </span>
        </motion.div>

        <motion.div
          className={styles.cloud3}
          variants={cloudVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: '5s' }}
        >
         <span className={styles.icon}> 
          <img src= {getImageUrl('contact/githubIcon.png')}></img>
        </span>
        </motion.div>
      </div>
    );
}
