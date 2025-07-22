import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Lightbulb, AlertCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { generateAIResponse, isOpenAIConfigured } from '../services/openaiService';
import { toast } from 'sonner';
import gamesData from '../data/games.json';
import { Game } from '../types/game';

/**
 * Game chat page component for AI interaction
 */
export default function GameChat() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentGame, messages, addMessage, setCurrentGame, resetGame } = useGameStore();
  const games: Game[] = gamesData;

  // Initialize game if not set
  useEffect(() => {
    if (!currentGame && gameId) {
      const game = games.find(g => g.id === gameId);
      if (game) {
        setCurrentGame(game);
      } else {
        toast.error('游戏不存在');
        navigate('/games');
      }
    }
  }, [gameId, currentGame, setCurrentGame, navigate, games]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handle sending user message and getting AI response
   */
  const handleSendMessage = async () => {
    if (!input.trim() || !currentGame || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      // Check if OpenAI is configured
      if (!isOpenAIConfigured()) {
        addMessage(
          '⚠️ OpenAI API未配置。请在环境变量中设置VITE_OPENAI_API_KEY。\n\n作为演示，我会给出模拟回答：\n\n' +
          getMockResponse(userMessage),
          false
        );
        setIsLoading(false);
        return;
      }

      // Get chat history for context
      const chatHistory = messages
        .filter(msg => msg.content && !msg.content.includes('欢迎来到'))
        .map(msg => msg.content);

      const aiResponse = await generateAIResponse(userMessage, currentGame, chatHistory);
      addMessage(aiResponse, false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage(
        '抱歉，AI服务暂时不可用。请稍后再试。\n\n' +
        '作为备用回答：' + getMockResponse(userMessage),
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get mock response when AI is not available
   */
  const getMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('男') || lowerQuestion.includes('女')) {
      return '是的。';
    }
    if (lowerQuestion.includes('死') || lowerQuestion.includes('杀')) {
      return '是的，这很重要。';
    }
    if (lowerQuestion.includes('为什么') || lowerQuestion.includes('怎么')) {
      return '不能这样问，请问是非问题。';
    }
    
    return Math.random() > 0.5 ? '是的。' : '不是。';
  };

  /**
   * Handle back to game list
   */
  const handleBack = () => {
    resetGame();
    navigate('/games');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>加载游戏中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{currentGame.title}</h1>
              <p className="text-sm text-slate-300">与AI主持人对话推理</p>
            </div>
          </div>
          
          {/* Hint Button */}
          <button
            onClick={() => {
              const hints = currentGame.hints?.join('\n• ') || '暂无提示';
              toast.info(`💡 提示：\n• ${hints}`, { duration: 5000 });
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 rounded-lg transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">提示</span>
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
              >
                {message.isUser ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-slate-300">AI正在思考...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border-t border-white/20">
        <div className="max-w-4xl mx-auto p-4">
          {/* API Warning */}
          {!isOpenAIConfigured() && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-200">
                OpenAI API未配置，当前使用模拟回答。请设置环境变量 VITE_OPENAI_API_KEY 以启用真实AI交互。
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="问一个是非问题，比如：他是男人吗？"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">发送</span>
            </button>
          </form>

          {/* Quick Questions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              '这个人是男性吗？',
              '有人死了吗？',
              '这是意外吗？',
              '时间很重要吗？'
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-colors"
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}