import {useState} from 'react'
import {Navbar} from '../Navbar/Navbar'
import styles from './detail.module.css'
import { getImageUrl } from '../../util'
import {  GoChevronRight } from "react-icons/go";
import {  GoChevronLeft } from "react-icons/go";
import {motion, AnimatePresence } from "framer-motion"
import { Contact } from '../contact/Contact';
import Sparkles from '../Sparkle1';

export const Detail = () => {
  const images=['carManagment.png','cars.png','ManageAccount.png','manageCars.png']
  const [imageIndex,setImageIndex]=useState(0)
  const numberOfImage=1
  const swapRight=()=>{
    setImageIndex(Math.min(imageIndex+1, images.length-1))
  }
  const swapLeft=()=>{
    setImageIndex(Math.max(imageIndex-1, 0))
  }
  return (
    <>
    <div>
      <Navbar/>
        <div className={styles.wraper}>
          <h1>car managment system with  price prediction  </h1>
            <p>
            The project was focused on <Sparkles>
            developing a comprehensive platform </Sparkles> where users can 
            manage the buying, selling, and evaluation of cars. The goal was to create an
             intuitive system that simplifies car management while using machine 
            learning to predict prices, offering users valuable insights during transactions.
            </p>
            <div className={styles.imageWraper}>
              <div className={styles.images}>

              <AnimatePresence initial={false}>
              {images.slice(imageIndex, imageIndex + numberOfImage).map((image, key) => (
                <motion.img
                key={image}
                src={getImageUrl(`projects/${image}`)}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                />
              ))}
            </AnimatePresence>
            </div>
             <div className={styles.carouselControl}> 
              <button
              onClick={swapLeft}
              style={{color:'white',fontSize: '40px'}}
              disabled={imageIndex === 0}              >
                <GoChevronLeft  style={{ color:'black',fontSize: '40px' }}/>
              </button>
              <button
              onClick={swapRight}
              style={{color:'black',fontSize: '40px', backgroundColor:'none'}} 
              disabled={imageIndex>= images.length - numberOfImage}
              >
              <GoChevronRight  style={{ color:'black',fontSize: '40px' }}/>
              </button>
            </div>
            </div>
         
            <h1> project purpose and goal</h1>
            <p>
            The Car Management System is designed to streamline the car listing and selling 
            process, offering a predictive pricing feature based on historical data. 
            The aim was to allow users to confidently price their cars or evaluate potential
             purchases. The challenge was integrating a machine learning model seamlessly 
             into a web application, while ensuring the system was scalable and user-friendly.
              <br></br>
            The project also needed a reliable backend to manage user data, car listings, and the machine learning model. 
            As the system handles a growing amount of car data, scalability and performance were
             key concerns throughout development.
            </p>
        </div>
    </div>
    <Contact/>
</>
  )
}
