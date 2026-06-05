import { NavLink, useLocation } from 'react-router-dom'
import { 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Scale, 
  Briefcase,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  Gavel
} from 'lucide-react'
import { useStudyApp } from '@/context/StudyAppContext'
import { studyUiText, translateText } from '@/lib/studyUtils'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation()
  const { language, savedCount } = useStudyApp()
  const ui = studyUiText[language]
  const systemStatus = {
    ipc: true,
    crpc: true,
    constitution: true
  }
  const navItems = [
    { path: '/ai-lawyer', icon: MessageSquare, label: 'AI Lawyer', labelHi: 'AI Lawyer', badge: 'AI' },
    { path: '/analyze-document', icon: FileText, label: 'Analyze Document', labelHi: 'Analyze Document', badge: null },
    { path: '/constitution', icon: BookOpen, label: 'Constitution', labelHi: 'Constitution', badge: null },
    { path: '/precedent-cases', icon: Scale, label: 'Precedent Cases', labelHi: 'प्रिसिडेंट केस', badge: null },
    { path: '/case-studies', icon: Briefcase, label: 'Case Studies', labelHi: 'केस स्टडीज़', badge: null },
    { path: '/study-folder', icon: FolderOpen, label: ui.studyFolder, labelHi: ui.studyFolder, badge: savedCount > 0 ? String(savedCount) : null }
  ]

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-legal-800/95 backdrop-blur-xl border-r border-legal-600/30 
                  transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-72' : 'w-20'}`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-legal-600/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-500/20">
            <Gavel className="w-6 h-6 text-legal-900" />
          </div>
          {isOpen && (
            <div className="animate-fade-in">
              <h1 className="text-xl font-serif font-bold text-white leading-tight">Legal Mind AI</h1>
              <p className="text-xs text-gold-400 tracking-wider uppercase">Intelligent Legal Assistant</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'text-gold-400 bg-legal-700/50 border border-gold-400/20 shadow-lg shadow-gold-500/5' 
                  : 'text-legal-300 hover:text-gold-400 hover:bg-legal-700/30'
                }
                ${!isOpen && 'justify-center'}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400' : 'group-hover:text-gold-400'} transition-colors`} />

              {isOpen && (
                <span className="font-medium">{translateText(language, item.label, item.labelHi)}</span>
              )}

              {item.badge && isOpen && (
                <span className="ml-auto flex items-center gap-1 rounded-full border border-gold-400/30 bg-gold-400/20 px-2 py-0.5 text-xs text-gold-400">
                  {item.path === '/ai-lawyer' && <Sparkles className="h-3 w-3" />}
                  {item.badge}
                </span>
              )}

              {!isOpen && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-legal-700 text-legal-100 text-sm rounded-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                                whitespace-nowrap z-50 border border-legal-600 shadow-xl">
                  {translateText(language, item.label, item.labelHi)}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-gold-400/20 text-gold-400 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* System Status */}
      {isOpen && (
        <div className="p-4 mx-4 mb-4 rounded-xl bg-legal-700/30 border border-legal-600/30">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-legal-300 tracking-wider uppercase">System Status</span>
          </div>
          <p className="text-sm text-white font-medium mb-3">All services operational</p>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-2 py-1 text-xs rounded-lg border ${systemStatus.ipc ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-red-400/10 text-red-400 border-red-400/30'}`}>
              IPC
            </span>
            <span className={`px-2 py-1 text-xs rounded-lg border ${systemStatus.crpc ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-red-400/10 text-red-400 border-red-400/30'}`}>
              CrPC
            </span>
            <span className={`px-2 py-1 text-xs rounded-lg border ${systemStatus.constitution ? 'bg-green-400/10 text-green-400 border-green-400/30' : 'bg-red-400/10 text-red-400 border-red-400/30'}`}>
              Constitution
            </span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gold-400 text-legal-900 rounded-full 
                   flex items-center justify-center shadow-lg shadow-gold-500/30
                   hover:bg-gold-300 transition-colors cursor-pointer z-50"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  )
}
