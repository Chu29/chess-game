import { QrCode, Zap } from "lucide-react";

interface CtaBannerSectionProps {
  onPlayClick?: () => void;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({ onPlayClick }) => {
  return (
    <section id="mobile-cta" className="relative py-16 lg:py-20 bg-[#050705]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#1A201B] bg-[#0C0E0D] p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* Subtle neon corner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Heading, Subtitle & Store Badges */}
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1A201B] bg-[#050705] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00E676]">
              <Zap className="h-3 w-3 fill-current" />
              OFFICIAL v3.4 RELEASE
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Claim Your Seat on the Board.
            </h2>

            <p className="text-xs sm:text-sm text-[#889088] leading-relaxed">
              Join 1.2M+ players leveling up their tactics. Available now on iOS, iPadOS, Android, and modern web browsers.
            </p>

            {/* Store & Web Play Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* Apple Store Button */}
              <button
                type="button"
                onClick={onPlayClick}
                className="flex items-center gap-2.5 rounded-xl border border-[#1F2620] bg-[#050705] px-4 py-2.5 text-left hover:border-[#00E676]/40 transition-colors cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.88 2.76 1.01.08 2.03-.51 2.6-1.26z" />
                </svg>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#555E56]">
                    Download on the
                  </div>
                  <div className="text-xs font-bold text-white">Apple App Store</div>
                </div>
              </button>

              {/* Google Play Button */}
              <button
                type="button"
                onClick={onPlayClick}
                className="flex items-center gap-2.5 rounded-xl border border-[#1F2620] bg-[#050705] px-4 py-2.5 text-left hover:border-[#00E676]/40 transition-colors cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.98 1.98 0 0 1-.22-.924V2.738c0-.342.08-.66.22-.924zM15.207 13.414l2.84 2.84-12.784 7.382 9.944-10.222zm0-2.828L5.263.364l12.784 7.382-2.84 2.84zm1.414 1.414l3.774-2.18c1.045-.603 1.045-1.587 0-2.19l-3.774-2.18-2.122 2.122 2.122 2.122z" />
                </svg>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#555E56]">
                    GET IT ON
                  </div>
                  <div className="text-xs font-bold text-white">Google Play Store</div>
                </div>
              </button>

              {/* Play in Browser Button */}
              <button
                type="button"
                onClick={onPlayClick}
                className="flex items-center gap-2 rounded-xl bg-[#00E676] px-5 py-3 text-xs font-bold text-[#050705] hover:bg-[#10FF85] shadow-[0_0_20px_-3px_rgba(0,230,118,0.4)] transition-all cursor-pointer active:scale-95"
              >
                <span>▶</span>
                Play in Browser
              </button>
            </div>
          </div>

          {/* Right Column: Stylized QR Code Box */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative rounded-2xl border-2 border-[#00E676]/40 bg-[#050705] p-5 shadow-[0_0_30px_-5px_rgba(0,230,118,0.25)]">
              {/* Corner accent marks */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00E676]" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00E676]" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00E676]" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00E676]" />

              <div className="flex flex-col items-center">
                <QrCode className="h-28 w-28 text-[#00E676]" />
              </div>
            </div>

            <div className="mt-3 text-center">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00E676]">
                SCAN TO INSTALL
              </div>
              <div className="text-[9px] font-mono text-[#555E56]">
                Universal Handoff
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
