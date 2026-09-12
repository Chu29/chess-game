
import { STATS_DATA } from "../../data/landingContent";

export const StatStrip: React.FC = () => {
  return (
    <section className="relative border-y border-[#232A24] bg-[#161B17]/60 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_DATA.map((stat, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-xl border border-[#232A24] bg-[#0D110F] p-5 transition-all hover:border-[#8FC24A]/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#8FC24A] tracking-tight">
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span className="rounded-full bg-[#1C2418] border border-[#8FC24A]/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8FC24A]">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-bold text-[#F2F4F0]">
                  {stat.label}
                </h3>
              </div>
              <p className="mt-2 text-xs text-[#8A9086] leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
