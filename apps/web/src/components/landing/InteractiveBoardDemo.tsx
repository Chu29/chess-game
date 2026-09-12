import { useState, useEffect } from "react";
import { Chess, type Square } from "chess.js";
import {
  Shield,
  Zap,
  Flag,
  RotateCw,
  Lightbulb,
  Handshake,
} from "lucide-react";

// Piece Unicode symbols for visual board rendering
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

// Initial position matching the user's mockup: tactical position where Knight is centralized on d5
const MOCK_START_FEN =
  "r1bqkb1r/pppp1ppp/2n5/3Np3/2B1n3/5N2/PPPP1PPP/R1BQK2R w KQkq - 0 6";

export const InteractiveBoardDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "live" | "ai" | "academy" | "telemetry"
  >("live");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#grandmaster-ai") {
        setActiveTab("ai");
      } else if (hash === "#interactive-terminal") {
        setActiveTab("live");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const [game, setGame] = useState<Chess>(() => new Chess(MOCK_START_FEN));
  const [board, setBoard] = useState(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    {
      from: "c3",
      to: "d5",
    },
  );

  const [evalScore, setEvalScore] = useState("+1.84");
  const [bestMoveLabel, setBestMoveLabel] = useState("Nd5!");
  const [calcTime, setCalcTime] = useState("348ms");
  const [hintActive, setHintActive] = useState(false);

  // Handle square clicks
  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        try {
          const move = game.move({
            from: selectedSquare,
            to: square,
            promotion: "q",
          });

          if (move) {
            setBoard(game.board());
            setLastMove({ from: selectedSquare, to: square });
            setSelectedSquare(null);
            setLegalMoves([]);
            setCalcTime("182ms");

            if (square === "d5" || move.san === "Nd5") {
              setEvalScore("+2.10");
              setBestMoveLabel("Nd5!");
            } else {
              setEvalScore("+0.92");
              setBestMoveLabel("c3");
            }
            return;
          }
        } catch {
          // Illegal move attempt
        }
      }
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map((m) => m.to);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleResetBoard = () => {
    const g = new Chess(MOCK_START_FEN);
    setGame(g);
    setBoard(g.board());
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove({ from: "c3", to: "d5" });
    setEvalScore("+1.84");
    setBestMoveLabel("Nd5!");
    setCalcTime("348ms");
    setHintActive(false);
  };

  return (
    <section
      id="interactive-terminal"
      className="relative py-16 lg:py-24 bg-[#050705]"
    >
      {/* Anchor for Grandmaster AI Navigation Link */}
      <div id="grandmaster-ai" className="scroll-mt-24 absolute top-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Pill Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1A201B] bg-[#0C0E0D] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#00E676]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E676] animate-ping" />
            INTERACTIVE TERMINAL
          </div>
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mt-4 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tactile Mobile Simulation
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#889088]">
            Engineered precision controls matching official FIDE tournament
            boards.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "live"
                ? "bg-[#00E676] text-[#050705] shadow-[0_0_15px_-3px_rgba(0,230,118,0.4)]"
                : "bg-[#0C0E0D] border border-[#1A201B] text-[#889088] hover:text-white"
            }`}
          >
            <span>▶</span> Live Match Play
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-[#00E676] text-[#050705] font-bold"
                : "bg-[#0C0E0D] border border-[#1A201B] text-[#889088] hover:text-white"
            }`}
          >
            <span>⚙</span> Grandmaster AI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("academy")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "academy"
                ? "bg-[#00E676] text-[#050705] font-bold"
                : "bg-[#0C0E0D] border border-[#1A201B] text-[#889088] hover:text-white"
            }`}
          >
            <span>♞</span> Movement Academy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "telemetry"
                ? "bg-[#00E676] text-[#050705] font-bold"
                : "bg-[#0C0E0D] border border-[#1A201B] text-[#889088] hover:text-white"
            }`}
          >
            <span>⚡</span> ELO Telemetry
          </button>
        </div>

        {/* 3-Column Centerpiece: Left Cards, Phone Frame, Right Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-6xl mx-auto">
          {/* Left Column: 2 Telemetry Cards */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
            {/* Card 1: Dynamic Evaluation / AI / Academy Feedback */}
            <div className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A201B]">
                <span className="font-mono font-black text-[#00E676] text-sm tracking-tight">
                  {activeTab === "ai"
                    ? "GEMINI 3.5 AI"
                    : activeTab === "academy"
                      ? "TACTICAL OUTPOST"
                      : activeTab === "telemetry"
                        ? "EDGE TELEMETRY"
                        : `EVAL ${evalScore}`}
                </span>
                <span className="text-[10px] font-mono text-[#555E56] uppercase tracking-wider">
                  {activeTab === "ai"
                    ? "DUAL ENGINE"
                    : activeTab === "academy"
                      ? "CURRICULUM"
                      : activeTab === "telemetry"
                        ? "SOCKET.IO"
                        : "STOCKFISH 17"}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-[#889088] leading-relaxed">
                {activeTab === "ai"
                  ? "White holds decisive central control. Knight on d5 exerts dominant board pressure, restricting Black's f6 response while opening diagonal tactics."
                  : activeTab === "academy"
                    ? "Tactical mastery: A central knight outpost on d5 anchors attacking lines against f7 and cannot be dislodged by opponent pawns."
                    : activeTab === "telemetry"
                      ? "Direct TCP edge tunneling with sub-14ms sync across global clusters. Authoritative FEN validation prevents illegal board states."
                      : "White holds central outpost advantage. Knight on d5 exerts dominant board pressure."}
              </p>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-[#1A201B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#00E676] h-full transition-all duration-500"
                  style={{
                    width:
                      activeTab === "ai"
                        ? "85%"
                        : activeTab === "academy"
                          ? "75%"
                          : activeTab === "telemetry"
                            ? "98%"
                            : "65%",
                  }}
                />
              </div>
            </div>

            {/* Card 2: Engine Profile / Active Drill */}
            <div className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 text-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#1A201B]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#141A16] border border-[#1F2620] text-[#00E676] text-[10px] font-bold">
                  {activeTab === "academy" ? "AC" : "GM"}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {activeTab === "ai"
                      ? "Stockfish 17 NNUE"
                      : activeTab === "academy"
                        ? "Mastery Challenge #4"
                        : activeTab === "telemetry"
                          ? "Frankfurt Edge Node"
                          : "Carlsen Neural 17"}
                  </div>
                  <div className="text-[10px] text-[#555E56]">
                    {activeTab === "ai"
                      ? "Depth 32 · Alpha-Beta"
                      : activeTab === "academy"
                        ? "Knight Centralization"
                        : activeTab === "telemetry"
                          ? "99.8% Heuristic Filter"
                          : "2842 FIDE ELIC"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-[#889088]">
                  {activeTab === "academy" ? "Status:" : "Calc:"}{" "}
                  <span className="text-white font-mono">
                    {activeTab === "academy" ? "Active" : calcTime}
                  </span>
                </span>
                <span className="text-[#00E676] font-mono font-bold">
                  {activeTab === "academy"
                    ? "Goal: d5 Dominance"
                    : `Best: ${bestMoveLabel}`}
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Phone Mockup Frame */}
          <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] sm:max-w-[370px] rounded-[38px] border-4 border-[#1A201B] bg-[#070908] p-3 shadow-[0_0_50px_-10px_rgba(0,230,118,0.15)]">
              {/* Phone Speaker Notch */}
              <div className="mx-auto h-3.5 w-24 rounded-full bg-[#1A201B] mb-2.5" />

              {/* In-Phone Screen */}
              <div className="rounded-[28px] bg-[#0C0E0D] border border-[#161B17] p-3 flex flex-col justify-between">
                {/* Opponent Info Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#161B17] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#161B17] text-[10px] text-[#889088]">
                      AI
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">
                        Stockfish Neural
                      </div>
                      <div className="text-[9px] text-[#555E56]">3180 ELO</div>
                    </div>
                  </div>
                  <div className="rounded bg-[#161B17] px-2 py-0.5 font-mono text-[11px] font-bold text-white border border-[#1F2620]">
                    03:42
                  </div>
                </div>

                {/* The Chessboard */}
                <div className="my-2.5 aspect-square w-full rounded-lg overflow-hidden border border-[#161B17] bg-[#050705] p-1 shadow-inner">
                  <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded overflow-hidden">
                    {board.map((row, rowIndex) =>
                      row.map((square, colIndex) => {
                        const file = String.fromCharCode(97 + colIndex);
                        const rank = (8 - rowIndex).toString();
                        const squareKey = `${file}${rank}` as Square;

                        const isDark = (rowIndex + colIndex) % 2 === 1;
                        const isSelected = selectedSquare === squareKey;
                        const isLegalMove = legalMoves.includes(squareKey);
                        const isLastMoveTarget = lastMove?.to === squareKey;
                        const isLastMoveSource = lastMove?.from === squareKey;

                        // Tournament green-and-beige colors matching user design
                        let bgColor = isDark ? "bg-[#4A7C59]" : "bg-[#DEE3D6]";

                        if (isSelected) {
                          bgColor = "bg-[#00E676]/70 ring-2 ring-[#00E676]";
                        } else if (isLastMoveTarget || isLastMoveSource) {
                          bgColor = isDark
                            ? "bg-[#00E676]/50"
                            : "bg-[#00E676]/40";
                        }

                        const piece = square ? square.type : null;
                        const pieceColor = square ? square.color : null;
                        const pieceSymbol = piece
                          ? pieceColor === "w"
                            ? PIECE_SYMBOLS[piece.toUpperCase()]
                            : PIECE_SYMBOLS[piece]
                          : null;

                        return (
                          <button
                            key={squareKey}
                            type="button"
                            onClick={() => handleSquareClick(squareKey)}
                            className={`relative flex items-center justify-center select-none transition-colors duration-100 ${bgColor} cursor-pointer`}
                            aria-label={`Square ${squareKey}`}
                          >
                            {/* Legal Move Dot */}
                            {isLegalMove && (
                              <div
                                className={`absolute z-10 rounded-full ${
                                  square
                                    ? "h-full w-full border-4 border-[#00E676]/90"
                                    : "h-3 w-3 bg-[#00E676]/90 shadow-sm"
                                }`}
                              />
                            )}

                            {/* Chess Piece Display */}
                            {pieceSymbol && (
                              <span
                                className={`text-xl sm:text-2xl transition-transform ${
                                  pieceColor === "w"
                                    ? "text-[#FFFFFF] drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)]"
                                    : "text-[#121413] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                                } ${isSelected ? "scale-110" : "scale-100"}`}
                              >
                                {pieceSymbol}
                              </span>
                            )}
                          </button>
                        );
                      }),
                    )}
                  </div>
                </div>

                {/* User Player Info Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#161B17] text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00E676]/20 border border-[#00E676]/30 text-[10px] font-bold text-[#00E676]">
                      AM
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white leading-tight">
                        Alex Mercer
                      </div>
                      <div className="text-[9px] text-[#555E56]">
                        2284 ELO (Live)
                      </div>
                    </div>
                  </div>
                  <div className="rounded bg-[#00E676] px-2 py-0.5 font-mono text-[11px] font-bold text-[#050705]">
                    04:18
                  </div>
                </div>

                {/* Mobile Bottom Utility Toolbar */}
                <div className="mt-3 pt-2 border-t border-[#161B17] flex items-center justify-around text-[#889088]">
                  <button
                    type="button"
                    onClick={handleResetBoard}
                    className="p-1 hover:text-white cursor-pointer"
                    title="Reset Board"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setHintActive(!hintActive)}
                    className="p-1 hover:text-[#00E676] cursor-pointer"
                    title="Request Hint"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-white cursor-pointer"
                    title="Offer Draw"
                  >
                    <Handshake className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-white cursor-pointer"
                    title="Resign"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2 Telemetry Cards */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-3">
            {/* Card 1: WEBSOCKET EDGE */}
            <div className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 text-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E676] uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 fill-current" />
                WEBSOCKET EDGE
              </div>
              <p className="mt-2 text-[11px] text-[#889088] leading-relaxed">
                Direct TCP edge tunneling guarantees sub-15ms sync for critical
                bullet time blitzes.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-[#00E676]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E676] animate-pulse" />
                Frankfurt · Tokyo · NYC Active
              </div>
            </div>

            {/* Card 2: Fair Play Engine */}
            <div className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A201B]">
                <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                  <Shield className="h-3.5 w-3.5 text-[#00E676]" />
                  Fair Play Engine
                </div>
              </div>
              <p className="mt-2 text-[11px] text-[#889088] leading-relaxed">
                Continuous behavioral move-vector & touch curvature evaluation
                per ply.
              </p>
              <div className="mt-3">
                <span className="inline-block rounded border border-[#00E676]/30 bg-[#00E676]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00E676]">
                  Verified Clean Status
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
