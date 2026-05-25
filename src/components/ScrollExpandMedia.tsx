import { useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ScrollExpandMediaProps = {
  mediaType: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
};

export function ScrollExpandMedia({
  mediaType,
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [30, 18]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [0.72, 1]);

  const canShowPoster = bgImageSrc && !posterFailed;

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden border-y border-white/10 bg-transparent px-4 py-24 text-white sm:px-6 sm:py-28"
      style={{
        background: "transparent",
      }}
    >
      {canShowPoster ? (
        <img
          src={bgImageSrc}
          alt=""
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full scale-105 object-cover opacity-[0.08] blur-sm"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 -z-20 bg-white/[0.03]" />
      )}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.03] backdrop-blur-sm" />

      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {date ? (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
                {date}
              </p>
            ) : null}
            <h2
              className={`mt-3 text-4xl font-black tracking-normal sm:text-6xl ${
                textBlend ? "mix-blend-screen" : ""
              }`}
            >
              {title}
            </h2>
          </div>
          {scrollToExpand ? (
            <p className="text-sm font-medium text-white/56">{scrollToExpand}</p>
          ) : null}
        </div>

        <motion.div
          className="mx-auto overflow-hidden border border-white/10 bg-white/[0.06] shadow-lg backdrop-blur-sm"
          style={{ scale, borderRadius, opacity }}
        >
          {!mediaFailed ? (
            mediaType === "video" ? (
              <video
                src={mediaSrc}
                poster={posterSrc}
                controls
                playsInline
                preload="metadata"
                className="block aspect-video h-auto w-full bg-black object-cover"
                onError={() => setMediaFailed(true)}
              />
            ) : (
              <img
                src={mediaSrc}
                alt={title}
                className="block aspect-video h-auto w-full bg-black object-cover"
                onError={() => setMediaFailed(true)}
              />
            )
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-black px-6 text-center">
              <p className="text-base leading-8 text-white/76">
                请将 advertising-video.mp4 放到 public/videos/projects/project-1/
              </p>
            </div>
          )}
        </motion.div>

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
