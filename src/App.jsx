import { Routes, Route } from 'react-router-dom'
import styles from './App.module.css'
import { Portfolio } from './component/portfolio/Portfolio'
import { Detail } from './component/details/Detail'

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/:slug" element={<Detail />} />
      </Routes>
    </div>
  )
}

export default App
