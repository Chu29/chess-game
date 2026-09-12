import { useState, useEffect } from "react";
import { Navbar } from "./components/landing/Navbar";
import { HeroSection } from "./components/landing/HeroSection";
import { InteractiveBoardDemo } from "./components/landing/InteractiveBoardDemo";
import { FeatureGridSection } from "./components/landing/FeatureGridSection";
import { DailyPuzzleSection } from "./components/landing/DailyPuzzleSection";
import { StatsAndTestimonialsSection } from "./components/landing/StatsAndTestimonialsSection";
import { Footer } from "./components/landing/Footer";
import { QuickPlayModal } from "./components/landing/QuickPlayModal";

const MOBILE_APP_URL =
  import.meta.env.VITE_MOBILE_APP_URL || "http://localhost:8081";

export function App() {
  const [playModalOpen, setPlayModalOpen] = useState(false);

  // If user visits /login, /register, /game, or /play on the landing site,
  // immediately redirect them to the Expo mobile web app
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (["/login", "/register", "/game", "/play"].includes(path)) {
      const targetPath = path === "/play" || path === "/game" ? "" : path;
      window.location.href = `${MOBILE_APP_URL}${targetPath}`;
    }
  }, []);

  // When clicking any Play button, open the Expo mobile web app in a new tab
  const handlePlayClick = () => {
    window.open(MOBILE_APP_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#050705] text-white flex flex-col selection:bg-[#00E676]/20 selection:text-[#00E676]">
      {/* Top Tournament Navigation Bar */}
      <Navbar
        onPlayClick={handlePlayClick}
        onDownloadClick={() => setPlayModalOpen(true)}
      />

      {/* Main Content Sections Matching Original Design */}
      <main className="flex-grow">
        {/* 1. Hero: Master the Board. Outthink the World. + Direct Mobile Play CTA */}
        <HeroSection onPlayClick={handlePlayClick} />

        {/* 2. Tactile Mobile Simulation: Phone Frame + Green Tournament Board + Telemetry */}
        <InteractiveBoardDemo />

        {/* 3. Pure Chess. Zero Clutter: 6 Feature Cards */}
        <FeatureGridSection />

        {/* 4. Daily Grandmaster Puzzle: Queen Sacrifice on h7 + Tal Attack */}
        <DailyPuzzleSection />

        {/* 5. Metrics & Testimonials: 1.2M+, 15M+, 4.9★, 99.98% + 3 Player Reviews */}
        <StatsAndTestimonialsSection />
      </main>

      {/* 6. Conversion Banner & 4-Column Specifications Footer */}
      <Footer onPlayClick={handlePlayClick} />

      {/* App Launchpad / Installation Modal */}
      <QuickPlayModal
        isOpen={playModalOpen}
        onClose={() => setPlayModalOpen(false)}
      />
    </div>
  );
}

export default App;
