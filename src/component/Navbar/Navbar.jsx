import react, { useState } from "react";

import  {getImageUrl} from '../../util';
import styles from  "./Navbar.module.css"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const [menuOpen, setMenuOpen ]=useState(false)
    const navigate= useNavigate()
  return (
    <nav className={styles.nav} >
        <a className={styles.title} href="/">Portfolio</a>
        <div className={styles.menu} >
            <img className={styles.menubtn} 
                src={
                    menuOpen?
                    getImageUrl('nav/closeIcon.png'):
                    getImageUrl('nav/menuIcon.png')
                    }
                onClick={()=>setMenuOpen(!menuOpen)
                }
            />
            <ul onClick={()=>setMenuOpen(false)} className={`${styles.menuItems} ${menuOpen && styles.menuOpen  }`}>
                <li>
                    <a href="#about">about</a>
                </li>
                <li>
                    <a href="#project">projects</a>
                </li>
                <li>
                    <a href="#contact">contact</a>
                </li>
            </ul>
        </div>
    </nav>
  )
}
