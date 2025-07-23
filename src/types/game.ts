export interface Game {
  id: string;
  title: string;
  description: string;
  answer: string;
  key: string;
  hints: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface GameState {
  currentGame: Game | null;
  messages: ChatMessage[];
  isAuthenticated: boolean;
}