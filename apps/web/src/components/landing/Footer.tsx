import { Zap, BookOpen, ShieldCheck } from "lucide-react";

interface FooterProps {
  onPlayClick?: () => void;
  showBanner?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onPlayClick,
  showBanner = true,
}) => {
  return (
    <footer className="relative bg-[#050705] pt-16 pb-12 border-t border-[#161B17]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Conversion Banner: Ready to Outsmart the Competition? */}
        {showBanner && (
          <div className="relative rounded-3xl border border-[#232A24] bg-gradient-to-b from-[#182319]/70 via-[#101712]/80 to-[#0A0E0B] p-10 sm:p-14 lg:p-16 text-center overflow-hidden shadow-2xl mb-16">
            {/* Subtle green ambient light */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#8FC24A]/10 blur-[110px] rounded-full"
              aria-hidden="true"
            />

            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
              Ready to Outsmart the Competition?
            </h2>

            <p className="relative mt-4 text-xs sm:text-sm text-[#889088] max-w-xl mx-auto leading-relaxed">
              Elevate your tactical vision today. Experience sub-50ms
              matchmaking, Stockfish calculation, and natural language Gemini
              coaching.
            </p>

            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={onPlayClick}
                className="flex items-center gap-2 rounded-xl bg-[#8FC24A] px-6 py-3 text-xs sm:text-sm font-bold text-[#050705] shadow-[0_0_20px_-3px_rgba(143,194,74,0.35)] transition-all hover:bg-[#A0D656] active:scale-95 cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-current" />
                Play Online Now
              </button>

              <a
                href="#interactive-terminal"
                className="rounded-xl border border-[#232A24] bg-[#121613] px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#181F1A] hover:border-[#889088]/40 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        )}

        {/* 4-Column Footer Information */}
        <div
          className={`${showBanner ? "mt-0" : "mt-0"} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#161B17]`}
        >
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161B17] border border-[#232A24] text-[#8FC24A]">
                {/* Minimalist Knight Emblem */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 22H5v-2h14v2M18.8 9.5c-.3-.8-.8-1.5-1.5-2-.3-.2-.7-.4-1.1-.5.3-.6.5-1.3.4-2-.1-1.1-.8-2-1.8-2.4-.9-.4-2-.2-2.8.4-.5.4-.8 1-1 1.6-.6-.4-1.4-.5-2.1-.4-.8.2-1.6.8-2 1.5-.4.8-.5 1.7-.2 2.5.2.5.5.9.8 1.3-.8.7-1.3 1.7-1.3 2.8 0 .8.2 1.5.6 2.1l-1.9 3.8v1.1h13.2l.9-3.7c1-1.3 1.2-3.1.5-4.7z" />
                </svg>
              </div>
              <span className="font-bold text-sm text-white">
                Chuvinjab Chess
              </span>
            </div>

            <p className="text-xs text-[#889088] leading-relaxed">
              Open-source competitive chess platform powered by Stockfish NNUE,
              Google Gemini 3.5, and NestJS WebSockets.
            </p>
          </div>

          {/* Col 2: PLATFORM */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white mb-3">
              PLATFORM
            </div>
            <ul className="space-y-2 text-xs text-[#889088]">
              <li>
                <a
                  href="#interactive-terminal"
                  className="hover:text-white transition-colors"
                >
                  Interactive Simulator
                </a>
              </li>
              <li>
                <a
                  href="#grandmaster-ai"
                  className="hover:text-white transition-colors"
                >
                  Gemini AI Coach
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onPlayClick}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  PvP Matchmaking
                </button>
              </li>
              <li>
                <a
                  href="#academy"
                  className="hover:text-white transition-colors"
                >
                  Chess Academy
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: ARCHITECTURE */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white mb-3">
              ARCHITECTURE
            </div>
            <ul className="space-y-2 text-xs text-[#889088]">
              <li className="hover:text-white transition-colors cursor-default">
                NestJS WebSocket Gateway
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Stockfish 16+ NNUE
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Prisma & PostgreSQL 16
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                Keycloak 26 OIDC
              </li>
            </ul>
          </div>

          {/* Col 4: SPECIFICATIONS */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white mb-3">
              SPECIFICATIONS
            </div>
            <ul className="space-y-2 text-xs text-[#889088]">
              <li className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#8FC24A]" />
                <a
                  href="https://github.com/Chu29/chess-game/blob/development/docs/api-contract.yaml"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  OpenAPI 3.1 Spec
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5B9BD5]" />
                <a
                  href="https://github.com/Chu29/chess-game/blob/development/docs/web-socket-contract.md"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WebSocket Contract
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <svg
                  className="h-3.5 w-3.5 text-[#DDAA55] fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <a
                  href="https://github.com/Chu29/chess-game"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#889088]">
          <p>© 2026 Chuvinjab Chess. MIT Licensed.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <span className="text-red-500">❤️</span>
            <span>for the global chess community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
