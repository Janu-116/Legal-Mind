import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Award,
  Copy,
  Check,
  Bookmark,
  Sparkles
} from 'lucide-react'
import { precedentCases } from '../data/constitutionData'
import StudyPageHeader from '@/components/StudyPageHeader'
import { useStudyApp, type SavedStudyItem } from '@/context/StudyAppContext'
import { studyUiText, translateText } from '@/lib/studyUtils'

type ViewMode = 'student' | 'citizen'
type TabKey = 'summary' | 'legalAnalysis' | 'impact' | 'meaning'
type BasePrecedentCase = (typeof precedentCases)[number]

interface PrecedentDetail {
  category: string
  categoryHi: string
  summaryHi: string
  legalAnalysis: string
  impact: string
  whatThisMeans: string
  whatThisMeansHi: string
}

interface EnrichedPrecedentCase extends BasePrecedentCase {
  category: string
  categoryHi: string
  summaryHi: string
  legalAnalysis: string
  impact: string
  whatThisMeans: string
  whatThisMeansHi: string
  court: string
  year: number
}

const VIEW_MODE_STORAGE_KEY = 'legal-mind-ai.precedent-view-mode'

const precedentDetails: Record<string, PrecedentDetail> = {
  'Kesavananda Bharati v. State of Kerala (1973)': {
    category: 'Constitutional Law',
    categoryHi: 'संवैधानिक विधि',
    summaryHi:
      'इस निर्णय ने बेसिक स्ट्रक्चर सिद्धांत स्थापित किया। संसद संविधान में संशोधन कर सकती है, लेकिन उसके मूल ढांचे को नष्ट नहीं कर सकती।',
    legalAnalysis:
      'The majority drew a line between the amending power under Article 368 and the identity of the Constitution itself. Ratio decidendi: Parliament can amend any provision, but not in a way that damages the Constitution’s basic structure. Obiter across the opinions emphasized institutional balance, limited government, and judicial review as structural safeguards.',
    impact:
      'Kesavananda remains the foundation for later cases such as Minerva Mills, NJAC, and I.R. Coelho. It is repeatedly cited whenever courts test amendments affecting democracy, federalism, judicial review, or separation of powers.',
    whatThisMeans:
      'This is why no government can legally rewrite the Constitution in a way that destroys core freedoms or removes checks on power.',
    whatThisMeansHi:
      'इसी वजह से कोई भी सरकार संविधान को इस तरह नहीं बदल सकती कि मूल अधिकार या सत्ता पर नियंत्रण पूरी तरह खत्म हो जाए।'
  },
  'Maneka Gandhi v. Union of India (1978)': {
    category: 'Civil Rights',
    categoryHi: 'नागरिक अधिकार',
    summaryHi:
      'इस फैसले ने अनुच्छेद 21 की व्याख्या बहुत व्यापक कर दी। अदालत ने कहा कि किसी भी प्रक्रिया को न्यायसंगत, उचित और गैर-मनमानी होना चाहिए।',
    legalAnalysis:
      'The Court linked Articles 14, 19, and 21 into a “golden triangle,” rejecting narrow procedure-only readings. Ratio: any law depriving liberty must be just, fair, and reasonable, not arbitrary. The case also expanded natural justice principles in administrative action.',
    impact:
      'Maneka Gandhi shaped later jurisprudence on privacy, travel, prison rights, dignity, and due process. Courts cite it to test whether state action is fair in substance, not merely lawful in form.',
    whatThisMeans:
      'This is why authorities cannot restrict your liberty through a procedure that is technically legal but fundamentally unfair.',
    whatThisMeansHi:
      'इसी वजह से कोई भी प्राधिकरण आपकी स्वतंत्रता को ऐसी प्रक्रिया से सीमित नहीं कर सकता जो कागज पर कानूनी हो लेकिन असल में अन्यायपूर्ण हो।'
  },
  'Vishaka v. State of Rajasthan (1997)': {
    category: 'Gender Justice',
    categoryHi: 'लैंगिक न्याय',
    summaryHi:
      'इस फैसले ने कार्यस्थल पर यौन उत्पीड़न को मौलिक अधिकारों का उल्लंघन माना। जब तक कानून नहीं बना, अदालत ने सुरक्षा के लिए दिशानिर्देश तय किए।',
    legalAnalysis:
      'The Court used constitutional guarantees under Articles 14, 15, 19, and 21 alongside international norms to fill a legislative gap. Ratio: employers and institutions have a positive duty to prevent sexual harassment and create complaint mechanisms. The judgment is a classic example of constitutional remedies driving institutional compliance.',
    impact:
      'Vishaka directly led to the 2013 workplace sexual harassment statute and continues to influence employer compliance standards, internal committees, and liability assessment in service and constitutional litigation.',
    whatThisMeans:
      'This is why workplaces need formal complaint systems and cannot ignore sexual harassment as a “personal matter.”',
    whatThisMeansHi:
      'इसी वजह से हर कार्यस्थल पर शिकायत व्यवस्था होना जरूरी है और यौन उत्पीड़न को “निजी मामला” कहकर नजरअंदाज नहीं किया जा सकता।'
  },
  'Puttaswamy v. Union of India (2017)': {
    category: 'Privacy & Liberty',
    categoryHi: 'गोपनीयता और स्वतंत्रता',
    summaryHi:
      'अदालत ने माना कि निजता का अधिकार मौलिक अधिकार है। यह निर्णय व्यक्ति की गरिमा, स्वायत्तता और निजी जीवन की सुरक्षा को मजबूत करता है।',
    legalAnalysis:
      'The nine-judge bench treated privacy as intrinsic to liberty, dignity, and autonomy under Part III. Ratio: privacy is a fundamental right, subject only to lawful, necessary, and proportionate restrictions. The opinions laid groundwork for data protection, bodily autonomy, and informational privacy analysis.',
    impact:
      'Puttaswamy has become the leading authority in Aadhaar, surveillance, reproductive rights, digital governance, and personal autonomy disputes. It is now central to proportionality review in rights litigation.',
    whatThisMeans:
      'This is why the state must justify invasive data collection, surveillance, and bodily intrusions instead of assuming unlimited access to private life.',
    whatThisMeansHi:
      'इसी वजह से सरकार को निगरानी, डेटा संग्रह या निजी जीवन में दखल देने से पहले मजबूत कानूनी और संवैधानिक आधार दिखाना पड़ता है।'
  },
  'Navtej Singh Johar v. Union of India (2018)': {
    category: 'Civil Rights',
    categoryHi: 'नागरिक अधिकार',
    summaryHi:
      'इस फैसले ने वयस्कों के बीच सहमति से बने समलैंगिक संबंधों को अपराध की श्रेणी से बाहर कर दिया। अदालत ने गरिमा, समानता और पहचान की रक्षा की।',
    legalAnalysis:
      'The Court held that criminalizing consensual same-sex intimacy violated dignity, privacy, equality, and expression. Ratio: Section 377 could not survive constitutional scrutiny to the extent it targeted consenting adults. The opinions also rejected majoritarian morality as a constitutional standard.',
    impact:
      'Navtej is a defining precedent for LGBTQ+ equality, anti-discrimination discourse, and dignity-based constitutional interpretation. It is frequently cited in debates on identity, autonomy, and equal citizenship.',
    whatThisMeans:
      'This is why the law cannot treat consenting adult relationships as criminal just because a social majority disapproves.',
    whatThisMeansHi:
      'इसी वजह से केवल सामाजिक असहमति के आधार पर वयस्कों के सहमति वाले निजी संबंधों को अपराध नहीं बनाया जा सकता।'
  },
  'Joseph Shine v. Union of India (2018)': {
    category: 'Gender Justice',
    categoryHi: 'लैंगिक न्याय',
    summaryHi:
      'इस निर्णय ने व्यभिचार को अपराध मानने वाले प्रावधान को खत्म कर दिया। अदालत ने कहा कि महिलाओं को पुरुष की संपत्ति की तरह नहीं देखा जा सकता।',
    legalAnalysis:
      'The Court found Section 497 paternalistic and inconsistent with equality and dignity. Ratio: criminal law cannot enforce a patriarchal conception of marriage that deprives women of agency. The judgment also distinguished civil matrimonial wrongs from criminal punishment.',
    impact:
      'Joseph Shine is cited in cases involving autonomy, dignity, and gender-equal interpretation of family law norms. It also informs broader anti-stereotyping jurisprudence.',
    whatThisMeans:
      'This is why criminal law cannot be used to control private adult relationships through outdated ideas of ownership and morality.',
    whatThisMeansHi:
      'इसी वजह से आपराधिक कानून का इस्तेमाल पुराने पितृसत्तात्मक विचारों के आधार पर निजी संबंधों को नियंत्रित करने के लिए नहीं किया जा सकता।'
  },
  'Sabarimala Temple Entry (2018)': {
    category: 'Religious Freedom',
    categoryHi: 'धार्मिक स्वतंत्रता',
    summaryHi:
      'अदालत ने कहा कि महिलाओं को उम्र के आधार पर मंदिर प्रवेश से रोकना भेदभावपूर्ण है। धार्मिक प्रथा भी संविधान के समानता सिद्धांत से ऊपर नहीं है।',
    legalAnalysis:
      'The majority tested the exclusionary practice against equality, dignity, and essential religious practice analysis. Ratio: a denominational claim cannot override constitutional guarantees where exclusion is discriminatory. The case also sharpened the tension between religious autonomy and equal citizenship.',
    impact:
      'Sabarimala continues to influence debates on temple entry, denominational rights, and gender equality in faith spaces. Its reasoning remains central in review and parallel religious-rights litigation.',
    whatThisMeans:
      'This is why institutions claiming religious freedom may still face constitutional scrutiny if they exclude people unfairly.',
    whatThisMeansHi:
      'इसी वजह से धार्मिक स्वतंत्रता का दावा करने वाली संस्थाएं भी संविधान के तहत जांच से नहीं बच सकतीं यदि वे लोगों को अनुचित रूप से बाहर करती हैं।'
  },
  'Aadhaar Case (2019)': {
    category: 'Privacy & Liberty',
    categoryHi: 'गोपनीयता और स्वतंत्रता',
    summaryHi:
      'अदालत ने आधार कानून को सीमित रूप में वैध माना, लेकिन कुछ प्रावधान रद्द किए। फैसला कल्याण योजनाओं और निजता के बीच संतुलन खोजने की कोशिश करता है।',
    legalAnalysis:
      'The Court accepted Aadhaar for targeted welfare delivery but applied constitutional limits to data use and private-sector expansion. Ratio: identity architecture can survive if backed by law and bounded by proportionality. The dissent strongly emphasized surveillance and exclusion risks.',
    impact:
      'Aadhaar is repeatedly cited in disputes about digital ID, welfare authentication, surveillance safeguards, and data minimization. It remains a practical bridge between Puttaswamy and later digital-rights litigation.',
    whatThisMeans:
      'This is why digital identity systems may be allowed, but the government still has to justify how far your personal data can be used.',
    whatThisMeansHi:
      'इसी वजह से डिजिटल पहचान व्यवस्था वैध हो सकती है, लेकिन सरकार को यह भी बताना पड़ता है कि आपके निजी डेटा का उपयोग कितनी सीमा तक किया जा सकता है।'
  },
  'Ayodhya Verdict (2019)': {
    category: 'Governance',
    categoryHi: 'शासन और संस्थान',
    summaryHi:
      'अदालत ने विवादित भूमि पर हिंदू पक्ष का दावा माना और मुस्लिम पक्ष के लिए वैकल्पिक भूमि देने का निर्देश दिया। यह फैसला ऐतिहासिक, धार्मिक और संपत्ति दावों के जटिल संतुलन पर आधारित था।',
    legalAnalysis:
      'The judgment relied on title principles, evidentiary assessment, archaeological material, and long possession claims while separating faith from the legal question of ownership. Ratio: civil title had to be resolved on evidence, even in a dispute shaped by deep religious significance.',
    impact:
      'Ayodhya has influenced public law conversations around historical wrongs, remedies, secular governance, and judicial management of high-conflict identity disputes.',
    whatThisMeans:
      'This is why even emotionally charged religious disputes still have to be resolved through evidence, title, and enforceable legal remedies.',
    whatThisMeansHi:
      'इसी वजह से बेहद संवेदनशील धार्मिक विवाद भी अंततः साक्ष्य, स्वामित्व और लागू कानूनी उपचारों के आधार पर तय होते हैं।'
  },
  'Maratha Reservation Case (2021)': {
    category: 'Governance',
    categoryHi: 'शासन और संस्थान',
    summaryHi:
      'इस फैसले ने मराठा आरक्षण कानून को रद्द कर दिया और 50% आरक्षण सीमा को फिर से मजबूत किया। अदालत ने असाधारण परिस्थितियों की सीमा स्पष्ट की।',
    legalAnalysis:
      'The Court reaffirmed the continuing authority of Indra Sawhney and rejected the state’s attempt to justify a separate exceptional class. Ratio: reservation beyond the established cap needs constitutionally sustainable exceptional circumstances and evidence.',
    impact:
      'The case is central to reservation policy debates across states and is cited whenever legislatures attempt category-specific expansion without a clear constitutional foundation.',
    whatThisMeans:
      'This is why reservation policy changes must be backed by strong constitutional reasoning and solid data, not only political demand.',
    whatThisMeansHi:
      'इसी वजह से आरक्षण नीति में बदलाव केवल राजनीतिक मांग से नहीं, बल्कि ठोस संवैधानिक आधार और विश्वसनीय आंकड़ों से समर्थित होना चाहिए।'
  },
  'Right to Die with Dignity (2018)': {
    category: 'Privacy & Liberty',
    categoryHi: 'गोपनीयता और स्वतंत्रता',
    summaryHi:
      'अदालत ने गरिमा के साथ मृत्यु के अधिकार को अनुच्छेद 21 के दायरे में माना और निष्क्रिय इच्छामृत्यु तथा लिविंग विल को स्वीकार किया।',
    legalAnalysis:
      'The Court extended dignity analysis into end-of-life decision-making and medical autonomy. Ratio: passive euthanasia and advance directives can be recognized within a constitutional framework subject to procedural safeguards. The judgment blends liberty, autonomy, and state oversight concerns.',
    impact:
      'This precedent shapes hospital ethics, end-of-life protocols, and judicial thinking about bodily autonomy. It is frequently discussed in healthcare rights and medical consent debates.',
    whatThisMeans:
      'This is why a person’s dignity and medical choices can still matter even in end-of-life situations, though the law requires safeguards.',
    whatThisMeansHi:
      'इसी वजह से जीवन के अंतिम चरण में भी व्यक्ति की गरिमा और चिकित्सा संबंधी इच्छा महत्वपूर्ण रहती है, हालांकि कानून कुछ सुरक्षा उपाय भी मांगता है।'
  },
  'Triple Talaq Case (2017)': {
    category: 'Gender Justice',
    categoryHi: 'लैंगिक न्याय',
    summaryHi:
      'अदालत ने तत्काल तीन तलाक को असंवैधानिक घोषित किया। इस फैसले ने समानता और मुस्लिम महिलाओं के अधिकारों की रक्षा को मजबूत किया।',
    legalAnalysis:
      'The Court examined whether talaq-e-biddat could claim constitutional protection despite its arbitrary impact on Muslim women. Ratio: the practice violated equality norms and could not be insulated by a broad Article 25 claim. The judgment also reflects the Court’s willingness to test personal law-linked practices through constitutional values.',
    impact:
      'The case shaped legislative reform, women’s rights discourse, and constitutional review of discriminatory personal-law practices. It remains a key reference point in debates on faith and equality.',
    whatThisMeans:
      'This is why a long-standing personal practice can still be struck down if it unfairly strips one side of dignity and equal protection.',
    whatThisMeansHi:
      'इसी वजह से कोई पुरानी व्यक्तिगत या धार्मिक प्रथा भी रद्द की जा सकती है यदि वह एक पक्ष से गरिमा और समान सुरक्षा छीनती हो।'
  },
  'NJAC Case (2015)': {
    category: 'Constitutional Law',
    categoryHi: 'संवैधानिक विधि',
    summaryHi:
      'अदालत ने NJAC और 99वें संशोधन को रद्द कर दिया। निर्णय ने न्यायपालिका की स्वतंत्रता को संविधान की मूल संरचना का हिस्सा माना।',
    legalAnalysis:
      'The Court held that institutional independence in judicial appointments is tied to the basic structure. Ratio: a constitutional amendment that materially compromises judicial independence is invalid even if passed through the formal amendment process.',
    impact:
      'NJAC is repeatedly cited in disputes involving constitutional design, institutional independence, and the reach of the basic structure doctrine. It also continues to shape debates on reforming the collegium system.',
    whatThisMeans:
      'This is why even popular reform proposals can be struck down if they weaken judicial independence too far.',
    whatThisMeansHi:
      'इसी वजह से बहुत लोकप्रिय सुधार प्रस्ताव भी रद्द हो सकते हैं यदि वे न्यायपालिका की स्वतंत्रता को अत्यधिक कमजोर कर दें।'
  },
  'Lily Thomas v. Union of India (2013)': {
    category: 'Governance',
    categoryHi: 'शासन और संस्थान',
    summaryHi:
      'इस फैसले ने दोषसिद्ध सांसदों और विधायकों को अपील लंबित रहने तक पद पर बने रहने की छूट खत्म कर दी। अदालत ने स्वतः अयोग्यता को लागू माना।',
    legalAnalysis:
      'The Court invalidated the statutory protection that postponed disqualification after conviction. Ratio: once the constitutional and statutory conditions for disqualification are triggered, Parliament cannot create a shield that defeats the scheme.',
    impact:
      'Lily Thomas is central to electoral accountability and criminalization of politics debates. It is cited whenever lawmakers seek procedural insulation from consequences after conviction.',
    whatThisMeans:
      'This is why convicted legislators cannot automatically keep office just by filing an appeal.',
    whatThisMeansHi:
      'इसी वजह से दोषसिद्ध जनप्रतिनिधि केवल अपील दायर करके अपने पद पर स्वतः बने नहीं रह सकते।'
  },
  'Vodafone Case (2012)': {
    category: 'Economic Law',
    categoryHi: 'आर्थिक विधि',
    summaryHi:
      'इस फैसले में अदालत ने कहा कि विदेशी कंपनियों के बीच ऑफशोर सौदे पर भारत कर नहीं लगा सकता, यदि कराधान का स्पष्ट कानूनी आधार न हो।',
    legalAnalysis:
      'The Court focused on statutory interpretation, territorial nexus, and certainty in tax law. Ratio: tax liability must rest on clear legislative authority, especially in cross-border transactions. The decision underscored predictability in international taxation.',
    impact:
      'Vodafone remains a reference point in tax certainty, retrospective taxation debates, and the legal treatment of cross-border corporate structuring.',
    whatThisMeans:
      'This is why tax authorities need a clear legal basis before taxing complex international transactions.',
    whatThisMeansHi:
      'इसी वजह से कर विभाग को जटिल अंतरराष्ट्रीय लेन-देन पर कर लगाने से पहले स्पष्ट कानूनी आधार दिखाना पड़ता है।'
  }
}

function getCaseYear(title: string, citation: string) {
  const titleYear = title.match(/\((\d{4})\)/)?.[1]
  const citationYear = citation.match(/(\d{4})/)?.[1]
  return Number(titleYear || citationYear || '0')
}

function createPrecedentCitation(caseItem: EnrichedPrecedentCase) {
  return `${caseItem.title}, ${caseItem.citation}, ${caseItem.court}, ${caseItem.year}`
}

export default function PrecedentCases() {
  const { language, isSaved, toggleSavedItem } = useStudyApp()
  const ui = studyUiText[language]
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedCase, setExpandedCase] = useState<string | null>(null)
  const [copiedCase, setCopiedCase] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') {
      return 'student'
    }

    return window.localStorage.getItem(VIEW_MODE_STORAGE_KEY) === 'citizen' ? 'citizen' : 'student'
  })
  const [activeTabs, setActiveTabs] = useState<Record<string, TabKey>>({})

  useEffect(() => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode)
  }, [viewMode])

  const enrichedCases = useMemo<EnrichedPrecedentCase[]>(
    () =>
      precedentCases.map((caseItem) => {
        const details = precedentDetails[caseItem.title]

        return {
          ...caseItem,
          category: details.category,
          categoryHi: details.categoryHi,
          summaryHi: details.summaryHi,
          legalAnalysis: details.legalAnalysis,
          impact: details.impact,
          whatThisMeans: details.whatThisMeans,
          whatThisMeansHi: details.whatThisMeansHi,
          court: 'Supreme Court of India',
          year: getCaseYear(caseItem.title, caseItem.citation)
        }
      }),
    []
  )

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>()

    enrichedCases.forEach((caseItem) => {
      uniqueCategories.set(caseItem.category, caseItem.categoryHi)
    })

    return [{ label: 'All', labelHi: 'सभी' }, ...Array.from(uniqueCategories, ([label, labelHi]) => ({ label, labelHi }))]
  }, [enrichedCases])

  const filteredCases = useMemo(() => {
    let filtered = enrichedCases

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((caseItem) => caseItem.category === selectedCategory)
    }

    if (!searchQuery.trim()) {
      return filtered
    }

    const normalizedQuery = searchQuery.toLowerCase()

    return filtered.filter((caseItem) => {
      const haystack = [
        caseItem.title,
        caseItem.citation,
        String(caseItem.year),
        caseItem.category,
        caseItem.categoryHi,
        caseItem.summary,
        caseItem.summaryHi,
        caseItem.significance
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [enrichedCases, searchQuery, selectedCategory])

  const copyCitation = async (caseItem: EnrichedPrecedentCase) => {
    await navigator.clipboard.writeText(createPrecedentCitation(caseItem))
    setCopiedCase(caseItem.title)
    window.setTimeout(() => setCopiedCase(null), 1800)
  }

  const updateTab = (caseTitle: string, tab: TabKey) => {
    setActiveTabs((currentTabs) => ({
      ...currentTabs,
      [caseTitle]: tab
    }))
  }

  const visibleTabs = viewMode === 'student'
    ? [
        { key: 'summary' as const, label: ui.summary },
        { key: 'legalAnalysis' as const, label: ui.legalAnalysis },
        { key: 'impact' as const, label: ui.impact },
        { key: 'meaning' as const, label: ui.whatThisMeans }
      ]
    : [
        { key: 'summary' as const, label: ui.summary },
        { key: 'meaning' as const, label: ui.whatThisMeans }
      ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <StudyPageHeader
        title={ui.precedentHeading}
        titleHi={ui.precedentHeading}
        description={ui.precedentBody}
        descriptionHi={ui.precedentBody}
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-legal-600/30 bg-legal-800/50 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-1">
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('student')}
                  className={`rounded-lg px-4 py-2 text-sm transition-all ${
                    viewMode === 'student'
                      ? 'bg-gold-400 text-legal-900'
                      : 'text-legal-300 hover:bg-legal-700 hover:text-white'
                  }`}
                >
                  {ui.lawStudentView}
                </button>
                <button
                  onClick={() => setViewMode('citizen')}
                  className={`rounded-lg px-4 py-2 text-sm transition-all ${
                    viewMode === 'citizen'
                      ? 'bg-gold-400 text-legal-900'
                      : 'text-legal-300 hover:bg-legal-700 hover:text-white'
                  }`}
                >
                  {ui.citizenView}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-legal-600/30 bg-legal-900/70 px-4 py-3 text-sm text-legal-300">
              <Sparkles className="mr-2 inline h-4 w-4 text-gold-400" />
              {viewMode === 'student'
                ? 'Ratio, obiter, doctrinal impact, and practical citizen meaning in one place.'
                : translateText(
                    language,
                    'Plain-language summaries and practical rights impact for everyday understanding.',
                    'सरल भाषा में सारांश और व्यावहारिक असर, ताकि नागरिक आसानी से समझ सकें।'
                  )}
            </div>
          </div>

          <div className="relative flex-1 xl:max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-legal-400" />
            <input
              type="text"
              placeholder={ui.searchPrecedents}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-legal-600 bg-legal-900/80 py-3 pl-12 pr-4 text-white placeholder:text-legal-500 focus:border-gold-400/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => setSelectedCategory(category.label)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                selectedCategory === category.label
                  ? 'bg-gold-400 text-legal-900'
                  : 'border border-legal-600 bg-legal-900 text-legal-300 hover:bg-legal-700'
              }`}
            >
              {translateText(language, category.label, category.labelHi)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {filteredCases.map((caseItem, index) => {
            const isExpanded = expandedCase === caseItem.title
            const activeTab = activeTabs[caseItem.title] || 'summary'
            const bookmarkId = `precedent:${caseItem.title}`
            const precedentBookmark: SavedStudyItem = {
              id: bookmarkId,
              title: caseItem.title,
              subtitle: createPrecedentCitation(caseItem),
              subtitleHi: createPrecedentCitation(caseItem),
              savedAt: new Date().toISOString(),
              payload: {
                kind: 'precedent',
                title: caseItem.title,
                citation: caseItem.citation,
                court: caseItem.court,
                year: caseItem.year,
                category: caseItem.category,
                categoryHi: caseItem.categoryHi,
                summary: caseItem.summary,
                summaryHi: caseItem.summaryHi,
                legalAnalysis: caseItem.legalAnalysis,
                impact: caseItem.impact,
                whatThisMeans: caseItem.whatThisMeans,
                whatThisMeansHi: caseItem.whatThisMeansHi
              }
            }

            return (
              <motion.div
                key={caseItem.title}
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
                    onClick={() => {
                      setExpandedCase(isExpanded ? null : caseItem.title)
                      if (!activeTabs[caseItem.title]) {
                        updateTab(caseItem.title, 'summary')
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
                            {translateText(language, caseItem.category, caseItem.categoryHi)}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-legal-400">
                            <BookOpen className="h-4 w-4" />
                            {caseItem.citation}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-legal-400">
                            <Users className="h-4 w-4" />
                            {caseItem.bench}
                          </span>
                          <span className="rounded-full border border-legal-600/30 bg-legal-900 px-3 py-1 text-xs text-legal-300">
                            {caseItem.year}
                          </span>
                        </div>

                        <div className="mb-2 flex items-center gap-3">
                          <Award className="h-5 w-5 text-gold-400" />
                          <h2 className="text-xl font-semibold text-white">{caseItem.title}</h2>
                        </div>

                        <p className="text-sm leading-relaxed text-legal-300">
                          {translateText(language, caseItem.summary, caseItem.summaryHi)}
                        </p>
                      </div>

                      <button className="p-2 text-legal-400 transition-colors hover:text-white">
                        {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => copyCitation(caseItem)}
                      className="flex items-center gap-2 rounded-xl border border-gold-400/20 bg-gold-400/10 px-4 py-3 text-sm text-gold-300 transition-all hover:bg-gold-400/15"
                    >
                      {copiedCase === caseItem.title ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copiedCase === caseItem.title ? ui.copied : ui.citeThisCase}
                    </button>

                    <button
                      onClick={() => toggleSavedItem(precedentBookmark)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all ${
                        isSaved(bookmarkId)
                          ? 'border-gold-400/30 bg-gold-400/20 text-gold-200'
                          : 'border-legal-600/30 bg-legal-900 text-legal-300 hover:border-gold-400/20 hover:text-gold-300'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      {isSaved(bookmarkId) ? ui.saved : ui.save}
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
                        <div className="flex flex-wrap gap-2">
                          {visibleTabs.map((tab) => (
                            <button
                              key={tab.key}
                              onClick={() => updateTab(caseItem.title, tab.key)}
                              className={`rounded-xl px-4 py-3 text-sm transition-all ${
                                activeTab === tab.key
                                  ? 'bg-gold-400 text-legal-900'
                                  : 'border border-legal-600 bg-legal-900 text-legal-300 hover:bg-legal-700'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {activeTab === 'summary' && (
                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">
                            <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-5">
                              <p className="text-xs uppercase tracking-[0.22em] text-gold-400">
                                {ui.citizenSummaryLabel}
                              </p>
                              <p className="mt-3 text-sm leading-relaxed text-legal-300">
                                {translateText(language, caseItem.summary, caseItem.summaryHi)}
                              </p>
                            </div>
                            <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-5">
                              <p className="text-xs uppercase tracking-[0.22em] text-gold-400">Outcome</p>
                              <p className="mt-3 text-sm leading-relaxed text-legal-300">
                                {caseItem.outcome}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {caseItem.relatedArticles.map((article: number | string) => (
                                  <span
                                    key={article}
                                    className="rounded-lg border border-legal-600 bg-legal-800 px-3 py-1.5 text-xs text-legal-300"
                                  >
                                    Article {article}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === 'legalAnalysis' && (
                          <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-5">
                            <p className="text-xs uppercase tracking-[0.22em] text-gold-400">
                              {ui.legalAnalysis}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-legal-300">
                              {caseItem.legalAnalysis}
                            </p>
                          </div>
                        )}

                        {activeTab === 'impact' && (
                          <div className="rounded-xl border border-legal-600/30 bg-legal-900/50 p-5">
                            <p className="text-xs uppercase tracking-[0.22em] text-gold-400">
                              {ui.impactSince}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-legal-300">{caseItem.impact}</p>
                          </div>
                        )}

                        {activeTab === 'meaning' && (
                          <div className="rounded-xl border border-gold-400/20 bg-gold-400/10 p-5">
                            <p className="text-xs uppercase tracking-[0.22em] text-gold-300">
                              {ui.whatThisMeans}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-gold-100">
                              {translateText(language, caseItem.whatThisMeans, caseItem.whatThisMeansHi)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredCases.length === 0 && (
        <div className="rounded-2xl border border-dashed border-legal-600/40 bg-legal-800/30 py-14 text-center">
          <Scale className="mx-auto mb-4 h-16 w-16 text-legal-600" />
          <h3 className="text-xl font-semibold text-white">{ui.noCasesFound}</h3>
          <p className="mt-2 text-legal-400">{ui.tryAnotherSearch}</p>
        </div>
      )}
    </div>
  )
}
