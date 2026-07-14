import { PracticeChallenge } from '../types/academy';

export const practiceChallenges: PracticeChallenge[] = [
  {
    id: 'beginner-piece-movement',
    title: 'Beginner Piece Movement',
    description: 'Practice moving each piece correctly across an empty board.',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    progress: 100,
    state: 'completed',
  },
  {
    id: 'move-the-knight',
    title: 'Move the Knight',
    description: 'Navigate the Knight to the target square in the fewest moves.',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    progress: 60,
    state: 'unlocked',
  },
  {
    id: 'protect-the-king',
    title: 'Protect the King',
    description: 'Identify the best defensive move to keep your King safe.',
    difficulty: 'intermediate',
    estimatedMinutes: 6,
    progress: 0,
    state: 'unlocked',
  },
  {
    id: 'capture-the-queen',
    title: 'Capture the Queen',
    description: 'Spot the tactic that wins the opponent\'s Queen.',
    difficulty: 'intermediate',
    estimatedMinutes: 7,
    progress: 0,
    state: 'locked',
  },
  {
    id: 'checkmate-in-one',
    title: 'Checkmate in One',
    description: 'Find the single move that delivers checkmate.',
    difficulty: 'advanced',
    estimatedMinutes: 5,
    progress: 0,
    state: 'locked',
  },
  {
    id: 'learn-castling',
    title: 'Learn Castling',
    description: 'Practice recognizing when and how to castle safely.',
    difficulty: 'beginner',
    estimatedMinutes: 4,
    progress: 0,
    state: 'locked',
  },
];

export const getChallengeById = (id: string) => practiceChallenges.find((c) => c.id === id);
