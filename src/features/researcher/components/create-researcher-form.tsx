"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  createResearcher,
} from "../actions";

import {
  type CreateResearcherInput,
} from "../validations";

const positions = [
  {
    value: "RESEARCHER",
    label: "Researcher",
  },
  {
    value: "LEAD_RESEARCHER",
    label: "Lead Researcher",
  },
  {
    value: "ASSOCIATE_RESEARCH_LEAD",
    label: "Associate Research Lead",
  },
  {
    value: "PRINCIPAL_INVESTIGATOR",
    label: "Principal Investigator",
  },
] as const;

export function CreateResearcherForm() {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateResearcherInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      designation: "",
      department: "",
      position: "RESEARCHER",
      academicSession: "",
      university:
        "Jatiya Kabi Kazi Nazrul Islam University",
    },
  });

  async function onSubmit(values: CreateResearcherInput) {
    setServerError(null);

    const result = await createResearcher(values);

    if (!result.success) {
      setServerError(result.message);
      return;
    }

    router.push("/admin/people");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Account */}
      <section className="space-y-6">
        <div>
          <h3 className="font-semibold">
            Login Account
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            These credentials will be used by the researcher
            to access the researcher portal.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Full Name
              <span className="ml-1 text-destructive">
                *
              </span>
            </label>

            <input
              id="name"
              type="text"
              placeholder="e.g. Dr. John Doe"
              disabled={isSubmitting}
              {...register("name")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
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
              <span className="ml-1 text-destructive">
                *
              </span>
            </label>

            <input
              id="email"
              type="email"
              placeholder="researcher@example.com"
              disabled={isSubmitting}
              {...register("email")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Initial Password
              <span className="ml-1 text-destructive">
                *
              </span>
            </label>

            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
              {...register("password")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Academic */}
      <section className="space-y-6 border-t pt-8">
        <div>
          <h3 className="font-semibold">
            Academic Information
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Basic academic information for the researcher
            profile.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="position"
              className="text-sm font-medium"
            >
              ASL Position
            </label>

            <select
              id="position"
              disabled={isSubmitting}
              {...register("position")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
            >
              {positions.map((position) => (
                <option
                  key={position.value}
                  value={position.value}
                >
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="designation"
              className="text-sm font-medium"
            >
              Academic Designation
            </label>

            <input
              id="designation"
              type="text"
              placeholder="e.g. Assistant Professor"
              disabled={isSubmitting}
              {...register("designation")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="department"
              className="text-sm font-medium"
            >
              Department
            </label>

            <input
              id="department"
              type="text"
              placeholder="e.g. Department of EEE"
              disabled={isSubmitting}
              {...register("department")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="academicSession"
              className="text-sm font-medium"
            >
              Academic Session
            </label>

            <input
              id="academicSession"
              type="text"
              placeholder="e.g. 2019–2020"
              disabled={isSubmitting}
              {...register("academicSession")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="university"
              className="text-sm font-medium"
            >
              University
            </label>

            <input
              id="university"
              type="text"
              disabled={isSubmitting}
              {...register("university")}
              className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      </section>

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
          className="w-full rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting
            ? "Creating..."
            : "Create Researcher"}
        </button>
      </div>
    </form>
  );
}