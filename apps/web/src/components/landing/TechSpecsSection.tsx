import {
  Server,
  Cpu,
  Layers,
  CheckCircle,
  Database,
  Radio,
  Lock,
} from "lucide-react";

export const TechSpecsSection: React.FC = () => {
  return (
    <section
      id="architecture"
      className="relative py-20 lg:py-28 bg-[#0D110F] border-t border-[#232A24]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B9BD5]/30 bg-[#5B9BD5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#5B9BD5]">
            <Layers className="h-3.5 w-3.5" />
            Under The Hood
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
            Built for Extreme Low Latency and Zero Desync
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#8A9086] leading-relaxed">
            Engineered with strict separation of concerns, server-authoritative
            validation, and a high-performance C++ & WebSocket pipeline.
          </p>
        </div>

        {/* 4 Architectural Pillars */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Authoritative NestJS Gateway */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 hover:border-[#8FC24A]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C2418] text-[#8FC24A] border border-[#8FC24A]/30 mb-4">
                <Radio className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F4F0]">
                NestJS WebSocket Gateway
              </h3>
              <p className="mt-2 text-xs text-[#8A9086] leading-relaxed">
                Dedicated <code className="text-[#8FC24A]">/game</code>{" "}
                Socket.IO namespace managing per-match isolated rooms. Handles
                heartbeat, move broadcasts, and reconnect resync.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-[#232A24] space-y-1.5 text-[11px] text-[#F2F4F0]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#8FC24A]" />
                Sub-50ms message round-trip
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#8FC24A]" />
                Server-side clock ticks
              </li>
            </ul>
          </div>

          {/* Pillar 2: Dual AI Pipeline */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 hover:border-[#5B9BD5]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D110F] text-[#5B9BD5] border border-[#5B9BD5]/30 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F4F0]">
                Stockfish + Gemini AI
              </h3>
              <p className="mt-2 text-xs text-[#8A9086] leading-relaxed">
                Stockfish NNUE calculates optimal candidate moves in a
                synchronized engine queue, while Google Gemini translates FEN
                into tactical human coaching.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-[#232A24] space-y-1.5 text-[11px] text-[#F2F4F0]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#5B9BD5]" />
                C++ bitboard move generator
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#5B9BD5]" />
                Natural language explanations
              </li>
            </ul>
          </div>

          {/* Pillar 3: Prisma + PostgreSQL */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 hover:border-[#DDAA55]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D110F] text-[#DDAA55] border border-[#DDAA55]/30 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F4F0]">
                PostgreSQL & Prisma
              </h3>
              <p className="mt-2 text-xs text-[#8A9086] leading-relaxed">
                Relational schema mapping Games, Moves (SAN, FEN after move),
                Matchmaking Queues, and AI Analyses with transactional
                integrity.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-[#232A24] space-y-1.5 text-[11px] text-[#F2F4F0]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#DDAA55]" />
                Full move history replay
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#DDAA55]" />
                Atomic queue transitions
              </li>
            </ul>
          </div>

          {/* Pillar 4: Keycloak Enterprise Auth */}
          <div className="rounded-2xl border border-[#232A24] bg-[#161B17] p-6 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0D110F] text-emerald-400 border border-emerald-500/30 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F2F4F0]">
                Keycloak 26 OAuth2 / OIDC
              </h3>
              <p className="mt-2 text-xs text-[#8A9086] leading-relaxed">
                Enterprise identity management providing JWT authentication,
                single-flight token refresh locks, and end-to-end credential
                security.
              </p>
            </div>
            <ul className="mt-4 pt-4 border-t border-[#232A24] space-y-1.5 text-[11px] text-[#F2F4F0]">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                OAuth2 / OpenID Connect
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Protected WebSocket handshakes
              </li>
            </ul>
          </div>
        </div>

        {/* Architecture Pipeline Flowchart Graphic */}
        <div className="mt-12 rounded-2xl border border-[#232A24] bg-[#161B17] p-6 lg:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#232A24]">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#8FC24A]" />
              <h3 className="text-sm font-bold text-[#F2F4F0]">
                System Communication Architecture
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#8A9086]">
              docs/web-socket-contract.md
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-center">
              <span className="text-xs font-bold text-[#8FC24A]">
                1. Client Tier
              </span>
              <p className="text-[11px] text-[#8A9086] mt-1">
                Web (React 19) & Mobile (Expo / React Native)
              </p>
            </div>
            <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-center">
              <span className="text-xs font-bold text-[#5B9BD5]">
                2. Gateway
              </span>
              <p className="text-[11px] text-[#8A9086] mt-1">
                NestJS Socket.IO /game & REST v1 API
              </p>
            </div>
            <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-center">
              <span className="text-xs font-bold text-[#DDAA55]">
                3. Domain Logic
              </span>
              <p className="text-[11px] text-[#8A9086] mt-1">
                ChessBoard Aggregate & Server Move Validation
              </p>
            </div>
            <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-center">
              <span className="text-xs font-bold text-[#8FC24A]">
                4. AI Pipeline
              </span>
              <p className="text-[11px] text-[#8A9086] mt-1">
                Stockfish Service + Google Gemini Provider
              </p>
            </div>
            <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 text-center">
              <span className="text-xs font-bold text-emerald-400">
                5. Persistence
              </span>
              <p className="text-[11px] text-[#8A9086] mt-1">
                PostgreSQL 16 via Prisma ORM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
