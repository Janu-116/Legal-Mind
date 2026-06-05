import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { StudyAppProvider } from './context/StudyAppContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StudyAppProvider>
        <App />
      </StudyAppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
