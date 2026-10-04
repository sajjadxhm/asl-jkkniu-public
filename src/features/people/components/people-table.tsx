"use client";

import { getResearcherPositionLabel, type ResearcherPosition } from "@/lib/researcher-position";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteResearcherProfile } from "@/features/researcher/profile-delete-actions";
import { useMemo, useState } from "react";

import { deletePerson } from "@/features/people/actions";

type PersonTableItem = {
id: string;
name: string;
slug: string;
designation: string | null;
department: string | null;
email: string | null;
isActive: boolean;
researcherProfile?: { id: string; position: ResearcherPosition } | null;
};

type PeopleTableProps = {
people: PersonTableItem[];
};

export function PeopleTable({
people,
}: PeopleTableProps) {
const router = useRouter();
const [search, setSearch] = useState("");
const [status, setStatus] = useState<
"all" | "active" | "inactive"

> ("all");

const [deletingId, setDeletingId] = useState<string | null>(
null,
);

const filteredPeople = useMemo(() => {
const normalizedSearch = search.trim().toLowerCase();

return people.filter((person) => {
  const matchesSearch =
    normalizedSearch.length === 0 ||
    person.name.toLowerCase().includes(normalizedSearch) ||
    getResearcherPositionLabel(person.researcherProfile?.position)?.toLowerCase().includes(normalizedSearch) ||
    person.designation
      ?.toLowerCase()
      .includes(normalizedSearch) ||
    person.department
      ?.toLowerCase()
      .includes(normalizedSearch) ||
    person.email
      ?.toLowerCase()
      .includes(normalizedSearch);

  const matchesStatus =
    status === "all" ||
    (status === "active" && person.isActive) ||
    (status === "inactive" && !person.isActive);

  return Boolean(matchesSearch) && matchesStatus;
});
}, [people, search, status]);

async function handleDelete(person: PersonTableItem) {
const confirmed = window.confirm(
person.researcherProfile
  ? `Permanently delete ${person.name} and their researcher profile? This also deletes any remaining researcher login, profile awards, project memberships and research-area links. Publications and projects stay, with publication author names preserved as text. This cannot be undone. If they lead a project, assign another lead first.`
  : `Are you sure you want to delete ${person.name}? This action cannot be undone.`,
);
if (!confirmed) {
  return;
}

setDeletingId(person.id);

try {
  const result = person.researcherProfile
    ? await deleteResearcherProfile(person.id)
    : await deletePerson(person.id);

  if (!result.success) {
    toast.error(result.message);
    return;
  }
  toast.success(result.message);
  router.refresh();
} catch (error) {
  console.error("Failed to delete person:", error);

  toast.error("Something went wrong while deleting the person.");
} finally {
  setDeletingId(null);
}
}

return ( <div className="space-y-4"> <div className="flex flex-col gap-3 sm:flex-row"> <div className="flex-1"> <label
         htmlFor="people-search"
         className="sr-only"
       >
Search people </label>
      <input
        id="people-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, designation, department..."
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </div>

    <div className="sm:w-40">
      <label
        htmlFor="people-status"
        className="sr-only"
      >
        Filter by status
      </label>

      <select
        id="people-status"
        value={status}
        onChange={(event) =>
          setStatus(
            event.target.value as
              | "all"
              | "active"
              | "inactive",
          )
        }
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </div>

  {people.length === 0 ? (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium">
        No people found
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Add your first lab member to get started.
      </p>

      <Link
        href="/admin/people/new"
        className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Add Person
      </Link>
    </div>
  ) : filteredPeople.length === 0 ? (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium">
        No matching people
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Try changing your search or status filter.
      </p>

      <button
        type="button"
        onClick={() => {
          setSearch("");
          setStatus("all");
        }}
        className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        Clear Filters
      </button>
    </div>
  ) : (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium">
                Name
              </th>

              <th className="px-4 py-3 text-left font-medium">
                ASL Position / Designation
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Department
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Email
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Status
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPeople.map((person) => (
              <tr
                key={person.id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">
                      {person.name}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      /people/{person.slug}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {person.designation || "—"}
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {person.department || "—"}
                </td>

                <td className="px-4 py-4 text-muted-foreground">
                  {person.email || "—"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={
                      person.isActive
                        ? "inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                        : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    }
                  >
                    {person.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link
                      href={`/admin/people/${person.id}/edit`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === person.id}
                      onClick={() =>
                        handleDelete(person)
                      }
                      className="text-sm font-medium text-destructive hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === person.id
                        ? "Deleting..."
                        : person.researcherProfile ? "Delete profile permanently" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filteredPeople.map((person) => (
          <div
            key={person.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">
                  {person.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {person.researcherProfile && <span className="block font-medium text-foreground">{getResearcherPositionLabel(person.researcherProfile.position)}</span>}
                  {person.designation || "No designation"}
                </p>
              </div>

              <span
                className={
                  person.isActive
                    ? "shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                    : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {person.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>
                {person.department || "No department"}
              </p>

              <p>
                {person.email || "No email"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 border-t pt-3">
              <Link
                href={`/admin/people/${person.id}/edit`}
                className="text-sm font-medium text-primary"
              >
                Edit
              </Link>

              <button
                type="button"
                disabled={deletingId === person.id}
                onClick={() =>
                  handleDelete(person)
                }
                className="text-sm font-medium text-destructive disabled:opacity-50"
              >
                {deletingId === person.id
                  ? "Deleting..."
                  : person.researcherProfile ? "Delete profile permanently" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {filteredPeople.length > 0 && (
    <p className="text-xs text-muted-foreground">
      Showing {filteredPeople.length} of {people.length}{" "}
      {people.length === 1 ? "person" : "people"}.
    </p>
  )}
</div>
);
}
