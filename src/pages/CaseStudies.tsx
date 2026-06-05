import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Scale,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Bookmark,
  Download,
  Loader2,
  Gavel
} from 'lucide-react'
import { caseStudies } from '../data/constitutionData'
import StudyPageHeader from '@/components/StudyPageHeader'
import {
  useStudyApp,
  type SavedCaseStudyPayload,
  type SavedStudyItem
} from '@/context/StudyAppContext'
import { downloadCaseBrief, studyUiText, translateText } from '@/lib/studyUtils'

interface CaseStudyCardData {
  id: string
  title: string
  titleHi?: string
  category: string
  categoryHi: string
  summary: string
  summaryHi?: string
  facts: string
  issues: string[]
  analysis: string
  outcome: string
  keyTakeaways: string[]
  relevantLaws: string[]
  timeline?: string
  source: 'curated' | 'ai'
  prompt?: string
  plaintiffArguments?: string[]
  defendantArguments?: string[]
  matchExplanation?: string
}

interface MootCourtState {
  isOpen: boolean
  isLoading: boolean
  plaintiffArguments: string[]
  defendantArguments: string[]
  error?: string
}

interface GeneratedCaseStudyResponse {
  id?: string
  title?: string
  category?: string
  summary?: string
  background?: string
  legalIssues?: string[]
  plaintiffArguments?: string[]
  defendantArguments?: string[]
  reasoning?: string
  judgment?: string
  keyTakeaways?: string[]
  relevantLaws?: string[]
  matchExplanation?: string
  error?: string
  details?: string
}

const curatedTranslations: Record<number, { titleHi: string; categoryHi: string; summaryHi: string }> = {
  1: {
    titleHi: 'संपत्ति विवाद समाधान',
    categoryHi: 'दीवानी विधि',
    summaryHi: 'तीन पीढ़ियों तक फैले दस्तावेजी अस्पष्टता वाले जटिल संपत्ति विवाद की केस स्टडी।'
  },
  2: {
    titleHi: 'स्टार्टअप फाउंडर एग्रीमेंट उल्लंघन',
    categoryHi: 'वाणिज्यिक विधि',
    summaryHi: 'सह-संस्थापकों के बीच बौद्धिक संपदा और शेयर वेस्टिंग को लेकर विवाद।'
  },
  3: {
    titleHi: 'चिकित्सीय लापरवाही - सर्जिकल त्रुटि',
    categoryHi: 'टॉर्ट विधि',
    summaryHi: 'गलत अंग पर सर्जरी के कारण स्थायी विकलांगता झेलने वाले मरीज का मामला।'
  },
  4: {
    titleHi: 'पर्यावरणीय स्वीकृति उल्लंघन',
    categoryHi: 'पर्यावरण विधि',
    summaryHi: 'बिना पर्यावरणीय स्वीकृति के वेटलैंड क्षेत्र में शुरू हुए निर्माण परियोजना का विवाद।'
  },
  5: {
    titleHi: 'साइबर अपराध - पहचान चोरी',
    categoryHi: 'साइबर विधि',
    summaryHi: 'फ़िशिंग के जरिए पहचान चुराकर नकली प्रोफाइल बनाकर धोखाधड़ी करने का मामला।'
  },
  6: {
    titleHi: 'श्रम विवाद - अनुचित बर्खास्तगी',
    categoryHi: 'श्रम विधि',
    summaryHi: 'सुरक्षा संबंधी चिंता उठाने के बाद निकाले गए वरिष्ठ कर्मचारी का विवाद।'
  }
}

function normalizeAiCaseStudy(
  response: GeneratedCaseStudyResponse,
  prompt: string
): CaseStudyCardData {
  return {
    id: response.id || `ai-${Date.now()}`,
    title: response.title || prompt,
    titleHi: response.title || prompt,
    category: response.category || 'General Law',
    categoryHi: response.category || 'सामान्य विधि',
    summary: response.summary || 'No summary was returned.',
    summaryHi: response.summary || 'कोई सारांश वापस नहीं आया।',
    facts: response.background || 'Background not available.',
    issues: response.legalIssues || [],
    analysis: response.reasoning || 'Reasoning not available.',
    outcome: response.judgment || 'Outcome not available.',
    keyTakeaways: response.keyTakeaways || [],
    relevantLaws: response.relevantLaws || [],
    source: 'ai',
    prompt,
    plaintiffArguments: response.plaintiffArguments || [],
    defendantArguments: response.defendantArguments || [],
    matchExplanation: response.matchExplanation || ''
  }
}

export default function CaseStudies() {
  const { language, isSaved, toggleSavedItem } = useStudyApp()
  const ui = studyUiText[language]
  const [featuredSearch, setFeaturedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedCase, setExpandedCase] = useState<string | null>(null)
  const [aiQuery, setAiQuery] = useState('')
  const [situationQuery, setSituationQuery] = useState('')
  const [isGeneratingCaseStudy, setIsGeneratingCaseStudy] = useState(false)
  const [isMatchingSituation, setIsMatchingSituation] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [generatedStudies, setGeneratedStudies] = useState<CaseStudyCardData[]>([])
  const [mootCourtById, setMootCourtById] = useState<Record<string, MootCourtState>>({})

  const categories = ['All', 'Civil Law', 'Commercial Law', 'Tort Law', 'Environmental Law', 'Cyber Law', 'Labour Law']
  const categoryTranslations: Record<string, string> = {
    All: 'सभी',
    'Civil Law': 'दीवानी विधि',
    'Commercial Law': 'वाणिज्यिक विधि',
    'Tort Law': 'टॉर्ट विधि',
    'Environmental Law': 'पर्यावरण विधि',
    'Cyber Law': 'साइबर विधि',
    'Labour Law': 'श्रम विधि'
  }

  const curatedStudies = useMemo<CaseStudyCardData[]>(
    () =>
      caseStudies.map((caseItem) => ({
        id: `curated-${caseItem.id}`,
        title: caseItem.title,
        titleHi: curatedTranslations[caseItem.id].titleHi,
        category: caseItem.category,
        categoryHi: curatedTranslations[caseItem.id].categoryHi,
        summary: caseItem.summary,
        summaryHi: curatedTranslations[caseItem.id].summaryHi,
        facts: caseItem.facts,
        issues: caseItem.issues,
        analysis: caseItem.analysis,
        outcome: caseItem.outcome,
        keyTakeaways: caseItem.keyTakeaways,
        relevantLaws: caseItem.relevantLaws,
        timeline: caseItem.timeline,
        source: 'curated'
      })),
    []
  )

  const filteredFeaturedCases = useMemo(() => {
    let filtered = curatedStudies

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((caseItem) => caseItem.category === selectedCategory)
    }

    if (!featuredSearch.trim()) {
      return filtered
    }

    const query = featuredSearch.toLowerCase()
    return filtered.filter((caseItem) =>
      [
        caseItem.title,
        caseItem.titleHi || '',
        caseItem.summary,
        caseItem.summaryHi || '',
        caseItem.category,
        caseItem.categoryHi
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [curatedStudies, featuredSearch, selectedCategory])

  const requestGeneratedStudy = async (query: string, mode: 'case-study' | 'similar-situation') => {
    const response = await fetch('/api/generate-case-study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        mode,
        language
      })
    })

    const data = await response.json() as GeneratedCaseStudyResponse & { success?: boolean }

    if (!response.ok || !data) {
      throw new Error(data?.details || data?.error || 'Failed to generate case study.')
    }

    return normalizeAiCaseStudy(data, query)
  }

  const handleGenerateCaseStudy = async () => {
    if (!aiQuery.trim()) {
      return
    }

    setIsGeneratingCaseStudy(true)
    setGenerationError('')

    try {
      const generatedStudy = await requestGeneratedStudy(aiQuery, 'case-study')
      setGeneratedStudies((currentStudies) => [generatedStudy, ...currentStudies])
      setExpandedCase(generatedStudy.id)
      setAiQuery('')
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate case study.')
    } finally {
      setIsGeneratingCaseStudy(false)
    }
  }

  const handleMatchSituation = async () => {
    if (!situationQuery.trim()) {
      return
    }

    setIsMatchingSituation(true)
    setGenerationError('')

    try {
      const matchedStudy = await requestGeneratedStudy(situationQuery, 'similar-situation')
      setGeneratedStudies((currentStudies) => [matchedStudy, ...currentStudies])
      setExpandedCase(matchedStudy.id)
      setSituationQuery('')
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to match case study.')
    } finally {
      setIsMatchingSituation(false)
    }
  }

  const toggleMootCourtMode = async (study: CaseStudyCardData) => {
    const currentState = mootCourtById[study.id]

    if (currentState?.isOpen) {
      setMootCourtById((currentStateMap) => ({
        ...currentStateMap,
        [study.id]: {
          ...currentState,
          isOpen: false
        }
      }))
      return
    }

    if (currentState && currentState.plaintiffArguments.length > 0 && currentState.defendantArguments.length > 0) {
      setMootCourtById((currentStateMap) => ({
        ...currentStateMap,
        [study.id]: {
          ...currentState,
          isOpen: true,
          error: undefined
        }
      }))
      return
    }

    if (
      study.source === 'ai' &&
      study.plaintiffArguments &&
      study.plaintiffArguments.length > 0 &&
      study.defendantArguments &&
      study.defendantArguments.length > 0
    ) {
      setMootCourtById((currentStateMap) => ({
        ...currentStateMap,
        [study.id]: {
          isOpen: true,
          isLoading: false,
          plaintiffArguments: study.plaintiffArguments || [],
          defendantArguments: study.defendantArguments || []
        }
      }))
      return
    }

    setMootCourtById((currentStateMap) => ({
      ...currentStateMap,
      [study.id]: {
        isOpen: true,
        isLoading: true,
        plaintiffArguments: [],
        defendantArguments: []
      }
    }))

    try {
      const response = await fetch('/api/generate-case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: study.title,
          mode: 'moot-court',
          language,
          caseContext: JSON.stringify({
            summary: study.summary,
            facts: study.facts,
            issues: study.issues,
            outcome: study.outcome
          })
        })
      })

      const data = await response.json() as {
        plaintiffArguments?: string[]
        defendantArguments?: string[]
        error?: string
        details?: string
      }

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to generate moot court arguments.')
      }

      setMootCourtById((currentStateMap) => ({
        ...currentStateMap,
        [study.id]: {
          isOpen: true,
          isLoading: false,
          plaintiffArguments: data.plaintiffArguments || [],
          defendantArguments: data.defendantArguments || []
        }
      }))
    } catch (error) {
      setMootCourtById((currentStateMap) => ({
        ...currentStateMap,
        [study.id]: {
          isOpen: true,
          isLoading: false,
          plaintiffArguments: [],
          defendantArguments: [],
          error:
            error instanceof Error
              ? error.message
              : 'Failed to generate moot court arguments.'
        }
      }))
    }
  }

  const buildSavedCaseStudy = (
    study: CaseStudyCardData
  ): SavedStudyItem & { payload: SavedCaseStudyPayload } => ({
    id: `case-study:${study.id}`,
    title: study.title,
    titleHi: study.titleHi,
    subtitle: study.source === 'ai' ? `${ui.aiGenerated} • ${study.category}` : study.category,
    subtitleHi: study.source === 'ai' ? `${ui.aiGenerated} • ${study.categoryHi}` : study.categoryHi,
    savedAt: new Date().toISOString(),
    payload: {
      kind: 'case-study',
      title: study.title,
      category: study.category,
      categoryHi: study.categoryHi,
      summary: study.summary,
      summaryHi: study.summaryHi || study.summary,
      facts: study.facts,
      issues: study.issues,
      analysis: study.analysis,
      outcome: study.outcome,
      keyTakeaways: study.keyTakeaways,
      relevantLaws: study.relevantLaws,
      plaintiffArguments: study.plaintiffArguments,
      defendantArguments: study.defendantArguments,
      source: study.source,
      prompt: study.prompt
    }
  })

  const renderStudyCard = (study: CaseStudyCardData, index: number) => {
    const isExpanded = expandedCase === study.id
    const bookmarkId = `case-study:${study.id}`
    const mootCourtState = mootCourtById[study.id]

    return (
      <motion.div
        key={study.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.04 }}
        className={`rounded-2xl border transition-all duration-300 ${
          isExpanded
            ? 'border-gold-400/30 bg-legal-800/80 shadow-lg shadow-gold-500/5'
            : 'border-legal-600/30 bg-legal-800/50 hover:border-legal-500/50'
        }`}
      >
        <div className="p-6">
          <div
            className="cursor-pointer"
            onClick={() => setExpandedCase(isExpanded ? null : study.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
                    {translateText(language, study.category, study.categoryHi)}
                  </span>
                  {study.timeline && (
                    <span className="flex items-center gap-1 text-sm text-legal-400">
                      <Clock className="h-4 w-4" />
                      {study.timeline}
                    </span>
                  )}
                  {study.source === 'ai' && (
                    <span className="rounded-full border border-legal-600/30 bg-legal-900 px-3 py-1 text-xs text-legal-300">
                      {ui.aiGenerated}
                    </span>
                  )}
                </div>

                <h2 className="mb-2 text-xl font-semibold text-white">
                  {translateText(language, study.title, study.titleHi)}
                </h2>
                <p className="text-sm leading-relaxed text-legal-300">
                  {translateText(language, study.summary, study.summaryHi)}
                </p>
                {study.matchExplanation && (
                  <p className="mt-3 rounded-xl border border-gold-400/15 bg-gold-400/10 px-4 py-3 text-sm text-gold-100">
                    {study.matchExplanation}
                  </p>
                )}
              </div>

              <button className="p-2 text-legal-400 transition-colors hover:text-white">
                {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => toggleSavedItem(buildSavedCaseStudy(study))}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${
                isSaved(bookmarkId)
                  ? 'border-gold-400/30 bg-gold-400/20 text-gold-200'
                  : 'border-legal-600/30 bg-legal-900 text-legal-300 hover:border-gold-400/20 hover:text-gold-300'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              {isSaved(bookmarkId) ? ui.saved : ui.save}
            </button>

            <button
              onClick={() => downloadCaseBrief(buildSavedCaseStudy(study).payload)}
              className="flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/10 px-4 py-3 text-sm text-gold-300 transition-all hover:bg-gold-400/15"
            >
              <Download className="h-4 w-4" />
              {ui.downloadBrief}
            </button>

            <button
              onClick={() => void toggleMootCourtMode(study)}
              className="flex items-center gap-2 rounded-xl border border-legal-600/30 bg-legal-900 px-4 py-3 text-sm text-legal-300 transition-all hover:border-gold-400/20 hover:text-gold-300"
            >
              {mootCourtState?.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Gavel className="h-4 w-4" />
              )}
              {mootCourtState?.isOpen ? ui.closeMootCourt : ui.mootCourtMode}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-legal-600/30"
            >
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <FileText className="h-4 w-4" />
                    {ui.caseBackground}
                  </h3>
                  <p className="rounded-xl bg-legal-900/50 p-4 text-sm leading-relaxed text-legal-300">
                    {study.facts}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <AlertCircle className="h-4 w-4" />
                    {ui.keyLegalIssues}
                  </h3>
                  <ul className="space-y-2">
                    {study.issues.map((issue, issueIndex) => (
                      <li key={issueIndex} className="flex items-start gap-2 text-sm text-legal-300">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-400" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                {study.source === 'ai' && study.plaintiffArguments && study.defendantArguments && (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gold-400">
                        <Scale className="h-4 w-4" />
                        {ui.plaintiff}
                      </h3>
                      <ul className="space-y-2">
                        {study.plaintiffArguments.map((argument, argumentIndex) => (
                          <li key={argumentIndex} className="flex items-start gap-2 text-sm text-legal-300">
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                            {argument}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gold-400">
                        <Scale className="h-4 w-4" />
                        {ui.defendant}
                      </h3>
                      <ul className="space-y-2">
                        {study.defendantArguments.map((argument, argumentIndex) => (
                          <li key={argumentIndex} className="flex items-start gap-2 text-sm text-legal-300">
                            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                            {argument}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <Scale className="h-4 w-4" />
                    {ui.courtsReasoning}
                  </h3>
                  <p className="text-sm leading-relaxed text-legal-300">{study.analysis}</p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <CheckCircle className="h-4 w-4" />
                    {ui.judgmentOutcome}
                  </h3>
                  <p className="rounded-xl border border-green-400/20 bg-green-400/5 p-4 text-sm leading-relaxed text-legal-300">
                    {study.outcome}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <Lightbulb className="h-4 w-4" />
                    {ui.keyTakeaways}
                  </h3>
                  <ul className="space-y-2">
                    {study.keyTakeaways.map((takeaway, takeawayIndex) => (
                      <li key={takeawayIndex} className="flex items-start gap-2 text-sm text-legal-300">
                        <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gold-400">
                    <BookOpen className="h-4 w-4" />
                    {ui.relevantLaws}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {study.relevantLaws.map((law, lawIndex) => (
                      <span
                        key={lawIndex}
                        className="rounded-lg border border-legal-600 bg-legal-700 px-3 py-1.5 text-sm text-legal-300"
                      >
                        {law}
                      </span>
                    ))}
                  </div>
                </div>

                {mootCourtState?.isOpen && (
                  <div className="rounded-2xl border border-gold-400/20 bg-gold-400/10 p-5">
                    <div className="mb-4 flex items-center gap-2 text-gold-200">
                      <Gavel className="h-5 w-5" />
                      <h3 className="text-base font-semibold">{ui.mootCourtMode}</h3>
                    </div>

                    {mootCourtState.isLoading ? (
                      <div className="flex items-center gap-3 text-sm text-gold-100">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Preparing arguments for both sides...
                      </div>
                    ) : mootCourtState.error ? (
                      <p className="text-sm text-red-200">{mootCourtState.error}</p>
                    ) : (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-gold-400/15 bg-legal-900/70 p-4">
                          <h4 className="mb-3 text-sm font-medium text-gold-300">{ui.plaintiff}</h4>
                          <ul className="space-y-2">
                            {mootCourtState.plaintiffArguments.map((argument, argumentIndex) => (
                              <li key={argumentIndex} className="flex items-start gap-2 text-sm text-legal-200">
                                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                                {argument}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-gold-400/15 bg-legal-900/70 p-4">
                          <h4 className="mb-3 text-sm font-medium text-gold-300">{ui.defendant}</h4>
                          <ul className="space-y-2">
                            {mootCourtState.defendantArguments.map((argument, argumentIndex) => (
                              <li key={argumentIndex} className="flex items-start gap-2 text-sm text-legal-200">
                                <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-400" />
                                {argument}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <StudyPageHeader
        title={ui.caseStudiesHeading}
        titleHi={ui.caseStudiesHeading}
        description={ui.caseStudiesBody}
        descriptionHi={ui.caseStudiesBody}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-legal-600/30 bg-legal-800/50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-3">
              <Search className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{ui.generateCaseStudy}</h2>
              <p className="text-sm text-legal-400">
                Ask for any case, topic, or dispute and get a fresh AI-generated brief.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={aiQuery}
              onChange={(event) => setAiQuery(event.target.value)}
              rows={4}
              placeholder={ui.caseStudyPrompt}
              className="w-full rounded-xl border border-legal-600 bg-legal-900/80 px-4 py-3 text-white placeholder:text-legal-500 focus:border-gold-400/50 focus:outline-none"
            />
            <button
              onClick={() => void handleGenerateCaseStudy()}
              disabled={isGeneratingCaseStudy}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 px-5 py-3 font-semibold text-legal-900 transition-all hover:from-gold-400 hover:to-gold-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGeneratingCaseStudy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isGeneratingCaseStudy ? 'Generating...' : ui.generateCaseStudy}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-legal-600/30 bg-legal-800/50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-3">
              <Briefcase className="h-5 w-5 text-gold-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{ui.similarSituation}</h2>
              <p className="text-sm text-legal-400">
                Describe a real-life problem and get the closest legal case study framing.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={situationQuery}
              onChange={(event) => setSituationQuery(event.target.value)}
              rows={4}
              placeholder={ui.situationPrompt}
              className="w-full rounded-xl border border-legal-600 bg-legal-900/80 px-4 py-3 text-white placeholder:text-legal-500 focus:border-gold-400/50 focus:outline-none"
            />
            <button
              onClick={() => void handleMatchSituation()}
              disabled={isMatchingSituation}
              className="flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/10 px-5 py-3 font-semibold text-gold-300 transition-all hover:bg-gold-400/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isMatchingSituation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
              {isMatchingSituation ? 'Matching...' : ui.matchSituation}
            </button>
          </div>
        </div>
      </div>

      {generationError && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
          {generationError}
        </div>
      )}

      {generatedStudies.length > 0 && (
        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold-400">{ui.aiGenerated}</p>
            <h2 className="text-2xl font-serif font-bold text-white">Generated Study Results</h2>
          </div>
          <div className="grid gap-6">
            <AnimatePresence>
              {generatedStudies.map((study, index) => renderStudyCard(study, index))}
            </AnimatePresence>
          </div>
        </section>
      )}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold-400">{ui.featuredCases}</p>
            <h2 className="text-2xl font-serif font-bold text-white">{ui.featuredCases}</h2>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-3xl lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-legal-400" />
              <input
                type="text"
                placeholder="Filter featured cases by title, topic, or summary..."
                value={featuredSearch}
                onChange={(event) => setFeaturedSearch(event.target.value)}
                className="w-full rounded-xl border border-legal-600 bg-legal-800/80 py-3 pl-12 pr-4 text-white placeholder:text-legal-500 focus:border-gold-400/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gold-400 text-legal-900'
                      : 'border border-legal-600 bg-legal-800 text-legal-300 hover:bg-legal-700'
                  }`}
                >
                  {translateText(language, category, categoryTranslations[category])}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {filteredFeaturedCases.map((study, index) => renderStudyCard(study, index))}
          </AnimatePresence>
        </div>
      </section>

      {filteredFeaturedCases.length === 0 && (
        <div className="rounded-2xl border border-dashed border-legal-600/40 bg-legal-800/30 py-14 text-center">
          <Briefcase className="mx-auto mb-4 h-16 w-16 text-legal-600" />
          <h3 className="text-xl font-semibold text-white">{ui.noCasesFound}</h3>
          <p className="mt-2 text-legal-400">{ui.tryAnotherSearch}</p>
        </div>
      )}
    </div>
  )
}
