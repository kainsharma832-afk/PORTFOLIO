import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ContainerScrollProps = {
  titleComponent: ReactNode;
  children: ReactNode;
};

export function ContainerScroll({ titleComponent, children }: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.55], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.05, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.55], [0, -84]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0.72]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] w-full items-start justify-center overflow-visible px-4 pt-16 sm:px-6 md:h-[80rem] md:pt-20"
      style={{ perspective: "1000px" }}
    >
      <div className="sticky top-20 mx-auto flex w-full max-w-[1200px] flex-col items-center">
        <motion.div
          className="mx-auto mb-8 max-w-5xl text-center"
          style={{ translateY, opacity: titleOpacity }}
        >
          {titleComponent}
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-[1120px] rounded-[30px] border border-slate-950/30 bg-slate-950 p-2 shadow-[0_34px_110px_rgba(0,0,0,0.32)] sm:p-3"
          style={{
            rotateX,
            scale,
            transformStyle: "preserve-3d",
            transformOrigin: "center top",
          }}
        >
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
