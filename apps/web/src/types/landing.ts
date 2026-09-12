export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
  description: string;
  badge?: string;
}

export type CoachClassification = "BEST" | "GOOD" | "INACCURACY" | "MISTAKE" | "BLUNDER";

export interface DemoPosition {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Master";
  fen: string;
  turn: "white" | "black";
  bestMoveSan: string;
  bestMoveFrom: string;
  bestMoveTo: string;
  stockfishEval: string;
  classification: CoachClassification;
  geminiExplanation: string;
  hintDescription: string;
  positionalSummary: {
    strengths: string[];
    weaknesses: string[];
  };
}

export interface PieceMastery {
  name: string;
  symbol: string;
  value: number | string;
  role: string;
  movement: string;
  proTip: string;
}

export interface ChessRule {
  id: string;
  title: string;
  tag: string;
  description: string;
  keyRule: string;
}

export interface AcademyChallenge {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  progress: number;
  description: string;
  state: "completed" | "unlocked" | "locked";
}

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  rating: number;
  winRate: number;
  gamesPlayed: number;
  title?: string;
  avatarBg: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "ai" | "gameplay" | "platform";
}
