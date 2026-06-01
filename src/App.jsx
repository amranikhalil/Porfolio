import { Routes, Route } from 'react-router-dom'
import styles from './App.module.css'
import { Portfolio } from './component/portfolio/Portfolio'
import { Detail } from './component/details/Detail'
import { ScrollToTop } from './component/ScrollToTop/ScrollToTop'

function App() {
  return (
    <div className={styles.App}>
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/:slug" element={<Detail />} />
      </Routes>
    </div>
  )
}

export default App
