import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'

export type AppLanguage = 'en' | 'hi'

export interface SavedPrecedentPayload {
  kind: 'precedent'
  title: string
  citation: string
  court: string
  year: number
  category: string
  categoryHi: string
  summary: string
  summaryHi: string
  legalAnalysis: string
  impact: string
  whatThisMeans: string
  whatThisMeansHi?: string
}

export interface SavedCaseStudyPayload {
  kind: 'case-study'
  title: string
  category: string
  categoryHi: string
  summary: string
  summaryHi: string
  facts: string
  issues: string[]
  analysis: string
  outcome: string
  keyTakeaways: string[]
  relevantLaws: string[]
  plaintiffArguments?: string[]
  defendantArguments?: string[]
  source: 'curated' | 'ai'
  prompt?: string
}

export type SavedStudyPayload = SavedPrecedentPayload | SavedCaseStudyPayload

export interface SavedStudyItem {
  id: string
  title: string
  titleHi?: string
  subtitle?: string
  subtitleHi?: string
  savedAt: string
  payload: SavedStudyPayload
}

interface StudyAppContextValue {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => void
  savedItems: SavedStudyItem[]
  savedCount: number
  isSaved: (id: string) => boolean
  toggleSavedItem: (item: SavedStudyItem) => void
  removeSavedItem: (id: string) => void
}

const LANGUAGE_STORAGE_KEY = 'legal-mind-ai.language'
const SAVED_ITEMS_STORAGE_KEY = 'legal-mind-ai.study-folder'

const StudyAppContext = createContext<StudyAppContextValue | undefined>(undefined)

function readSavedItems() {
  if (typeof window === 'undefined') {
    return [] as SavedStudyItem[]
  }

  const savedItems = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY)

  if (!savedItems) {
    return [] as SavedStudyItem[]
  }

  try {
    return JSON.parse(savedItems) as SavedStudyItem[]
  } catch {
    return [] as SavedStudyItem[]
  }
}

function readLanguage() {
  if (typeof window === 'undefined') {
    return 'en' as AppLanguage
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return storedLanguage === 'hi' ? 'hi' : 'en'
}

export function StudyAppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(readLanguage)
  const [savedItems, setSavedItems] = useState<SavedStudyItem[]>(readSavedItems)

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems))
  }, [savedItems])

  const toggleSavedItem = (item: SavedStudyItem) => {
    setSavedItems((currentItems) => {
      const isItemSaved = currentItems.some((savedItem) => savedItem.id === item.id)

      if (isItemSaved) {
        return currentItems.filter((savedItem) => savedItem.id !== item.id)
      }

      return [{ ...item, savedAt: new Date().toISOString() }, ...currentItems]
    })
  }

  const removeSavedItem = (id: string) => {
    setSavedItems((currentItems) => currentItems.filter((savedItem) => savedItem.id !== id))
  }

  const isSaved = (id: string) => savedItems.some((savedItem) => savedItem.id === id)

  return (
    <StudyAppContext.Provider
      value={{
        language,
        setLanguage,
        savedItems,
        savedCount: savedItems.length,
        isSaved,
        toggleSavedItem,
        removeSavedItem
      }}
    >
      {children}
    </StudyAppContext.Provider>
  )
}

export function useStudyApp() {
  const context = useContext(StudyAppContext)

  if (!context) {
    throw new Error('useStudyApp must be used within a StudyAppProvider')
  }

  return context
}
