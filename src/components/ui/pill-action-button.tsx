import type { MouseEventHandler, ReactNode } from "react";

type PillActionButtonProps = {
  children?: ReactNode;
  label?: ReactNode;
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export function PillActionButton({
  children,
  label,
  icon = "↗",
  href,
  target,
  rel,
  className = "",
  disabled = false,
  size = "default",
  onClick,
  type = "button",
}: PillActionButtonProps) {
  const sizeClassName = size === "sm" ? "pill-action-button--sm" : "";
  const rootClassName = `pill-action-button ${sizeClassName} ${className}`.trim();

  const content = (
    <>
      <span className="pill-action-button__label">{label ?? children}</span>
      <span className="pill-action-button__icon" aria-hidden="true">
        {icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={disabled}
        className={rootClassName}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={rootClassName}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
