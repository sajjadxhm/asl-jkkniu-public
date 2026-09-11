"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  createAlumni,
  updateAlumni,
} from "@/features/people/researcher-actions";
import {
  alumniSchema,
  type AlumniInput,
} from "@/lib/validations/alumni";

type AlumniFormProps = {
  mode?: "create" | "edit";
  person?: {
    id: string;
    name: string;
    linkedinUrl: string | null;
    profileImage: string | null;
    isActive: boolean;
  };
};

export function AlumniForm({
  mode = "create",
  person,
}: AlumniFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AlumniInput>({
    resolver: zodResolver(alumniSchema),

    defaultValues: {
      name: person?.name ?? "",
      linkedinUrl: person?.linkedinUrl ?? "",
      profileImage: person?.profileImage ?? "",
      isActive: person?.isActive ?? true,
    },
  });

  const isEditMode = mode === "edit";

  async function onSubmit(values: AlumniInput) {
    setServerError(null);

    try {
      const result = isEditMode
        ? person
          ? await updateAlumni(person.id, values)
          : {
              success: false,
              message: "Person information is missing.",
            }
        : await createAlumni(values);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      router.push("/researcher/people");
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to save Alumni / Co-researcher:",
        error,
      );

      setServerError(
        "Something went wrong while saving this person.",
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
            htmlFor="name"
            className="text-sm font-medium"
          >
            Full Name
            <span className="ml-1 text-destructive">*</span>
          </label>

          <input
            id="name"
            type="text"
            placeholder="e.g. Md. John Doe"
            disabled={isSubmitting}
            {...register("name")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="linkedinUrl"
            className="text-sm font-medium"
          >
            LinkedIn URL
          </label>

          <input
            id="linkedinUrl"
            type="url"
            placeholder="https://www.linkedin.com/in/..."
            disabled={isSubmitting}
            {...register("linkedinUrl")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.linkedinUrl && (
            <p className="text-sm text-destructive">
              {errors.linkedinUrl.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
          Visitors can use this to view the person&apos;s
          professional profile.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profileImage"
            className="text-sm font-medium"
          >
            Profile Image URL
          </label>

          <input
            id="profileImage"
            type="url"
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("profileImage")}
            className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.profileImage && (
            <p className="text-sm text-destructive">
              {errors.profileImage.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Optional. You can add a publicly accessible image
            URL.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/20 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...register("isActive")}
            disabled={isSubmitting}
            className="mt-0.5 size-4 rounded border"
          />

          <span>
            <span className="block text-sm font-medium">
              Show on public People page
            </span>

            <span className="mt-1 block text-xs text-muted-foreground">
              Inactive people remain in the database but are
              hidden from the public website.
            </span>
          </span>
        </label>
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.push("/researcher/people")}
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
              : "Add Person"}
        </button>
      </div>
    </form>
  );
}