export interface MetricTelemetry {
  label: string;
  value: string;
  sub: string;
}

export interface PureChessFeature {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  icon: "ai" | "academy" | "matchmaking" | "minimalist" | "analytics" | "sync";
}

export interface Testimonial {
  rating: number;
  quote: string;
  author: string;
  title: string;
  avatar: string;
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

export const TOP_TELEMETRY: MetricTelemetry[] = [
  {
    label: "DEPTH TELEMETRY",
    value: "32 Ply",
    sub: "Stockfish 17 Engine",
  },
  {
    label: "MATCHMAKING",
    value: "< 14ms",
    sub: "Global Edge Latency",
  },
  {
    label: "FAIR-PLAY SHIELD",
    value: "99.8%",
    sub: "Heuristic Cheat Filter",
  },
  {
    label: "ACTIVE GRANDMASTERS",
    value: "420+",
    sub: "FIDE Verified Titles",
  },
];

export const PURE_CHESS_FEATURES: PureChessFeature[] = [
  {
    id: "adaptive-ai",
    title: "Adaptive Neural AI",
    description:
      "From gentle, instructional play (800 ELO) up to punishing 2840 Magnus-level calculation, the bot continuously adapts to expose strategic flaws.",
    linkText: "explore engine tree →",
    linkHref: "#grandmaster-ai",
    icon: "ai",
  },
  {
    id: "tactical-academy",
    title: "Tactical Piece Academy",
    description:
      "Crisp board overlays and positional drills display knight forks, rook elevators, and smothered mates with absolute geometric clarity.",
    linkText: "view curriculum →",
    linkHref: "#academy",
    icon: "academy",
  },
  {
    id: "instant-matchmaking",
    title: "Instant Global Matchmaking",
    description:
      "Sub-second Blitz, Bullet, and Classical queue times connecting players across 140+ countries on an edge-optimized WebSocket backplane.",
    linkText: "latency diagnostics →",
    linkHref: "#interactive-terminal",
    icon: "matchmaking",
  },
  {
    id: "minimalist-ui",
    title: "Grandmaster Minimalist UI",
    description:
      "Deep pitch-black OLED contrast with sharp tournament green indicators, preserving visual focus during marathon tournament sessions.",
    linkText: "theme inspector →",
    linkHref: "#hero",
    icon: "minimalist",
  },
  {
    id: "deep-analytics",
    title: "Deep Performance Analytics",
    description:
      "Exhaustive opening book win-rates, time spent per move phase, and automated post-game blunder forensics with FEN/PGN exports.",
    linkText: "sample analytics FEN →",
    linkHref: "#puzzle-section",
    icon: "analytics",
  },
  {
    id: "cross-platform",
    title: "Cross-Platform Sync",
    description:
      "Seamlessly transition an active match or analysis board from desktop web straight to your phone with zero reconnect delays.",
    linkText: "ecosystem devices →",
    linkHref: "#interactive-terminal",
    icon: "sync",
  },
];

export const BIG_STATS = [
  { value: "1.2M+", label: "ACTIVE STRATEGISTS" },
  { value: "15M+", label: "RATED MATCHES" },
  { value: "4.9★", label: "AVERAGE APP RATING" },
  { value: "99.98%", label: "SERVER UPTIME" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    rating: 5,
    quote:
      "The engine analysis depth on mobile is startlingly fast. It feels like having my personal Grandmaster seconds team reviewing tactical forks in the palm of my hand.",
    author: "GM Anatoly S.",
    title: "FIDE 2548 · International Master",
    avatar: "AS",
  },
  {
    rating: 5,
    quote:
      "Most chess apps are cluttered with noisy gamification and cartoon avatars. Chuvinjab respects the intellectual gravity of the board while keeping the UI frictionless.",
    author: "Katia Lin",
    title: "2190 Blitz · Collegiate Champion",
    avatar: "KL",
  },
  {
    rating: 5,
    quote:
      "The Piece Academy took me from a 900 blunder-machine to 1450 in three months. The visual geometry overlays teach board control better than any book.",
    author: "Marcus Reed",
    title: "Verified Club Player · London",
    avatar: "MR",
  },
];

export const STATS_DATA = [
  {
    value: "Stockfish 17",
    label: "Neural Chess Engine",
    description: "Cold NNUE move computation combined with human-friendly natural language coaching.",
    badge: "32 Ply",
  },
  {
    value: "< 14ms",
    label: "Edge WebSocket Gateway",
    description: "NestJS Socket.IO architecture ensuring instant board state synchronization.",
    badge: "Low Latency",
  },
  {
    value: "99.8%",
    label: "Fair-Play Shield",
    description: "Continuous behavioral move-vector & touch curvature evaluation per ply.",
    badge: "Fair Play",
  },
  {
    value: "420+",
    label: "Active Grandmasters",
    description: "FIDE verified titles competing and training on the platform.",
    badge: "Verified",
  },
];

export const PIECE_MASTERIES: PieceMastery[] = [
  {
    name: "The Knight",
    symbol: "♞",
    value: 3,
    role: "Tactical Infiltrator",
    movement: "Unique L-shape movement.",
    proTip: "Place knights on central outposts.",
  },
  {
    name: "The Bishop",
    symbol: "♝",
    value: 3,
    role: "Long-Range Sniper",
    movement: "Moves diagonally across open squares.",
    proTip: "The bishop pair in open endgames is deadly.",
  },
];

export const CHESS_RULES: ChessRule[] = [
  {
    id: "castling",
    title: "Castling",
    tag: "King Safety",
    description: "King moves two squares toward a rook, and the rook hops over.",
    keyRule: "Neither piece can have moved previously.",
  },
];

export const ACADEMY_CHALLENGES: AcademyChallenge[] = [
  {
    id: "move-the-knight",
    title: "Move the Knight",
    difficulty: "beginner",
    estimatedMinutes: 4,
    progress: 80,
    description: "Navigate tricky L-shaped trajectories.",
    state: "unlocked",
  },
];

export const LEADERBOARD_PREVIEW: LeaderboardPlayer[] = [
  {
    rank: 1,
    username: "GrandmasterViktor",
    rating: 2480,
    winRate: 74,
    gamesPlayed: 512,
    title: "GM",
    avatarBg: "from-amber-500 to-yellow-600",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does the Neural AI Coach work?",
    answer: "Pairs Stockfish 17 calculation with conversational explanations.",
    category: "ai",
  },
];
