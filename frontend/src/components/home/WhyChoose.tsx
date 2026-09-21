"use client";

import { CheckCircle2, PackageCheck, Sparkles, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading, AnimatedSection } from "@/components/ui/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";

const reasons = [
  {
    icon: Sparkles,
    title: "Curated Selection",
    description:
      "Every pair is hand-selected for style, authenticity markers, and wearability — never random thrift clutter.",
  },
  {
    icon: PackageCheck,
    title: "Quality Checked",
    description:
      "Uppers, soles, stitching, and odor are inspected so you know exactly what you're getting.",
  },
  {
    icon: CheckCircle2,
    title: "Affordable Premium",
    description:
      "Imported icons at fair prices. Luxury presence without the luxury markup.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Order on WhatsApp and get delivery across Pakistan with clear tracking updates.",
  },
];

export function WhyChoose() {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedSection className="bg-foreground py-20 text-background md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why us"
          title="Why Choose Flex it!"
          description="Premium imported thrift fashion built on trust, curation, and clean presentation."
          className="[&_h2]:text-background [&_p]:text-background/60 [&_.mb-3]:text-background/50"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-card/5 p-6 backdrop-blur-sm"
            >
              <reason.icon className="h-7 w-7 text-background" strokeWidth={1.5} />
              <h3 className="mt-5 font-display text-xl font-semibold">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-background/65">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  );
}
