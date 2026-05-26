"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: "ltr" | "rtl";
  disabled?: boolean;
}

export const RadialScrollGallery = forwardRef<HTMLDivElement, RadialScrollGalleryProps>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = "",
      startTrigger = "center center",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      style,
      ...rest
    },
    ref,
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);
    const mobileRotationRef = useRef(0);
    const mobileFrameRef = useRef<number | null>(null);
    const suppressClickRef = useRef(false);
    const dragRef = useRef({
      pointerId: null as number | null,
      startX: 0,
      startY: 0,
      startRotation: 0,
      isDragging: false,
      hasMoved: false,
    });

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(() => React.Children.toArray(children(hoveredIndex)), [children, hoveredIndex]);
    const childrenCount = childrenNodes.length;

    const isMobileViewport = () => typeof window !== "undefined" && window.innerWidth < 768;

    const applyMobileRotation = (rotation: number) => {
      mobileRotationRef.current = rotation;

      if (mobileFrameRef.current !== null) return;

      mobileFrameRef.current = window.requestAnimationFrame(() => {
        mobileFrameRef.current = null;
        if (containerRef.current) {
          gsap.set(containerRef.current, { rotation: mobileRotationRef.current });
        }
      });
    };

    const handleMobilePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !isMobileViewport()) return;

      suppressClickRef.current = false;
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startRotation: mobileRotationRef.current,
        isDragging: false,
        hasMoved: false,
      };
    };

    const handleMobilePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (disabled || !isMobileViewport() || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (!drag.isDragging) {
        if (absX < 6 && absY < 6) return;
        if (absY > absX) return;

        drag.isDragging = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }

      if (!drag.isDragging) return;

      event.preventDefault();
      drag.hasMoved = absX > 10;
      suppressClickRef.current = drag.hasMoved;
      applyMobileRotation(drag.startRotation + deltaX * 0.25);
    };

    const endMobileDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      if (drag.isDragging && containerRef.current && childrenCount > 0) {
        const angleStep = 360 / childrenCount;
        const targetRotation = Math.round(mobileRotationRef.current / angleStep) * angleStep;
        mobileRotationRef.current = targetRotation;

        gsap.to(containerRef.current, {
          rotation: targetRotation,
          duration: 0.28,
          ease: "power2.out",
        });
      }

      if (drag.hasMoved) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 200);
      }

      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      dragRef.current = {
        pointerId: null,
        startX: 0,
        startY: 0,
        startRotation: mobileRotationRef.current,
        isDragging: false,
        hasMoved: false,
      };
    };

    const handleItemSelect = (index: number) => {
      if (suppressClickRef.current) {
        suppressClickRef.current = false;
        return;
      }

      onItemSelect?.(index);
    };

    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged) {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    useEffect(() => {
      return () => {
        if (mobileFrameRef.current !== null) {
          window.cancelAnimationFrame(mobileFrameRef.current);
        }
      };
    }, []);

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
          const mm = gsap.matchMedia();

          gsap.fromTo(
            containerRef.current.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "back.out(1.2)",
              stagger: 0.05,
              scrollTrigger: {
                trigger: pinRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );

          mm.add("(min-width: 768px)", () => {
            if (!pinRef.current || !containerRef.current) return;

            gsap.to(containerRef.current, {
              rotation: 360,
              ease: "none",
              scrollTrigger: {
                trigger: pinRef.current,
                pin: true,
                start: startTrigger,
                end: `+=${scrollDuration}`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          });

          mm.add("(max-width: 767px)", () => {
            if (!pinRef.current || !containerRef.current) return;

            gsap.set(containerRef.current, {
              rotation: mobileRotationRef.current,
            });
          });

          return () => mm.revert();
        }
      },
      {
        scope: pinRef,
        dependencies: [scrollDuration, currentRadius, startTrigger, childrenCount],
      },
    );

    if (childrenCount === 0) return null;

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize ? childSize.h * scaleFactor - childSize.h + 60 : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    return (
      <div
        ref={mergedRef}
        className={`relative flex min-h-screen w-full touch-pan-y items-center justify-center overflow-hidden ${className}`}
        {...rest}
        style={{
          WebkitOverflowScrolling: "touch",
          ...style,
        }}
      >
        <div
          className="relative w-full touch-pan-y overflow-hidden"
          onPointerDown={handleMobilePointerDown}
          onPointerMove={handleMobilePointerMove}
          onPointerUp={endMobileDrag}
          onPointerCancel={endMobileDrag}
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage: "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 m-0 -translate-x-1/2 list-none p-0 will-change-transform
              transition-opacity duration-500 ease-out
              touch-pan-y
              ${disabled ? "pointer-events-none opacity-50 grayscale" : ""}
              ${isMounted ? "opacity-100" : "opacity-0"}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === "rtl") {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && handleItemSelect(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onItemSelect?.(index);
                      }
                    }}
                    onMouseEnter={() => !disabled && setHoveredIndex(index)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    onFocus={() => !disabled && setHoveredIndex(index)}
                    onBlur={() => !disabled && setHoveredIndex(null)}
                    className={`
                      block cursor-pointer rounded-xl text-left outline-none will-change-transform
                      touch-pan-y
                      transition-all duration-500 ease-out
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      ${isHovered ? "-translate-y-8 scale-125" : "scale-100"}
                      ${isAnyHovered && !isHovered ? "blur-[2px] grayscale opacity-40" : "blur-0 opacity-100"}
                    `}
                  >
                    {child}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  },
);

RadialScrollGallery.displayName = "RadialScrollGallery";
