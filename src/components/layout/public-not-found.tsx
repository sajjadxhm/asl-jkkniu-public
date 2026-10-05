import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function PublicNotFound() {
  return (
    <main className="border-b border-[#002B56]/10 bg-[#F5FAF8] text-[#002B56]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10">
          <p className="text-7xl font-semibold leading-none tracking-[-0.06em] text-[#0058D6] sm:border-r sm:border-[#002B56]/15 sm:pr-10 sm:text-8xl">
            <span className="sr-only">Error </span>404
          </p>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0058D6]">Advanced System Lab / ASL-JKKNIU</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#334E68]">The page you are looking for may have been moved, removed, or the URL may be incorrect.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0058D6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#002B56] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0067FF]">
                <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />Back to Home
              </Link>
              <Link href="/research" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#002B56]/25 bg-white px-5 py-3 text-sm font-semibold hover:bg-[#E1FFE1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0067FF]">
                Explore Research<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
