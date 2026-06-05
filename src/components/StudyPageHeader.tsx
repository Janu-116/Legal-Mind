import { Link } from 'react-router-dom'
import { FolderOpen } from 'lucide-react'
import { useStudyApp } from '@/context/StudyAppContext'
import { languageOptions, studyUiText, translateText } from '@/lib/studyUtils'

interface StudyPageHeaderProps {
  title: string
  titleHi: string
  description: string
  descriptionHi: string
}

export default function StudyPageHeader({
  title,
  titleHi,
  description,
  descriptionHi
}: StudyPageHeaderProps) {
  const { language, setLanguage, savedCount } = useStudyApp()
  const ui = studyUiText[language]

  return (
    <div className="rounded-2xl border border-legal-600/30 bg-legal-800/50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold-400">Study Workspace</p>
          <h1 className="text-3xl font-serif font-bold text-white">
            {translateText(language, title, titleHi)}
          </h1>
          <p className="max-w-3xl text-sm text-legal-400">
            {translateText(language, description, descriptionHi)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-legal-600 bg-legal-900/80 p-1">
            <div className="mb-1 px-2 pt-1 text-[10px] uppercase tracking-[0.22em] text-legal-500">
              {ui.language}
            </div>
            <div className="flex gap-1">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLanguage(option.value)}
                  className={`rounded-lg px-3 py-2 text-sm transition-all ${
                    language === option.value
                      ? 'bg-gold-400 text-legal-900'
                      : 'text-legal-300 hover:bg-legal-700 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/study-folder"
            className="flex items-center gap-3 rounded-xl border border-gold-400/20 bg-gold-400/10 px-4 py-3 text-sm text-gold-300 transition-all hover:bg-gold-400/15"
          >
            <FolderOpen className="h-4 w-4" />
            <span>{ui.openFolder}</span>
            <span className="rounded-full border border-gold-400/30 bg-gold-400/20 px-2 py-0.5 text-xs text-gold-200">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
