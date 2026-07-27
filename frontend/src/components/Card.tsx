import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("rounded-xl bg-gruv-fg2 dark:bg-gruv-fg4 shadow-sm", {
  variants: {
    padding: { none: "p-0", sm: "p-3", md: "p-5", lg: "p-8" },
    interactive: { true: "hover:bg-gruv-orange hover:text-gruv-fg2 hover:bg-gruv-orange/80 transition-all cursor-pointer" },
  },
  defaultVariants: { padding: "md" },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, padding, interactive, ...props }: CardProps) {
  return (
    <div className={cardVariants({ padding, interactive, className })} {...props} />
  );
}
