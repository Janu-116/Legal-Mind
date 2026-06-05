import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  FileWarning,
  Loader2,
  Scale,
  Search,
  Upload,
  X
} from 'lucide-react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

interface DocumentInfo {
  name: string
  size: string
  type: 'PDF' | 'TXT'
  pages: number | null
  uploadTime: Date
}

interface ExtractedDocument {
  text: string
  pages: number | null
}

interface AnalysisSection {
  title: string
  content: string[]
}

function isAnalysisHeading(line: string) {
  return /^(📄|📋|⚖️|🚨|✅|🗺️|⚠️)\s+/.test(line.trim())
}

function parseAnalysisSections(analysisText: string): AnalysisSection[] {
  const lines = analysisText.split('\n').map((line) => line.trim())
  const sections: AnalysisSection[] = []
  let currentSection: AnalysisSection | null = null

  for (const line of lines) {
    if (!line) {
      continue
    }

    if (isAnalysisHeading(line)) {
      currentSection = { title: line, content: [] }
      sections.push(currentSection)
      continue
    }

    if (!currentSection) {
      currentSection = { title: 'Analysis Overview', content: [] }
      sections.push(currentSection)
    }

    currentSection.content.push(line)
  }

  return sections
}

function cleanAnalysisLine(line: string) {
  return line.replace(/^- /, '').replace(/^\d+\.\s*/, '').trim()
}

function splitAnalysisItem(line: string) {
  const cleanedLine = cleanAnalysisLine(line)
  const separatorIndex = cleanedLine.indexOf(':')

  if (separatorIndex === -1) {
    return {
      title: cleanedLine,
      description: ''
    }
  }

  return {
    title: cleanedLine.slice(0, separatorIndex).trim(),
    description: cleanedLine.slice(separatorIndex + 1).trim()
  }
}

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function isTextFile(file: File) {
  return file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')
}

function formatFileSize(sizeInBytes: number) {
  return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`
}

function readTextFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Could not read the selected text file.'))
    }

    reader.onerror = () => {
      reject(new Error('Could not read the selected text file.'))
    }

    reader.readAsText(file)
  })
}

async function extractTextFromPdf(file: File): Promise<ExtractedDocument> {
  const pdfDocument = await getDocument({ data: await file.arrayBuffer() }).promise
  const pageTexts: string[] = []

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (pageText) {
      pageTexts.push(`Page ${pageNumber}\n${pageText}`)
    }
  }

  return {
    text: pageTexts.join('\n\n'),
    pages: pdfDocument.numPages
  }
}

async function extractTextFromFile(file: File): Promise<ExtractedDocument> {
  if (isPdfFile(file)) {
    return extractTextFromPdf(file)
  }

  if (isTextFile(file)) {
    return {
      text: await readTextFile(file),
      pages: null
    }
  }

  throw new Error('Please upload a PDF or TXT document.')
}

export default function AnalyzeDocument() {
  const [file, setFile] = useState<File | null>(null)
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const analysisRequestIdRef = useRef(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragAreaRef.current?.classList.add('border-gold-400', 'bg-gold-400/5')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragAreaRef.current?.classList.remove('border-gold-400', 'bg-gold-400/5')
  }, [])

  const handleFile = useCallback((selectedFile: File) => {
    if (!isPdfFile(selectedFile) && !isTextFile(selectedFile)) {
      setErrorMessage('Please upload a PDF or TXT document.')
      return
    }

    analysisRequestIdRef.current += 1
    setFile(selectedFile)
    setDocumentInfo({
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      type: isPdfFile(selectedFile) ? 'PDF' : 'TXT',
      pages: null,
      uploadTime: new Date()
    })
    setAnalysis('')
    setErrorMessage('')
    setAnalysisComplete(false)
    setIsAnalyzing(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragAreaRef.current?.classList.remove('border-gold-400', 'bg-gold-400/5')

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }, [handleFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  const startAnalysis = async () => {
    if (!file) {
      return
    }

    const requestId = analysisRequestIdRef.current + 1
    analysisRequestIdRef.current = requestId

    setIsAnalyzing(true)
    setAnalysis('')
    setErrorMessage('')
    setAnalysisComplete(false)

    try {
      const { text: documentText, pages } = await extractTextFromFile(file)

      if (analysisRequestIdRef.current !== requestId) {
        return
      }

      if (!documentText || documentText.trim().length === 0) {
        throw new Error('Could not extract text from the PDF')
      }

      console.log('Extracted document text preview:', documentText.slice(0, 300))

      if (pages !== null) {
        setDocumentInfo((currentDocumentInfo) =>
          currentDocumentInfo
            ? {
                ...currentDocumentInfo,
                pages
              }
            : currentDocumentInfo
        )
      }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentText })
      })

      const data = await response.json() as {
        analysis?: string
        success?: boolean
        error?: string
        details?: string
      }
      const analysis = data?.analysis

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to analyze document.')
      }

      if (!data?.success || typeof analysis !== 'string') {
        throw new Error('The analysis service returned an unexpected response.')
      }

      if (analysisRequestIdRef.current !== requestId) {
        return
      }

      setAnalysis(analysis)
      setAnalysisComplete(true)
    } catch (error) {
      if (analysisRequestIdRef.current !== requestId) {
        return
      }

      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze document.')
      setAnalysisComplete(false)
    } finally {
      if (analysisRequestIdRef.current === requestId) {
        setIsAnalyzing(false)
      }
    }
  }

  const clearDocument = () => {
    analysisRequestIdRef.current += 1
    setFile(null)
    setDocumentInfo(null)
    setIsAnalyzing(false)
    setAnalysis('')
    setErrorMessage('')
    setAnalysisComplete(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const analysisSections = parseAnalysisSections(analysis)
  const documentTypeSection = analysisSections.find((section) => section.title === '📄 Document Type')
  const summarySection = analysisSections.find((section) => section.title === '📋 Summary')
  const keyLegalSection = analysisSections.find(
    (section) => section.title === '⚖️ Key Legal Sections & Clauses'
  )
  const redFlagsSection = analysisSections.find((section) => section.title === '🚨 Red Flags & Risks')
  const favorableSection = analysisSections.find(
    (section) => section.title === '✅ What is in your favour'
  )
  const nextStepsSection = analysisSections.find((section) => section.title === '🗺️ What you should do')
  const lawsSection = analysisSections.find(
    (section) => section.title === '⚖️ Relevant Indian Laws That Apply'
  )
  const disclaimerSection = analysisSections.find(
    (section) => section.title === '⚠️ Just so you know'
  )

  const classificationTitle = documentTypeSection?.content[0] || 'Uploaded Legal Document'
  const executiveSummary = summarySection?.content.join(' ') || analysis
  const keyClauseItems = (keyLegalSection?.content || []).map(splitAnalysisItem)
  const favorableItems = (favorableSection?.content || []).map(cleanAnalysisLine)
  const threatItems = (redFlagsSection?.content || []).map(splitAnalysisItem)
  const statutoryItems = (lawsSection?.content || []).map(cleanAnalysisLine)
  const actionItems = (nextStepsSection?.content || []).map(cleanAnalysisLine)
  const hasEmbeddedDisclaimer = analysisSections.some(
    (section) => section.title === '⚠️ Just so you know'
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Analyze Documents</h1>
          <p className="text-legal-400">
            Upload legal documents to extract clauses, identify risks, and get AI-powered analysis.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            ref={dragAreaRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-legal-600 rounded-3xl p-12 text-center hover:border-gold-400/50 transition-all duration-300 bg-legal-800/30"
          >
            <div className="w-20 h-20 rounded-2xl bg-gold-400/10 flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-gold-400" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Upload Legal Document</h3>
            <p className="text-legal-400 mb-6 max-w-md mx-auto">
              Drag and drop your PDF or TXT file here, or click to browse. We support employment
              contracts, rental agreements, NDAs, and other legal documents.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,text/plain"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-legal-900 font-semibold rounded-xl cursor-pointer hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20"
            >
              <FileText className="w-5 h-5" />
              Choose PDF or TXT File
            </label>

            <p className="text-xs text-legal-500 mt-4">Maximum file size: 50MB • PDF and TXT only</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-legal-800/50 rounded-2xl p-6 border border-legal-600/30"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-red-400/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-red-400" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{documentInfo?.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-legal-400 mt-1">
                    <span>{documentInfo?.type}</span>
                    <span>{documentInfo?.size}</span>
                    {documentInfo?.pages !== null && <span>{documentInfo?.pages} pages</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Uploaded {documentInfo?.uploadTime.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isAnalyzing && (
                  <button
                    onClick={startAnalysis}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-legal-900 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-300 transition-all duration-300"
                  >
                    <Search className="w-5 h-5" />
                    {analysisComplete ? 'Analyze Again' : 'Analyze Document'}
                  </button>
                )}

                {isAnalyzing && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-legal-700 rounded-xl">
                    <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
                    <span className="text-white">Analyzing...</span>
                  </div>
                )}

                <button
                  onClick={clearDocument}
                  className="p-3 text-legal-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  aria-label="Clear document"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="h-2 bg-legal-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-400 to-gold-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-sm text-legal-400">
            <span>Extracting text...</span>
            <span>Preparing document...</span>
            <span>Analyzing clauses...</span>
            <span>Generating report...</span>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-red-400/10 border border-red-400/20"
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-300">Analysis failed</h3>
            <p className="text-sm text-red-200/90 mt-1">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {analysisComplete && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-[#2A3342] bg-[#0B0F14] p-6 md:p-8">
            <div className="border-b border-[#232C39] pb-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">Analysis Report</p>
              <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#F3F4F6]">Analysis Report</h2>
                  <p className="mt-2 text-sm text-[#9CA3AF]">
                    Structured legal review generated for {documentInfo?.name}
                    {documentInfo?.pages !== null ? ` • ${documentInfo?.pages} pages` : ''}
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.28em] text-[#6B7280]">
                  Processed from uploaded {documentInfo?.type} document
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(300px,1fr)]">
              <div className="space-y-6">
                <section className="rounded-xl border border-[#3A3020] bg-[#111827] p-6">
                  <div className="flex flex-col gap-4 border-b border-[#232C39] pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
                        Classification
                      </p>
                      <h3 className="mt-3 text-3xl font-serif font-bold text-[#F3F4F6]">
                        {classificationTitle}
                      </h3>
                    </div>
                    <span className="inline-flex w-fit rounded-md border border-[#9A7B24] bg-[#D4AF37] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#111827]">
                      High Priority
                    </span>
                  </div>

                  <div className="pt-5">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#8B93A6]">
                      Executive Summary
                    </p>
                    <div className="mt-4 max-h-48 overflow-y-auto pr-2 text-sm leading-7 text-[#D1D5DB]">
                      <p>{executiveSummary}</p>
                    </div>
                  </div>
                </section>

                {keyClauseItems.length > 0 && (
                  <section className="rounded-xl border border-[#2A3342] bg-[#111827] p-6">
                    <div className="flex items-center gap-3 border-b border-[#232C39] pb-4">
                      <Scale className="h-4 w-4 text-[#D4AF37]" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                        Key Legal Sections & Clauses
                      </h3>
                    </div>

                    <div className="mt-6 grid max-h-[24rem] gap-4 overflow-y-auto pr-2 md:grid-cols-2">
                      {keyClauseItems.map((item, index) => (
                        <article
                          key={`${item.title}-${index}`}
                          className="rounded-xl border border-[#232C39] bg-[#0F1722] p-4"
                        >
                          <h4 className="text-base font-semibold text-[#F3F4F6]">{item.title}</h4>
                          {item.description && (
                            <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">{item.description}</p>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {favorableItems.length > 0 && (
                  <section className="rounded-xl border border-[#2A3342] bg-[#111827] p-6">
                    <div className="flex items-center gap-3 border-b border-[#232C39] pb-4">
                      <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                        Favorable Points
                      </h3>
                    </div>

                    <div className="mt-5 max-h-[20rem] space-y-4 overflow-y-auto pr-2">
                      {favorableItems.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex items-start gap-3 border-b border-[#1F2937] pb-4 last:border-b-0 last:pb-0"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#A88A2A]" />
                          <p className="text-sm leading-7 text-[#D1D5DB]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="space-y-6">
                {threatItems.length > 0 && (
                  <section className="rounded-xl border border-[#2A3342] bg-[#111827] p-6">
                    <div className="border-b border-[#232C39] pb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                        Threat Assessment
                      </h3>
                    </div>

                    <div className="mt-5 max-h-[24rem] space-y-4 overflow-y-auto pr-2">
                      {threatItems.map((item, index) => {
                        const isCritical = index % 2 === 0

                        return (
                          <article
                            key={`${item.title}-${index}`}
                            className={`rounded-xl border p-4 ${
                              isCritical
                                ? 'border-[#6B3341] bg-[#1B1317]'
                                : 'border-[#6B5A2D] bg-[#1A1710]'
                            }`}
                          >
                            <p
                              className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${
                                isCritical ? 'text-[#D88A98]' : 'text-[#D1AF58]'
                              }`}
                            >
                              {isCritical ? 'Critical Risk' : 'Moderate Concern'}
                            </p>
                            <h4 className="mt-3 text-base font-semibold text-[#F3F4F6]">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="mt-2 text-sm leading-6 text-[#B8BEC9]">{item.description}</p>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  </section>
                )}

                {statutoryItems.length > 0 && (
                  <section className="rounded-xl border border-[#2A3342] bg-[#111827] p-6">
                    <div className="border-b border-[#232C39] pb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                        Statutory Framework
                      </h3>
                    </div>

                    <div className="mt-4 max-h-56 overflow-y-auto pr-2">
                      {statutoryItems.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex items-start gap-3 border-b border-[#1F2937] py-3 last:border-b-0"
                        >
                          <Scale className="mt-1 h-4 w-4 flex-shrink-0 text-[#8B93A6]" />
                          <p className="text-sm leading-6 text-[#D1D5DB]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {actionItems.length > 0 && (
                  <section className="rounded-xl border border-[#3A3020] bg-[#111827] p-6">
                    <div className="flex items-center gap-3 border-b border-[#232C39] pb-4">
                      <AlertTriangle className="h-4 w-4 text-[#D4AF37]" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
                        Actionable Next Steps
                      </h3>
                    </div>

                    <div className="mt-5 max-h-[22rem] space-y-3 overflow-y-auto pr-2">
                      {actionItems.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex items-start gap-4 border-b border-[#1F2937] py-4 last:border-b-0"
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#6B5A2D] text-xs font-semibold text-[#D4AF37]">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                          <p className="pt-1 text-sm leading-6 text-[#F3F4F6]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </aside>
            </div>

            {disclaimerSection && (
              <div className="mt-6 rounded-xl border border-[#2A3342] bg-[#111827] p-5">
                <div className="flex items-start gap-3">
                  <FileWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                      Just so you know
                    </h3>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-[#9CA3AF]">
                      {disclaimerSection.content.map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!hasEmbeddedDisclaimer && (
            <div className="rounded-xl border border-[#2A3342] bg-[#111827] p-5">
              <div className="flex items-start gap-3">
                <FileWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#D4AF37]" />
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                    Important Disclaimer
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#9CA3AF]">
                    This AI analysis is for informational purposes only and does not constitute legal
                    advice. Always consult with a qualified legal professional before making decisions
                    based on document analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
