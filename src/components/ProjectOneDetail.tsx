import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { portfolioContent, projects } from "@/content/portfolio";
import { InteractiveDots } from "@/components/ui/interactive-dots";
import { ScrollExpandMedia } from "@/components/ScrollExpandMedia";

type Project = (typeof projects)[number];

type ProjectOneDetailProps = {
  project: Project;
  onBack: () => void;
};

const fullPageImage = "/images/projects/project-1/full-page.png";

export function ProjectOneDetail({ project, onBack }: ProjectOneDetailProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="group relative min-h-screen overflow-x-hidden text-white">
      <div className="opacity-30 transition-opacity duration-500 group-hover:opacity-50">
        <InteractiveDots
          spacing={20}
          dotRadius={9}
          repelForce={0.6}
          repelDistance={10000}
          returnSpeed={1}
          colors={["#EEBEED", "#9FD6FF", "#FFED7B", "#8CE5E9"]}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-[1] bg-white/5" aria-hidden="true" />

      <main className="relative z-10 min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
            <button type="button" onClick={onBack} className="text-sm font-bold tracking-wide text-white">
              {portfolioContent.nav.brand}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 transition hover:-translate-y-0.5 hover:bg-white hover:text-black"
            >
              <ArrowLeft size={16} />
              Back Home
            </button>
          </div>
        </nav>

        <section className="relative z-10 mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto mb-8 max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Product design
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-900 sm:text-5xl">
              Home rehabilitation equipment for dysphagia after stroke
            </h1>
          </div>

          {!imageFailed ? (
            <img
              src={fullPageImage}
              alt="Home rehabilitation equipment for dysphagia after stroke"
              className="mx-auto h-auto w-full max-w-[1200px] object-contain"
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="mx-auto flex min-h-[60vh] max-w-[1200px] items-center justify-center rounded-md border border-dashed border-white/25 bg-white/70 p-8 text-center backdrop-blur">
              <p className="text-base leading-8 text-slate-700">
                请将 full-page.png 放到 public/images/projects/project-1/
              </p>
            </div>
          )}
        </section>

        {project.projectUrl ? (
          <section className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-4 pb-12 text-center">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              访问项目网页
              <ExternalLink size={16} />
            </a>
            <p className="text-xs font-medium text-white/70">
              当前为本地测试链接，上线后请替换为正式网址。
            </p>
          </section>
        ) : null}

        <ScrollExpandMedia
          mediaType="video"
          mediaSrc="/videos/projects/project-1/advertising-video.mp4"
          posterSrc="/images/projects/project-1/advertising-poster.png"
          bgImageSrc="/images/projects/project-1/advertising-poster.png"
          title="ADVERTISING VIDEO"
          date="YINYU PROJECT"
          scrollToExpand="Scroll to Expand Video"
        >
          <div className="mx-auto max-w-4xl text-white">
            <h2 className="mb-6 text-3xl font-bold">Advertising Video</h2>
            <p className="text-lg leading-8 text-white/80">
              This section showcases the advertising video for the YINYU project.
            </p>
          </div>
        </ScrollExpandMedia>

        <footer className="relative z-10 mx-auto flex max-w-[1200px] justify-center px-4 py-12">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/90 px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </footer>
      </main>
    </div>
  );
}
