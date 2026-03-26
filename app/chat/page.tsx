"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Send,
  Bot,
  User,
  Lightbulb,
  ArrowLeft,
  Zap,
  ArrowDown,
  Printer,
  Copy,
  Plus,
  Trash2,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  History,
} from "lucide-react"
import Link from "next/link"
import { searchOneChainKnowledge } from "@/lib/chat-ai"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string // Changed to string to avoid hydration issues
  suggestions?: string[]
}

interface ChatPageProps {}

interface ConversationSummary {
  id: string
  title: string
  updatedAt: string
  messages: Message[]
}

const STORAGE_CURRENT_MESSAGES = 'onebox-chat-current-messages'
const STORAGE_CONVERSATIONS = 'onebox-chat-conversations'
const STORAGE_CURRENT_CONVERSATION_ID = 'onebox-chat-current-conversation-id'
const MAX_INPUT_CHARS = 4000

export default function ChatPage({}: ChatPageProps) {
  const welcomeMessage: Message = {
    id: '1',
    content:
      "👋 Hello! I'm your OneChain AI assistant powered by ChatGPT. I can help you with:\n\n• OneChain blockchain development\n• Move programming language\n• PTB (Programmable Transaction Blocks)\n• Smart contract deployment\n• Wallet integration\n• Developer tools and SDK usage\n\nWhat would you like to know about OneChain?",
    role: 'assistant',
    timestamp: new Date().toISOString(),
    suggestions: [
      "How do I create my first Move package?",
      "What are PTBs and how do I use them?",
      "How to connect a wallet to OneChain?",
      "Explain OneChain objects and ownership",
    ],
  }

  const [messages, setMessages] = useState<Message[]>([
    welcomeMessage,
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string>(`conv-${Date.now()}`)
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const getConversationTitle = (conversationMessages: Message[]) => {
    const firstUserMessage = conversationMessages.find((message) => message.role === 'user')
    const baseTitle = firstUserMessage?.content || 'New conversation'
    return baseTitle.length > 48 ? `${baseTitle.slice(0, 48)}...` : baseTitle
  }

  const upsertConversation = (conversationId: string, conversationMessages: Message[]) => {
    if (conversationMessages.length === 0) {
      return
    }

    const nextSummary: ConversationSummary = {
      id: conversationId,
      title: getConversationTitle(conversationMessages),
      updatedAt: new Date().toISOString(),
      messages: conversationMessages,
    }

    setConversations((previous) => {
      const withoutCurrent = previous.filter((conversation) => conversation.id !== conversationId)
      return [nextSummary, ...withoutCurrent].slice(0, 20)
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShouldAutoScroll(true)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShouldAutoScroll(isNearBottom)
  }

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [messages])

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    try {
      const savedMessages = window.localStorage.getItem(STORAGE_CURRENT_MESSAGES)
      const savedConversations = window.localStorage.getItem(STORAGE_CONVERSATIONS)
      const savedConversationId = window.localStorage.getItem(STORAGE_CURRENT_CONVERSATION_ID)

      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages) as Message[]
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages)
        }
      }

      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations) as ConversationSummary[]
        if (Array.isArray(parsedConversations)) {
          setConversations(parsedConversations)
        }
      }

      if (savedConversationId) {
        setCurrentConversationId(savedConversationId)
      }
    } catch {
      toast.error('Could not restore previous chat state')
    }
  }, [hydrated])

  useEffect(() => {
    if (!hydrated) return

    try {
      window.localStorage.setItem(STORAGE_CURRENT_MESSAGES, JSON.stringify(messages))
      window.localStorage.setItem(STORAGE_CONVERSATIONS, JSON.stringify(conversations))
      window.localStorage.setItem(STORAGE_CURRENT_CONVERSATION_ID, currentConversationId)
    } catch {
      // Ignore storage write failures silently.
    }
  }, [messages, conversations, currentConversationId, hydrated])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = '0px'
    const nextHeight = Math.min(textarea.scrollHeight, 220)
    textarea.style.height = `${nextHeight}px`
  }, [input])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const prompt = params.get("prompt")
    if (prompt) {
      setInput(prompt)
      textareaRef.current?.focus()
    }
  }, [])

  const formatTime = (timestamp: string) => {
    if (!hydrated) return ''
    
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShouldAutoScroll(true) // Enable auto-scroll when sending a message

    try {
      const response = await searchOneChainKnowledge(input.trim())
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try asking about OneChain development, Move programming, or PTBs in a different way.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    textareaRef.current?.focus()
  }

  const handleCopyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast.success('Message copied')
    } catch {
      toast.error('Could not copy message')
    }
  }

  const handleRegenerateMessage = async (assistantMessageId: string) => {
    if (isLoading || regeneratingMessageId) return

    const assistantIndex = messages.findIndex((message) => message.id === assistantMessageId)
    if (assistantIndex < 0) return

    const previousUserMessage = [...messages]
      .slice(0, assistantIndex)
      .reverse()
      .find((message) => message.role === 'user')

    if (!previousUserMessage) {
      toast.error('Could not find user prompt to regenerate')
      return
    }

    setRegeneratingMessageId(assistantMessageId)

    try {
      const response = await searchOneChainKnowledge(previousUserMessage.content)
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: response.answer,
                timestamp: new Date().toISOString(),
                suggestions: response.suggestions,
              }
            : message
        )
      )
      toast.success('Response regenerated')
    } catch {
      toast.error('Could not regenerate this response')
    } finally {
      setRegeneratingMessageId(null)
    }
  }

  const handleOpenConversation = (conversation: ConversationSummary) => {
    setMessages(conversation.messages)
    setCurrentConversationId(conversation.id)
    setShouldAutoScroll(true)
    toast.success('Loaded conversation')
  }

  const handleNewChat = () => {
    upsertConversation(currentConversationId, messages)

    const nextConversationId = `conv-${Date.now()}`
    setMessages([
      {
        ...welcomeMessage,
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ])
    setCurrentConversationId(nextConversationId)
    setInput('')
    setShouldAutoScroll(true)
    toast.success('Started a new chat')
  }

  const handleClearChat = () => {
    upsertConversation(currentConversationId, messages)
    setMessages([])
    setInput('')
    toast.success('Transcript cleared')
  }

  const handleCopyTranscript = async () => {
    const transcript = messages
      .map((message) => `${message.role === 'user' ? 'You' : 'Assistant'}: ${message.content}`)
      .join('\n\n')

    if (!transcript) {
      toast.error('No transcript to copy yet')
      return
    }

    try {
      await navigator.clipboard.writeText(transcript)
      toast.success('Transcript copied')
    } catch {
      toast.error('Could not copy transcript')
    }
  }

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const handlePrintChat = () => {
    if (messages.length === 0) {
      toast.error('No messages to print')
      return
    }

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Unable to open print window')
      return
    }

    const html = messages
      .map(
        (message) => `
          <article style="margin-bottom: 16px; padding: 14px; border: 1px solid #dbe4ec; border-radius: 10px; background: ${
            message.role === 'user' ? '#ecfeff' : '#ffffff'
          }">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;">
              ${message.role === 'user' ? 'You' : 'Assistant'}
            </p>
            <p style="margin: 0; line-height: 1.55; white-space: pre-wrap; color: #0f172a;">${escapeHtml(message.content)}</p>
          </article>
        `
      )
      .join('')

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>OneChain Chat Transcript</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; margin: 32px; color: #0f172a; }
            h1 { margin: 0 0 16px 0; font-size: 22px; }
            p.meta { margin: 0 0 24px 0; color: #475569; font-size: 12px; }
            @media print { body { margin: 16px; } }
          </style>
        </head>
        <body>
          <h1>OneChain Assistant Chat Transcript</h1>
          <p class="meta">Printed on ${new Date().toLocaleString()}</p>
          ${html}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const renderFormattedText = (text: string) => {
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  const formatContent = (content: string) => {
    const lines = content.split('\n')
    const elements = []
    let currentElement = []
    let inCodeBlock = false
    let codeLanguage = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={elements.length} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto my-2 w-full max-w-full">
              <code className={`language-${codeLanguage} text-xs leading-relaxed block whitespace-pre-wrap`}>
                {currentElement.join('\n')}
              </code>
            </pre>
          )
          currentElement = []
          inCodeBlock = false
          codeLanguage = ''
        } else {
          // Start code block
          if (currentElement.length > 0) {
            elements.push(
              <div key={elements.length} className="mb-3">
                {currentElement.map((text, idx) => (
                  <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
                ))}
              </div>
            )
            currentElement = []
          }
          inCodeBlock = true
          codeLanguage = line.replace('```', '')
        }
        continue
      }

      if (inCodeBlock) {
        currentElement.push(line)
      } else if (line.startsWith('# ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h1 key={elements.length} className="font-bold text-xl mt-6 mb-3 text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-600 pb-2">
            {line.replace('# ', '')}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h2 key={elements.length} className="font-semibold text-lg mt-4 mb-2 text-blue-600 dark:text-blue-400">
            {line.replace('## ', '')}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        if (currentElement.length > 0) {
          elements.push(
            <div key={elements.length} className="mb-3">
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        elements.push(
          <h3 key={elements.length} className="font-medium text-base mt-3 mb-2 text-blue-600 dark:text-blue-400">
            {line.replace('### ', '')}
          </h3>
        )
      } else if (line.startsWith('• ')) {
        if (currentElement.length > 0 && !currentElement[currentElement.length - 1]?.startsWith('• ')) {
          elements.push(
            <div key={elements.length}>
              {currentElement.map((text, idx) => (
                <p key={idx} className="mb-2">{text}</p>
              ))}
            </div>
          )
          currentElement = []
        }
        currentElement.push(line)
      } else if (line.trim() === '') {
        if (currentElement.length > 0) {
          if (currentElement.some(item => item.startsWith('• '))) {
            elements.push(
              <ul key={elements.length} className="list-none space-y-1 my-2">
                {currentElement.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {renderFormattedText(item.replace('• ', ''))}
                  </li>
                ))}
              </ul>
            )
          } else {
            elements.push(
              <div key={elements.length} className="mb-3">
                {currentElement.map((text, idx) => (
                  <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
                ))}
              </div>
            )
          }
          currentElement = []
        }
      } else {
        // Handle inline formatting like **bold** and *italic*
        let formattedLine = line
        
        // Handle bold text **text**
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Handle italic text *text*
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Handle inline code `code`
        formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
        
        currentElement.push(formattedLine)
      }
    }

    if (currentElement.length > 0) {
      if (inCodeBlock) {
        elements.push(
          <pre key={elements.length} className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto my-2 w-full max-w-full">
            <code className={`language-${codeLanguage} text-xs leading-relaxed block whitespace-pre-wrap`}>
              {currentElement.join('\n')}
            </code>
          </pre>
        )
      } else if (currentElement.some(item => item.startsWith('• '))) {
        elements.push(
          <ul key={elements.length} className="list-none space-y-1 my-2">
            {currentElement.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {renderFormattedText(item.replace('• ', ''))}
              </li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <div key={elements.length} className="mb-3">
            {currentElement.map((text, idx) => (
              <p key={idx} className="mb-2">{renderFormattedText(text)}</p>
            ))}
          </div>
        )
      }
    }

    return <div className="space-y-2 w-full overflow-hidden">{elements}</div>
  }

  const assistantCount = messages.filter((message) => message.role === 'assistant').length
  const userCount = messages.filter((message) => message.role === 'user').length
  const quickPrompts = [
    'Create a PTB to transfer assets safely',
    'Explain Move object ownership with example code',
    'Show wallet connection flow for OneChain dApp',
    'Debug a failed contract publish transaction',
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f7f6] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-[-6rem] h-80 w-80 rounded-full bg-[#0f766e]/20 blur-3xl animate-float-slow" />
        <div className="absolute right-[-7rem] top-12 h-[26rem] w-[26rem] rounded-full bg-[#0ea5e9]/20 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-9rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#f59e0b]/15 blur-3xl animate-float-slow" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-slate-300/80 bg-white/80 dark:border-slate-700 dark:bg-slate-900"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </Button>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-teal-700 uppercase dark:text-teal-400">ONEbox Assistant</p>
              <h1 className="text-base font-semibold sm:text-lg">OneChain AI Chat</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="hidden rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-emerald-700 sm:flex dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Zap className="mr-1 h-3 w-3" />
              GPT-powered
            </Badge>
            <Button variant="outline" size="sm" className="gap-2" onClick={handlePrintChat}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyTranscript}>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleClearChat}>
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid h-[calc(100vh-4.1rem)] w-full max-w-[90rem] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[18rem_1fr]">
        <aside
          className={`${showSidebar ? 'flex' : 'hidden'} h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/75 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/75 lg:flex`}
        >
          <div className="p-4">
            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">Session Insights</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Card className="border-slate-200/70 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60">
                <CardContent className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">You</p>
                  <p className="text-xl font-semibold">{userCount}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200/70 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/60">
                <CardContent className="p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Assistant</p>
                  <p className="text-xl font-semibold">{assistantCount}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="max-h-56 overflow-y-auto p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <History className="h-3.5 w-3.5" />
              Recent chats
            </div>
            <div className="space-y-2">
              {conversations.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Your recent chats will appear here.
                </p>
              )}
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleOpenConversation(conversation)}
                  className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                    conversation.id === currentConversationId
                      ? 'border-teal-300 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/20'
                      : 'border-slate-200 bg-white/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-slate-700'
                  }`}
                >
                  <p className="truncate text-sm text-slate-700 dark:text-slate-200">{conversation.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{new Date(conversation.updatedAt).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5" />
              Quick prompts
            </div>
            <div className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(prompt)}
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 p-4 text-xs text-slate-500 dark:text-slate-400">
            <p>Model: GPT assistant</p>
            <p>Press Enter to send, Shift+Enter for newline</p>
          </div>
        </aside>

        <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_20px_55px_rgba(2,8,23,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          {!shouldAutoScroll && (
            <Button
              onClick={scrollToBottom}
              size="sm"
              className="absolute bottom-28 right-6 z-10 rounded-full border border-slate-200 bg-white/90 p-0 shadow-md hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}

          <div ref={messagesContainerRef} className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-7" onScroll={handleScroll}>
            <div className="mx-auto w-full max-w-4xl space-y-8 py-6">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div className={`${message.role === 'user' ? 'max-w-[90%] sm:max-w-[75%]' : 'min-w-0 flex-1'}`}>
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm sm:px-5 ${
                          message.role === 'user'
                            ? 'border-sky-300 bg-sky-500 text-white'
                            : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <div className="break-words">
                          {message.role === 'assistant' ? formatContent(message.content) : message.content}
                        </div>
                      </div>
                      <div className={`mt-1 text-xs text-slate-500 dark:text-slate-400 ${message.role === 'user' ? 'text-right' : ''}`}>
                        {message.role === 'assistant' ? 'Assistant' : 'You'} {formatTime(message.timestamp) ? `• ${formatTime(message.timestamp)}` : ''}
                      </div>

                      <div className={`mt-1 flex items-center gap-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          onClick={() => handleCopyMessage(message)}
                        >
                          <Copy className="mr-1 h-3.5 w-3.5" />
                          Copy
                        </Button>
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            disabled={Boolean(regeneratingMessageId) || isLoading}
                            onClick={() => handleRegenerateMessage(message.id)}
                          >
                            <RotateCcw className="mr-1 h-3.5 w-3.5" />
                            {regeneratingMessageId === message.id ? 'Regenerating...' : 'Regenerate'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-300 bg-sky-100 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {message.suggestions && message.role === 'assistant' && (
                    <div className="ml-0 space-y-2 pl-11">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Lightbulb className="h-3 w-3" />
                        Suggested follow-ups
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-auto rounded-full border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.12s' }} />
                        <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.24s' }} />
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200/80 bg-white/75 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-7">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950/60">
                <Textarea
                  ref={textareaRef}
                  placeholder="Message OneChain assistant..."
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
                  onKeyPress={handleKeyPress}
                  className="min-h-[68px] resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  disabled={isLoading}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Responses are tailored for OneChain docs, Move, PTB, and dApp engineering.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {input.length}/{MAX_INPUT_CHARS}
                  </p>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="gap-2 rounded-full bg-[#0f766e] px-5 text-white hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
