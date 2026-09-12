"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
createPerson,
updatePerson,
} from "@/features/people/actions";
import {
personSchema,
type PersonInput,
} from "@/lib/validations/people";

type PersonFormProps = {
mode?: "create" | "edit";
person?: {
id: string;
name: string;
email: string | null;
designation: string | null;
department: string | null;
bio: string | null;
isActive: boolean;
researcherProfile?: { isPublic: boolean } | null;
};
};

export function PersonForm({
mode = "create",
person,
}: PersonFormProps) {
const router = useRouter();

const [serverMessage, setServerMessage] = useState<string | null>(
null,
);

const [serverError, setServerError] = useState<string | null>(
null,
);

const {
register,
watch,
handleSubmit,
formState: { errors, isSubmitting },
} = useForm<PersonInput>({
resolver: zodResolver(personSchema),
defaultValues: {
name: person?.name ?? "",
email: person?.email ?? "",
designation: person?.designation ?? "",
department: person?.department ?? "",
bio: person?.bio ?? "",
isActive: person?.isActive ?? true,
isPublic: person?.researcherProfile?.isPublic,
},
});

const isEditMode = mode === "edit";

async function onSubmit(values: PersonInput) {
setServerMessage(null);
setServerError(null);

try {
  if (isEditMode) {
    if (!person) {
      setServerError("Person information is missing.");
      return;
    }

    const result = await updatePerson(person.id, values);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    setServerMessage(result.message);

    router.push("/admin/people");
    router.refresh();

    return;
  }

  const result = await createPerson(values);

  if (!result.success) {
    setServerError(result.message);
    return;
  }

  setServerMessage(result.message);

  router.push("/admin/people");
  router.refresh();
} catch (error) {
  console.error("Failed to save person:", error);

  setServerError(
    "Something went wrong while saving the person.",
  );
}
}

return ( <form
   onSubmit={handleSubmit(onSubmit)}
   className="space-y-8"
 > <div className="grid gap-6 sm:grid-cols-2"> <div className="space-y-2 sm:col-span-2"> <label
         htmlFor="name"
         className="text-sm font-medium"
       >
Full Name <span className="ml-1 text-destructive">*</span> </label>
      <input
        id="name"
        type="text"
        placeholder="e.g. Dr. John Doe"
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
        htmlFor="email"
        className="text-sm font-medium"
      >
        Email
      </label>

      <input
        id="email"
        type="email"
        placeholder="person@example.com"
        disabled={isSubmitting}
        {...register("email")}
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
      />

      {errors.email && (
        <p className="text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
    </div>

    <div className="space-y-2">
      <label
        htmlFor="designation"
        className="text-sm font-medium"
      >
        Designation
      </label>

      <input
        id="designation"
        type="text"
        placeholder="e.g. Professor, Researcher"
        disabled={isSubmitting}
        {...register("designation")}
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
      />

      {errors.designation && (
        <p className="text-sm text-destructive">
          {errors.designation.message}
        </p>
      )}
    </div>

    <div className="space-y-2 sm:col-span-2">
      <label
        htmlFor="department"
        className="text-sm font-medium"
      >
        Department
      </label>

      <input
        id="department"
        type="text"
        placeholder="e.g. Department of Electrical and Electronic Engineering"
        disabled={isSubmitting}
        {...register("department")}
        className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
      />

      {errors.department && (
        <p className="text-sm text-destructive">
          {errors.department.message}
        </p>
      )}
    </div>

    <div className="space-y-2 sm:col-span-2">
      <label
        htmlFor="bio"
        className="text-sm font-medium"
      >
        Short Bio
      </label>

      <textarea
        id="bio"
        rows={6}
        placeholder="Enter a short biography..."
        disabled={isSubmitting}
        {...register("bio")}
        className="w-full resize-y rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="flex items-center justify-between gap-4">
        {errors.bio ? (
          <p className="text-sm text-destructive">
            {errors.bio.message}
          </p>
        ) : (
          <span />
        )}

        <span className="text-xs text-muted-foreground">
          Maximum 2000 characters
        </span>
      </div>
    </div>
  </div>

  {person?.researcherProfile && (
    <div className="rounded-lg border bg-muted/20 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" {...register("isPublic")} disabled={isSubmitting} className="mt-0.5 size-4 shrink-0 rounded border" />
        <span>
          <span className="block text-sm font-medium">Show on public People page</span>
          <span className="mt-1 block text-xs text-muted-foreground">Use this setting to show or hide this researcher on the public directory and profile page. Hiding a profile keeps all records and login access unchanged.</span>
        </span>
      </label>
      {!watch("isActive") && (
        <p role="status" className="mt-3 text-sm text-amber-700 dark:text-amber-400">
          This Person record is inactive, so the profile stays hidden even when this box is checked. Enable the record under Advanced record status to make it eligible for public display.
        </p>
      )}
    </div>
  )}

  <details className="rounded-lg border p-4" open={person?.researcherProfile ? undefined : true}>
    <summary className="cursor-pointer text-sm font-medium">
      {person?.researcherProfile ? "Advanced record status" : "Directory record status"}
    </summary>
    <label className="mt-4 flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        {...register("isActive")}
        disabled={isSubmitting}
        className="mt-0.5 size-4 shrink-0 rounded border"
      />
      <span>
        <span className="block text-sm font-medium">Keep this Person record active</span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {person?.researcherProfile
            ? 'Normally leave this enabled. An inactive record is excluded from public pages regardless of its visibility setting. To simply hide this researcher, use "Show on public People page" above.'
            : "Active records can appear in the public People directory. Disable this to hide the person while keeping their record in Admin management."}
          {" "}This does not enable or disable a login account.
        </span>
      </span>
    </label>
  </details>

  {serverMessage && (
    <p
      role="status"
      className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm"
    >
      {serverMessage}
    </p>
  )}

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
      onClick={() => router.push("/admin/people")}
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
          : "Create Person"}
    </button>
  </div>
</form>
);
}
