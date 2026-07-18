"use client";

import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/kibo-ui/contribution-graph";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type ContributionsProps = {
  data: Activity[];
};

export const Contributions = ({ data }: ContributionsProps) => {
  const reduceMotion = useReducedMotion() ?? false;
  const years = data.map(({ date }) => date.slice(0, 4)).sort();
  const firstYear = years[0];
  const lastYear = years.at(-1);
  const yearRange = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;
  const tooltipTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: "easeOut" };

  return (
    <ContributionGraph className="w-full" data={data}>
      <ContributionGraphCalendar className="w-full [&>svg]:h-auto [&>svg]:w-full">
        {({ activity, dayIndex, weekIndex }) => {
          const block = (
            <ContributionGraphBlock
              activity={activity}
              className={cn(
                'data-[level="0"]:fill-muted dark:data-[level="0"]:fill-muted/40',
                'data-[level="1"]:fill-primary/20 dark:data-[level="1"]:fill-primary/30',
                'data-[level="2"]:fill-primary/40 dark:data-[level="2"]:fill-primary/50',
                'data-[level="3"]:fill-primary/65 dark:data-[level="3"]:fill-primary/70',
                'data-[level="4"]:fill-secondary/80 dark:data-[level="4"]:fill-secondary/70',
                "[transform-box:fill-box] [transform-origin:center] transition-transform duration-150 ease-out hover:scale-[1.2]",
              )}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          );

          if (activity.count === 0) {
            return block;
          }

          return (
            <Tooltip>
              <TooltipTrigger asChild>{block}</TooltipTrigger>
              <TooltipContent className="whitespace-nowrap">
                {format(parseISO(activity.date), "dd MMMM yyyy")} · {activity.count} contributions
              </TooltipContent>
            </Tooltip>
          );
        }}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphTotalCount>
          {({ totalCount }) => `${totalCount} activities in ${yearRange}`}
        </ContributionGraphTotalCount>
        <ContributionGraphLegend>
          {({ level }) => (
            <motion.div
              animate="rest"
              className="relative flex h-3 w-3 items-center justify-center"
              data-level={level}
              initial="rest"
              whileHover="hover"
            >
              <div
                className={cn(
                  "h-full w-full rounded-xs border border-border",
                  level === 0 && "bg-muted dark:bg-muted/40",
                  level === 1 && "bg-primary/20 dark:bg-primary/30",
                  level === 2 && "bg-primary/40 dark:bg-primary/50",
                  level === 3 && "bg-primary/65 dark:bg-primary/70",
                  level === 4 && "bg-secondary/80 dark:bg-secondary/70",
                )}
              />
              <motion.span
                className="-top-8 pointer-events-none absolute rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md"
                transition={tooltipTransition}
                variants={{
                  rest: { opacity: 0, y: 4 },
                  hover: { opacity: 1, y: 0 },
                }}
              >
                Level {level}
              </motion.span>
            </motion.div>
          )}
        </ContributionGraphLegend>
      </ContributionGraphFooter>
    </ContributionGraph>
  );
};
