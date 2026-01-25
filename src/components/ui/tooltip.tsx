"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const reduceMotion = useReducedMotion() ?? false;
  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: "easeOut" };
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        asChild
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        <motion.div
          className={cn(
            "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-muted/80 px-3 py-1.5 text-foreground text-xs shadow-md",
            className,
          )}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-muted/80 fill-muted/80" />
        </motion.div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
