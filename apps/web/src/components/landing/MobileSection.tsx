import {
  Smartphone,
  Volume2,
  Sparkles,
  Download,
  Check,
  Headphones,
} from "lucide-react";

export const MobileSection: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#161B17]/50 border-t border-[#232A24] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mobile App Value & Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8FC24A]/30 bg-[#1C2418] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#8FC24A]">
              <Smartphone className="h-3.5 w-3.5" />
              Cross-Platform Ecosystem
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl lg:text-5xl">
              Carry Your Grandmaster Coach in Your Pocket
            </h2>

            <p className="text-base sm:text-lg text-[#8A9086] leading-relaxed">
              Play rapid blitz matches on the commute or review deep opening theories at your desk. The Chuvinjab Chess companion app for iOS and Android brings the full dual-engine experience everywhere with zero compromises.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4">
                <div className="flex items-center gap-2 font-bold text-[#F2F4F0] text-sm mb-1">
                  <Headphones className="h-4 w-4 text-[#8FC24A]" />
                  Atmospheric Audio
                </div>
                <p className="text-xs text-[#8A9086]">
                  Rich lobby theme soundtrack and authentic piece-click, capture, and check soundscapes.
                </p>
              </div>

              <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4">
                <div className="flex items-center gap-2 font-bold text-[#F2F4F0] text-sm mb-1">
                  <Sparkles className="h-4 w-4 text-[#5B9BD5]" />
                  Haptic Feedback
                </div>
                <p className="text-xs text-[#8A9086]">
                  Tactile feedback on every move, blunder alert, and victory screen confirmation.
                </p>
              </div>
            </div>

            {/* CTAs & Download Options */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-xl bg-[#8FC24A] px-6 py-3 text-sm font-bold text-[#0D110F] shadow-sm hover:bg-[#A0D656] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download via Expo
              </button>
              <div className="flex items-center gap-2 text-xs text-[#8A9086]">
                <Check className="h-4 w-4 text-[#8FC24A]" />
                <span>Compatible with iOS 16+ & Android 12+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[300px] sm:max-w-[340px] rounded-[42px] border-4 border-[#232A24] bg-[#0D110F] p-3.5 shadow-2xl shadow-[#8FC24A]/10">
              {/* Phone Speaker & Camera Notch */}
              <div className="mx-auto h-4 w-28 rounded-full bg-[#232A24] mb-3" />

              {/* Mock Screen Content */}
              <div className="rounded-[30px] bg-[#161B17] border border-[#232A24] p-4 space-y-4">
                {/* Mobile Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#232A24]">
                  <span className="text-xs font-bold text-[#8FC24A]">
                    Chuvinjab Chess
                  </span>
                  <Volume2 className="h-4 w-4 text-[#8A9086]" />
                </div>

                {/* Mobile Ranking Card */}
                <div className="rounded-xl bg-[#0D110F] p-3 border border-[#232A24]">
                  <div className="text-[10px] uppercase font-bold text-[#8A9086]">
                    Current Ranking
                  </div>
                  <div className="text-xl font-black text-[#8FC24A]">#142</div>
                  <div className="text-[10px] text-[#8A9086]">1420 ELO · 64% Win Rate</div>
                </div>

                {/* Mobile Quick Start Play Button */}
                <div className="rounded-xl bg-[#8FC24A] p-4 text-center text-[#0D110F]">
                  <div className="text-xs font-extrabold uppercase tracking-wide">
                    Play Online
                  </div>
                  <div className="text-[11px] font-medium opacity-80">
                    Find match in seconds
                  </div>
                </div>

                {/* Two Action Cards */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[#0D110F] p-3 border border-[#1A4F80]">
                    <div className="text-[11px] font-bold text-[#5B9BD5]">Versus AI</div>
                    <div className="text-[9px] text-[#8A9086] mt-0.5">Practice skills</div>
                  </div>
                  <div className="rounded-lg bg-[#0D110F] p-3 border border-[#7A5B2B]">
                    <div className="text-[11px] font-bold text-[#DDAA55]">Academy</div>
                    <div className="text-[9px] text-[#8A9086] mt-0.5">Daily puzzles</div>
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-[#232A24]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
