import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Scale, 
  BookOpen,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: { article: string; title: string }[]
  isStreaming?: boolean
}

const quickPrompts = [
  { icon: Scale, text: "What are Fundamental Rights?" },
  { icon: BookOpen, text: "Explain Article 21" },
  { icon: Scale, text: "What is the Right to Equality?" },
  { icon: BookOpen, text: "Explain Directive Principles" },
  { icon: Scale, text: "How to file an FIR?" },
  { icon: BookOpen, text: "What is bail procedure?" },
]

export default function AILawyer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Legal Assistant. I can help you understand Indian law, explain constitutional provisions, IPC sections, and provide general legal guidance. What would you like to know?",
      timestamp: new Date(),
      sources: []
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Conversation history for API
  const conversationHistory = useRef<Array<{role: string, content: string}>>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userMessageContent = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // Add user message to conversation history
      conversationHistory.current.push({
        role: "user",
        content: userMessageContent
      })

      // Keep history to last 10 messages to avoid token limits
      if (conversationHistory.current.length > 20) {
        conversationHistory.current.splice(0, 2)
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessageContent,
          history: conversationHistory.current.slice(0, -1) // Don't include current message in history
        }),
      })

      const data = await response.json()

      // Add AI reply to conversation history
      conversationHistory.current.push({
        role: "assistant",
        content: data.response
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
        isStreaming: false
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        sources: [],
        isStreaming: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Legal Assistant. I can help you understand Indian law, explain constitutional provisions, IPC sections, and provide general legal guidance. What would you like to know?",
      timestamp: new Date(),
      sources: []
    }])
  }

  return (
    <div className="h-[calc(100vh-3rem)] flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <Bot className="w-6 h-6 text-legal-900" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white">AI Lawyer</h1>
            <p className="text-sm text-legal-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Powered by Advanced Legal AI
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 text-sm text-legal-300 hover:text-white 
                     bg-legal-800 hover:bg-legal-700 rounded-xl transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-legal-800/30 rounded-2xl border border-legal-600/30 overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gold-400/20' 
                    : 'bg-gradient-to-br from-gold-400 to-gold-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-gold-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-legal-900" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block text-left p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gold-400/10 border border-gold-400/20 text-white'
                      : 'bg-legal-700/50 border border-legal-600/30 text-legal-100'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gold-400/10 
                                   text-gold-400 rounded-full border border-gold-400/20"
                        >
                          <BookOpen className="w-3 h-3" />
                          {source.article}: {source.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1.5 text-legal-400 hover:text-white hover:bg-legal-700 rounded-lg transition-all"
                        title="Copy response"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-1.5 text-legal-400 hover:text-white hover:bg-legal-700 rounded-lg transition-all">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-legal-400 hover:text-white hover:bg-legal-700 rounded-lg transition-all">
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <span className="text-xs text-legal-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-legal-900 animate-pulse" />
              </div>
              <div className="flex-1 max-w-[80%]">
                <div className="inline-block p-4 rounded-2xl bg-legal-700/50 border border-legal-600/30">
                  <div className="flex items-center gap-2 text-legal-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing legal provisions...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length < 3 && (
          <div className="px-6 py-4 border-t border-legal-600/30">
            <p className="text-xs text-legal-400 mb-3">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => {
                const Icon = prompt.icon
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt.text)
                      inputRef.current?.focus()
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-legal-700/50 hover:bg-legal-600 
                             text-legal-300 hover:text-white rounded-xl transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {prompt.text}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-legal-600/30 bg-legal-800/50">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Fundamental Rights, Articles, IPC sections, or any legal query..."
              className="flex-1 input-field resize-none min-h-[56px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-legal-900 font-semibold rounded-xl
                       hover:from-gold-400 hover:to-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-legal-500 mt-2 text-center">
            AI responses are for informational purposes only and do not constitute legal advice. Consult a qualified lawyer for specific legal matters.
          </p>
        </div>
      </div>
    </div>
  )
}
