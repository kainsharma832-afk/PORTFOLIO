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

const SWIPE_THRESHOLD = 35;
const VERTICAL_CANCEL_RATIO = 1.2;
const CLICK_CANCEL_THRESHOLD = 10;
const MOBILE_SWIPE_DURATION = 0.42;

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
    const wheelRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);
    const touchStartXRef = useRef(0);
    const touchStartYRef = useRef(0);
    const isSwipingRef = useRef(false);
    const hasSwipeMovedRef = useRef(false);
    const swipePointerIdRef = useRef<number | null>(null);
    const mobileActiveIndexRef = useRef(0);
    const mobileStepRef = useRef(0);
    const mobileRotationRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const suppressClickRef = useRef(false);

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
    const initialRotation = useMemo(
      () => (childrenCount > 1 ? -(360 / childrenCount) * 2 : 0),
      [childrenCount],
    );

    const isMobileViewport = () => typeof window !== "undefined" && window.innerWidth < 768;

    const resetMobileSwipe = () => {
      isSwipingRef.current = false;
      hasSwipeMovedRef.current = false;
      swipePointerIdRef.current = null;
    };

    const goToMobileIndex = (direction: "next" | "prev") => {
      if (isAnimatingRef.current || !wheelRef.current || childrenCount === 0) return;

      const angleStep = 360 / childrenCount;
      const directionStep = direction === "next" ? 1 : -1;
      const nextStep = mobileStepRef.current + directionStep;
      const nextIndex = ((nextStep % childrenCount) + childrenCount) % childrenCount;
      const targetRotation = initialRotation - nextStep * angleStep;

      isAnimatingRef.current = true;
      mobileStepRef.current = nextStep;
      mobileActiveIndexRef.current = nextIndex;
      mobileRotationRef.current = targetRotation;
      suppressClickRef.current = true;

      gsap.to(wheelRef.current, {
        rotation: targetRotation,
        duration: MOBILE_SWIPE_DURATION,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
        onInterrupt: () => {
          isAnimatingRef.current = false;
        },
      });
    };

    const handleMobilePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !isMobileViewport()) return;
      if (isAnimatingRef.current) return;

      if (wheelRef.current) {
        gsap.killTweensOf(wheelRef.current);
      }

      suppressClickRef.current = false;
      touchStartXRef.current = event.clientX;
      touchStartYRef.current = event.clientY;
      isSwipingRef.current = true;
      hasSwipeMovedRef.current = false;
      swipePointerIdRef.current = event.pointerId;
    };

    const handleMobilePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (isAnimatingRef.current) return;
      if (disabled || !isMobileViewport() || !isSwipingRef.current || swipePointerIdRef.current !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - touchStartXRef.current;
      const deltaY = event.clientY - touchStartYRef.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      hasSwipeMovedRef.current = absX > CLICK_CANCEL_THRESHOLD;
      suppressClickRef.current = hasSwipeMovedRef.current;

      if (absX > CLICK_CANCEL_THRESHOLD && absX > absY * VERTICAL_CANCEL_RATIO) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
    };

    const endMobileDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      if (swipePointerIdRef.current !== event.pointerId) return;

      const deltaX = event.clientX - touchStartXRef.current;
      const deltaY = event.clientY - touchStartYRef.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const isHorizontalSwipe = absX > SWIPE_THRESHOLD && absX > absY * VERTICAL_CANCEL_RATIO;

      if (isHorizontalSwipe) {
        goToMobileIndex(deltaX > 0 ? "next" : "prev");
      }

      if (hasSwipeMovedRef.current || isHorizontalSwipe) {
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 200);
      }

      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetMobileSwipe();
    };

    const cancelMobileDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      if (swipePointerIdRef.current !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetMobileSwipe();
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
      mobileActiveIndexRef.current = 0;
      mobileStepRef.current = 0;
      mobileRotationRef.current = initialRotation;
      isAnimatingRef.current = false;
      resetMobileSwipe();

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
    }, [childrenCount, initialRotation]);

    useGSAP(
      () => {
        if (!pinRef.current || !wheelRef.current || childrenCount === 0) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!prefersReducedMotion) {
          const mm = gsap.matchMedia();

          gsap.fromTo(
            wheelRef.current.children,
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
            if (!pinRef.current || !wheelRef.current) return;

            gsap.fromTo(
              wheelRef.current,
              { rotation: initialRotation },
              {
                rotation: initialRotation - 360,
                ease: "none",
                scrollTrigger: {
                  trigger: pinRef.current,
                  pin: true,
                  start: startTrigger,
                  end: `+=${scrollDuration}`,
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          mm.add("(max-width: 767px)", () => {
            if (!pinRef.current || !wheelRef.current) return;

            mobileRotationRef.current = initialRotation;
            gsap.set(wheelRef.current, {
              rotation: initialRotation,
            });
          });

          return () => mm.revert();
        }
      },
      {
        scope: pinRef,
        dependencies: [scrollDuration, currentRadius, startTrigger, childrenCount, initialRotation],
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
          onPointerCancel={cancelMobileDrag}
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage: "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 40%, black 100%)",
          }}
        >
          <div
            className={`
              absolute left-1/2 m-0 -translate-x-1/2 p-0
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
            <ul ref={wheelRef} className="relative m-0 h-full w-full list-none p-0 will-change-transform">
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
      </div>
    );
  },
);

RadialScrollGallery.displayName = "RadialScrollGallery";
