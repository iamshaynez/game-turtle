import { create } from 'zustand';
import { Game, ChatMessage, GameState } from '../types/game';

interface GameStore extends GameState {
  // Authentication actions
  login: (password: string) => boolean;
  logout: () => void;
  
  // Game actions
  setCurrentGame: (game: Game) => void;
  addMessage: (content: string, isUser: boolean) => void;
  clearMessages: () => void;
  resetGame: () => void;
}

const CORRECT_PASSWORD = 'turtle123'; // In production, this should be environment variable

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentGame: null,
  messages: [],
  isAuthenticated: false,

  // Authentication actions
  login: (password: string) => {
    const isValid = password === CORRECT_PASSWORD;
    if (isValid) {
      set({ isAuthenticated: true });
    }
    return isValid;
  },

  logout: () => {
    set({ 
      isAuthenticated: false, 
      currentGame: null, 
      messages: [] 
    });
  },

  // Game actions
  setCurrentGame: (game: Game) => {
    set({ 
      currentGame: game, 
      messages: [{
        id: Date.now().toString(),
        content: `欢迎来到《${game.title}》！\n\n${game.description}\n\n你可以问我任何是非问题来推理出真相。记住，我只能回答"是"、"否"或"无关"。`,
        isUser: false,
        timestamp: new Date()
      }] 
    });
  },

  addMessage: (content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date()
    };
    set(state => ({ 
      messages: [...state.messages, newMessage] 
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  resetGame: () => {
    set({ currentGame: null, messages: [] });
  }
}));