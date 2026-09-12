import {
  Bot,
  GraduationCap,
  Radio,
  Moon,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { PURE_CHESS_FEATURES } from "../../data/landingContent";

export const FeatureGridSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ai":
        return <Bot className="h-5 w-5 text-[#00E676]" />;
      case "academy":
        return <GraduationCap className="h-5 w-5 text-[#00E676]" />;
      case "matchmaking":
        return <Radio className="h-5 w-5 text-[#00E676]" />;
      case "minimalist":
        return <Moon className="h-5 w-5 text-[#00E676]" />;
      case "analytics":
        return <TrendingUp className="h-5 w-5 text-[#00E676]" />;
      case "sync":
        return <RefreshCw className="h-5 w-5 text-[#00E676]" />;
      default:
        return <Bot className="h-5 w-5 text-[#00E676]" />;
    }
  };

  return (
    <section
      id="features"
      className="relative py-20 lg:py-28 bg-[#050705] border-t border-[#161B17]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00E676]">
            ENGINEERED FOR MASTERY
          </div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Pure Chess. Zero Clutter.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#889088] leading-relaxed">
            Crafted from the ground up with a strict focus on ergonomics, speed,
            and analytical precision.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {PURE_CHESS_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl border border-[#1A201B] bg-[#0C0E0D] p-6 lg:p-7 flex flex-col justify-between transition-all hover:border-[#00E676]/40 hover:bg-[#101411] group"
            >
              <div>
                {/* Icon Container */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141A15] border border-[#1F2620] group-hover:border-[#00E676]/30 transition-colors mb-5">
                  {getIcon(feature.icon)}
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-xs text-[#889088] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#161B17]">
                <a
                  href={feature.linkHref}
                  className="text-xs font-mono font-semibold text-[#00E676] hover:text-[#10FF85] transition-colors flex items-center gap-1"
                >
                  {feature.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
