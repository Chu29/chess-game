import { Injectable } from '@nestjs/common';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { join } from 'node:path';

export interface StockfishMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface StockfishAnalysis {
  bestMove: StockfishMove;
  score: number;
  depth: number;
}

@Injectable()
export class StockfishService {
  private engine!: ChildProcessWithoutNullStreams;
  private isReady = false;
  private currentFen =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  private skillLevel = 10; // Default medium difficulty (0-20)

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine() {
    const enginePath = join(
      process.cwd(),
      'src',
      'ai',
      'stockfish',
      'stockfish-ubuntu-x86-64-avx2',
    );

    this.engine = spawn(enginePath);

    this.engine.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      // Log UCI responses for debugging
      if (output.includes('bestmove') || output.includes('info')) {
        console.log('[Stockfish]', output.trim());
      }
    });

    this.engine.stderr.on('data', (data: Buffer) => {
      console.error('[Stockfish Error]', data.toString());
    });

    this.engine.on('error', (error) => {
      console.error('[Stockfish] Failed to start engine:', error);
    });

    this.engine.on('exit', (code) => {
      console.log(`[Stockfish] Engine exited with code ${code}`);
    });

    // Initialize UCI protocol
    this.sendCommand('uci');
    this.sendCommand('setoption name Skill Level value 10');
    this.sendCommand('isready');

    // Wait for engine to be ready
    setTimeout(() => {
      this.isReady = true;
    }, 500);
  }

  private taskQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  private enqueueTask<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.taskQueue.push(async () => {
        try {
          const res = await task();
          resolve(res);
        } catch (err) {
          reject(err as Error);
        }
      });
      void this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.taskQueue.length === 0) return;
    this.isProcessingQueue = true;
    const nextTask = this.taskQueue.shift();
    if (nextTask) {
      try {
        await nextTask();
      } catch (err) {
        console.error('[Stockfish Queue Error]', err);
      }
    }
    this.isProcessingQueue = false;
    void this.processQueue();
  }

  private sendCommand(command: string): void {
    if (this.engine && this.engine.stdin) {
      this.engine.stdin.write(command + '\n');
    }
  }

  setPosition(fen: string): void {
    this.currentFen = fen;
    this.sendCommand(`position fen ${fen}`);
  }

  setDifficulty(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): void {
    const skillLevels = {
      EASY: 0,
      MEDIUM: 10,
      HARD: 20,
    };
    this.skillLevel = skillLevels[difficulty];
    this.sendCommand(`setoption name Skill Level value ${this.skillLevel}`);
  }

  async getBestMoveForPosition(
    fen: string,
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM',
    depth?: number,
  ): Promise<StockfishMove> {
    return this.enqueueTask(async () => {
      if (!this.isReady) {
        throw new Error('Stockfish engine is not ready');
      }

      const targetDepth =
        depth ?? (difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 8 : 12);
      const skillLevel =
        difficulty === 'EASY' ? 0 : difficulty === 'MEDIUM' ? 10 : 20;

      this.sendCommand(`setoption name Skill Level value ${skillLevel}`);
      this.sendCommand(`position fen ${fen}`);

      return new Promise<StockfishMove>((resolve, reject) => {
        let bestMove: StockfishMove | null = null;

        const timeout = setTimeout(() => {
          this.engine.stdout.off('data', listener);
          reject(new Error('Stockfish analysis timeout'));
        }, 10000);

        const listener = (data: Buffer) => {
          const output = data.toString();
          const bestmoveMatch = output.match(/bestmove (\w{4})(\w)?/);

          if (bestmoveMatch) {
            const [, move, promotion] = bestmoveMatch;
            bestMove = {
              from: move.substring(0, 2),
              to: move.substring(2, 4),
              promotion: promotion || undefined,
            };

            this.engine.stdout.off('data', listener);
            clearTimeout(timeout);
            resolve(bestMove);
          }
        };

        this.engine.stdout.on('data', listener);

        this.sendCommand(`go depth ${targetDepth}`);
      });
    });
  }

  async getBestMove(depth = 15): Promise<StockfishMove> {
    return this.enqueueTask(async () => {
      if (!this.isReady) {
        throw new Error('Stockfish engine is not ready');
      }

      return new Promise<StockfishMove>((resolve, reject) => {
        let bestMove: StockfishMove | null = null;

        const timeout = setTimeout(() => {
          this.engine.stdout.off('data', listener);
          reject(new Error('Stockfish analysis timeout'));
        }, 10000);

        const listener = (data: Buffer) => {
          const output = data.toString();
          const bestmoveMatch = output.match(/bestmove (\w{4})(\w)?/);

          if (bestmoveMatch) {
            const [, move, promotion] = bestmoveMatch;
            bestMove = {
              from: move.substring(0, 2),
              to: move.substring(2, 4),
              promotion: promotion || undefined,
            };

            this.engine.stdout.off('data', listener);
            clearTimeout(timeout);
            resolve(bestMove);
          }
        };

        this.engine.stdout.on('data', listener);

        this.sendCommand(`go depth ${depth}`);
      });
    });
  }

  async getBestMoveWithAnalysis(depth = 15): Promise<StockfishAnalysis> {
    return this.enqueueTask(async () => {
      if (!this.isReady) {
        throw new Error('Stockfish engine is not ready');
      }

      return new Promise<StockfishAnalysis>((resolve, reject) => {
        let bestMove: StockfishMove | null = null;
        let score = 0;
        let analysisDepth = 0;

        const timeout = setTimeout(() => {
          this.engine.stdout.off('data', listener);
          reject(new Error('Stockfish analysis timeout'));
        }, 10000);

        const listener = (data: Buffer) => {
          const output = data.toString();

          const scoreMatch = output.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            score = parseInt(scoreMatch[1], 10);
          }

          const mateMatch = output.match(/score mate (-?\d+)/);
          if (mateMatch) {
            score = mateMatch[1] === '0' ? 100000 : -100000;
          }

          const depthMatch = output.match(/depth (\d+)/);
          if (depthMatch) {
            analysisDepth = parseInt(depthMatch[1], 10);
          }

          const bestmoveMatch = output.match(/bestmove (\w{4})(\w)?/);
          if (bestmoveMatch) {
            const [, move, promotion] = bestmoveMatch;
            bestMove = {
              from: move.substring(0, 2),
              to: move.substring(2, 4),
              promotion: promotion || undefined,
            };

            this.engine.stdout.off('data', listener);
            clearTimeout(timeout);
            resolve({
              bestMove,
              score,
              depth: analysisDepth,
            });
          }
        };

        this.engine.stdout.on('data', listener);

        this.sendCommand(`go depth ${depth}`);
      });
    });
  }

  resetToStartingPosition(): void {
    this.currentFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.sendCommand('position startpos');
  }

  onModuleDestroy() {
    if (this.engine) {
      this.sendCommand('quit');
      this.engine.kill();
    }
  }
}
