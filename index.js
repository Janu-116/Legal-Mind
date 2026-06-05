import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Initialize Groq AI with fallback
const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

// Legal knowledge base
const legalKnowledgeBase = {
  fundamentalRights: `Fundamental Rights (Part III, Articles 12-35) are basic human rights guaranteed to all citizens.

Key rights include:
- Article 14: Equality before law
- Article 15: No discrimination on religion, race, caste, sex, place of birth
- Article 19: Six freedoms (speech, assembly, association, movement, residence, profession)
- Article 21: Right to life and personal liberty (includes privacy, education, clean environment)
- Article 32: Right to constitutional remedies`,

  article21: `Article 21: Protection of Life and Personal Liberty

"No person shall be deprived of his life or personal liberty except according to procedure established by law."

Expanded interpretation includes:
- Right to Privacy (Puttaswamy judgment, 2017)
- Right to Education
- Right to Clean Environment
- Right to Health
- Right to Livelihood
- Right to Die with Dignity (passive euthanasia)
- Right to Sleep
- Right to Speedy Trial`,

  ipc: `Indian Penal Code, 1860 - Key Sections:

Section 302: Murder - Death or life imprisonment
Section 304: Culpable homicide not amounting to murder
Section 306: Abetment of suicide
Section 307: Attempt to murder
Section 375/376: Rape and punishment
Section 378/379: Theft
Section 403/406: Criminal breach of trust
Section 420: Cheating
Section 463-465: Forgery
Section 498A: Cruelty by husband/relatives`,

  crpc: `Code of Criminal Procedure, 1973 - Key Provisions:

Section 154: FIR registration (mandatory for cognizable offenses)
Section 156: Police investigation powers
Section 160: Power to summon witnesses
Section 190: Taking cognizance of offenses by Magistrate
Section 204: Issue of process
Section 313: Examination of accused
Section 320: Compounding of offenses
Section 357: Compensation to victims`,

  constitutionParts: `Constitution of India Structure:

Part I: The Union and its Territory (Articles 1-4)
Part II: Citizenship (Articles 5-11)
Part III: Fundamental Rights (Articles 12-35)
Part IV: Directive Principles (Articles 36-51)
Part IVA: Fundamental Duties (Article 51A)
Part V: The Union (Articles 52-151)
Part VI: The States (Articles 152-237)
Part VIII: The Union Territories (Articles 239-242)
Part IX: The Panchayats (Articles 243-243O)
Part IXA: The Municipalities (Articles 243P-243ZG)
Part X: The Scheduled and Tribal Areas (Articles 244-244A)
Part XI: Relations between Union and States (Articles 245-263)
Part XII: Finance, Property, Contracts and Suits (Articles 264-300A)
Part XIII: Trade, Commerce and Intercourse (Articles 301-307)
Part XIV: Services under Union and States (Articles 308-323)
Part XIVA: Tribunals (Articles 323A-323B)
Part XV: Elections (Articles 324-329A)
Part XVI: Special Provisions (Articles 330-342)
Part XVII: Official Language (Articles 343-351)
Part XVIII: Emergency Provisions (Articles 352-360)
Part XIX: Miscellaneous (Articles 361-367)
Part XX: Amendment of Constitution (Article 368)
Part XXI: Temporary, Transitional and Special Provisions (Articles 369-392)
Part XXII: Short Title, Commencement, Authoritative Text (Articles 393-395)`
}

const NON_LEGAL_REFUSAL =
  "I'm LegalMind AI, your Indian legal assistant. I can only help with legal questions. Please ask me something related to Indian law, your rights, or legal procedures."

const LEGAL_QUERY_PATTERNS = [
  /\blaw\b/i,
  /\blegal\b/i,
  /\blawyer\b/i,
  /\badvocate\b/i,
  /\bcourt\b/i,
  /\bjudge\b/i,
  /\bjudgment\b/i,
  /\bpetition\b/i,
  /\bwrit\b/i,
  /\bright[s]?\b/i,
  /\bconstitution\b/i,
  /\barticle\s*\d+/i,
  /\bsection\s*\d+/i,
  /\bipc\b/i,
  /\bcrpc\b/i,
  /\bbns\b/i,
  /\bbnss\b/i,
  /\bfir\b/i,
  /\bbail\b/i,
  /\barrest\b/i,
  /\bpolice\b/i,
  /\bcomplaint\b/i,
  /\blegal notice\b/i,
  /\bsummons\b/i,
  /\bcontract\b/i,
  /\bagreement\b/i,
  /\btenant\b/i,
  /\blandlord\b/i,
  /\blease\b/i,
  /\bproperty\b/i,
  /\bsale deed\b/i,
  /\bwill\b/i,
  /\bsuccession\b/i,
  /\binheritance?\b/i,
  /\bdivorce\b/i,
  /\bmarriage\b/i,
  /\bmaintenance\b/i,
  /\balimony\b/i,
  /\bcustody\b/i,
  /\bdomestic violence\b/i,
  /\bdowry\b/i,
  /\bharassment\b/i,
  /\bassault\b/i,
  /\bcrime\b/i,
  /\bmurder\b/i,
  /\btheft\b/i,
  /\bcheating\b/i,
  /\bforgery\b/i,
  /\bfraud\b/i,
  /\bcyber\b/i,
  /\bconsumer\b/i,
  /\btax\b/i,
  /\bgst\b/i,
  /\btrademark\b/i,
  /\bcopyright\b/i,
  /\bpatent\b/i,
  /\bcompany\b/i,
  /\blabou?r\b/i,
  /\bsalary\b/i,
  /\btermination\b/i,
  /\bemployment\b/i,
  /\bworkplace\b/i,
  /\binsurance\b/i,
  /\bloan\b/i,
  /\bdebt\b/i,
  /\brecovery\b/i,
  /\bhelmet\b/i,
  /\bseat belt\b/i,
  /\btraffic\b/i,
  /\btraffic police\b/i,
  /\bchallan\b/i,
  /\bdriv(e|ing)\b/i,
  /\bdriving licen[cs]e\b/i,
  /\blicen[cs]e\b/i,
  /\bvehicle\b/i,
  /\bmotor vehicle\b/i,
  /\bbike\b/i,
  /\bcar\b/i,
  /\broad accident\b/i,
  /\baccident\b/i,
  /\bspeed(ing)?\b/i,
  /\bdrunk driving\b/i,
  /\bpuc\b/i,
  /\brc\b/i,
  /\bregistration\b/i,
  /\btow(ed|ing)?\b/i,
  /\bimpound(ed)?\b/i,
  /\bno[- ]parking\b/i,
  /\bparking\b/i,
  /\bfine\b/i,
  /\bmagistrate\b/i,
  /\bsupreme court\b/i,
  /\bhigh court\b/i,
  /\btribunal\b/i,
  /\bpenalty\b/i,
  /\bpunishment\b/i
]

const LEGAL_FOLLOW_UP_PATTERNS = [
  /^(what|how|why|when|where|which|can|could|should|would|will|do|does|did|is|are)\b/i,
  /\bwhat about\b/i,
  /\band if\b/i,
  /\bhow much\b/i,
  /\bcharges?\b/i,
  /\bdocuments?\b/i,
  /\bprocedure\b/i,
  /\bnext step\b/i,
  /\bthen what\b/i,
  /\bretrieve\b/i,
  /\brelease\b/i
]

function getHistoryText(history) {
  if (!Array.isArray(history)) {
    return ''
  }

  return history
    .slice(-6)
    .map((entry) => (typeof entry?.content === 'string' ? entry.content : ''))
    .join(' ')
    .trim()
}

function isLegalFollowUp(message, history) {
  const historyText = getHistoryText(history)

  if (!historyText) {
    return false
  }

  const historyLooksLegal = LEGAL_QUERY_PATTERNS.some((pattern) => pattern.test(historyText))
  const messageLooksLikeFollowUp = LEGAL_FOLLOW_UP_PATTERNS.some((pattern) => pattern.test(message))

  return historyLooksLegal && messageLooksLikeFollowUp
}

function isLikelyLegalQuery(message, history = []) {
  const normalizedMessage = String(message || '').trim()

  if (!normalizedMessage) {
    return false
  }

  if (LEGAL_QUERY_PATTERNS.some((pattern) => pattern.test(normalizedMessage))) {
    return true
  }

  return isLegalFollowUp(normalizedMessage, history)
}

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    if (!isLikelyLegalQuery(message, history)) {
      return res.json({
        response: NON_LEGAL_REFUSAL,
        sources: [],
        isMock: !groqClient
      })
    }

    // Check if API key is configured
    if (!groqClient) {
      const lowerMsg = message.toLowerCase()
      let response = generateMockLegalResponse(lowerMsg)

      return res.json({
        response,
        sources: extractSources(lowerMsg),
        isMock: true
      })
    }

    const systemPrompt = `You are LegalMind AI, an Indian legal assistant.

IMPORTANT RULES:

You ONLY answer questions related to Indian law, legal rights, courts, legal procedures, contracts, FIRs, legal notices, constitutional rights, criminal law, civil law, family law, property law, cyber law, labour law, or any other legal topic.
If the user asks anything that is NOT related to law or legal matters — such as recipes, sports, entertainment, general knowledge, coding, math, or anything else — you must politely refuse and say:
"I'm LegalMind AI, your Indian legal assistant. I can only help with legal questions. Please ask me something related to Indian law, your rights, or legal procedures."
Do NOT answer non-legal questions under any circumstances, even if the user insists.
Do NOT pretend to be any other AI or change your role.

Answer legal questions in a clear, structured, natural-language style that feels like a practical legal explainer.

Your responses should be:
- informative
- easy to understand
- legally relevant
- structured
- natural sounding

## RESPONSE FORMAT
Use this structure when appropriate:

1. Title
2. Indian Law and Regulations
3. Relevant Legal Provision / Section
4. Implications / Consequences
5. Practical Understanding
6. Best Practice / What to do
7. Conclusion
8. Disclaimer

## RULES
- Focus on the exact user question.
- Use Indian legal context.
- Mention legal sections only if relevant.
- Mention penalties only if reasonably known.
- Explain consequences clearly.
- Keep the answer natural and not robotic.
- Avoid generic constitutional overviews unless directly relevant.
- Do not mention random Articles, IPC, CrPC, or Supreme Court cases unless truly useful.
- Do not hallucinate case law, penalties, or legal provisions.
- If exact law varies, clearly mention that it may depend on state-specific rules or facts.
- Do not over-explain simple questions.
- Do not sound like a legal textbook.
- Do not sound like a blog article.
- Sound like a smart legal AI assistant.

## IMPORTANT
If case law is not clearly relevant, do not include it.

## LANGUAGE
If the selected language is not English, answer fully in that language.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(msg => ({ role: msg.role || 'user', content: msg.content })),
      { role: 'user', content: message }
    ]

    const result = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 800,
      temperature: 0.2
    })

    const response = result.choices?.[0]?.message?.content || 'Sorry, I could not generate a response at this time.'


    res.json({
      response,
      sources: extractSources(message),
      isMock: false
    })

  } catch (error) {
    console.error('Chat error:', error)
    // Fallback to mock response
    const response = generateMockLegalResponse(req.body.message?.toLowerCase() || '')
    res.json({ 
      response,
      sources: extractSources(req.body.message || ''),
      isMock: true,
      error: error.message
    })
  }
})

// Document analysis endpoint (mock for demo)
// Document analysis endpoint
const DOCUMENT_ANALYZER_PROMPT = `You are LawGPT, an expert Indian law document analyzer. A user has uploaded a legal document. Analyze it thoroughly and respond in this exact format:

📄 Document Type
[Identify what type of document this is]

📋 Summary
[Explain what this document is about in 3-4 plain simple sentences]

⚖️ Key Legal Sections & Clauses
- [Clause or Section]: [plain language explanation]
- [Clause or Section]: [plain language explanation]

🚨 Red Flags & Risks
[List any unfair, illegal, vague, or missing clauses that could harm the user]

✅ What is in your favour
[List clauses or provisions that protect the user]

🗺️ What you should do
1. [Most important immediate action]
2. [Next step]
3. [Any negotiation points]
4. [Whether to sign, challenge, or get legal help]
5. [Any deadline in the document]

⚖️ Relevant Indian Laws That Apply
- [Exact Act Name, Section Number] — one sentence why it applies

⚠️ Just so you know
This analysis is for informational purposes only. Always get important documents reviewed by a qualified lawyer.`

function extractCompletionText(content) {
  if (typeof content === 'string') {
    return content.trim()
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content
    .map((part) => {
      if (typeof part === 'string') {
        return part
      }

      return typeof part?.text === 'string' ? part.text : ''
    })
    .join('\n')
    .trim()
}

function inferDocumentType(documentText) {
  const lowerText = documentText.toLowerCase()

  if (lowerText.includes('rent agreement') || lowerText.includes('landlord') || lowerText.includes('tenant')) {
    return 'Rental Agreement'
  }

  if (lowerText.includes('legal notice')) {
    return 'Legal Notice'
  }

  if (lowerText.includes('employment') || lowerText.includes('employee') || lowerText.includes('employer')) {
    return 'Employment Agreement'
  }

  if (lowerText.includes('non-disclosure') || lowerText.includes('confidentiality')) {
    return 'Non-Disclosure Agreement'
  }

  return 'Legal Document'
}

function generateMockDocumentAnalysis(documentText) {
  const documentType = inferDocumentType(documentText)

  return `📄 Document Type
${documentType}

📋 Summary
This appears to be a ${documentType.toLowerCase()} based on the uploaded text. The document sets out the main rights, obligations, and restrictions for the parties involved. You should review the payment, termination, liability, and notice terms carefully before relying on it. Important commercial and legal effects may depend on the exact wording and local law.

⚖️ Key Legal Sections & Clauses
- Parties and Subject Matter: Identifies who is bound by the document and what arrangement it governs.
- Payment and Financial Terms: Sets out consideration such as rent, fees, deposit, damages, or reimbursement obligations.
- Duration and Termination: Explains how long the arrangement lasts and how either side can end it.
- Liability and Compliance: Describes risk allocation, duties, and legal compliance expectations.

🚨 Red Flags & Risks
- Check whether any penalty, forfeiture, or unilateral termination term is excessive or one-sided.
- Review whether inspection, entry, default, or dispute clauses give one side disproportionate power.
- Confirm whether refund timelines, repair duties, or notice periods are clearly defined.

✅ What is in your favour
- The document text is readable and structured enough for a clause-by-clause review.
- Core commercial terms appear identifiable from the uploaded content.

🗺️ What you should do
1. Review payment, notice, and termination clauses line by line.
2. Flag any one-sided penalty or forfeiture terms for negotiation.
3. Confirm governing law, jurisdiction, and dispute-cost clauses.
4. Do not sign or rely on the document without checking unclear clauses.
5. Get a lawyer to review the final wording if the document affects money, property, or long-term rights.

⚖️ Relevant Indian Laws That Apply
- Indian Contract Act, 1872 — governs validity, enforceability, fairness, and breach consequences for contracts.

⚠️ Just so you know
This analysis is for informational purposes only. Always get important documents reviewed by a qualified lawyer.`
}

const analyzeDocumentWithGroq = async (documentText) => {
  if (!groqClient) {
    return generateMockDocumentAnalysis(documentText)
  }

  const result = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content: DOCUMENT_ANALYZER_PROMPT
      },
      {
        role: 'user',
        content: `Analyze this legal document:\n\n${documentText}`
      }
    ]
  })

  const analysis = result.choices?.[0]?.message?.content ?? ''

  if (!analysis) {
    throw new Error('The document analysis service returned an empty response.')
  }

  return analysis
}

function extractJsonObject(text) {
  const trimmedText = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
  const directObjectStart = trimmedText.indexOf('{')
  const directObjectEnd = trimmedText.lastIndexOf('}')

  if (directObjectStart === -1 || directObjectEnd === -1) {
    throw new Error('AI response did not contain valid JSON.')
  }

  return JSON.parse(trimmedText.slice(directObjectStart, directObjectEnd + 1))
}

function buildMockCaseStudyResponse(query, language, mode) {
  if (mode === 'moot-court') {
    if (language === 'hi') {
      return {
        plaintiffArguments: [
          'वादी यह तर्क दे सकता है कि रिकॉर्ड और परिस्थितियाँ उसके कानूनी अधिकार का समर्थन करती हैं।',
          'विवादित कार्रवाई से सीधे नुकसान, अनुचित व्यवहार या वैधानिक उल्लंघन हुआ है।',
          'उचित राहत में मुआवजा, निषेधाज्ञा या संविदात्मक दायित्व का पालन शामिल हो सकता है।'
        ],
        defendantArguments: [
          'प्रतिवादी यह कह सकता है कि कार्रवाई कानून, अनुबंध या वैध प्रशासनिक शक्ति के भीतर थी।',
          'वादी के पास कारण-कार्रवाई, पर्याप्त साक्ष्य या प्रत्यक्ष क्षति साबित करने की कमी हो सकती है।',
          'वैकल्पिक राहत सीमित होनी चाहिए और अनुपातिकता का सिद्धांत लागू होना चाहिए।'
        ]
      }
    }

    return {
      plaintiffArguments: [
        'The plaintiff can argue that the facts and documents support a clear legal injury.',
        'The challenged conduct appears arbitrary, disproportionate, or inconsistent with statutory obligations.',
        'The court should grant effective relief through compensation, injunction, or specific compliance.'
      ],
      defendantArguments: [
        'The defendant can argue that the action falls within contractual rights, statutory power, or lawful discretion.',
        'Causation, proof of loss, or the plaintiff’s own conduct may weaken the claim.',
        'Any relief should be narrow because broader orders would exceed the facts or governing law.'
      ]
    }
  }

  if (language === 'hi') {
    return {
      id: uuidv4(),
      title: `AI केस स्टडी: ${query}`,
      category: 'सामान्य विधि',
      summary: `यह एआई-जनरेटेड केस स्टडी "${query}" से जुड़ी संभावित कानूनी स्थिति को सरल भाषा में समझाती है।`,
      background: `तथ्यों के आधार पर यह विवाद अधिकारों, दायित्वों और उपलब्ध कानूनी उपायों के इर्द-गिर्द घूमता है।`,
      legalIssues: [
        'क्या पक्षों के अधिकारों का उल्लंघन हुआ है?',
        'कौन से वैधानिक या संविदात्मक प्रावधान लागू हो सकते हैं?',
        'न्यायालय किस प्रकार की राहत दे सकता है?'
      ],
      plaintiffArguments: [
        'कार्रवाई मनमानी, अनुचित या कानून के विरुद्ध थी।',
        'वादी को वास्तविक नुकसान या अधिकार-हानि हुई है।'
      ],
      defendantArguments: [
        'प्रतिवादी की कार्रवाई वैध, औचित्यपूर्ण या अनुबंध के अनुरूप थी।',
        'वादी के दावे में तथ्यात्मक या कानूनी कमी है।'
      ],
      reasoning: 'न्यायालय आमतौर पर वैधानिक पाठ, उपलब्ध रिकॉर्ड, निष्पक्षता और अनुपातिकता को देखेगा।',
      judgment: 'परिणाम सटीक तथ्यों पर निर्भर करेगा, लेकिन मजबूत दस्तावेजी रिकॉर्ड राहत पाने की संभावना बढ़ाता है।',
      keyTakeaways: [
        'समय पर दस्तावेज़ सुरक्षित रखें।',
        'तथ्यों और कानून के बीच स्पष्ट संबंध बनाना महत्वपूर्ण है।',
        'उचित मंच और सही राहत चुनना रणनीतिक रूप से महत्वपूर्ण है।'
      ],
      relevantLaws: ['Indian Contract Act, 1872', 'Code of Civil Procedure, 1908'],
      matchExplanation:
        mode === 'similar-situation'
          ? 'यह केस स्टडी आपकी बताई गई स्थिति से मिलती-जुलती कानूनी समस्या को मॉडल करती है।'
          : ''
    }
  }

  return {
    id: uuidv4(),
    title: `AI Case Study: ${query}`,
    category: 'General Law',
    summary: `This AI-generated case study models a likely dispute connected to "${query}" in clear, study-friendly language.`,
    background:
      'The dispute centers on rights, obligations, and the remedies available once the relevant facts are tested against the governing law.',
    legalIssues: [
      'Whether the claimant can establish a legally enforceable right.',
      'Which statutory, constitutional, or contractual provisions apply to the dispute.',
      'What remedy a court is likely to grant on the available record.'
    ],
    plaintiffArguments: [
      'The challenged conduct was arbitrary, unfair, or contrary to law.',
      'The claimant suffered a real legal injury that merits relief.'
    ],
    defendantArguments: [
      'The conduct was lawful, justified, or contractually permitted.',
      'The claimant cannot prove the required facts, loss, or legal entitlement.'
    ],
    reasoning:
      'A court would usually examine the text of the governing law, the documentary record, fairness concerns, and whether the requested relief is proportionate.',
    judgment:
      'The likely outcome depends on the exact facts, but a coherent documentary record would materially improve the claimant’s chances.',
    keyTakeaways: [
      'Preserve documents and timelines early.',
      'Connect the facts to the exact legal standard.',
      'Choose the right forum and remedy before escalating the dispute.'
    ],
    relevantLaws: ['Indian Contract Act, 1872', 'Code of Civil Procedure, 1908'],
    matchExplanation:
      mode === 'similar-situation'
        ? 'This generated brief is tailored to the real-life situation you described.'
        : ''
  }
}

function buildCaseStudyPrompt({ query, mode, language, caseContext }) {
  const responseLanguage = language === 'hi' ? 'Hindi' : 'English'
  const contextText = caseContext ? `\n\nCase context:\n${caseContext}` : ''

  if (mode === 'moot-court') {
    return `You are an Indian law moot-court coach. Respond only with valid JSON in ${responseLanguage}.

Return this exact JSON shape:
{
  "plaintiffArguments": ["string", "string", "string"],
  "defendantArguments": ["string", "string", "string"]
}

Generate concise but persuasive courtroom arguments for both sides based on the following case material:
${query}${contextText}`
  }

  return `You are an Indian legal educator. Generate a complete case study in ${responseLanguage} and respond only with valid JSON.

Return this exact JSON shape:
{
  "title": "string",
  "category": "string",
  "summary": "string",
  "background": "string",
  "legalIssues": ["string", "string", "string"],
  "plaintiffArguments": ["string", "string"],
  "defendantArguments": ["string", "string"],
  "reasoning": "string",
  "judgment": "string",
  "keyTakeaways": ["string", "string", "string"],
  "relevantLaws": ["string", "string"],
  "matchExplanation": "string"
}

Rules:
- The summary must be in plain language.
- Keep the output study-friendly for law students and useful for citizens.
- If the query is a real-life situation, infer the most relevant legal framing under Indian law.
- If the query names a specific case, center the case study on that case.
- For mode "similar-situation", explain why the generated case study matches the situation.

Mode: ${mode}
User query: ${query}${contextText}`
}

app.post('/api/analyze-document', async (req, res) => {
  try {
    const { documentText } = req.body

    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required' })
    }

    const analysis = await analyzeDocumentWithGroq(documentText)

    res.json({
      analysis,
      success: true
    })

  } catch (error) {
    console.error('Document analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze document', details: error.message })
  }
})

app.post('/api/generate-case-study', async (req, res) => {
  try {
    const {
      query,
      mode = 'case-study',
      language = 'en',
      caseContext = ''
    } = req.body

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' })
    }

    if (!groqClient) {
      return res.json({
        success: true,
        ...buildMockCaseStudyResponse(query, language, mode)
      })
    }

    const result = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: mode === 'moot-court' ? 900 : 1800,
      messages: [
        {
          role: 'system',
          content:
            'You are LegalMind AI. Always follow the requested JSON schema exactly and do not add markdown commentary.'
        },
        {
          role: 'user',
          content: buildCaseStudyPrompt({ query, mode, language, caseContext })
        }
      ]
    })

    const rawText = extractCompletionText(result.choices?.[0]?.message?.content)

    if (!rawText) {
      throw new Error('The case study service returned an empty response.')
    }

    const structuredResponse = extractJsonObject(rawText)

    res.json({
      success: true,
      id: mode === 'moot-court' ? undefined : uuidv4(),
      ...structuredResponse
    })
  } catch (error) {
    console.error('Case study generation error:', error)
    res.status(500).json({
      error: 'Failed to generate case study',
      details: error.message
    })
  }
})

// Constitution articles endpoint
app.get('/api/constitution/articles', (req, res) => {
  const articles = [
    { number: 14, title: 'Equality Before Law', category: 'Fundamental Rights', part: 'Part III' },
    { number: 15, title: 'Prohibition of Discrimination', category: 'Fundamental Rights', part: 'Part III' },
    { number: 16, title: 'Equality of Opportunity', category: 'Fundamental Rights', part: 'Part III' },
    { number: 19, title: 'Protection of Certain Rights', category: 'Fundamental Rights', part: 'Part III' },
    { number: 21, title: 'Protection of Life and Personal Liberty', category: 'Fundamental Rights', part: 'Part III' },
    { number: 32, title: 'Remedies for Enforcement of Rights', category: 'Fundamental Rights', part: 'Part III' }
  ]

  res.json({ articles, total: 470 })
})

// Precedent cases endpoint
app.get('/api/cases/precedents', (req, res) => {
  const cases = [
    {
      title: 'Kesavananda Bharati v. State of Kerala',
      citation: 'AIR 1973 SC 1464',
      year: 1973,
      significance: 'Basic Structure Doctrine'
    },
    {
      title: 'Maneka Gandhi v. Union of India',
      citation: 'AIR 1978 SC 597',
      year: 1978,
      significance: 'Expanded Article 21 interpretation'
    },
    {
      title: 'Vishaka v. State of Rajasthan',
      citation: 'AIR 1997 SC 3011',
      year: 1997,
      significance: 'Vishaka Guidelines on sexual harassment'
    }
  ]

  res.json({ cases })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      ai: groqClient ? 'configured' : 'demo-mode',
      documents: 'ready'
    }
  })
})

// Helper functions
function generateMockLegalResponse(message) {
  const lowerMsg = message.toLowerCase()

  if (lowerMsg.includes('fundamental right')) {
    return legalKnowledgeBase.fundamentalRights
  }
  if (lowerMsg.includes('article 21') || lowerMsg.includes('right to life')) {
    return legalKnowledgeBase.article21
  }
  if (lowerMsg.includes('ipc') || lowerMsg.includes('penal code')) {
    return legalKnowledgeBase.ipc
  }
  if (lowerMsg.includes('crpc') || lowerMsg.includes('criminal procedure')) {
    return legalKnowledgeBase.crpc
  }
  if (lowerMsg.includes('constitution') && lowerMsg.includes('part')) {
    return legalKnowledgeBase.constitutionParts
  }

  return `Hey there! I can see you're curious about "${message}" in Indian law. Let me break this down for you in a way that makes sense.

🔍 **What's happening here**
You're asking about a topic that touches on Indian legal principles. The Indian legal system is pretty comprehensive and covers this through various laws and Constitutional provisions.

⚖️ **The law says**
The specific laws that might apply here include:
- **Indian Constitution** — The foundation of all our laws
- **Indian Penal Code (IPC), 1860** — Covers criminal matters
- **Code of Criminal Procedure (CrPC), 1973** — Governs how criminal proceedings work
- **Indian Contract Act, 1872** — For contract-related issues

✅ **Your rights**
Your rights depend on the specific situation, but generally:
- You have the right to legal remedy if someone violates your rights
- You can approach courts for justice
- You have the right to be heard before any action is taken against you

🗺️ **What you should do**
1. Gather all relevant documents and information about your situation
2. Note down dates, people involved, and what happened
3. Contact a lawyer who specializes in this area — they'll give you specific advice
4. Keep records of everything related to your case
5. Act quickly — many legal matters have time limits

⚠️ **Just so you know**
This is general legal information to help you understand your situation. For your specific case, always speak to a qualified lawyer. Every situation is unique, and you need personalized legal advice!

Want me to explain any specific law, article, or concept in more detail? 😊`
}

function extractSources(message) {
  const sources = []
  const lowerMsg = message.toLowerCase()

  if (lowerMsg.includes('article 21')) sources.push({ article: 'Article 21', title: 'Right to Life' })
  if (lowerMsg.includes('article 14')) sources.push({ article: 'Article 14', title: 'Equality Before Law' })
  if (lowerMsg.includes('article 15')) sources.push({ article: 'Article 15', title: 'No Discrimination' })
  if (lowerMsg.includes('article 19')) sources.push({ article: 'Article 19', title: 'Freedoms' })
  if (lowerMsg.includes('article 32')) sources.push({ article: 'Article 32', title: 'Constitutional Remedies' })
  if (lowerMsg.includes('ipc') || lowerMsg.includes('section')) sources.push({ article: 'IPC', title: 'Indian Penal Code' })
  if (lowerMsg.includes('crpc')) sources.push({ article: 'CrPC', title: 'Criminal Procedure Code' })

  if (sources.length === 0) {
    sources.push({ article: 'Constitution', title: 'Fundamental Rights' })
  }

  return sources
}

// For Vercel serverless
export default app

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
