import { BIG_STATS, TESTIMONIALS } from "../../data/landingContent";

export const StatsAndTestimonialsSection: React.FC = () => {
  return (
    <section
      id="community"
      className="relative py-20 lg:py-28 bg-[#050705] border-t border-[#161B17]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Big 4 Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto text-center">
          {BIG_STATS.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#1A201B] bg-[#0C0E0D] p-6 lg:p-8"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#00E676]">
                {stat.value}
              </div>
              <div className="mt-2 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-widest text-[#889088]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3 Testimonials */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#1A201B] bg-[#0C0E0D] p-6 flex flex-col justify-between hover:border-[#00E676]/30 transition-all"
            >
              <div>
                {/* 5 Green Stars */}
                <div className="flex items-center gap-1 text-[#00E676] text-xs">
                  {"★".repeat(t.rating)}
                </div>

                <p className="mt-3 text-xs sm:text-[13px] text-[#889088] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#161B17] flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141A15] border border-[#1F2620] text-[11px] font-bold text-[#00E676]">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {t.author}
                  </div>
                  <div className="text-[10px] text-[#555E56]">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
