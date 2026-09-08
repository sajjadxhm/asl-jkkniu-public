import Link from "next/link";

import { PeopleTable } from "@/features/people/components/people-table";
import { getPeople } from "@/features/people/queries";

export default async function AdminPeoplePage() {
const people = await getPeople();

return ( <div className="space-y-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div> <h2 className="text-2xl font-semibold tracking-tight">
People </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Manage researchers, faculty members, students, and
        lab members.
      </p>
    </div>

    <Link
      href="/admin/people/new"
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
    >
      + Add Person
    </Link>
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
