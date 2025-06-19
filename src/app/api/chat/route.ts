import { NextResponse } from 'next/server';
import { OpenRouterClient } from '../../../lib/openrouter';
import { availableTools } from '../../../tools';

export async function POST(request: Request) {
  try {
    const { message, previousMessages } = await request.json();
    
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    const client = new OpenRouterClient(process.env.OPENROUTER_API_KEY, availableTools);
    const result = await client.chat(message, previousMessages);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
} 