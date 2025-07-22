import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, LogOut, Brain } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Game } from '../types/game';
import gamesData from '../data/games.json';
import { toast } from 'sonner';

/**
 * Game list page component showing available turtle soup games
 */
export default function GameList() {
  const navigate = useNavigate();
  const { setCurrentGame, logout } = useGameStore();
  const games: Game[] = gamesData;

  /**
   * Handle game selection
   */
  const handleGameSelect = (game: Game) => {
    setCurrentGame(game);
    toast.success(`开始游戏：${game.title}`);
    navigate(`/game/${game.id}`);
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    toast.info('已退出登录');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">海龟汤猜谜游戏</h1>
              <p className="text-sm text-slate-300">选择一个游戏开始推理</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>退出</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">🐢 选择你的推理挑战</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            海龟汤是一种推理游戏，你需要通过问是非问题来推断出事件的真相。
            选择下面的任意一个故事，开始你的推理之旅吧！
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              onClick={() => handleGameSelect(game)}
            >
              {/* Game Number */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <Play className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
              </div>

              {/* Game Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                {game.title}
              </h3>

              {/* Game Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {game.description}
              </p>

              {/* Difficulty Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < (game.hints?.length || 1) 
                          ? 'bg-orange-400' 
                          : 'bg-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-2">难度</span>
                </div>
                <div className="text-xs text-slate-400">
                  点击开始
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {games.length === 0 && (
          <div className="text-center py-16">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">暂无游戏</h3>
            <p className="text-slate-500">请稍后再来查看新的推理挑战</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">🎯 游戏规则</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
            <div>
              <h4 className="font-semibold text-orange-300 mb-2">如何游戏</h4>
              <ul className="space-y-1 text-sm">
                <li>• 选择一个感兴趣的故事</li>
                <li>• 向AI主持人提出是非问题</li>
                <li>• 根据回答推理出真相</li>
                <li>• 可以随时返回选择其他游戏</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-300 mb-2">提问技巧</h4>
              <ul className="space-y-1 text-sm">
                <li>• 只能问是非问题（是/否）</li>
                <li>• 从大方向开始缩小范围</li>
                <li>• 关注人物、时间、地点、动机</li>
                <li>• 善用逻辑推理和想象力</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}