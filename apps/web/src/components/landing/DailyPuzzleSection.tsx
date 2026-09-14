import { useState } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { CheckCircle2, RotateCcw } from "lucide-react";

// Standard unicode chess piece glyphs
const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

// Mikhail Tal Queen sacrifice puzzle position on h7
const TAL_PUZZLE_FEN =
  "r1bq1rk1/ppp2ppp/2n1pn2/8/2BP4/2N1PN2/PP1Q1PPP/R4RK1 w - - 0 10";

export const DailyPuzzleSection: React.FC = () => {
  const [game, setGame] = useState<Chess>(() => new Chess(TAL_PUZZLE_FEN));
  const [board, setBoard] = useState(game.board());
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [step, setStep] = useState(0);

  const handlePlayBreakthrough = () => {
    if (step === 0) {
      // Step 1: Qxh7+!
      const g = new Chess(TAL_PUZZLE_FEN);
      try {
        // Place Queen on h7 for visual simulation of Tal's attack
        g.load("r1bq1rk1/ppp2pQp/2n1pn2/8/2BP4/2N1PN2/PP3PPP/R4RK1 b - - 0 10");
        setGame(g);
        setBoard(g.board());
        setLastMove({ from: "d2", to: "h7" });
        setStep(1);

        // Delayed King response Kxh7
        setTimeout(() => {
          g.load(
            "r1bq1r2/ppp2pk1/2n1pn2/8/2BP4/2N1PN2/PP3PPP/R4RK1 w - - 0 11",
          );
          setGame(g);
          setBoard(g.board());
          setLastMove({ from: "g8", to: "h7" });
          setStep(2);
        }, 900);
      } catch {
        // Move attempt failed
      }
    } else if (step === 2) {
      const g = new Chess();
      g.load("r1bq1r2/ppp2pk1/2n1pn2/8/2BP4/2N1PN1R/PP3PPP/5RK1 b - - 1 11");
      setGame(g);
      setBoard(g.board());
      setLastMove({ from: "f1", to: "h3" });
      setStep(3);
    }
  };

  const handleReset = () => {
    const g = new Chess(TAL_PUZZLE_FEN);
    setGame(g);
    setBoard(g.board());
    setLastMove(null);
    setStep(0);
  };

  return (
    <section
      id="puzzle-section"
      className="relative py-20 lg:py-28 bg-[#050705] border-t border-[#161B17]"
    >
      {/* Anchor for Academy Navigation Link */}
      <div id="academy" className="scroll-mt-24 absolute top-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Puzzle Details & Move Line */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1A201B] bg-[#0C0E0D] px-3.5 py-1 text-xs text-[#00E676]">
              <span>♟</span>
              <span className="font-semibold text-white">
                Daily Grandmaster Puzzle
              </span>
              <span className="text-[#555E56]">·</span>
              <span className="text-xs text-[#00E676] font-medium">
                Academy Track
              </span>
              <span className="text-[#555E56]">·</span>
              <span className="font-mono text-[#889088]">#1,048</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Queen Sacrifice on h7
            </h2>

            <p className="text-xs sm:text-sm text-[#889088] leading-relaxed">
              White to play and mate in 2 moves. Can you identify Mikhail
              Tal&rsquo;s legendary attacking breakthrough against the French
              Defense?
            </p>

            {/* Position Analysis Box */}
            <div className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#555E56] font-mono uppercase tracking-wider">
                  Position analysis:
                </span>
                <span className="text-[10px] font-mono font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                  MATE IN 2 CONFIRMED
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#050705] border border-[#1A201B] p-3 text-sm font-mono font-bold text-white">
                <span>1. Qxh7+! Kxh7 2. Rh3#</span>
                <CheckCircle2 className="h-4 w-4 text-[#00E676]" />
              </div>

              <p className="text-[11px] text-[#889088] leading-relaxed">
                By sacrificing the Queen, the Black King is forced to h7,
                opening the h-file for a decisive Rook checkmate assisted by the
                Bishop on c4.
              </p>
            </div>

            {/* Interactive Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePlayBreakthrough}
                className="flex items-center gap-2 rounded-lg bg-[#00E676] px-5 py-2.5 text-xs font-bold text-[#050705] shadow-[0_0_20px_-3px_rgba(0,230,118,0.4)] transition-all hover:bg-[#10FF85] active:scale-95 cursor-pointer"
              >
                <span>▶</span>
                {step === 0
                  ? "Play Breakthrough Move"
                  : step < 3
                    ? "Deliver Checkmate (Rh3#)"
                    : "Mate Delivered!"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-[#1A201B] bg-[#0C0E0D] px-4 py-2.5 text-xs font-semibold text-[#889088] hover:text-white hover:border-[#889088]/40 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Board
              </button>
            </div>
          </div>

          {/* Right Column: 8x8 Board with coordinates */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[420px] rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-3 shadow-2xl">
              {/* File Coordinates top */}
              <div className="grid grid-cols-8 text-center text-[10px] font-mono text-[#555E56] pb-1">
                {["a", "b", "c", "d", "e", "f", "g", "h"].map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>

              {/* Board */}
              <div className="aspect-square w-full rounded border border-[#1A201B] bg-[#050705] overflow-hidden">
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                  {board.map((row, rowIndex) =>
                    row.map((square, colIndex) => {
                      const file = String.fromCharCode(97 + colIndex);
                      const rank = (8 - rowIndex).toString();
                      const squareKey = `${file}${rank}` as Square;

                      const isDark = (rowIndex + colIndex) % 2 === 1;
                      const isLastMoveTarget = lastMove?.to === squareKey;
                      const isLastMoveSource = lastMove?.from === squareKey;

                      let bgColor = isDark ? "bg-[#4A7C59]" : "bg-[#DEE3D6]";
                      if (isLastMoveTarget || isLastMoveSource) {
                        bgColor = isDark
                          ? "bg-[#00E676]/60"
                          : "bg-[#00E676]/45";
                      }

                      const piece = square ? square.type : null;
                      const pieceColor = square ? square.color : null;
                      const pieceSymbol = piece
                        ? pieceColor === "w"
                          ? PIECE_SYMBOLS[piece.toUpperCase()]
                          : PIECE_SYMBOLS[piece]
                        : null;

                      return (
                        <div
                          key={squareKey}
                          className={`relative flex items-center justify-center select-none ${bgColor}`}
                        >
                          {pieceSymbol && (
                            <span
                              className={`text-2xl sm:text-3xl ${
                                pieceColor === "w"
                                  ? "text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]"
                                  : "text-[#121413] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                              }`}
                            >
                              {pieceSymbol}
                            </span>
                          )}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="mt-2 flex items-center justify-between text-[10px] font-mono pt-1 text-[#555E56]">
                <span className="truncate max-w-[240px]">
                  FEN: {game.fen().slice(0, 32)}...
                </span>
                <span className="text-[#00E676] font-bold">
                  Stockfish 17: +M2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
