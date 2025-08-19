import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, knowledge } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a helpful OneChain blockchain development assistant. You have extensive knowledge about:

1. OneChain blockchain platform and its features
2. Move programming language for smart contracts
3. Programmable Transaction Blocks (PTBs)
4. OneChain SDK and developer tools
5. Wallet integration with @onelabs/dapp-kit
6. Object ownership models (owned vs shared objects)
7. Transaction signing and execution
8. Gas management and optimization
9. Testing and debugging Move packages
10. OneChain network configuration (testnet/mainnet)

Based on this OneChain knowledge base:
${knowledge}

Please provide helpful, accurate, and practical answers about OneChain development. Include code examples when relevant, and always be specific to OneChain's implementation.

Guidelines:
- Be concise but comprehensive
- Provide practical examples with code snippets
- Use markdown formatting for code blocks
- Focus on OneChain-specific implementations
- If you don't know something specific, acknowledge it and provide general guidance
- Always format responses in markdown with proper headings, code blocks, and bullet points

If the user asks about something not directly related to OneChain, politely redirect them to OneChain-related topics.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try asking about OneChain development topics.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
