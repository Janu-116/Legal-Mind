import type { AppLanguage, SavedCaseStudyPayload } from '@/context/StudyAppContext'

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' }
] as const

export const studyUiText = {
  en: {
    language: 'Language',
    studyFolder: 'My Study Folder',
    saved: 'Saved',
    save: 'Save',
    savedToFolder: 'Saved to folder',
    remove: 'Remove',
    noSavedItems: 'No saved items yet',
    noSavedItemsBody: 'Save precedent cases and case briefs to build your own study folder.',
    openFolder: 'Open Study Folder',
    citeThisCase: 'Cite This Case',
    copied: 'Copied',
    lawStudentView: 'Law Student View',
    citizenView: 'Citizen View',
    searchPrecedents: 'Search cases by name, citation, year, category, or summary...',
    noCasesFound: 'No cases found',
    tryAnotherSearch: 'Try adjusting your search or filter criteria',
    summary: 'Summary',
    legalAnalysis: 'Legal Analysis',
    impact: 'Impact',
    whatThisMeans: 'What This Means For You',
    featuredCases: 'Featured Cases',
    generateCaseStudy: 'Generate Case Study',
    similarSituation: 'Similar Situation Matcher',
    matchSituation: 'Find Matching Case',
    caseStudyPrompt: 'Type any case name, legal topic, or real-life legal problem...',
    situationPrompt: 'Describe a real-life situation like "my landlord will not return deposit"...',
    aiGenerated: 'AI Generated',
    mootCourtMode: 'Moot Court Mode',
    closeMootCourt: 'Close Moot Court',
    plaintiff: 'Arguments for Plaintiff',
    defendant: 'Arguments for Defendant',
    downloadBrief: 'Download Case Brief',
    caseBackground: 'Case Background',
    keyLegalIssues: 'Key Legal Issues',
    argumentsBothSides: 'Arguments on Both Sides',
    courtsReasoning: "Court's Reasoning",
    judgmentOutcome: 'Judgment / Outcome',
    keyTakeaways: 'Key Takeaways',
    relevantLaws: 'Relevant Laws',
    savedOn: 'Saved on',
    studyFolderIntro: 'Review and organize the cases and AI-generated briefs you chose to keep.',
    precedentHeading: 'Precedent Cases',
    precedentBody:
      'Landmark Supreme Court judgments that shaped Indian jurisprudence, with both law-student and citizen-friendly views.',
    caseStudiesHeading: 'Case Studies',
    caseStudiesBody:
      'Explore curated disputes, generate AI case briefs, and practice arguments without leaving the study workspace.',
    studyFolderHeading: 'My Study Folder',
    citizenSummaryLabel: 'Plain-language summary',
    generatedFrom: 'Generated from',
    impactSince: 'How the case continues to matter',
    refreshResponse: 'Generate Again'
  },
  hi: {
    language: 'भाषा',
    studyFolder: 'मेरा स्टडी फोल्डर',
    saved: 'सहेजा गया',
    save: 'सेव करें',
    savedToFolder: 'फोल्डर में सहेजा गया',
    remove: 'हटाएं',
    noSavedItems: 'अभी कोई सहेजा गया आइटम नहीं है',
    noSavedItemsBody: 'अपना स्टडी फोल्डर बनाने के लिए केस और केस ब्रीफ सेव करें।',
    openFolder: 'स्टडी फोल्डर खोलें',
    citeThisCase: 'इस केस को उद्धृत करें',
    copied: 'कॉपी हो गया',
    lawStudentView: 'लॉ स्टूडेंट व्यू',
    citizenView: 'सिटिजन व्यू',
    searchPrecedents: 'नाम, उद्धरण, वर्ष, श्रेणी या सारांश से केस खोजें...',
    noCasesFound: 'कोई केस नहीं मिला',
    tryAnotherSearch: 'खोज या फ़िल्टर बदलकर फिर कोशिश करें',
    summary: 'सारांश',
    legalAnalysis: 'कानूनी विश्लेषण',
    impact: 'प्रभाव',
    whatThisMeans: 'इसका आपके लिए क्या मतलब है',
    featuredCases: 'फ़ीचर्ड केस',
    generateCaseStudy: 'केस स्टडी बनाएं',
    similarSituation: 'मिलती-जुलती स्थिति मैचर',
    matchSituation: 'मिलता-जुलता केस खोजें',
    caseStudyPrompt: 'कोई भी केस नाम, कानूनी विषय या वास्तविक समस्या लिखें...',
    situationPrompt: '"मेरा मकान मालिक जमा राशि वापस नहीं कर रहा" जैसी स्थिति लिखें...',
    aiGenerated: 'एआई जनरेटेड',
    mootCourtMode: 'मूट कोर्ट मोड',
    closeMootCourt: 'मूट कोर्ट बंद करें',
    plaintiff: 'वादी के तर्क',
    defendant: 'प्रतिवादी के तर्क',
    downloadBrief: 'केस ब्रीफ डाउनलोड करें',
    caseBackground: 'केस की पृष्ठभूमि',
    keyLegalIssues: 'मुख्य कानूनी मुद्दे',
    argumentsBothSides: 'दोनों पक्षों के तर्क',
    courtsReasoning: 'न्यायालय का तर्क',
    judgmentOutcome: 'निर्णय / परिणाम',
    keyTakeaways: 'मुख्य सीख',
    relevantLaws: 'संबंधित कानून',
    savedOn: 'सहेजने की तारीख',
    studyFolderIntro: 'यहां अपने सहेजे गए केस और एआई जनरेटेड ब्रीफ व्यवस्थित रखें।',
    precedentHeading: 'प्रिसिडेंट केस',
    precedentBody:
      'ऐसे ऐतिहासिक सुप्रीम कोर्ट निर्णय जिन्होंने भारतीय न्यायशास्त्र को आकार दिया, अब लॉ स्टूडेंट और सिटिजन दोनों व्यू में।',
    caseStudiesHeading: 'केस स्टडीज़',
    caseStudiesBody:
      'क्यूरेटेड विवाद देखें, एआई केस ब्रीफ बनाएं और एक ही स्टडी वर्कस्पेस में दलीलों का अभ्यास करें।',
    studyFolderHeading: 'मेरा स्टडी फोल्डर',
    citizenSummaryLabel: 'सरल भाषा में सारांश',
    generatedFrom: 'किससे बनाया गया',
    impactSince: 'यह केस आज भी क्यों मायने रखता है',
    refreshResponse: 'फिर से बनाएं'
  }
} as const

export function translateText(language: AppLanguage, englishText: string, hindiText?: string) {
  if (language === 'hi' && hindiText) {
    return hindiText
  }

  return englishText
}

export function downloadCaseBrief(payload: SavedCaseStudyPayload) {
  const lines = [
    `Title: ${payload.title}`,
    `Category: ${payload.category}`,
    '',
    'Facts:',
    payload.facts,
    '',
    'Issues:',
    ...payload.issues.map((issue, index) => `${index + 1}. ${issue}`),
    '',
    'Holding:',
    payload.outcome,
    '',
    'Key Takeaways:',
    ...payload.keyTakeaways.map((takeaway, index) => `${index + 1}. ${takeaway}`)
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  const safeTitle = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  link.href = url
  link.download = `${safeTitle || 'case-brief'}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
