"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-[background-color,color,border-color,box-shadow,transform] before:pointer-events-none before:absolute before:inset-0 before:rounded-[7px] before:transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:h-4 [&_svg:not([class*='size-'])]:w-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-3 sm:h-8",
        icon: "h-9 w-9 sm:h-8 sm:w-8",
        "icon-lg": "h-10 w-10 sm:h-9 sm:w-9",
        "icon-sm": "h-8 w-8 sm:h-7 sm:w-7",
        "icon-xl": "h-11 w-11 sm:h-10 sm:w-10 [&_svg:not([class*='size-'])]:h-5 [&_svg:not([class*='size-'])]:w-5",
        "icon-xs":
          "h-7 w-7 rounded-md before:rounded-[5px] sm:h-6 sm:w-6 [&_svg:not([class*='size-'])]:h-3.5 [&_svg:not([class*='size-'])]:w-3.5",
        lg: "h-10 px-3.5 sm:h-9",
        sm: "h-8 gap-1.5 px-2.5 sm:h-7",
        xl: "h-11 px-4 text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:h-5 [&_svg:not([class*='size-'])]:w-5",
        xs: "h-7 gap-1 rounded-md px-2 text-sm before:rounded-[5px] sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:h-3.5 [&_svg:not([class*='size-'])]:w-3.5",
      },
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20 before:shadow-[inset_0_1px_rgba(255,255,255,0.16)] hover:bg-primary/90 active:bg-primary/85 active:shadow-none active:before:shadow-[inset_0_1px_rgba(0,0,0,0.08)] data-[pressed]:bg-primary/90 data-[pressed]:shadow-none disabled:shadow-none",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 before:shadow-[inset_0_1px_rgba(255,255,255,0.16)] hover:bg-destructive/90 active:bg-destructive/85 active:shadow-none active:before:shadow-[inset_0_1px_rgba(0,0,0,0.08)] data-[pressed]:bg-destructive/90 data-[pressed]:shadow-none disabled:shadow-none",
        "destructive-outline":
          "border-input bg-transparent text-destructive shadow-sm before:shadow-[0_1px_rgba(0,0,0,0.06)] hover:border-destructive/40 hover:bg-destructive/10 active:bg-destructive/15 active:shadow-none data-[pressed]:border-destructive/40 data-[pressed]:bg-destructive/10 disabled:shadow-none",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80 data-[pressed]:bg-accent",
        link: "border-transparent bg-transparent text-foreground underline-offset-4 hover:underline active:underline data-[pressed]:underline",
        outline:
          "border-input bg-background text-foreground shadow-sm before:shadow-[0_1px_rgba(0,0,0,0.06)] hover:bg-accent/50 hover:text-accent-foreground active:bg-accent/70 active:shadow-none data-[pressed]:bg-accent/50 data-[pressed]:shadow-none disabled:shadow-none",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80 data-[pressed]:bg-secondary/90",
      },
    },
  }
);

interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

export { Button, buttonVariants };
