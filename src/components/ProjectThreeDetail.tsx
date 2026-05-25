import { useState } from "react";
import { portfolioContent, projects } from "@/content/portfolio";
import { PillActionButton } from "@/components/ui/pill-action-button";

type Project = (typeof projects)[number];

type ProjectThreeDetailProps = {
  project: Project;
  onBack: () => void;
};

const fullPageImage = "/images/projects/project-3/full-page.png";

export function ProjectThreeDetail({ project, onBack }: ProjectThreeDetailProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-white">
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
              className="mx-auto h-auto w-full max-w-[1200px] object-contain"
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="mx-auto flex min-h-[60vh] max-w-[1200px] items-center justify-center rounded-md border border-dashed border-white/25 bg-white/70 p-8 text-center backdrop-blur">
              <p className="text-base leading-8 text-slate-700">
                请将 full-page.png 放到 public/images/projects/project-3/
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
