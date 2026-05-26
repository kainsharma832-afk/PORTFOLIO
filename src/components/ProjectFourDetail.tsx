import { useState } from "react";
import { portfolioContent, projects } from "@/content/portfolio";
import Grainient from "@/components/Grainient/Grainient";
import { PillActionButton } from "@/components/ui/pill-action-button";

type Project = (typeof projects)[number];

type ProjectFourDetailProps = {
  project: Project;
  onBack: () => void;
};

const fullPageImage = "/images/projects/project-4/full-page.png";
const fullPageImageError =
  "图片加载失败，请检查 public/images/projects/project-4/full-page.png 是否存在。";

export function ProjectFourDetail({ project, onBack }: ProjectFourDetailProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-white">
      <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden">
        <Grainient
          color1="#d9d9d9"
          color2="#ffeeba"
          color3="#f1a46e"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <main className="relative z-10 min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/90 text-gray-700 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5">
            <span className="text-sm font-bold tracking-wide text-gray-700">
              {portfolioContent.nav.brand}
            </span>
            <PillActionButton onClick={onBack} icon="←" size="sm">
              Back Home
            </PillActionButton>
          </div>
        </nav>

        <section className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto mb-8 max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              {project.category}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-900 sm:text-5xl">
              {project.title}
            </h1>
            {project.description ? (
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
                {project.description}
              </p>
            ) : null}
          </div>

          {!imageFailed ? (
            <img
              src={fullPageImage}
              alt={`${project.title} full page`}
              loading="lazy"
              decoding="async"
              className="mx-auto h-auto w-full max-w-6xl object-contain"
              draggable={false}
              onError={() => {
                console.warn(fullPageImageError);
                setImageFailed(true);
              }}
            />
          ) : (
            <div className="mx-auto flex min-h-[60vh] max-w-[1200px] items-center justify-center rounded-md border border-dashed border-white/25 bg-white/70 p-8 text-center backdrop-blur">
              <p className="text-base leading-8 text-slate-700">
                {fullPageImageError}
              </p>
            </div>
          )}
        </section>

        <footer className="relative z-10 mx-auto flex max-w-[1200px] justify-center px-4 py-12">
          <PillActionButton onClick={onBack} icon="←">
            Back to Home
          </PillActionButton>
        </footer>
      </main>
    </div>
  );
}
