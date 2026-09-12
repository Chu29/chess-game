import {
  Trophy,
  BarChart3,
  TrendingUp,
  Shield,
  Medal,
  Flame,
} from "lucide-react";
import { LEADERBOARD_PREVIEW } from "../../data/landingContent";

export const LeaderboardSection: React.FC = () => {
  return (
    <section
      id="leaderboard"
      className="relative py-20 lg:py-28 bg-[#0D110F] border-t border-[#232A24]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8FC24A]/30 bg-[#1C2418] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#8FC24A]">
            <Trophy className="h-3.5 w-3.5" />
            Player Analytics & Rankings
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
            Climb the Ranks. Track Every Milestone.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8A9086] leading-relaxed">
            Every rated game updates your global ELO standing starting from base
            1200. Review comprehensive win rate metrics, historical matchups,
            and challenge the top rated players in the ecosystem.
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left: Player Profile & Metrics Card Preview */}
          <div className="lg:col-span-5 rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8FC24A] to-[#5B9BD5] font-black text-sm text-[#0D110F]">
                  YOU
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F2F4F0]">
                    Competitor Dashboard
                  </h3>
                  <span className="text-xs text-[#8A9086]">
                    Active Rated Profile
                  </span>
                </div>
              </div>
              <span className="rounded-full bg-[#1C2418] border border-[#8FC24A]/30 px-2.5 py-0.5 text-xs font-mono font-bold text-[#8FC24A]">
                1420 ELO
              </span>
            </div>

            {/* Profile Statistics Cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-3.5">
                <div className="flex items-center justify-between text-[#8A9086] text-xs">
                  <span>Current Rank</span>
                  <BarChart3 className="h-3.5 w-3.5 text-[#8FC24A]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#8FC24A]">
                  #142
                </div>
                <div className="text-[10px] text-[#8A9086] mt-0.5">
                  Top 5% Global
                </div>
              </div>

              <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-3.5">
                <div className="flex items-center justify-between text-[#8A9086] text-xs">
                  <span>Win Rate</span>
                  <TrendingUp className="h-3.5 w-3.5 text-[#8FC24A]" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#F2F4F0]">
                  64.2%
                </div>
                <div className="text-[10px] text-[#8A9086] mt-0.5">
                  82 Wins / 46 Losses
                </div>
              </div>
            </div>

            {/* Recent Matches Ticker */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A9086] mb-3">
                Recent Match History
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-[#232A24] bg-[#0D110F] p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#8FC24A]" />
                    <span className="font-medium text-[#F2F4F0]">
                      vs. KnightRider
                    </span>
                    <span className="text-[10px] text-[#8A9086]">
                      · Blitz 5+0
                    </span>
                  </div>
                  <span className="rounded bg-[#8FC24A]/20 px-2 py-0.5 text-[10px] font-bold text-[#8FC24A]">
                    WIN (+16)
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#232A24] bg-[#0D110F] p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#5B9BD5]" />
                    <span className="font-medium text-[#F2F4F0]">
                      vs. Stockfish (Med)
                    </span>
                    <span className="text-[10px] text-[#8A9086]">
                      · AI Practice
                    </span>
                  </div>
                  <span className="rounded bg-[#8A9086]/20 px-2 py-0.5 text-[10px] font-bold text-[#8A9086]">
                    DRAW
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[#232A24] bg-[#0D110F] p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E4574C]" />
                    <span className="font-medium text-[#F2F4F0]">
                      vs. BlitzKing99
                    </span>
                    <span className="text-[10px] text-[#8A9086]">
                      · Rapid 10+0
                    </span>
                  </div>
                  <span className="rounded bg-[#E4574C]/20 px-2 py-0.5 text-[10px] font-bold text-[#E4574C]">
                    LOSS (-12)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Global Top Leaderboard Table */}
          <div className="lg:col-span-7 rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-7 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-[#DDAA55]" />
                <h3 className="text-base font-bold text-[#F2F4F0]">
                  Global Hall of Fame
                </h3>
              </div>
              <span className="text-xs text-[#8A9086]">Updated Live</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232A24] text-[#8A9086] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Player</th>
                    <th className="pb-3 font-semibold text-right">Rating</th>
                    <th className="pb-3 font-semibold text-right">Win Rate</th>
                    <th className="pb-3 font-semibold text-right">Games</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232A24]/60">
                  {LEADERBOARD_PREVIEW.map((player) => (
                    <tr
                      key={player.rank}
                      className="transition-colors hover:bg-[#0D110F]/60"
                    >
                      <td className="py-3 font-bold text-[#F2F4F0]">
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-md font-mono text-[11px] ${
                            player.rank === 1
                              ? "bg-[#DDAA55]/20 text-[#DDAA55] border border-[#DDAA55]/40"
                              : player.rank === 2
                                ? "bg-[#8A9086]/20 text-[#F2F4F0] border border-[#8A9086]/40"
                                : player.rank === 3
                                  ? "bg-amber-800/30 text-amber-400 border border-amber-800/50"
                                  : "text-[#8A9086]"
                          }`}
                        >
                          #{player.rank}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-7 w-7 rounded-full bg-gradient-to-tr ${player.avatarBg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                          >
                            {player.username[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-[#F2F4F0]">
                              <span>{player.username}</span>
                              {player.title && (
                                <span className="rounded bg-[#DDAA55] px-1 py-0.2 text-[9px] font-black text-[#0D110F]">
                                  {player.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#8FC24A]">
                        {player.rating}
                      </td>
                      <td className="py-3 text-right text-[#F2F4F0]">
                        {player.winRate}%
                      </td>
                      <td className="py-3 text-right text-[#8A9086]">
                        {player.gamesPlayed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-[#232A24] flex items-center justify-between text-xs text-[#8A9086]">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-[#8FC24A]" />
                <span>Base Rating: 1200 ELO with ±200 queue bracket</span>
              </div>
              <div className="flex items-center gap-1 text-[#8FC24A] font-semibold">
                <Shield className="h-3.5 w-3.5" />
                Anti-Cheat Verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
