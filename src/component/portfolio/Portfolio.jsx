import { Navbar } from '../Navbar/Navbar'
import { Hero } from '../Hero/Hero'
import { About1 } from '../about/About1'
import { Experience } from '../Experience/Experience'
import { Projects } from '../projects/Projects'
import { Contact } from '../contact/Contact'

export const Portfolio = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About1 />
      <Experience />
      <Projects />
      <Contact />
    </>
  )
}
