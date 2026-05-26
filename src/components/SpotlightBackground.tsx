"use client";

import { useEffect, useRef, useState } from "react";

type SpotlightBackgroundProps = {
  color?: string;
};

const SpotlightBackground = ({
  color = "rgba(56,189,248,0.7)",
}: SpotlightBackgroundProps) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({ x: event.clientX, y: event.clientY });
      setIsMoving(true);

      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <div
        className="pointer-events-none absolute rounded-full transition-all duration-300 ease-out"
        style={{
          left: mouse.x,
          top: mouse.y,
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
