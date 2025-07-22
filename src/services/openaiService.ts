import OpenAI from 'openai';
import { Game } from '../types/game';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

/**
 * Generate AI response for turtle soup game
 * @param userQuestion - The user's question
 * @param game - Current game data
 * @param chatHistory - Previous chat messages for context
 * @returns AI response
 */
export async function generateAIResponse(
  userQuestion: string, 
  game: Game, 
  chatHistory: string[] = []
): Promise<string> {
  try {
    const systemPrompt = `你是海龟汤游戏的主持人。游戏规则：

游戏题目：${game.title}
谜面：${game.description}
真相：${game.answer}

你的职责：
1. 只能回答"是"、"否"、"无关"或"不能这样问"
2. 根据真相判断用户问题的答案
3. 如果问题与真相相符，回答"是"
4. 如果问题与真相不符，回答"否"
5. 如果问题与真相无关，回答"无关"
6. 如果问题不是是非问题，回答"不能这样问，请问是非问题"
7. 保持神秘感，不要直接透露答案
8. 可以在回答后给出简短的引导性提示

请严格按照规则回答，保持简洁。`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg, index) => ({
        role: (index % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg
      })),
      { role: 'user', content: userQuestion }
    ];

    const completion = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback response when API fails
    if (userQuestion.includes('是') || userQuestion.includes('吗')) {
      return '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。';
    }
    return '请问一个是非问题，比如"他是男人吗？"';
  }
}

/**
 * Check if OpenAI API key is configured
 * @returns boolean indicating if API key is available
 */
export function isOpenAIConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
}