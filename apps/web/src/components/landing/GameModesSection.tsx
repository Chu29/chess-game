import {
  Users,
  Bot,
  Zap,
  Clock,
  Shield,
  RefreshCw,
  Sliders,
  Sparkles,
  Trophy,
} from "lucide-react";

interface GameModesSectionProps {
  onPlayClick?: () => void;
}

export const GameModesSection: React.FC<GameModesSectionProps> = ({
  onPlayClick,
}) => {
  return (
    <section
      id="game-modes"
      className="relative py-20 lg:py-28 bg-[#0D110F] border-t border-[#232A24]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B9BD5]/30 bg-[#5B9BD5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#5B9BD5]">
            <Trophy className="h-3.5 w-3.5" />
            Competitive Arena
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
            Two Distinct Arenas, One Flawless Engine
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8A9086] leading-relaxed">
            Whether you want to climb the global multiplayer ELO leaderboard
            against real competitors or hone your skills against calibrated AI
            difficulty levels, Chuvinjab Chess gives you a lag-free experience.
          </p>
        </div>

        {/* 2 Main Game Mode Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Player vs Player (PvP) */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-8 flex flex-col justify-between hover:border-[#8FC24A]/40 transition-all hover:shadow-[0_0_30px_-5px_rgba(143,194,74,0.15)] group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C2418] border border-[#8FC24A]/30 text-[#8FC24A]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F2F4F0]">
                      Player vs. Player (PvP)
                    </h3>
                    <span className="text-xs text-[#8A9086]">
                      Real-Time Multiplayer Arena
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-[#8FC24A]/10 border border-[#8FC24A]/30 px-3 py-1 text-xs font-bold text-[#8FC24A]">
                  WebSocket Gateway
                </span>
              </div>

              <p className="mt-5 text-sm text-[#8A9086] leading-relaxed">
                Connect directly to our high-concurrency NestJS Socket.IO
                gateway. Jump into instant matchmaking calibrated to find
                players within your ±200 rating window, or challenge a friend to
                a dedicated room.
              </p>

              {/* Feature List */}
              <div className="mt-6 space-y-3 text-xs text-[#F2F4F0]">
                <div className="flex items-start gap-2.5">
                  <Zap className="h-4 w-4 text-[#8FC24A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">
                      Sub-50ms Socket.IO Rooms:
                    </strong>{" "}
                    Instantaneous move broadcast with authoritative server
                    verification.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[#8FC24A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">
                      Precise Time Controls:
                    </strong>{" "}
                    Blitz (3+0, 5+0, 10+0), Bullet (1+0), and Rapid clocks with
                    server-synchronized timers.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <RefreshCw className="h-4 w-4 text-[#8FC24A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero State Loss:</strong>{" "}
                    Automatic reconnection reconciliation if cellular or Wi-Fi
                    drops mid-game.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield className="h-4 w-4 text-[#8FC24A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">In-Game Diplomacy:</strong>{" "}
                    Official draw offers, resignations, and rematch queues.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#232A24]">
              <button
                type="button"
                onClick={onPlayClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8FC24A] py-3 text-sm font-bold text-[#0D110F] shadow-sm hover:bg-[#A0D656] transition-all cursor-pointer active:scale-98"
              >
                <Zap className="h-4 w-4 fill-current" />
                Find PvP Match
              </button>
            </div>
          </div>

          {/* Card 2: Player vs AI (PvAI) */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-8 flex flex-col justify-between hover:border-[#5B9BD5]/40 transition-all hover:shadow-[0_0_30px_-5px_rgba(91,155,213,0.15)] group">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D110F] border border-[#5B9BD5]/30 text-[#5B9BD5]">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F2F4F0]">
                      Player vs. AI (PvAI)
                    </h3>
                    <span className="text-xs text-[#8A9086]">
                      Powered by Stockfish & Gemini
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-[#5B9BD5]/10 border border-[#5B9BD5]/30 px-3 py-1 text-xs font-bold text-[#5B9BD5]">
                  3 Calibrated Tiers
                </span>
              </div>

              <p className="mt-5 text-sm text-[#8A9086] leading-relaxed">
                Test your openings, refine endgames, and practice stress-free
                against custom Stockfish difficulty levels while receiving
                on-demand coaching feedback and move evaluations.
              </p>

              {/* 3 Difficulty Tiers */}
              <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-3">
                  <span className="text-xs font-bold text-[#8FC24A] uppercase">
                    Easy
                  </span>
                  <div className="text-[11px] text-[#F2F4F0] font-semibold mt-1">
                    ~1000 ELO
                  </div>
                  <p className="text-[10px] text-[#8A9086] mt-1">
                    Relaxed tactics for beginners & warm-ups.
                  </p>
                </div>
                <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-3">
                  <span className="text-xs font-bold text-[#5B9BD5] uppercase">
                    Medium
                  </span>
                  <div className="text-[11px] text-[#F2F4F0] font-semibold mt-1">
                    ~1600 ELO
                  </div>
                  <p className="text-[10px] text-[#8A9086] mt-1">
                    Competitive club level positional play.
                  </p>
                </div>
                <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-3">
                  <span className="text-xs font-bold text-[#E4574C] uppercase">
                    Hard
                  </span>
                  <div className="text-[11px] text-[#F2F4F0] font-semibold mt-1">
                    Master / 2500+
                  </div>
                  <p className="text-[10px] text-[#8A9086] mt-1">
                    Stockfish NNUE uncompromising depth.
                  </p>
                </div>
              </div>

              {/* Additional Specs */}
              <div className="mt-5 space-y-2 text-xs text-[#8A9086]">
                <div className="flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-[#5B9BD5]" />
                  <span>
                    Choose White or Black pieces with custom opening books
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#8FC24A]" />
                  <span>
                    Active Gemini coach hint allowances for real-time learning
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#232A24]">
              <button
                type="button"
                onClick={onPlayClick}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#5B9BD5]/50 bg-[#5B9BD5]/10 py-3 text-sm font-bold text-[#5B9BD5] hover:bg-[#5B9BD5]/20 transition-all cursor-pointer active:scale-98"
              >
                <Bot className="h-4 w-4" />
                Play vs AI Bot
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
