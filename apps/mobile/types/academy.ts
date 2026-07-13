export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type PieceId = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export interface BoardSquare {
  file: number; // 0-7 (a-h)
  rank: number; // 0-7 (1-8)
}

export interface MovementExample {
  id: string;
  caption: string;
  from: BoardSquare;
  to: BoardSquare[]; // legal/illustrative destination squares
  blocked?: BoardSquare[]; // squares occupied by other pieces, for context
}

export interface ChessPiece {
  id: PieceId;
  name: string;
  symbol: string; // unicode glyph, used as a lightweight illustration fallback
  value: number | null; // material value, null for King
  difficulty: Difficulty;
  tagline: string; // one-line description for the card
  overview: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    typicalUse: string;
  };
  movement: {
    description: string;
    rules: string[];
  };
  strategy: {
    commonMistakes: string[];
    goodPositioning: string[];
    openingAdvice: string;
    endgameAdvice: string;
  };
  examples: MovementExample[];
}

export interface ChessRule {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: Difficulty;
  icon: string; // unicode/emoji glyph
  content: string[]; // paragraphs
  tips: string[];
  examples: MovementExample[];
}

export type ChallengeState = 'locked' | 'unlocked' | 'completed';

export interface PracticeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  progress: number; // 0–100
  state: ChallengeState;
}
