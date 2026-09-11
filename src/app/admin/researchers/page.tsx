import Link from "next/link";

import { ResearcherAccountTable } from "@/features/researcher/components/researcher-account-table";
import { getResearchersForAccountManagement } from "@/features/researcher/queries";
import { requireRole } from "@/lib/permissions/auth";

export default async function AdminResearchersPage() {
  await requireRole(["SUPER_ADMIN"]);

  const researchers =
    await getResearchersForAccountManagement();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Researcher Accounts
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage researcher login accounts, account
            status, and temporary passwords.
          </p>
        </div>

        <Link
          href="/admin/researchers/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          + Create Researcher
        </Link>
      </div>

      <section className="rounded-xl border bg-background">
        <div className="border-b px-5 py-4 sm:px-6">
          <h3 className="font-semibold">
            Researcher Accounts
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {researchers.length}{" "}
            {researchers.length === 1
              ? "researcher account"
              : "researcher accounts"}{" "}
            in the system.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <ResearcherAccountTable
            researchers={researchers}
          />
        </div>
      </section>
    </div>
  );
}