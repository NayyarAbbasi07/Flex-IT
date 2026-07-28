"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";

export function FAQs() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="bg-muted/40 py-20 md:py-28">
      <Container narrow>
        <SectionHeading
          align="center"
          eyebrow="Support"
          title="FAQs"
          description="Everything you need to know before you Flex it!"
        />
        <div className="space-y-3">
          {faqs.map((faq) => {
            const open = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-ring sm:px-6 sm:py-5"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : faq.id)}
                >
                  <span className="font-display text-base font-semibold sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      open && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </AnimatedSection>
  );
}
