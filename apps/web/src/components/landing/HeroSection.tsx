import { TOP_TELEMETRY } from "../../data/landingContent";

interface HeroSectionProps {
  onPlayClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlayClick }) => {
  return (
    <section
      id="hero"
      className="relative pt-14 pb-16 lg:pt-20 lg:pb-24 overflow-hidden"
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00E676]/6 blur-[140px] rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Rating Stars & Social Proof Pill */}

        {/* Main Tournament Heading */}
        <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
          <span className="block text-white">Master the Board.</span>
          <span className="block text-[#00E676] mt-1">Outthink the World.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-[#889088] leading-relaxed">
          A minimalist tournament chess platform engineered for aspiring novices
          and 2800+ Grandmasters. Harmonizing adaptive neural engines, tactical
          precision mechanics, and edge-native matchmaking.
        </p>

        {/* Two CTA Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onPlayClick}
            className="flex items-center gap-2 rounded-lg bg-[#00E676] px-6 py-3 text-xs sm:text-sm font-bold text-[#050705] shadow-[0_0_20px_-3px_rgba(0,230,118,0.35)] transition-all hover:bg-[#10FF85] active:scale-95 cursor-pointer"
          >
            {/* Play triangle */}
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Online Now
          </button>

          <a
            href="#interactive-terminal"
            className="flex items-center gap-2 rounded-lg border border-[#232B25] bg-[#0C0E0D] px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:border-[#00E676]/40 hover:bg-[#121613] transition-all active:scale-95 cursor-pointer"
          >
            Try Live App Demo
          </a>
        </div>

        {/* 4 Telemetry Metrics Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          {TOP_TELEMETRY.map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#1A201B] bg-[#0C0E0D] p-4 sm:p-5 transition-all hover:border-[#00E676]/30"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#555E56]">
                {stat.label}
              </div>
              <div className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] text-[#889088]">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
