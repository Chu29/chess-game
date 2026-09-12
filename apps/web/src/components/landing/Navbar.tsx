import { useState, useEffect } from "react";
import { User, Menu, X } from "lucide-react";

interface NavbarProps {
  onPlayClick?: () => void;
  onDownloadClick?: () => void;
}

interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { id: "features", label: "Features", href: "#features" },
  { id: "interactive-terminal", label: "Interactive Demo", href: "#interactive-terminal" },
  { id: "academy", label: "Academy", href: "#academy" },
  { id: "grandmaster-ai", label: "Grandmaster AI", href: "#grandmaster-ai" },
  { id: "community", label: "Community", href: "#community" },
];

export const Navbar: React.FC<NavbarProps> = ({
  onPlayClick,
  onDownloadClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("interactive-terminal");

  // ScrollSpy to dynamically highlight current section in navigation bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      const sectionOrder = [
        "hero",
        "interactive-terminal",
        "grandmaster-ai",
        "features",
        "academy",
        "community",
      ];

      for (let i = sectionOrder.length - 1; i >= 0; i--) {
        const id = sectionOrder[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          if (id === "hero") {
            setActiveSection("interactive-terminal");
          } else {
            setActiveSection(id);
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#161B17] bg-[#050705]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Emblem & Logo */}
        <a
          href="#hero"
          onClick={handleScrollToTop}
          className="flex items-center gap-2.5 group"
          title="Scroll to top"
        >
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wider text-white group-hover:text-[#00E676] transition-colors">
              CHUVINJAB
            </span>
            <span className="text-[9px] font-semibold tracking-widest text-[#00E676] uppercase -mt-0.5">
              TOURNAMENT CHESS
            </span>
          </div>
        </a>

        {/* Center Nav Links with Dynamic Pill Indicator */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={
                  isActive
                    ? "rounded-full border border-[#232B25] bg-[#0C0E0D] px-3.5 py-1 text-xs font-medium text-white shadow-inner hover:border-[#00E676]/40 transition-colors"
                    : "rounded-lg px-3 py-1.5 text-xs font-medium text-[#889088] transition-colors hover:text-white"
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onPlayClick}
            className="text-xs font-medium text-[#889088] hover:text-white transition-colors cursor-pointer px-2 py-1.5"
          >
            Play Online
          </button>
          <button
            type="button"
            onClick={onDownloadClick || onPlayClick}
            className="rounded-lg bg-[#00E676] px-4 py-1.5 text-xs font-bold text-[#050705] transition-all hover:bg-[#10FF85] hover:shadow-[0_0_15px_-2px_rgba(0,230,118,0.4)] active:scale-95 cursor-pointer"
          >
            Download App
          </button>
          <button
            type="button"
            onClick={onPlayClick}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1F2620] bg-[#0C0E0D] text-[#889088] hover:text-white hover:border-[#00E676]/40 transition-colors cursor-pointer"
            aria-label="User Account"
          >
            <User className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#889088] hover:bg-[#0C0E0D] hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#161B17] bg-[#050705] px-4 pt-3 pb-5 md:hidden space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "font-medium text-[#00E676] bg-[#0C0E0D]"
                    : "text-[#889088] hover:bg-[#0C0E0D] hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-3 border-t border-[#161B17] flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onPlayClick?.();
              }}
              className="flex-1 rounded-lg border border-[#232B25] bg-[#0C0E0D] py-2 text-center text-xs font-semibold text-white hover:border-[#00E676]/40 cursor-pointer"
            >
              Play Online
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                (onDownloadClick || onPlayClick)?.();
              }}
              className="flex-1 rounded-lg bg-[#00E676] py-2 text-center text-xs font-bold text-[#050705] hover:bg-[#10FF85] cursor-pointer"
            >
              Download App
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
