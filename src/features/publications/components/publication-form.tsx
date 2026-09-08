"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  createPublication,
  updatePublication,
} from "@/features/publications/actions";
import {
  publicationSchema,
  type PublicationInput,
} from "@/lib/validations/publications";

type PersonOption = {
  id: string;
  name: string;
  designation: string | null;
};

type ResearchAreaOption = {
  id: string;
  name: string;
};

type PublicationFormProps = {
  mode?: "create" | "edit";

  publication?: {
    id: string;
    title: string;
    abstract: string | null;
    publicationType:
      | "JOURNAL"
      | "CONFERENCE"
      | "BOOK"
      | "BOOK_CHAPTER"
      | "THESIS"
      | "PREPRINT"
      | "OTHER";
    journal: string | null;
    conference: string | null;
    publisher: string | null;
    publicationDate: Date | null;
    doi: string | null;
    url: string | null;
    pdfUrl: string | null;
    citationCount: number;
    isFeatured: boolean;
    authorIds: string[];
    researchAreaIds: string[];
  };

  people: PersonOption[];
  researchAreas: ResearchAreaOption[];
};

const publicationTypes = [
  { value: "JOURNAL", label: "Journal Article" },
  { value: "CONFERENCE", label: "Conference Paper" },
  { value: "BOOK", label: "Book" },
  { value: "BOOK_CHAPTER", label: "Book Chapter" },
  { value: "THESIS", label: "Thesis" },
  { value: "PREPRINT", label: "Preprint" },
  { value: "OTHER", label: "Other" },
] as const;

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export function PublicationForm({
  mode = "create",
  publication,
  people,
  researchAreas,
}: PublicationFormProps) {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [serverMessage, setServerMessage] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),

    defaultValues: {
      title: publication?.title ?? "",
      abstract: publication?.abstract ?? "",
      publicationType:
        publication?.publicationType ?? "OTHER",
      journal: publication?.journal ?? "",
      conference: publication?.conference ?? "",
      publisher: publication?.publisher ?? "",
      publicationDate: formatDateForInput(
        publication?.publicationDate ?? null,
      ),
      doi: publication?.doi ?? "",
      url: publication?.url ?? "",
      pdfUrl: publication?.pdfUrl ?? "",
      citationCount:
        publication?.citationCount ?? 0,
      isFeatured: publication?.isFeatured ?? false,
      authorIds: publication?.authorIds ?? [],
      researchAreaIds:
        publication?.researchAreaIds ?? [],
    },
  });

  const isEditMode = mode === "edit";

  async function onSubmit(values: PublicationInput) {
    setServerError(null);
    setServerMessage(null);

    try {
      if (isEditMode) {
        if (!publication) {
          setServerError(
            "Publication information is missing.",
          );
          return;
        }

        const result = await updatePublication(
          publication.id,
          values,
        );

        if (!result.success) {
          setServerError(result.message);
          return;
        }

        setServerMessage(result.message);

        router.push("/admin/publications");
        router.refresh();

        return;
      }

      const result = await createPublication(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      setServerMessage(result.message);

      router.push("/admin/publications");
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to save publication:",
        error,
      );

      setServerError(
        "Something went wrong while saving the publication.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="grid gap-6">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium"
          >
            Publication Title
            <span className="ml-1 text-destructive">*</span>
          </label>

          <input
            id="title"
            type="text"
            placeholder="Enter the full publication title"
            disabled={isSubmitting}
            {...register("title")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.title && (
            <p className="text-sm text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="publicationType"
              className="text-sm font-medium"
            >
              Publication Type
              <span className="ml-1 text-destructive">*</span>
            </label>

            <select
              id="publicationType"
              disabled={isSubmitting}
              {...register("publicationType")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {publicationTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="publicationDate"
              className="text-sm font-medium"
            >
              Publication Date
            </label>

            <input
              id="publicationDate"
              type="date"
              disabled={isSubmitting}
              {...register("publicationDate")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {errors.publicationDate && (
              <p className="text-sm text-destructive">
                {errors.publicationDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold">Authors</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Select authors in their citation order.
          </p>
        </div>

        <div className="space-y-2">
          {people.length === 0 ? (
            <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              No active people are available. Add people
              before creating a publication.
            </p>
          ) : (
            <select
              multiple
              disabled={isSubmitting}
              {...register("authorIds")}
              className="min-h-48 w-full rounded-md border bg-background p-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              {people.map((person) => (
                <option
                  key={person.id}
                  value={person.id}
                >
                  {person.name}
                  {person.designation
                    ? ` — ${person.designation}`
                    : ""}
                </option>
              ))}
            </select>
          )}

          {errors.authorIds && (
            <p className="text-sm text-destructive">
              {errors.authorIds.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Hold Ctrl (Windows) or Command (Mac) to select
            multiple authors.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="journal"
            className="text-sm font-medium"
          >
            Journal
          </label>

          <input
            id="journal"
            type="text"
            placeholder="Journal name"
            disabled={isSubmitting}
            {...register("journal")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="conference"
            className="text-sm font-medium"
          >
            Conference
          </label>

          <input
            id="conference"
            type="text"
            placeholder="Conference name"
            disabled={isSubmitting}
            {...register("conference")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="publisher"
            className="text-sm font-medium"
          >
            Publisher
          </label>

          <input
            id="publisher"
            type="text"
            placeholder="Publisher"
            disabled={isSubmitting}
            {...register("publisher")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="abstract"
          className="text-sm font-medium"
        >
          Abstract
        </label>

        <textarea
          id="abstract"
          rows={8}
          placeholder="Enter the publication abstract..."
          disabled={isSubmitting}
          {...register("abstract")}
          className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        {errors.abstract && (
          <p className="text-sm text-destructive">
            {errors.abstract.message}
          </p>
        )}
      </div>

      <div className="rounded-xl border p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold">
            Publication Links
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Add identifiers and external resources.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label
              htmlFor="doi"
              className="text-sm font-medium"
            >
              DOI
            </label>

            <input
              id="doi"
              type="text"
              placeholder="10.xxxx/xxxxx"
              disabled={isSubmitting}
              {...register("doi")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="url"
                className="text-sm font-medium"
              >
                Publication URL
              </label>

              <input
                id="url"
                type="url"
                placeholder="https://..."
                disabled={isSubmitting}
                {...register("url")}
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />

              {errors.url && (
                <p className="text-sm text-destructive">
                  {errors.url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="pdfUrl"
                className="text-sm font-medium"
              >
                PDF URL
              </label>

              <input
                id="pdfUrl"
                type="url"
                placeholder="https://..."
                disabled={isSubmitting}
                {...register("pdfUrl")}
                className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />

              {errors.pdfUrl && (
                <p className="text-sm text-destructive">
                  {errors.pdfUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="citationCount"
            className="text-sm font-medium"
          >
            Citation Count
          </label>

          <input
            id="citationCount"
            type="number"
            min="0"
            disabled={isSubmitting}
            {...register("citationCount", {
              valueAsNumber: true,
            })}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          {errors.citationCount && (
            <p className="text-sm text-destructive">
              {errors.citationCount.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("isFeatured")}
              disabled={isSubmitting}
              className="mt-0.5 size-4 rounded border"
            />

            <span>
              <span className="block text-sm font-medium">
                Featured publication
              </span>

              <span className="mt-1 block text-xs text-muted-foreground">
                Featured publications can appear in
                highlighted sections of the public website.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="rounded-xl border p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold">
            Research Areas
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Associate this publication with relevant research
            areas.
          </p>
        </div>

        {researchAreas.length === 0 ? (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            No active research areas are available yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {researchAreas.map((area) => (
              <label
                key={area.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  value={area.id}
                  disabled={isSubmitting}
                  {...register("researchAreaIds")}
                  className="size-4 rounded border"
                />

                <span className="text-sm">
                  {area.name}
                </span>
              </label>
            ))}
          </div>
        )}

        {errors.researchAreaIds && (
          <p className="mt-3 text-sm text-destructive">
            {errors.researchAreaIds.message}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      {serverMessage && (
        <p
          role="status"
          className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm"
        >
          {serverMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.push("/admin/publications")}
          className="w-full rounded-md border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Save Changes"
              : "Create Publication"}
        </button>
      </div>
    </form>
  );
}