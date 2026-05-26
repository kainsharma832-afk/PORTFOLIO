import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type InteractiveDotsProps = {
  spacing?: number;
  dotRadius?: number;
  repelForce?: number;
  repelDistance?: number;
  returnSpeed?: number;
  colors?: string[];
  className?: string;
};

type Point = {
  x: number;
  y: number;
  color: string;
};

type Size = {
  width: number;
  height: number;
};

export function InteractiveDots({
  spacing = 20,
  dotRadius = 9,
  repelForce = 0.6,
  repelDistance = 10000,
  returnSpeed = 1,
  colors = ["#EEBEED", "#9FD6FF", "#FFED7B"],
  className = "",
}: InteractiveDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const commitPointer = () => {
      setMouse(pointerRef.current);
      frameRef.current = null;
    };

    const schedulePointerUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(commitPointer);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      schedulePointerUpdate();
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
      schedulePointerUpdate();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const points = useMemo<Point[]>(() => {
    if (!size.width || !size.height) return [];

    const columns = Math.ceil(size.width / spacing) + 2;
    const rows = Math.ceil(size.height / spacing) + 2;
    const startX = -spacing;
    const startY = -spacing;
    const nextPoints: Point[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        nextPoints.push({
          x: startX + column * spacing,
          y: startY + row * spacing,
          color: colors[(row + column) % colors.length],
        });
      }
    }

    return nextPoints;
  }, [colors, size.height, size.width, spacing]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-0 h-screen min-h-screen w-screen overflow-hidden bg-white ${className}`}
      data-interactive-dots="true"
      aria-hidden="true"
    >
      {points.map((point, index) => {
        const deltaX = mouse ? point.x - mouse.x : 0;
        const deltaY = mouse ? point.y - mouse.y : 0;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;
        const influence = mouse ? Math.max(0, 1 - distanceSquared / repelDistance) : 0;
        const distance = Math.sqrt(distanceSquared) || 1;
        const moveX = (deltaX / distance) * influence * repelForce * spacing * 3;
        const moveY = (deltaY / distance) * influence * repelForce * spacing * 3;

        return (
          <span
            key={`${point.x}-${point.y}-${index}`}
            className="absolute rounded-full will-change-transform"
            style={
              {
                left: point.x,
                top: point.y,
                width: dotRadius * 2,
                height: dotRadius * 2,
                backgroundColor: point.color,
                opacity: 0.62,
                transform: `translate3d(${moveX}px, ${moveY}px, 0)`,
                transition: `transform ${Math.max(0.08, returnSpeed * 0.18)}s ease-out`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
