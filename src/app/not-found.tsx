import { PublicNotFound } from "@/components/layout/public-not-found";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Unmatched URLs do not pass through the public route-group layout.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="min-w-0 flex-1"><PublicNotFound /></div>
      <SiteFooter />
    </div>
  );
}
