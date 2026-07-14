import { ChessRule } from '../types/academy';

export const rules: ChessRule[] = [
  {
    id: 'check',
    title: 'Check',
    shortDescription: "When the King is under direct attack.",
    difficulty: 'beginner',
    icon: '⚠️',
    content: [
      'A King is "in check" when it is directly attacked by an enemy piece.',
      'The player in check must immediately address it on their next move — there is no other option.',
    ],
    tips: [
      'You can escape check by moving the King, blocking the attack, or capturing the attacker.',
      'You are never allowed to make a move that leaves your own King in check.',
    ],
    examples: [
      {
        id: 'check-ex-1',
        caption: 'The Queen delivers check along the open file.',
        from: { file: 4, rank: 7 },
        to: [{ file: 4, rank: 0 }],
      },
    ],
  },
  {
    id: 'checkmate',
    title: 'Checkmate',
    shortDescription: 'The King is in check with no legal escape — the game ends.',
    difficulty: 'beginner',
    icon: '👑',
    content: [
      'Checkmate occurs when the King is in check and there is no legal move to remove the threat.',
      'The game ends immediately — the player who delivers checkmate wins.',
    ],
    tips: [
      'Look for moves that restrict all of the King\'s escape squares before delivering the final blow.',
      'Common patterns include the back-rank mate and the smothered mate.',
    ],
    examples: [
      {
        id: 'checkmate-ex-1',
        caption: 'A classic back-rank checkmate pattern.',
        from: { file: 0, rank: 7 },
        to: [{ file: 4, rank: 7 }],
        blocked: [
          { file: 3, rank: 6 },
          { file: 4, rank: 6 },
          { file: 5, rank: 6 },
        ],
      },
    ],
  },
  {
    id: 'stalemate',
    title: 'Stalemate',
    shortDescription: 'No legal moves and not in check — the game is a draw.',
    difficulty: 'intermediate',
    icon: '🤝',
    content: [
      'Stalemate happens when a player has no legal moves available, but their King is not in check.',
      'Unlike checkmate, a stalemate results in an immediate draw, regardless of material advantage.',
    ],
    tips: [
      'Be careful when you have a large material advantage — trapping the enemy King without giving it any moves can accidentally cause a stalemate.',
      'Stalemate is a common defensive resource in losing endgames.',
    ],
    examples: [
      {
        id: 'stalemate-ex-1',
        caption: "The King has no legal moves, but is not in check — a draw.",
        from: { file: 0, rank: 0 },
        to: [],
        blocked: [
          { file: 1, rank: 0 },
          { file: 0, rank: 1 },
          { file: 1, rank: 1 },
        ],
      },
    ],
  },
  {
    id: 'castling',
    title: 'Castling',
    shortDescription: 'A special King + Rook move that improves King safety.',
    difficulty: 'beginner',
    icon: '🏰',
    content: [
      'Castling is a special move involving the King and a Rook, moving two pieces at once.',
      'The King moves two squares toward a Rook, and that Rook jumps to the square beside the King.',
    ],
    tips: [
      'Neither the King nor the chosen Rook may have moved previously.',
      'There must be no pieces between the King and Rook, and the King cannot castle through or into check.',
      'Castling kingside ("short") or queenside ("long") — kingside is typically faster and safer.',
    ],
    examples: [
      {
        id: 'castle-ex-1',
        caption: 'Kingside castling: King and Rook swap positions safely.',
        from: { file: 4, rank: 0 },
        to: [{ file: 6, rank: 0 }],
      },
    ],
  },
  {
    id: 'en-passant',
    title: 'En Passant',
    shortDescription: 'A special pawn capture rule, often missed by beginners.',
    difficulty: 'intermediate',
    icon: '👻',
    content: [
      'En passant ("in passing") lets a pawn capture an enemy pawn that just moved two squares, as if it had only moved one.',
      'This special capture is only legal immediately after the enemy pawn\'s two-square advance.',
    ],
    tips: [
      'If you don\'t capture en passant on the very next move, the option disappears.',
      'It only applies when your pawn is on its fifth rank and the enemy pawn moves two squares beside it.',
    ],
    examples: [
      {
        id: 'en-passant-ex-1',
        caption: 'The pawn captures diagonally onto the square the enemy pawn passed over.',
        from: { file: 3, rank: 4 },
        to: [{ file: 4, rank: 5 }],
        blocked: [{ file: 4, rank: 4 }],
      },
    ],
  },
  {
    id: 'pawn-promotion',
    title: 'Pawn Promotion',
    shortDescription: 'A pawn reaching the final rank becomes a stronger piece.',
    difficulty: 'beginner',
    icon: '⭐',
    content: [
      'When a pawn reaches the opponent\'s back rank, it must be promoted to a Queen, Rook, Bishop, or Knight.',
      'Most promotions choose a Queen, since it is the most powerful piece — this is called "queening".',
    ],
    tips: [
      'Occasionally a Knight promotion is stronger due to its unique jumping move — this is called "underpromotion".',
      'Supporting a passed pawn\'s path to promotion is a key endgame skill.',
    ],
    examples: [
      {
        id: 'promotion-ex-1',
        caption: 'A pawn reaches the last rank and promotes to a Queen.',
        from: { file: 4, rank: 6 },
        to: [{ file: 4, rank: 7 }],
      },
    ],
  },
];

export const getRuleById = (id: string) => rules.find((r) => r.id === id);
