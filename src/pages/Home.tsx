import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Scale, 
  Briefcase,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Zap
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const stats = [
  { number: '470+', label: 'Constitutional Articles', icon: BookOpen },
  { number: '500+', label: 'IPC Sections', icon: Scale },
  { number: '24/7', label: 'AI Assistance', icon: Clock },
  { number: '100%', label: 'Free to Use', icon: Shield },
]

const features = [
  {
    icon: MessageSquare,
    title: 'AI Virtual Lawyer',
    description: 'Get instant legal consultation powered by advanced AI trained on Indian law.',
    path: '/ai-lawyer',
    color: 'from-blue-500/20 to-blue-600/20',
    iconBg: 'bg-blue-500/20'
  },
  {
    icon: FileText,
    title: 'Analyze Documents',
    description: 'Upload PDFs. Extract clauses, risks, and obligations instantly.',
    path: '/analyze-document',
    color: 'from-purple-500/20 to-purple-600/20',
    iconBg: 'bg-purple-500/20'
  },
  {
    icon: BookOpen,
    title: 'Constitution Q&A',
    description: 'Search articles, rights, and duties with source references.',
    path: '/constitution',
    color: 'from-gold-500/20 to-gold-600/20',
    iconBg: 'bg-gold-500/20'
  },
  {
    icon: Scale,
    title: 'Precedent Cases',
    description: 'Access landmark Supreme Court judgments with detailed analysis.',
    path: '/precedent-cases',
    color: 'from-green-500/20 to-green-600/20',
    iconBg: 'bg-green-500/20'
  },
  {
    icon: Briefcase,
    title: 'Case Studies',
    description: 'Learn from real legal cases with step-by-step breakdowns.',
    path: '/case-studies',
    color: 'from-orange-500/20 to-orange-600/20',
    iconBg: 'bg-orange-500/20'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function Home() {
  const [animatedNumbers, setAnimatedNumbers] = useState(stats.map(() => 0))

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedNumbers(stats.map((stat) => {
        const num = parseInt(stat.number)
        return Math.floor(num * easeOut)
      }))

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 mb-4">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-gold-400 font-medium">AI-Powered Legal Assistance</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
            Justice Made <span className="gold-gradient-text">Accessible</span>
          </h1>

          <p className="text-xl text-legal-300 max-w-2xl mx-auto leading-relaxed">
            Your AI legal companion for understanding Indian law. Get instant consultations, 
            analyze documents, and navigate the legal system with confidence.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8"
        >
          {stats.map((stat, index) => {
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-legal-800/50 border border-legal-600/30 hover:border-gold-400/30 transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-serif font-bold gold-gradient-text mb-2">
                  {stat.number.includes('+') ? `${animatedNumbers[index]}+` : stat.number}
                </div>
                <div className="text-sm text-legal-300">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gold-400 text-sm font-medium tracking-widest uppercase"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-white"
          >
            One platform. Three<br />powers.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-legal-300 text-lg max-w-2xl mx-auto"
          >
            Built for Indian law—IPC, CrPC, Constitution, and central acts. No jargon. No wait.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <NavLink
                  to={feature.path}
                  className={`block p-6 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-legal-600/30 
                            hover:border-gold-400/30 transition-all duration-300 group h-full`}
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-legal-300 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </NavLink>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="rounded-3xl bg-legal-800/50 border border-legal-600/30 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Why Choose Legal Mind AI?
            </h2>
            <p className="text-legal-300 text-lg leading-relaxed">
              We combine cutting-edge AI technology with deep knowledge of Indian law to provide 
              you with accurate, reliable, and accessible legal assistance.
            </p>

            <ul className="space-y-4">
              {[
                'Instant AI-powered legal consultation',
                'Document analysis with OCR and NLP',
                'Constitutional article recommendations',
                'Precedent case matching',
                'Secure and private',
                'Available 24/7'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-legal-200">
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3 h-3 text-gold-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-purple-500/20 rounded-2xl blur-3xl" />
            <div className="relative bg-legal-900/80 backdrop-blur-xl rounded-2xl p-6 border border-legal-600/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-medium">JusticeGPT AI</p>
                  <p className="text-xs text-legal-400">Your Legal Assistant</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-legal-800/50 rounded-xl p-4 border border-legal-600/20">
                  <p className="text-legal-300 text-sm italic">
                    "I understand you're asking about tenant rights under the Rent Control Act. 
                    Based on your situation..."
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs bg-gold-400/10 text-gold-400 rounded-full border border-gold-400/20">
                    Article 21
                  </span>
                  <span className="px-3 py-1 text-xs bg-gold-400/10 text-gold-400 rounded-full border border-gold-400/20">
                    Article 300A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
          Ready to Get Started?
        </h2>
        <p className="text-legal-300 text-lg max-w-2xl mx-auto">
          Join our growing community of users who trust Legal Mind AI for their legal queries. 
          Start your free consultation today.
        </p>
        <NavLink
          to="/ai-lawyer"
          className="inline-flex items-center gap-2 btn-primary text-lg"
        >
          <MessageSquare className="w-5 h-5" />
          Start Free Consultation
        </NavLink>
      </section>
    </div>
  )
}
