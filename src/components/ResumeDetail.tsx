import { useState } from "react";
import { portfolioContent } from "@/content/portfolio";
import { PillActionButton } from "@/components/ui/pill-action-button";

type ResumeDetailProps = {
  onBack: () => void;
};

const resumeImage = "/images/resume/resume.png";
const resumeImageError =
  "简历图片加载失败，请检查 public/images/resume/resume.png 是否存在。";

export function ResumeDetail({ onBack }: ResumeDetailProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f7f4] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-bold tracking-wide text-slate-700"
          >
            {portfolioContent.nav.brand}
          </button>
          <PillActionButton onClick={onBack} icon="←" size="sm">
            Back Home
          </PillActionButton>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Resume
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal md:text-6xl">
            个人简历
          </h1>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-3 shadow-lg md:p-6">
          {!imageFailed ? (
            <img
              src={resumeImage}
              alt="WYQ resume"
              className="mx-auto h-auto w-full max-w-5xl object-contain"
              loading="eager"
              decoding="async"
              onError={() => {
                console.warn(resumeImageError);
                setImageFailed(true);
              }}
            />
          ) : (
            <div className="flex min-h-[50vh] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-base leading-8 text-slate-600">{resumeImageError}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
