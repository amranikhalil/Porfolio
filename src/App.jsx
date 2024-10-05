import {  Routes, Route } from "react-router-dom";
import styles from "./App.module.css"
import { Portfolio } from "./component/portfolio/Portfolio";
import { Detail } from "./component/details/Detail";
import { Hero } from "./component/Hero/Hero";
import { Projects } from "./component/projects/Projects";
function App() {

  return (
    
    <div className={styles.App}> 
      <Routes>
          <Route path="/" element={<Portfolio/>}/>
          <Route path="/Project1" element={<Detail/>}/>
          {/* <Route path="/hero" element={<Hero/>}/> */}
          {/* <Route path="/projects" element={<Projects/>}/> */}
        </Routes>
       
      
  </div>
  )
      
}

export default App
