import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { enterMotion } from "@/components/motion/enter";
import { GEAR_SECTIONS, type GearItem } from "@/data/gear";

const GEAR_DESCRIPTION =
  "The cameras, desk tools, fitness gear, chargers, and everyday technology Ajan Raj uses.";

export const Route = createFileRoute("/gear")({
  head: () => ({
    meta: [
      { title: "Gear | Ajan Raj" },
      { name: "description", content: GEAR_DESCRIPTION },
      { property: "og:title", content: "Gear | Ajan Raj" },
      { property: "og:description", content: GEAR_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ajanraj.com/gear" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gear | Ajan Raj" },
      { name: "twitter:description", content: GEAR_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://ajanraj.com/gear" }],
  }),
  component: GearPage,
});

type ProductCutoutProps = {
  item: GearItem;
  reduceMotion: boolean;
  delay: number;
};

function ProductLink({ item }: { item: GearItem }) {
  return (
    <a
      aria-label={`View ${item.name} at ${item.linkLabel}`}
      className="group/link mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
      href={item.href}
      rel={item.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      target="_blank"
    >
      {item.linkLabel}
      {item.affiliate ? " · affiliate" : ""}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  );
}

function ProductCutout({ item, reduceMotion, delay }: ProductCutoutProps) {
  const scale = item.scale ?? 1;
  const hoverTransition: Transition = {
    duration: reduceMotion ? 0 : 0.18,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.article className="group" {...enterMotion({ reduceMotion, y: 12, delay })}>
      <a
        aria-label={`View ${item.name} at ${item.linkLabel}`}
        className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        href={item.href}
        rel={item.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
        target="_blank"
      >
        <div className="flex aspect-square items-center justify-center p-3 sm:p-5">
          <motion.img
            alt={item.name}
            animate={{ rotate: reduceMotion ? 0 : item.rotation, scale }}
            className="h-full w-full object-contain drop-shadow-[0_24px_20px_rgba(4,12,28,0.28)]"
            loading="lazy"
            src={item.image}
            transition={hoverTransition}
            whileHover={reduceMotion ? undefined : { rotate: 0, scale: scale * 1.025, y: -6 }}
          />
        </div>
      </a>
      <h3
        className={`page-heading text-balance text-2xl leading-none ${item.compactTitle ? "sm:text-2xl" : "sm:text-3xl"}`}
      >
        {item.name}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.note}</p>
      <ProductLink item={item} />
    </motion.article>
  );
}

function FeaturedCutout({ item, reduceMotion, delay }: ProductCutoutProps) {
  const scale = item.scale ?? 1;
  const hoverTransition: Transition = {
    duration: reduceMotion ? 0 : 0.18,
    ease: [0.25, 0.1, 0.25, 1],
  };

  return (
    <motion.a
      aria-label={`View ${item.name} at ${item.linkLabel}`}
      className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      href={item.href}
      rel={item.affiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
      target="_blank"
      {...enterMotion({ reduceMotion, y: 14, delay })}
    >
      <motion.img
        alt={item.name}
        animate={{ rotate: reduceMotion ? 0 : item.rotation, scale }}
        className="h-full w-full object-contain drop-shadow-[0_28px_24px_rgba(4,12,28,0.3)]"
        src={item.image}
        transition={hoverTransition}
        whileHover={reduceMotion ? undefined : { rotate: 0, scale: scale * 1.025, y: -6 }}
      />
    </motion.a>
  );
}

function GearPage() {
  const reduceMotion = useReducedMotion() ?? false;
  const remember = GEAR_SECTIONS[0];
  const iphone = remember?.items[0];
  const fuji = remember?.items[1];
  const memoryCard = remember?.items[2];

  if (!remember || !iphone || !fuji || !memoryCard) {
    return null;
  }

  return (
    <motion.main
      className="border-t border-dashed px-6 pt-8 sm:px-8"
      {...enterMotion({ reduceMotion, y: 12, duration: 0.32 })}
    >
      <motion.header {...enterMotion({ reduceMotion, y: 10, delay: 0.04 })}>
        <h1 className="page-heading font-medium text-4xl tracking-tight sm:text-5xl">
          Things I use
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Objects that help me remember, make, move, and occasionally switch off.
        </p>
        <p className="mt-5 max-w-lg font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/80">
          Some links are affiliate links. They never change what I recommend or what you pay.
        </p>
      </motion.header>

      <section className="mt-14" aria-labelledby="gear-remember">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {remember.number} — <span id="gear-remember">{remember.title}</span>
        </p>

        <div className="mt-6 grid gap-12 sm:hidden">
          {[iphone, fuji, memoryCard].map((item, index) => (
            <ProductCutout
              delay={0.08 + index * 0.05}
              item={item}
              key={item.name}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="relative hidden min-h-[790px] sm:block">
          <div className="absolute left-4 top-3 h-[360px] w-[280px]">
            <FeaturedCutout item={iphone} reduceMotion={reduceMotion} delay={0.08} />
          </div>
          <motion.div
            className="absolute right-3 top-28 w-[220px]"
            {...enterMotion({ reduceMotion, y: 8, delay: 0.13 })}
          >
            <h2 className="page-heading text-3xl leading-none">{iphone.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{iphone.note}</p>
            <ProductLink item={iphone} />
          </motion.div>

          <motion.div
            className="absolute bottom-52 left-3 z-10 w-[220px]"
            {...enterMotion({ reduceMotion, y: 8, delay: 0.18 })}
          >
            <h2 className="page-heading text-3xl leading-none">{fuji.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{fuji.note}</p>
            <ProductLink item={fuji} />
          </motion.div>
          <div className="absolute bottom-52 right-[-1rem] h-[300px] w-[350px]">
            <FeaturedCutout item={fuji} reduceMotion={reduceMotion} delay={0.14} />
          </div>

          <motion.div
            className="absolute bottom-0 right-0 z-20 flex w-[400px] items-end justify-end gap-4"
            {...enterMotion({ reduceMotion, y: 8, delay: 0.22 })}
          >
            <div className="w-[220px] pb-3 text-right">
              <p className="page-heading text-balance text-xl leading-none">{memoryCard.name}</p>
              <ProductLink item={memoryCard} />
            </div>
            <div className="h-[120px] w-[120px] shrink-0">
              <FeaturedCutout item={memoryCard} reduceMotion={reduceMotion} delay={0.2} />
            </div>
          </motion.div>
        </div>
      </section>

      {GEAR_SECTIONS.slice(1).map((section, sectionIndex) => (
        <section
          aria-labelledby={`gear-${section.number}`}
          className="mt-16 border-t border-dashed pt-8 sm:mt-20"
          key={section.number}
        >
          <motion.p
            className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
            {...enterMotion({ reduceMotion, y: 8, delay: 0.04 })}
          >
            {section.number} — <span id={`gear-${section.number}`}>{section.title}</span>
          </motion.p>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2">
            {section.items.map((item, itemIndex) => (
              <ProductCutout
                delay={0.08 + sectionIndex * 0.02 + itemIndex * 0.04}
                item={item}
                key={item.name}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </section>
      ))}
    </motion.main>
  );
}
