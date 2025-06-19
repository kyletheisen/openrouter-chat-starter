import OpenAI from 'openai';
import { Tool } from '../types/tools';

export class OpenRouterClient {
  private client: OpenAI;
  private tools: Tool[];

  constructor(apiKey: string, tools: Tool[]) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Rocket AI Dashboard',
      },
    });
    this.tools = tools;
  }

  async chat(message: string, previousMessages: Array<{ role: string; content: string }> = []) {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview',
		
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant with access to the following tools:
${this.tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

When a user's message matches a tool's purpose exactly, you should use that tool.
For example, if they ask "how are you", use the how_are_you tool.
If they say "hello world", use the hello_world tool.

To use a tool, respond with EXACTLY: TOOL:tool_name
Otherwise, respond naturally to continue the conversation while maintaining context of previous messages.`
          },
          ...previousMessages,
          {
            role: 'user',
            content: message
          }
        ]
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No response from OpenRouter');

      if (content.startsWith('TOOL:')) {
        const toolName = content.replace('TOOL:', '').trim();
        const tool = this.tools.find(t => t.name === toolName);
        if (!tool) throw new Error(`Tool ${toolName} not found`);
        
        return await tool.execute();
      }

      return content;
    } catch (error) {
      console.error('Error in chat:', error);
      throw error;
    }
  }
} 