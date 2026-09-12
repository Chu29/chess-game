import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "../../data/landingContent";

export const FaqSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#0D110F] border-t border-[#232A24]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#232A24] bg-[#161B17] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#8A9086]">
            <HelpCircle className="h-3.5 w-3.5 text-[#8FC24A]" />
            Frequently Asked Questions
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#F2F4F0] sm:text-4xl">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8A9086]">
            Transparent answers about our AI architecture, competitive
            integrity, and game matchmaking.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openIndices.includes(index);

            return (
              <div
                key={index}
                className="rounded-xl border border-[#232A24] bg-[#161B17] transition-all hover:border-[#8FC24A]/30 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-[#F2F4F0] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#8A9086] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#8FC24A]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#8A9086] leading-relaxed border-t border-[#232A24]/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
