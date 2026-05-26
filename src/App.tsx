import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Code2, Mail, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadialScrollGallery } from "@/components/ui/portfolio-and-image-gallery";
import { portfolioContent, projects } from "@/content/portfolio";
import Waves from "@/components/Waves";

type Project = (typeof projects)[number];

const ProjectOneDetail = lazy(() =>
  import("@/components/ProjectOneDetail").then((module) => ({
    default: module.ProjectOneDetail,
  }))
);
const ProjectTwoDetail = lazy(() =>
  import("@/components/ProjectTwoDetail").then((module) => ({
    default: module.ProjectTwoDetail,
  }))
);
const ProjectThreeDetail = lazy(() =>
  import("@/components/ProjectThreeDetail").then((module) => ({
    default: module.ProjectThreeDetail,
  }))
);
const ProjectFourDetail = lazy(() =>
  import("@/components/ProjectFourDetail").then((module) => ({
    default: module.ProjectFourDetail,
  }))
);

function RouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-sm font-semibold text-muted-foreground">
      Loading project...
    </main>
  );
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const project = path.startsWith("/projects/")
      ? projects.find((item) => item.slug === path.replace("/projects/", ""))
      : null;
    document.title = project ? `${project.title} | ${portfolioContent.siteTitle}` : portfolioContent.siteTitle;
  }, [path]);

  const navigateTo = (nextPath: string) => {
    window.history.pushState(null, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0 });
  };

  const openProjectLink = (index: number) => {
    const slug = projects[index]?.slug;
    if (!slug) return;

    navigateTo(`/projects/${slug}`);
  };

  const selectedProject = path.startsWith("/projects/")
    ? projects.find((project) => project.slug === path.replace("/projects/", ""))
    : undefined;

  if (path.startsWith("/projects/")) {
    if (selectedProject?.slug === "project-1") {
      return (
        <Suspense fallback={<RouteFallback />}>
          <ProjectOneDetail project={selectedProject} onBack={() => navigateTo("/")} />
        </Suspense>
      );
    }

    if (selectedProject?.slug === "project-2") {
      return (
        <Suspense fallback={<RouteFallback />}>
          <ProjectTwoDetail project={selectedProject} onBack={() => navigateTo("/")} />
        </Suspense>
      );
    }

    if (selectedProject?.slug === "project-3") {
      return (
        <Suspense fallback={<RouteFallback />}>
          <ProjectThreeDetail project={selectedProject} onBack={() => navigateTo("/")} />
        </Suspense>
      );
    }

    if (selectedProject?.slug === "project-4") {
      return (
        <Suspense fallback={<RouteFallback />}>
          <ProjectFourDetail project={selectedProject} onBack={() => navigateTo("/")} />
        </Suspense>
      );
    }

    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => navigateTo("/")}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="text-sm font-bold tracking-wide">
            {portfolioContent.nav.brand}
          </a>
          <div className="flex items-center gap-2">
            <a
              href={portfolioContent.nav.emailHref}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:text-foreground"
              aria-label={portfolioContent.nav.emailLabel}
            >
              <Mail size={16} />
            </a>
            <a
              href={portfolioContent.nav.codeHref}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition hover:text-foreground"
              aria-label={portfolioContent.nav.codeLabel}
            >
              <Code2 size={16} />
            </a>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b border-border bg-white pt-28">
        <Waves
          lineColor="#000000"
          backgroundColor="#ffffff"
          waveSpeedX={0.04}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-14 sm:px-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <MapPin size={14} />
              {portfolioContent.hero.location}
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-normal sm:text-7xl lg:text-8xl">
              {portfolioContent.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {portfolioContent.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {portfolioContent.hero.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-background/80 px-3 py-1 backdrop-blur">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="hidden border-l border-border/80 pl-8 text-sm text-muted-foreground lg:block">
            <div className="mb-3 flex items-center gap-2 text-foreground">
              <Sparkles size={16} />
              {portfolioContent.hero.sideTitle}
            </div>
            <p className="leading-7">
              {portfolioContent.hero.sideDescription}
            </p>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:flex">
          <ArrowDown size={14} />
          {portfolioContent.hero.scrollLabel}
        </div>
      </section>

      <section className="overflow-hidden bg-background">
        <div className="mx-auto flex min-h-[300px] max-w-7xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">{portfolioContent.work.eyebrow}</span>
          <h2 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">{portfolioContent.work.title}</h2>
          <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
            {portfolioContent.work.description}
          </p>
        </div>

        <RadialScrollGallery
          className="!min-h-[620px]"
          baseRadius={430}
          mobileRadius={260}
          visiblePercentage={52}
          scrollDuration={2200}
          onItemSelect={openProjectLink}
        >
          {(hoveredIndex) =>
            projects.map((project, index) => {
              const isActive = hoveredIndex === index;

              return (
                <article
                  key={project.id}
                  className="group relative h-[300px] w-[210px] overflow-hidden rounded-md border border-border bg-card shadow-2xl shadow-black/15 sm:h-[340px] sm:w-[260px]"
                >
                  {project.cover ? (
                    <img
                      src={project.cover}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition duration-700 ease-out ${
                        isActive ? "scale-110 blur-0" : "scale-100 blur-[1px] grayscale-[30%]"
                      }`}
                    />
                  ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(232,255,159,0.26),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(214,220,220,0.74))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Badge variant="secondary" className="bg-background/85 text-[10px] backdrop-blur">
                        {project.category}
                      </Badge>
                      <span
                        className={`inline-flex size-8 items-center justify-center rounded-full bg-[#101820] text-[#E8FF9F] transition duration-500 ${
                          isActive ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
                        }`}
                      >
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                    <div className={`transition duration-500 ${isActive ? "translate-y-0" : "translate-y-3"}`}>
                      <h3 className="text-2xl font-black tracking-normal text-foreground">{project.title}</h3>
                      {project.description ? (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
                      ) : null}
                      <div
                        className={`mt-3 h-0.5 bg-[#E8FF9F] transition-all duration-500 ${
                          isActive ? "w-full opacity-100" : "w-0 opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                </article>
              );
            })
          }
        </RadialScrollGallery>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">{portfolioContent.about.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-black tracking-normal sm:text-5xl">{portfolioContent.about.title}</h2>
          </div>
          <div className="grid gap-4 text-muted-foreground sm:grid-cols-2">
            {portfolioContent.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProjectDetail({ project, onBack }: { project?: Project; onBack: () => void }) {
  if (!project) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <button type="button" onClick={onBack} className="text-sm font-bold tracking-wide">
              {portfolioContent.nav.brand}
            </button>
          </div>
        </nav>
        <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-5 pt-24 sm:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">Project</span>
          <h1 className="mt-4 text-4xl font-black tracking-normal sm:text-6xl">项目未找到</h1>
          <button
            type="button"
            onClick={onBack}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ArrowLeft size={16} />
            返回首页
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button type="button" onClick={onBack} className="text-sm font-bold tracking-wide">
            {portfolioContent.nav.brand}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8">
        <div className="max-w-4xl">
          <Badge variant="secondary" className="px-3 py-1">
            {project.category}
          </Badge>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          {project.description ? (
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {project.description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 overflow-hidden rounded-md border border-border bg-card">
          <img src={project.cover} alt={`${project.title} cover`} className="h-auto w-full object-cover" />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {project.images.map((image, index) => (
            <div key={image} className="overflow-hidden rounded-md border border-border bg-card">
              <img src={image} alt={`${project.title} image ${index + 1}`} className="h-auto w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
