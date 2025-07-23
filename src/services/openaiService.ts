import { Game } from '../types/game';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userQuestion,
        game,
        chatHistory
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '抱歉，我无法回答这个问题。';
  } catch (error) {
    console.error('Backend API Error:', error);
    
    // Fallback response when API fails
    if (userQuestion.includes('是') || userQuestion.includes('吗')) {
      return '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。';
    }
    return '请问一个是非问题，比如"他是男人吗？"';
  }
}

/**
 * Check if OpenAI API is configured on the backend
 * @returns boolean indicating if API is available
 */
export async function isOpenAIConfigured(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.openaiConfigured;
  } catch (error) {
    console.error('Failed to check OpenAI configuration:', error);
    return false;
  }
}