import { ChessPiece } from '../types/academy';

export const pieces: ChessPiece[] = [
  {
    id: 'king',
    name: 'King',
    symbol: '♔',
    value: null,
    difficulty: 'beginner',
    tagline: 'The piece you must always protect.',
    overview: {
      summary:
        'The King is the most important piece on the board. If your King is checkmated, you lose the game immediately, regardless of what other pieces remain.',
      strengths: ['Can move in any direction', 'Becomes powerful in the endgame'],
      weaknesses: ['Extremely fragile in the opening and middlegame', 'Cannot move into check'],
      typicalUse: 'Kept safe behind pawns early, then activated as an attacking piece in the endgame.',
    },
    movement: {
      description: 'The King moves exactly one square in any direction: horizontally, vertically, or diagonally.',
      rules: [
        'Moves one square in any of the 8 directions',
        'Cannot move into a square attacked by an enemy piece',
        'Can participate in castling with a rook under specific conditions',
        'Cannot capture a protected piece',
      ],
    },
    strategy: {
      commonMistakes: [
        'Leaving the King in the center too long',
        'Forgetting to castle early',
        'Walking the King into open lines',
      ],
      goodPositioning: ['Castle within the first 10 moves when possible', 'Keep pawn shelter intact in front of the King'],
      openingAdvice: 'Prioritize King safety — castle early rather than chasing material.',
      endgameAdvice: 'Activate your King as a fighting piece once most pieces are traded off.',
    },
    examples: [
      {
        id: 'king-ex-1',
        caption: 'The King can step to any adjacent square.',
        from: { file: 4, rank: 0 },
        to: [
          { file: 3, rank: 0 },
          { file: 5, rank: 0 },
          { file: 3, rank: 1 },
          { file: 4, rank: 1 },
          { file: 5, rank: 1 },
        ],
      },
    ],
  },
  {
    id: 'queen',
    name: 'Queen',
    symbol: '♕',
    value: 9,
    difficulty: 'beginner',
    tagline: 'The most powerful attacking piece.',
    overview: {
      summary:
        'The Queen combines the power of the Rook and Bishop, making it the most versatile and dangerous piece on the board.',
      strengths: ['Moves in all 8 directions', 'Excellent at forks and long-range attacks'],
      weaknesses: ['High value makes it a prime target', 'Losing it is usually decisive'],
      typicalUse: 'Deployed after minor pieces are developed, often to spearhead a middlegame attack.',
    },
    movement: {
      description: 'The Queen moves any number of squares horizontally, vertically, or diagonally.',
      rules: [
        'Combines Rook and Bishop movement',
        'Cannot jump over other pieces',
        'Captures by landing on an enemy piece square',
      ],
    },
    strategy: {
      commonMistakes: ['Bringing the Queen out too early', 'Overextending it into undefended squares'],
      goodPositioning: ['Develop minor pieces first', 'Use the Queen to support, not lead, early attacks'],
      openingAdvice: 'Avoid early Queen moves — it invites tempo-losing attacks from enemy minor pieces.',
      endgameAdvice: 'A lone Queen can checkmate a King with correct technique, especially with King support.',
    },
    examples: [
      {
        id: 'queen-ex-1',
        caption: 'The Queen sweeps the open diagonal and file simultaneously.',
        from: { file: 3, rank: 3 },
        to: [
          { file: 3, rank: 7 },
          { file: 7, rank: 3 },
          { file: 7, rank: 7 },
          { file: 0, rank: 0 },
        ],
      },
    ],
  },
  {
    id: 'rook',
    name: 'Rook',
    symbol: '♖',
    value: 5,
    difficulty: 'beginner',
    tagline: 'A straight-line powerhouse, best in open files.',
    overview: {
      summary: 'The Rook is a heavy piece that dominates open files and ranks, especially in the endgame.',
      strengths: ['Strong on open files', 'Excellent for back-rank attacks'],
      weaknesses: ['Weak in cramped, closed positions', 'Slow to activate early'],
      typicalUse: 'Connected via castling, then placed on open or semi-open files.',
    },
    movement: {
      description: 'The Rook moves any number of squares horizontally or vertically, but not diagonally.',
      rules: ['Moves along ranks and files only', 'Cannot jump over pieces', 'Involved in castling with the King'],
    },
    strategy: {
      commonMistakes: ['Activating Rooks too late', 'Leaving them trapped behind pawns'],
      goodPositioning: ['Place Rooks on open or half-open files', 'Double Rooks on the same file for pressure'],
      openingAdvice: 'Castle early so your Rooks connect and can support each other.',
      endgameAdvice: 'Rook endgames are the most common — keep your Rook active over saving pawns.',
    },
    examples: [
      {
        id: 'rook-ex-1',
        caption: 'The Rook controls the entire open file.',
        from: { file: 0, rank: 0 },
        to: [
          { file: 0, rank: 7 },
          { file: 7, rank: 0 },
        ],
      },
    ],
  },
  {
    id: 'bishop',
    name: 'Bishop',
    symbol: '♗',
    value: 3,
    difficulty: 'beginner',
    tagline: 'A long-range diagonal specialist.',
    overview: {
      summary:
        'The Bishop is a light piece confined to one color of squares for the entire game, but capable of striking across the whole board.',
      strengths: ['Strong in open diagonals', 'The "Bishop pair" is a well-known long-term advantage'],
      weaknesses: ['Restricted to one square color', 'Weak when its diagonal is blocked by pawns'],
      typicalUse: 'Developed early to active diagonals, often fianchettoed behind a pawn.',
    },
    movement: {
      description: 'The Bishop moves any number of squares diagonally, staying on the same color square forever.',
      rules: ['Moves diagonally only', 'Cannot jump over pieces', 'Each side has one light-squared and one dark-squared Bishop'],
    },
    strategy: {
      commonMistakes: ['Blocking your own Bishop with pawns', 'Trading your active Bishop for a passive Knight'],
      goodPositioning: ['Fianchetto for long diagonal control', 'Keep pawn chains flexible so diagonals stay open'],
      openingAdvice: 'Develop Bishops before your Queen, and aim them at open diagonals.',
      endgameAdvice: 'Opposite-colored Bishop endgames tend toward draws — same-colored Bishops favor the active side.',
    },
    examples: [
      {
        id: 'bishop-ex-1',
        caption: 'The Bishop rules the long diagonal.',
        from: { file: 2, rank: 0 },
        to: [
          { file: 7, rank: 5 },
          { file: 0, rank: 2 },
        ],
      },
    ],
  },
  {
    id: 'knight',
    name: 'Knight',
    symbol: '♘',
    value: 3,
    difficulty: 'intermediate',
    tagline: 'The only piece that can jump over others.',
    overview: {
      summary:
        'The Knight moves in a unique "L" shape and is the only piece that can leap over other pieces, making it excellent in closed positions.',
      strengths: ['Can jump over any piece', 'Strong in closed, blocked positions', 'Great fork potential'],
      weaknesses: ['Short range', 'Poor near the edge of the board'],
      typicalUse: 'Developed toward the center early, often to outposts protected by pawns.',
    },
    movement: {
      description: 'The Knight moves in an "L" shape: two squares in one direction, then one square perpendicular.',
      rules: [
        'Moves in an L-shape: 2+1 squares',
        'Can jump over any piece, friend or foe',
        'Always lands on the opposite square color from where it started',
      ],
    },
    strategy: {
      commonMistakes: ['Placing the Knight on the rim ("a Knight on the rim is dim")', 'Ignoring fork opportunities'],
      goodPositioning: ['Aim for strong central outposts', 'Support Knight outposts with pawns'],
      openingAdvice: 'Develop Knights before Bishops in most openings — "Knights before Bishops" is a common guideline.',
      endgameAdvice: 'A well-placed Knight can dominate a bad Bishop, especially in closed endgames.',
    },
    examples: [
      {
        id: 'knight-ex-1',
        caption: 'From the center, the Knight can reach up to 8 squares.',
        from: { file: 4, rank: 4 },
        to: [
          { file: 2, rank: 3 },
          { file: 2, rank: 5 },
          { file: 6, rank: 3 },
          { file: 6, rank: 5 },
          { file: 3, rank: 2 },
          { file: 5, rank: 2 },
          { file: 3, rank: 6 },
          { file: 5, rank: 6 },
        ],
      },
    ],
  },
  {
    id: 'pawn',
    name: 'Pawn',
    symbol: '♙',
    value: 1,
    difficulty: 'beginner',
    tagline: 'The soul of chess — small but strategically vital.',
    overview: {
      summary:
        'Pawns are the least valuable pieces individually, but their structure shapes the entire strategy of a game.',
      strengths: ['Can promote to any piece upon reaching the last rank', 'Forms the structural backbone of a position'],
      weaknesses: ['Cannot move backward', 'Weak when isolated or doubled'],
      typicalUse: 'Advanced carefully to control central squares and open lines for other pieces.',
    },
    movement: {
      description:
        'Pawns move forward one square (two on their first move) and capture diagonally one square forward.',
      rules: [
        'Moves forward one square; two squares on its first move only',
        'Captures diagonally, one square forward',
        'Can capture en passant under specific conditions',
        'Promotes to Queen, Rook, Bishop, or Knight upon reaching the final rank',
      ],
    },
    strategy: {
      commonMistakes: ['Creating unnecessary weaknesses like doubled or isolated pawns', 'Pushing pawns without a plan'],
      goodPositioning: ['Control the center with pawns early', 'Keep pawn chains connected when possible'],
      openingAdvice: 'Central pawn moves like e4/d4 or e5/d5 open lines for pieces and claim space.',
      endgameAdvice: 'Passed pawns become extremely powerful — push them with King support.',
    },
    examples: [
      {
        id: 'pawn-ex-1',
        caption: 'A pawn on its starting square can move one or two squares forward.',
        from: { file: 4, rank: 1 },
        to: [
          { file: 4, rank: 2 },
          { file: 4, rank: 3 },
        ],
      },
    ],
  },
];

export const getPieceById = (id: string) => pieces.find((p) => p.id === id);
