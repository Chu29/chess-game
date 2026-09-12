import { X, Zap, Bot, Smartphone, ShieldCheck } from "lucide-react";

interface QuickPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPlayModal: React.FC<QuickPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#232A24] bg-[#161B17] p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-[#8A9086] hover:bg-[#0D110F] hover:text-[#F2F4F0] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#232A24]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C2418] border border-[#8FC24A]/30 text-[#8FC24A]">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F2F4F0]">
              Start Playing Chuvinjab Chess
            </h3>
            <p className="text-xs text-[#8A9086]">
              Choose how you want to experience the dual-engine platform
            </p>
          </div>
        </div>

        {/* Play Options */}
        <div className="mt-5 space-y-3">
          {/* Option 1: In-Browser Demo */}
          <a
            href="#interactive-terminal"
            onClick={onClose}
            className="flex items-center justify-between rounded-xl border border-[#8FC24A]/30 bg-[#1C2418]/60 p-4 transition-all hover:bg-[#1C2418] hover:border-[#8FC24A] group"
          >
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-[#8FC24A]" />
              <div>
                <div className="text-sm font-bold text-[#F2F4F0] group-hover:text-white">
                  Interactive Web Simulator
                </div>
                <div className="text-xs text-[#8A9086]">
                  Try moves right now on the landing page with live Gemini explanations.
                </div>
              </div>
            </div>
            <span className="rounded-lg bg-[#8FC24A] px-2.5 py-1 text-xs font-bold text-[#0D110F]">
              Try Now
            </span>
          </a>

          {/* Option 2: Full Mobile App via Expo */}
          <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-[#5B9BD5]" />
              <div>
                <div className="text-sm font-bold text-[#F2F4F0]">
                  Native Mobile App (Expo)
                </div>
                <div className="text-xs text-[#8A9086]">
                  Run <code className="text-[#5B9BD5]">npx expo start</code> in <code className="text-[#5B9BD5]">apps/mobile</code> for iOS & Android.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#8A9086] border border-[#232A24] px-2 py-1 rounded">
              Ready
            </span>
          </div>

          {/* Option 3: Backend Services */}
          <div className="rounded-xl border border-[#232A24] bg-[#0D110F] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#DDAA55]" />
              <div>
                <div className="text-sm font-bold text-[#F2F4F0]">
                  NestJS API & Gateway
                </div>
                <div className="text-xs text-[#8A9086]">
                  Running at <code className="text-[#DDAA55]">localhost:3000</code> with Keycloak on <code className="text-[#DDAA55]">8080</code>.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#8A9086] border border-[#232A24] px-2 py-1 rounded">
              Local Dev
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#232A24] flex items-center justify-between text-xs text-[#8A9086]">
          <span>Open-Source Monorepo (Turborepo)</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8FC24A] font-semibold hover:underline cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
