import { Briefcase, Download, FolderOpen, Scale, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import StudyPageHeader from '@/components/StudyPageHeader'
import { useStudyApp } from '@/context/StudyAppContext'
import { downloadCaseBrief, studyUiText, translateText } from '@/lib/studyUtils'

export default function MyStudyFolder() {
  const { language, savedItems, removeSavedItem } = useStudyApp()
  const ui = studyUiText[language]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <StudyPageHeader
        title={ui.studyFolderHeading}
        titleHi={ui.studyFolderHeading}
        description={ui.studyFolderIntro}
        descriptionHi={ui.studyFolderIntro}
      />

      {savedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-legal-600/50 bg-legal-800/40 px-6 py-12 text-center">
          <FolderOpen className="mx-auto mb-4 h-14 w-14 text-legal-500" />
          <h2 className="text-xl font-semibold text-white">{ui.noSavedItems}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-legal-400">{ui.noSavedItemsBody}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedItems.map((item, index) => {
            const payload = item.payload

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-legal-600/30 bg-legal-800/50 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
                        {payload.kind === 'precedent' ? (
                          <>
                            <Scale className="mr-1 inline h-3.5 w-3.5" />
                            Precedent
                          </>
                        ) : (
                          <>
                            <Briefcase className="mr-1 inline h-3.5 w-3.5" />
                            Case Study
                          </>
                        )}
                      </span>
                      <span className="text-xs uppercase tracking-[0.22em] text-legal-500">
                        {ui.savedOn} {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        {translateText(language, item.title, item.titleHi)}
                      </h2>
                      {(item.subtitle || item.subtitleHi) && (
                        <p className="mt-1 text-sm text-gold-300">
                          {translateText(language, item.subtitle || '', item.subtitleHi)}
                        </p>
                      )}
                    </div>

                    {payload.kind === 'precedent' ? (
                      <>
                        <p className="text-sm text-legal-300">
                          {translateText(
                            language,
                            payload.summary,
                            payload.summaryHi
                          )}
                        </p>
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gold-400">
                              {ui.legalAnalysis}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-legal-300">
                              {payload.legalAnalysis}
                            </p>
                          </div>
                          <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gold-400">
                              {ui.whatThisMeans}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-legal-300">
                              {translateText(
                                language,
                                payload.whatThisMeans,
                                payload.whatThisMeansHi
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-legal-300">
                          {translateText(
                            language,
                            payload.summary,
                            payload.summaryHi
                          )}
                        </p>
                        <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-gold-400">
                            {ui.caseBackground}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-legal-300">
                            {payload.facts}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {payload.kind === 'case-study' && (
                      <button
                        onClick={() => downloadCaseBrief(payload)}
                        className="flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/10 px-4 py-3 text-sm text-gold-300 transition-all hover:bg-gold-400/15"
                      >
                        <Download className="h-4 w-4" />
                        {ui.downloadBrief}
                      </button>
                    )}

                    <button
                      onClick={() => removeSavedItem(item.id)}
                      className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200 transition-all hover:bg-red-400/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      {ui.remove}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
