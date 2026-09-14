import { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  Terminal,
  MessageSquareCode,
} from "lucide-react";

export const AiCoachSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "hints" | "evaluation" | "position" | "review"
  >("hints");

  return (
    <section id="ai-coach" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background accents */}
      <div
        className="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#8FC24A]/5 blur-[150px] rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8FC24A]/30 bg-[#1C2418] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#8FC24A]">
            <Sparkles className="h-3.5 w-3.5" />
            The Dual-Engine Innovation
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
            Why Play with a Cold Engine When You Can Play with a Coach?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8A9086] leading-relaxed">
            Traditional chess engines tell you that you made a blunder with an
            abstract number like{" "}
            <code className="text-[#E4574C] font-mono font-bold">-3.8</code>.
            Chuvinjab Chess pairs{" "}
            <span className="text-[#5B9BD5] font-semibold">
              Stockfish 16+ NNUE
            </span>{" "}
            for infallible calculation with{" "}
            <span className="text-[#8FC24A] font-semibold">Google Gemini</span>{" "}
            to explain the tactics, psychology, and positional concepts behind
            every move in plain English.
          </p>
        </div>

        {/* Side-by-Side Comparison: Traditional Engine vs Chuvinjab Coach */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Traditional Engine Card */}
          <div className="rounded-2xl border border-[#232A24] bg-[#0D110F] p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#232A24]">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#8A9086]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8A9086]">
                    Standard Raw Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8A9086]">
                  UCI Protocol
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-[#161B17] p-3.5 font-mono text-xs text-[#8A9086] space-y-1.5 border border-[#232A24]">
                <p className="text-[#E4574C]">
                  info depth 24 score cp -340 nodes 18200000
                </p>
                <p className="text-[#8A9086]">bestmove f3d4 ponder c7c5</p>
                <p className="text-[#8A9086]">
                  eval error: pv e2e4 e7e5 g1f3 b8c6 f1c4
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#232A24] flex items-center gap-2 text-xs text-[#E4574C]">
              <span>
                ✕ Leaves 95% of players confused about why a move failed.
              </span>
            </div>
          </div>

          {/* Chuvinjab Dual-Engine Card */}
          <div className="rounded-2xl border border-[#8FC24A]/40 bg-[#161B17] p-6 flex flex-col justify-between shadow-[0_0_30px_-5px_rgba(143,194,74,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#8FC24A]/10 rounded-full blur-2xl" />
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#232A24]">
                <div className="flex items-center gap-2">
                  <MessageSquareCode className="h-4 w-4 text-[#8FC24A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8FC24A]">
                    Chuvinjab Dual-Engine
                  </span>
                </div>
                <span className="rounded-full bg-[#1C2418] border border-[#8FC24A]/30 px-2 py-0.5 text-[10px] font-bold text-[#8FC24A]">
                  Stockfish + Gemini
                </span>
              </div>
              <div className="mt-4 rounded-lg bg-[#0D110F] p-3.5 text-xs text-[#F2F4F0] border border-[#232A24] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8FC24A]">
                    Stockfish: Nd4 (+1.8)
                  </span>
                  <span className="text-[10px] bg-[#8FC24A]/20 text-[#8FC24A] font-semibold px-2 py-0.5 rounded">
                    BEST MOVE
                  </span>
                </div>
                <p className="text-[#8A9086] text-xs leading-relaxed italic">
                  &ldquo;Gemini Coach: &lsquo;Nd4 centralizes your knight on a
                  powerful forward outpost while dislodging Black&rsquo;s queen
                  from the e-file and opening line-of-sight for your
                  dark-squared bishop to enter the attack.&rsquo;&rdquo;
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#232A24] flex items-center gap-2 text-xs text-[#8FC24A]">
              <span>
                ✓ Instant tactical understanding and retention for every skill
                level.
              </span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Feature Pillars (Tabs) */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#232A24]">
            <button
              type="button"
              onClick={() => setActiveTab("hints")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "hints"
                  ? "bg-[#8FC24A] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0] hover:bg-[#0D110F]"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              1. In-Game Move Hints
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("evaluation")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "evaluation"
                  ? "bg-[#8FC24A] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0] hover:bg-[#0D110F]"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              2. Pre-Move Evaluation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("position")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "position"
                  ? "bg-[#8FC24A] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0] hover:bg-[#0D110F]"
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              3. Positional Diagnosis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "review"
                  ? "bg-[#8FC24A] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0] hover:bg-[#0D110F]"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              4. Post-Game Analysis
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="mt-6">
            {activeTab === "hints" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8FC24A]">
                    Hint Request Engine
                  </span>
                  <h3 className="text-xl font-bold text-[#F2F4F0]">
                    Never Stay Stuck: On-Demand Tactical Guidance
                  </h3>
                  <p className="text-sm text-[#8A9086] leading-relaxed">
                    Stuck in a complex mid-game tactical bind? Tap the Hint
                    button. Our backend queries Stockfish inside a safe queue,
                    isolates the candidate move, passes the FEN context to
                    Gemini, and decrements your game hint quota while coaching
                    you on how to exploit the opponent&rsquo;s blunder.
                  </p>
                  <div className="pt-2 flex flex-col gap-2 text-xs text-[#F2F4F0]">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-[#8FC24A]" />
                      <span>
                        Configurable hints-per-game quotas for focused learning
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-[#8FC24A]" />
                      <span>
                        Zero hallucination: Gemini only explains moves validated
                        by Stockfish
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#232A24] text-[#8A9086]">
                    <span>POST /ai/hint</span>
                    <span className="text-[#8FC24A]">200 OK</span>
                  </div>
                  <pre className="mt-3 text-[11px] font-mono text-[#8A9086] overflow-x-auto leading-relaxed">
                    {`{
  "bestMove": "Nf3",
  "score": "+0.7",
  "explanation": "Develops the knight
  toward the center, controlling d4
  and e5 while preparing kingside
  castling."
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "evaluation" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5B9BD5]">
                    Real-Time Classification
                  </span>
                  <h3 className="text-xl font-bold text-[#F2F4F0]">
                    Pre-Move & Live Move Evaluation
                  </h3>
                  <p className="text-sm text-[#8A9086] leading-relaxed">
                    Each move is categorized across 5 official tiers:{" "}
                    <span className="text-[#8FC24A] font-semibold">BEST</span>,{" "}
                    <span className="text-[#A0D656] font-semibold">GOOD</span>,{" "}
                    <span className="text-[#DDAA55] font-semibold">
                      INACCURACY
                    </span>
                    ,{" "}
                    <span className="text-orange-400 font-semibold">
                      MISTAKE
                    </span>
                    , and{" "}
                    <span className="text-[#E4574C] font-semibold">
                      BLUNDER
                    </span>
                    . Learn immediately when a candidate move leaves a square
                    unguarded or allows a devastating tactic.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="rounded-lg bg-[#0D110F] p-2.5 border border-[#232A24]">
                      <span className="font-bold text-[#8FC24A]">
                        BEST / GOOD
                      </span>
                      <p className="text-[11px] text-[#8A9086] mt-0.5">
                        Optimizes piece coordination and king safety.
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#0D110F] p-2.5 border border-[#232A24]">
                      <span className="font-bold text-[#E4574C]">BLUNDER</span>
                      <p className="text-[11px] text-[#8A9086] mt-0.5">
                        Drops material or surrenders mate threats.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#232A24] text-[#8A9086]">
                    <span>POST /games/:id/ai/evaluate</span>
                    <span className="text-[#5B9BD5]">200 OK</span>
                  </div>
                  <pre className="mt-3 text-[11px] font-mono text-[#8A9086] overflow-x-auto leading-relaxed">
                    {`{
  "classification": "GOOD",
  "score": "+1.4",
  "explanation": "Solid developing
  move that secures the bishop pair
  and maintains center tension."
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "position" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DDAA55]">
                    Positional Mastery
                  </span>
                  <h3 className="text-xl font-bold text-[#F2F4F0]">
                    Full Situational Strengths & Weaknesses Breakdown
                  </h3>
                  <p className="text-sm text-[#8A9086] leading-relaxed">
                    Ever stare at a board and have no idea what the plan is?
                    Request an explanation. Gemini analyzes the pawn structure,
                    active open files, king exposure, and piece coordination to
                    provide an executive summary and actionable bullet points.
                  </p>
                  <div className="flex flex-col gap-2 pt-2 text-xs text-[#F2F4F0]">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-[#8FC24A]" />
                      <span>
                        Identifies pawn islands, passed pawns, and backward
                        pawns
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3.5 w-3.5 text-[#5B9BD5]" />
                      <span>
                        Highlights outposts for minor pieces and open rooks
                        files
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#232A24] text-[#8A9086]">
                    <span>POST /games/:id/ai/explain</span>
                    <span className="text-[#DDAA55]">200 OK</span>
                  </div>
                  <pre className="mt-3 text-[11px] font-mono text-[#8A9086] overflow-x-auto leading-relaxed">
                    {`{
  "summary": "Balanced middle game.",
  "strengths": [
    "Strong pawn center on d4/c4",
    "Open c-file for rooks"
  ],
  "weaknesses": [
    "Vulnerable d5 outpost for Black"
  ]
}`}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "review" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8FC24A]">
                    Post-Game Review
                  </span>
                  <h3 className="text-xl font-bold text-[#F2F4F0]">
                    Comprehensive Match Analytics & Accuracy Scores
                  </h3>
                  <p className="text-sm text-[#8A9086] leading-relaxed">
                    Once a match concludes (via Checkmate, Resignation, Timeout,
                    or Draw), trigger a comprehensive game analysis. The system
                    calculates your overall Move Accuracy percentage, tallies
                    mistakes and blunders, and generates an overarching tactical
                    summary.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="rounded-lg bg-[#0D110F] p-2.5 border border-[#232A24]">
                      <span className="text-lg font-bold text-[#8FC24A]">
                        87.4%
                      </span>
                      <p className="text-[10px] text-[#8A9086]">Accuracy</p>
                    </div>
                    <div className="rounded-lg bg-[#0D110F] p-2.5 border border-[#232A24]">
                      <span className="text-lg font-bold text-[#DDAA55]">
                        2
                      </span>
                      <p className="text-[10px] text-[#8A9086]">Inaccuracies</p>
                    </div>
                    <div className="rounded-lg bg-[#0D110F] p-2.5 border border-[#232A24]">
                      <span className="text-lg font-bold text-[#E4574C]">
                        0
                      </span>
                      <p className="text-[10px] text-[#8A9086]">Blunders</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#232A24] text-[#8A9086]">
                    <span>POST /games/:id/analysis</span>
                    <span className="text-[#8FC24A]">200 OK</span>
                  </div>
                  <pre className="mt-3 text-[11px] font-mono text-[#8A9086] overflow-x-auto leading-relaxed">
                    {`{
  "accuracy": 87.4,
  "blunders": 0,
  "mistakes": 1,
  "inaccuracies": 2,
  "summary": "Dominant play with
  superior control of the e-file."
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
