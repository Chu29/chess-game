import { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import {
  PIECE_MASTERIES,
  CHESS_RULES,
  ACADEMY_CHALLENGES,
} from "../../data/landingContent";

export const AcademySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"pieces" | "rules" | "challenges">("pieces");
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(0);
  const currentPiece = PIECE_MASTERIES[selectedPieceIndex];

  return (
    <section id="academy" className="relative py-20 lg:py-28 bg-[#161B17]/40 border-t border-[#232A24]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DDAA55]/30 bg-[#DDAA55]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#DDAA55]">
            <GraduationCap className="h-3.5 w-3.5" />
            Interactive Chess Academy
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
            From First Pawn Push to Grandmaster Precision
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8A9086] leading-relaxed">
            Master the fundamentals, learn esoteric tournament rules like En Passant, and conquer progressive tactical challenges designed to boost your ELO rating step-by-step.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-xl border border-[#232A24] bg-[#0D110F] p-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory("pieces")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === "pieces"
                  ? "bg-[#DDAA55] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Piece Masteries
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("rules")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === "rules"
                  ? "bg-[#DDAA55] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0]"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Official Rules
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("challenges")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeCategory === "challenges"
                  ? "bg-[#DDAA55] text-[#0D110F]"
                  : "text-[#8A9086] hover:text-[#F2F4F0]"
              }`}
            >
              <Target className="h-4 w-4" />
              Practice Challenges
            </button>
          </div>
        </div>

        {/* Tab 1: Piece Masteries */}
        {activeCategory === "pieces" && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
            {/* Piece Selector Buttons */}
            <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {PIECE_MASTERIES.map((piece, idx) => (
                <button
                  key={piece.name}
                  type="button"
                  onClick={() => setSelectedPieceIndex(idx)}
                  className={`flex items-center gap-3.5 rounded-xl border p-3 text-left transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal ${
                    selectedPieceIndex === idx
                      ? "border-[#DDAA55] bg-[#1C2418] shadow-md"
                      : "border-[#232A24] bg-[#0D110F] text-[#8A9086] hover:border-[#8A9086]/40 hover:text-[#F2F4F0]"
                  }`}
                >
                  <span className="text-3xl text-white drop-shadow">
                    {piece.symbol}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#F2F4F0]">
                      {piece.name}
                    </div>
                    <div className="text-[11px] text-[#8A9086]">
                      Value: {piece.value} {typeof piece.value === "number" ? "Pts" : ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Piece Spotlight */}
            <div className="lg:col-span-8 rounded-2xl border border-[#232A24] bg-[#0D110F] p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl text-[#DDAA55]">
                      {currentPiece.symbol}
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-[#F2F4F0]">
                        {currentPiece.name}
                      </h3>
                      <span className="text-xs text-[#8A9086]">
                        {currentPiece.role}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#DDAA55]/10 border border-[#DDAA55]/30 px-3 py-1 text-xs font-bold text-[#DDAA55]">
                    {currentPiece.value} {typeof currentPiece.value === "number" ? "Points" : ""}
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FC24A]">
                      Movement Mechanics
                    </h4>
                    <p className="mt-1 text-[#F2F4F0] leading-relaxed">
                      {currentPiece.movement}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#DDAA55]/30 bg-[#161B17] p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#DDAA55] mb-1">
                      <Lightbulb className="h-4 w-4" />
                      Grandmaster Pro Tip
                    </div>
                    <p className="text-[#8A9086] leading-relaxed">
                      {currentPiece.proTip}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#232A24] flex items-center justify-between text-xs text-[#8A9086]">
                <span>Interactive movement diagrams accessible in Academy mode.</span>
                <span className="text-[#DDAA55] font-semibold flex items-center gap-1">
                  Learn in App <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Official Rules */}
        {activeCategory === "rules" && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {CHESS_RULES.map((rule) => (
              <div
                key={rule.id}
                className="rounded-2xl border border-[#232A24] bg-[#0D110F] p-6 hover:border-[#DDAA55]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#232A24]">
                    <h3 className="text-base font-bold text-[#F2F4F0]">
                      {rule.title}
                    </h3>
                    <span className="rounded-full bg-[#DDAA55]/10 border border-[#DDAA55]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#DDAA55]">
                      {rule.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-[#8A9086] leading-relaxed">
                    {rule.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#232A24] text-[11px] text-[#F2F4F0] bg-[#161B17] p-3 rounded-lg border">
                  <strong className="text-[#8FC24A]">Critical Rule:</strong>{" "}
                  {rule.keyRule}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Practice Challenges */}
        {activeCategory === "challenges" && (
          <div className="mt-10 space-y-4 max-w-4xl mx-auto">
            {ACADEMY_CHALLENGES.map((challenge) => {
              const isCompleted = challenge.state === "completed";
              const isUnlocked = challenge.state === "unlocked";

              return (
                <div
                  key={challenge.id}
                  className="rounded-xl border border-[#232A24] bg-[#0D110F] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#8FC24A]/40 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        isCompleted
                          ? "bg-[#1C2418] border-[#8FC24A]/40 text-[#8FC24A]"
                          : isUnlocked
                            ? "bg-[#DDAA55]/10 border-[#DDAA55]/40 text-[#DDAA55]"
                            : "bg-[#161B17] border-[#232A24] text-[#8A9086]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isUnlocked ? (
                        <Unlock className="h-5 w-5" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F2F4F0]">
                          {challenge.title}
                        </h4>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            challenge.difficulty === "beginner"
                              ? "bg-[#8FC24A]/20 text-[#8FC24A]"
                              : challenge.difficulty === "intermediate"
                                ? "bg-[#5B9BD5]/20 text-[#5B9BD5]"
                                : "bg-[#E4574C]/20 text-[#E4574C]"
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A9086] mt-0.5">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#232A24]">
                    <div className="flex items-center gap-1.5 text-xs text-[#8A9086]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{challenge.estimatedMinutes} mins</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-24 bg-[#161B17] h-2 rounded-full overflow-hidden border border-[#232A24]">
                      <div
                        className="bg-[#8FC24A] h-full transition-all"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#F2F4F0]">
                      {challenge.progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
