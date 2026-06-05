import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  MessageSquare,
  Scale,
  Search,
  Shield,
  Sparkles
} from 'lucide-react'
import {
  constitutionExplorerArticles,
  constitutionParts,
  constitutionSchedules,
  legalFAQs,
  type Article
} from '../data/constitutionData'

type Category = 'All' | 'Fundamental Rights' | 'Fundamental Duties' | 'Directive Principles'

interface AssistantResponse {
  title: string
  explanation: string
  bullets: string[]
  examples: string[]
  relatedArticles: Array<number | string>
}

const categories: Category[] = [
  'All',
  'Fundamental Rights',
  'Fundamental Duties',
  'Directive Principles'
]

const quickQuestions = [
  'What are Fundamental Rights?',
  'Explain Article 14',
  'Directive Principles overview'
]

const assistantExamples: Record<string, string[]> = {
  'ARTICLE_14': [
    'Example: A law cannot arbitrarily treat two similarly placed persons differently without a valid reason.',
    'Example: Equality does not prevent affirmative action for women, children, or disadvantaged groups.'
  ],
  'ARTICLE_21': [
    'Example: Courts have used Article 21 to protect privacy, dignity, and fair procedure.',
    'Example: Article 21 often supports claims involving livelihood, health, and humane treatment.'
  ],
  'FUNDAMENTAL RIGHTS': [
    'Example: If a public authority discriminates unfairly, the matter can be tested under Articles 14 to 16.',
    'Example: If a person is unlawfully detained, constitutional remedies can be sought under Articles 32 or 226.'
  ],
  'DIRECTIVE PRINCIPLES': [
    'Example: Policies on legal aid, panchayats, public health, and equal pay often draw support from Part IV.',
    'Example: Courts sometimes use Directive Principles to interpret Fundamental Rights in a welfare-oriented way.'
  ],
  'FUNDAMENTAL DUTIES': [
    'Example: Duties are not usually directly enforceable like Fundamental Rights, but they inform civic obligations and legislation.',
    'Example: Environmental protection and respect for constitutional ideals are reflected in Article 51A.'
  ]
}

function normalizeArticleId(value: number | string) {
  return String(value).replace(/\s+/g, '').toUpperCase()
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function buildArticlePreview(article: Article) {
  const previewSource = article.summary || article.content
  return previewSource.length > 180 ? `${previewSource.slice(0, 180)}...` : previewSource
}

function getHighlightedContent(text: string, query: string) {
  if (!query.trim()) {
    return text
  }

  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${safeQuery})`, 'ig'))

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-[#3A3020] px-0.5 text-[#F3E2A8]">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function articleMatchesQuery(article: Article, query: string) {
  if (!query) {
    return true
  }

  const haystack = [
    String(article.number),
    article.title,
    article.summary,
    article.content,
    article.part,
    article.category
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function findBestFaq(query: string) {
  const normalizedQuery = normalizeSearchValue(query)
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)

  let bestMatch = legalFAQs[0]
  let bestScore = -1

  for (const faq of legalFAQs) {
    const question = faq.question.toLowerCase()
    const answer = faq.answer.toLowerCase()
    let score = 0

    if (question.includes(normalizedQuery)) {
      score += 6
    }

    if (answer.includes(normalizedQuery)) {
      score += 3
    }

    for (const word of queryWords) {
      if (question.includes(word)) {
        score += 2
      }

      if (answer.includes(word)) {
        score += 1
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  return bestScore > 0 ? bestMatch : null
}

function getTopicExamples(query: string, article?: Article) {
  const normalizedQuery = normalizeSearchValue(query)

  if (article) {
    const articleKey = `ARTICLE_${normalizeArticleId(article.number)}`
    return assistantExamples[articleKey] || []
  }

  if (normalizedQuery.includes('fundamental rights')) {
    return assistantExamples['FUNDAMENTAL RIGHTS']
  }

  if (normalizedQuery.includes('directive principles')) {
    return assistantExamples['DIRECTIVE PRINCIPLES']
  }

  if (normalizedQuery.includes('fundamental duties')) {
    return assistantExamples['FUNDAMENTAL DUTIES']
  }

  return []
}

function createAssistantResponse(question: string): AssistantResponse {
  const normalizedQuery = normalizeSearchValue(question)
  const articleMatch =
    normalizedQuery.match(/article\s+(\d+[a-z]?)/i) ||
    normalizedQuery.match(/^(\d+[a-z]?)$/i)

  if (articleMatch) {
    const requestedArticle = normalizeArticleId(articleMatch[1])
    const article = constitutionExplorerArticles.find(
      (entry) => normalizeArticleId(entry.number) === requestedArticle
    )

    if (article) {
      return {
        title: `Article ${article.number} – ${article.title}`,
        explanation: article.content,
        bullets: [
          `${article.part} • ${article.category}`,
          article.summary,
          ...(article.relatedArticles?.length
            ? [`Related Articles: ${article.relatedArticles.join(', ')}`]
            : [])
        ],
        examples: getTopicExamples(question, article),
        relatedArticles: article.relatedArticles || []
      }
    }
  }

  const faqMatch = findBestFaq(question)

  if (faqMatch) {
    const matchingArticles = constitutionExplorerArticles
      .filter((article) => articleMatchesQuery(article, normalizedQuery))
      .slice(0, 4)

    return {
      title: faqMatch.question.replace(/^What is /i, '').replace(/^What are /i, ''),
      explanation: faqMatch.answer,
      bullets: matchingArticles.map(
        (article) => `Article ${article.number} – ${article.title}`
      ),
      examples: getTopicExamples(question),
      relatedArticles: matchingArticles.map((article) => article.number)
    }
  }

  const matchingArticles = constitutionExplorerArticles
    .filter((article) => articleMatchesQuery(article, normalizedQuery))
    .slice(0, 4)

  if (matchingArticles.length > 0) {
    const [primaryArticle] = matchingArticles

    return {
      title: `Best Match: Article ${primaryArticle.number} – ${primaryArticle.title}`,
      explanation: primaryArticle.content,
      bullets: matchingArticles.map(
        (article) => `${article.part} • Article ${article.number} – ${article.summary}`
      ),
      examples: getTopicExamples(question, primaryArticle),
      relatedArticles: matchingArticles.map((article) => article.number)
    }
  }

  return {
    title: 'Constitution Overview',
    explanation:
      'Try asking about a specific article, right, duty, or constitutional concept. You can search by article number such as Article 21, or by topic such as equality, freedom, directive principles, or constitutional remedies.',
    bullets: [
      'Examples: “Explain Article 21”',
      'Examples: “What are Fundamental Rights?”',
      'Examples: “Directive Principles overview”'
    ],
    examples: [],
    relatedArticles: []
  }
}

export default function Constitution() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [expandedParts, setExpandedParts] = useState<string[]>(['part-iii', 'part-iv', 'part-iva'])
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [askQuestion, setAskQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [lastQuestion, setLastQuestion] = useState('')
  const [assistantResponse, setAssistantResponse] = useState<AssistantResponse | null>(null)

  const normalizedSearchQuery = normalizeSearchValue(searchQuery)

  const filteredParts = useMemo(() => {
    return constitutionParts
      .map((part) => {
        const matchesPartTitle =
          !normalizedSearchQuery ||
          `${part.part} ${part.title} ${part.description}`.toLowerCase().includes(normalizedSearchQuery)

        const matchingArticles = part.articles.filter((article) => {
          const matchesFilter =
            selectedCategory === 'All' ? true : article.category === selectedCategory

          return matchesFilter && (matchesPartTitle || articleMatchesQuery(article, normalizedSearchQuery))
        })

        return {
          ...part,
          articles: matchingArticles
        }
      })
      .filter((part) => {
        if (selectedCategory === 'All') {
          return !normalizedSearchQuery || part.articles.length > 0 || part.title.toLowerCase().includes(normalizedSearchQuery)
        }

        return part.articles.length > 0
      })
  }, [normalizedSearchQuery, selectedCategory])

  useEffect(() => {
    if (!normalizedSearchQuery) {
      return
    }

    const matchingPartKeys = filteredParts
      .filter((part) => part.articles.length > 0)
      .map((part) => part.key)

    setExpandedParts((current) => Array.from(new Set([...current, ...matchingPartKeys])))
  }, [filteredParts, normalizedSearchQuery])

  const togglePart = (partKey: string) => {
    setExpandedParts((current) =>
      current.includes(partKey)
        ? current.filter((entry) => entry !== partKey)
        : [...current, partKey]
    )
  }

  const handleAsk = async (questionOverride?: string) => {
    const question = (questionOverride || askQuestion).trim()

    if (!question) {
      return
    }

    setAskQuestion(question)
    setLastQuestion(question)
    setIsAsking(true)

    await new Promise((resolve) => setTimeout(resolve, 450))

    setAssistantResponse(createAssistantResponse(question))
    setIsAsking(false)
  }

  const stats = [
    { number: '25', label: 'Parts' },
    { number: '470+', label: 'Articles' },
    { number: '12', label: 'Schedules' },
    { number: 'Search', label: 'Navigator' }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3A3020] bg-[#111827]">
          <BookOpen className="h-7 w-7 text-[#D4AF37]" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">The Living Constitution</h1>
          <p className="text-legal-400">
            Explore the structure of the Constitution of India and ask focused constitutional questions.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(420px,1fr)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-[#D4AF37]" />
            <h2 className="text-2xl font-serif font-bold text-white">Constitution Explorer</h2>
          </div>

          <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-legal-400" />
              <input
                type="text"
                placeholder="Search by article number, keyword, or part..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-[#2A3342] bg-[#0B0F14] py-4 pl-12 pr-4 text-white placeholder:text-legal-400 focus:outline-none focus:border-[#9A7B24]"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'border-[#9A7B24] bg-[#2A2112] text-[#F3E2A8]'
                      : 'border-[#2A3342] bg-[#0B0F14] text-[#B6BDC8] hover:border-[#6B5A2D] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-5">
            <div className="flex items-center justify-between border-b border-[#232C39] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Parts and Articles</h3>
                <p className="text-sm text-[#8B93A6]">
                  Browse the constitutional structure by Part and expand articles for more detail.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">
                {filteredParts.length} parts visible
              </span>
            </div>

            <div className="mt-5 max-h-[780px] space-y-4 overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {filteredParts.map((part) => {
                  const isExpanded = expandedParts.includes(part.key)

                  return (
                    <motion.section
                      key={part.key}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-[#232C39] bg-[#0B0F14]"
                    >
                      <button
                        onClick={() => togglePart(part.key)}
                        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-[#D4AF37]">{part.part}</span>
                            <span className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">
                              {part.articleRangeLabel}
                            </span>
                            {part.repealed && (
                              <span className="rounded-full border border-[#6B3341] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#D88A98]">
                                Repealed
                              </span>
                            )}
                          </div>
                          <h4 className="mt-2 text-lg font-semibold text-white">{part.title}</h4>
                          <p className="mt-1 text-sm leading-6 text-[#9CA3AF]">{part.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full border border-[#2A3342] px-3 py-1 text-xs text-[#B6BDC8]">
                            {part.articles.length} articles
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-[#D4AF37]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#D4AF37]" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#232C39]"
                          >
                            <div className="space-y-3 p-4">
                              {part.articles.map((article) => {
                                const articleKey = `${part.key}-${article.number}`
                                const isArticleExpanded = expandedArticle === articleKey

                                return (
                                  <article
                                    key={articleKey}
                                    className="rounded-xl border border-[#1F2937] bg-[#111827]"
                                  >
                                    <button
                                      onClick={() =>
                                        setExpandedArticle(isArticleExpanded ? null : articleKey)
                                      }
                                      className="w-full px-4 py-4 text-left"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-[#D4AF37]">
                                              Article {getHighlightedContent(String(article.number), normalizedSearchQuery)}
                                            </span>
                                            {article.category !== 'Other' && (
                                              <span className="rounded-full border border-[#2A3342] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#8B93A6]">
                                                {article.category}
                                              </span>
                                            )}
                                          </div>
                                          <h5 className="mt-2 text-base font-semibold text-white">
                                            {getHighlightedContent(article.title, normalizedSearchQuery)}
                                          </h5>
                                          <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
                                            {getHighlightedContent(buildArticlePreview(article), normalizedSearchQuery)}
                                          </p>
                                        </div>
                                        {isArticleExpanded ? (
                                          <ChevronUp className="mt-1 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                                        ) : (
                                          <ChevronDown className="mt-1 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                                        )}
                                      </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                      {isArticleExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="border-t border-[#1F2937]"
                                        >
                                          <div className="space-y-4 p-4">
                                            <div>
                                              <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                                                Summary
                                              </p>
                                              <p className="mt-2 text-sm leading-6 text-[#D1D5DB]">
                                                {article.summary}
                                              </p>
                                            </div>

                                            <div>
                                              <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                                                Full Text
                                              </p>
                                              <div className="mt-2 max-h-48 overflow-y-auto pr-2 text-sm leading-7 text-[#BFC6D1]">
                                                {article.content}
                                              </div>
                                            </div>

                                            {article.relatedArticles && article.relatedArticles.length > 0 && (
                                              <div>
                                                <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                                                  Related Articles
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                  {article.relatedArticles.map((relatedArticle) => (
                                                    <button
                                                      key={String(relatedArticle)}
                                                      onClick={() => setSearchQuery(String(relatedArticle))}
                                                      className="rounded-lg border border-[#2A3342] bg-[#0B0F14] px-3 py-2 text-xs text-[#B6BDC8] hover:border-[#6B5A2D] hover:text-white"
                                                    >
                                                      Article {relatedArticle}
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </article>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.section>
                  )
                })}
              </AnimatePresence>

              {filteredParts.length === 0 && (
                <div className="rounded-xl border border-[#232C39] bg-[#0B0F14] p-6 text-sm text-[#9CA3AF]">
                  No matching constitutional provisions found. Try a different article number, topic,
                  or filter.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-[#D4AF37]" />
            <h2 className="text-2xl font-serif font-bold text-white">Ask About Constitution</h2>
          </div>

          <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-6">
            <div className="border-b border-[#232C39] pb-4">
              <h3 className="text-lg font-semibold text-white">Constitution Assistant</h3>
              <p className="mt-1 text-sm text-[#8B93A6]">
                Ask about specific articles, rights, duties, or constitutional concepts in plain language.
              </p>
            </div>

            <div className="mt-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask: Explain Article 21, equality, duties..."
                  value={askQuestion}
                  onChange={(event) => setAskQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      void handleAsk()
                    }
                  }}
                  className="w-full rounded-xl border border-[#2A3342] bg-[#0B0F14] py-4 pl-4 pr-14 text-white placeholder:text-legal-400 focus:outline-none focus:border-[#9A7B24]"
                />
                <button
                  onClick={() => void handleAsk()}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-[#D4AF37] text-[#111827] hover:bg-[#E3C35A]"
                  aria-label="Ask constitutional question"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => void handleAsk(question)}
                    className="rounded-lg border border-[#2A3342] bg-[#0B0F14] px-3 py-2 text-sm text-[#B6BDC8] hover:border-[#6B5A2D] hover:text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#232C39] bg-[#0B0F14] p-4">
              <div className="mb-4 flex items-center justify-between border-b border-[#1F2937] pb-3">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
                    Response Panel
                  </h4>
                  <p className="mt-1 text-xs text-[#8B93A6]">
                    Answers are generated from the local constitutional knowledge base.
                  </p>
                </div>
                {isAsking && <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />}
              </div>

              <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                {lastQuestion && (
                  <div className="rounded-xl border border-[#2A3342] bg-[#111827] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8B93A6]">Question</p>
                    <p className="mt-2 text-sm leading-6 text-white">{lastQuestion}</p>
                  </div>
                )}

                {isAsking && (
                  <div className="rounded-xl border border-[#2A3342] bg-[#111827] p-4 text-sm text-[#B6BDC8]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
                      Analyzing constitutional context...
                    </div>
                  </div>
                )}

                {!isAsking && assistantResponse && (
                  <div className="rounded-xl border border-[#2A3342] bg-[#111827] p-5">
                    <h5 className="text-lg font-semibold text-white">{assistantResponse.title}</h5>
                    <p className="mt-3 text-sm leading-7 text-[#D1D5DB]">
                      {assistantResponse.explanation}
                    </p>

                    {assistantResponse.bullets.length > 0 && (
                      <div className="mt-5 border-t border-[#232C39] pt-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                          Relevant Constitutional Context
                        </p>
                        <div className="mt-3 space-y-3">
                          {assistantResponse.bullets.map((bullet) => (
                            <div key={bullet} className="flex items-start gap-3">
                              <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8B93A6]" />
                              <p className="text-sm leading-6 text-[#BFC6D1]">{bullet}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistantResponse.examples.length > 0 && (
                      <div className="mt-5 border-t border-[#232C39] pt-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                          Examples
                        </p>
                        <div className="mt-3 space-y-3">
                          {assistantResponse.examples.map((example) => (
                            <div key={example} className="flex items-start gap-3">
                              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8B93A6]" />
                              <p className="text-sm leading-6 text-[#BFC6D1]">{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistantResponse.relatedArticles.length > 0 && (
                      <div className="mt-5 border-t border-[#232C39] pt-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                          Jump to Related Articles
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {assistantResponse.relatedArticles.map((articleNumber) => (
                            <button
                              key={String(articleNumber)}
                              onClick={() => setSearchQuery(String(articleNumber))}
                              className="rounded-lg border border-[#2A3342] bg-[#0B0F14] px-3 py-2 text-xs text-[#B6BDC8] hover:border-[#6B5A2D] hover:text-white"
                            >
                              Article {articleNumber}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isAsking && !assistantResponse && (
                  <div className="rounded-xl border border-dashed border-[#2A3342] bg-[#111827] p-5 text-sm leading-7 text-[#8B93A6]">
                    Ask a constitutional question to see a focused answer with relevant articles,
                    simple explanations, and examples.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#2A3342] bg-[#111827] p-4 text-center"
              >
                <div className="text-3xl font-serif font-bold text-[#F3E2A8]">{stat.number}</div>
                <div className="mt-1 text-sm text-[#8B93A6]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#2A3342] bg-[#111827] p-6">
            <div className="border-b border-[#232C39] pb-4">
              <h3 className="text-lg font-semibold text-white">Schedules Overview</h3>
              <p className="mt-1 text-sm text-[#8B93A6]">
                The Constitution currently contains 12 Schedules covering lists, oaths, subjects, and governance frameworks.
              </p>
            </div>

            <div className="mt-5 max-h-[260px] space-y-3 overflow-y-auto pr-2">
              {constitutionSchedules.map((schedule) => (
                <div
                  key={schedule.number}
                  className="rounded-xl border border-[#232C39] bg-[#0B0F14] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#D4AF37]">
                        Schedule {schedule.number}
                      </p>
                      <h4 className="mt-1 text-base font-semibold text-white">{schedule.title}</h4>
                    </div>
                    <span className="rounded-full border border-[#2A3342] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#8B93A6]">
                      {schedule.relatedArticles}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#BFC6D1]">{schedule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
