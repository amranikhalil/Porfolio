import React from 'react'
import { Navbar } from "../Navbar/Navbar"
import { Hero } from "../Hero/Hero"
import  {About1} from "../about/About1"
import { Projects } from "../projects/Projects"
import { Contact } from "../contact/Contact"
import { Cloude } from "../about/Claude"
import {Routes, Route} from 'react-router-dom'
export const Portfolio = () => {
  return (
    <>
      <Cloude/>
      <Navbar/>
      <Hero/>
      <About1/>
      <Projects/>
      <Contact/>   
    </>
  )
}
