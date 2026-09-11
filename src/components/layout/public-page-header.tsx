import type { ReactNode } from "react";

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PublicPageHeader({ eyebrow, title, description, children }: PublicPageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-[#002B56]/10 bg-[#F5FAF8]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 hidden size-[440px] rounded-full border border-[#0067FF]/10 sm:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 hidden size-[310px] rounded-full border border-[#0067FF]/10 sm:block" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-[#0067FF]" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0067FF]">{eyebrow}</p>
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#002B56] [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#002B56]/70 sm:text-lg">{description}</p>
        {children && <div className="mt-7">{children}</div>}
      </div>
    </header>
  );
}
