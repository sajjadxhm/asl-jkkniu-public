import Link from "next/link";

import { PeopleTable } from "@/features/people/components/people-table";
import { getPeopleForManagement } from "@/features/people/queries";

export default async function AdminPeoplePage() {
const people = await getPeopleForManagement();

return ( <div className="space-y-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div> <h2 className="text-2xl font-semibold tracking-tight">
People </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Manage directory profiles and public visibility, including alumni and co-researchers. Manage researcher logins and passwords in Researcher Accounts.
      </p>
    </div>

    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <Link
        href="/admin/people/new"
        className="inline-flex w-full items-center justify-center rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
      >
        + Add Person
      </Link>

      <Link
        href="/admin/researchers/new"
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
      >
        + Create Researcher
      </Link>
    </div>
  </div>

  <section className="rounded-xl border bg-background">
    <div className="border-b px-5 py-4 sm:px-6">
      <h3 className="font-semibold">
        All People
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {people.length}{" "}
        {people.length === 1 ? "person" : "people"} in the
        database.
      </p>
    </div>

    <div className="p-4 sm:p-6">
      <PeopleTable people={people} />
    </div>
  </section>
</div>
);
}
