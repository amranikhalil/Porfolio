import React from 'react'
import styles from './Contact.module.css'
import { getImageUrl } from '../../util'

export const Contact = () => {
  return (
    <section className= {styles.container}>
        <div className= {styles.content}>
        <h2> Contact</h2>
        <p>Feel free to reach out!</p>
        </div>
        <div className= {styles.Contact}>
        <ul className= {styles.contact}>
            <li>
            <a href='https://github.com/amranikhalil'
                style={{
                    backgroundImage: `url(${getImageUrl('contact/emailIcon.png')})`,
                
                }}
             >
                </a>  
            </li>
            <li>
            <a href='https://github.com/amranikhalil'
                style={{
                    backgroundImage: `url(${getImageUrl('contact/githubIcon.png')})`,
                
                }}
             >
                </a>  
            </li>
            <li>
                <a href='https://www.linkedin.com/in/khalil-amrani-b19010228/'
                style={{
                    backgroundImage: `url(${getImageUrl('contact/linkedinIcon.png')})`,
               
                }}
                />
            </li>
        </ul>
        </div>
    </section>
  )
}
