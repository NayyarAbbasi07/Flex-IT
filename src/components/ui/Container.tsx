import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "main" | "header" | "footer" | "nav";
  narrow?: boolean;
}

export function Container({
  as: Tag = "div",
  className,
  narrow,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-4xl" : "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
