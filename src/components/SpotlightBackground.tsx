"use client";

import { useEffect, useRef, useState } from "react";

type SpotlightBackgroundProps = {
  color?: string;
};

const SpotlightBackground = ({
  color = "rgba(56,189,248,0.7)",
}: SpotlightBackgroundProps) => {
  const [isMoving, setIsMoving] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateSpotlight = () => {
      const spotlight = spotlightRef.current;
      if (spotlight) {
        spotlight.style.left = `${mouseRef.current.x}px`;
        spotlight.style.top = `${mouseRef.current.y}px`;
      }
      frameRef.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateSpotlight);
      }

      if (!isMovingRef.current) {
        isMovingRef.current = true;
        setIsMoving(true);
      }

      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => {
        isMovingRef.current = false;
        setIsMoving(false);
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute rounded-full transition-all duration-300 ease-out"
        style={{
          left: 0,
          top: 0,
          width: isMoving ? "220px" : "280px",
          height: isMoving ? "220px" : "280px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default SpotlightBackground;
