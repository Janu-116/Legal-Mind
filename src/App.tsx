import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import AILawyer from './pages/AILawyer'
import AnalyzeDocument from './pages/AnalyzeDocument'
import Constitution from './pages/Constitution'
import PrecedentCases from './pages/PrecedentCases'
import CaseStudies from './pages/CaseStudies'
import MyStudyFolder from './pages/MyStudyFolder'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const showSidebar = !isHomePage

  return (
    <div className="flex min-h-screen bg-legal-900">
      {showSidebar && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}

      <main className={`flex-1 transition-all duration-300 ${showSidebar && sidebarOpen ? 'ml-72' : showSidebar && !sidebarOpen ? 'ml-20' : 'ml-0'}`}>
        <div className={`${showSidebar ? 'p-6' : 'p-0'} min-h-screen`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-lawyer" element={<AILawyer />} />
            <Route path="/analyze-document" element={<AnalyzeDocument />} />
            <Route path="/constitution" element={<Constitution />} />
            <Route path="/precedent-cases" element={<PrecedentCases />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/study-folder" element={<MyStudyFolder />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
