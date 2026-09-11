"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  resetResearcherPassword,
  setResearcherAccountStatus,
} from "@/features/auth/password-actions";

type ResearcherAccount = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  mustChangePassword: boolean;

  person: {
    id: string;
    slug: string;
    profileImage: string | null;
    designation: string | null;
    department: string | null;
  } | null;
};

type ResearcherAccountTableProps = {
  researchers: ResearcherAccount[];
};

export function ResearcherAccountTable({
  researchers,
}: ResearcherAccountTableProps) {
  const router = useRouter();

  const [loadingId, setLoadingId] = useState<string | null>(
    null,
  );

  const [temporaryPassword, setTemporaryPassword] =
    useState<{
      name: string;
      email: string;
      password: string;
    } | null>(null);

  async function handleStatusChange(
    researcher: ResearcherAccount,
  ) {
    const nextStatus = !researcher.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Enable the account for ${researcher.name}?`
        : `Disable the account for ${researcher.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setLoadingId(researcher.id);

    try {
      const result = await setResearcherAccountStatus(
        researcher.id,
        nextStatus,
      );

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update researcher account:",
        error,
      );

      window.alert(
        "Something went wrong while updating the account.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleResetPassword(
    researcher: ResearcherAccount,
  ) {
    const confirmed = window.confirm(
      `Reset the password for ${researcher.name}? They will be required to change the temporary password after logging in.`,
    );

    if (!confirmed) {
      return;
    }

    setLoadingId(researcher.id);
    setTemporaryPassword(null);

    try {
      const result = await resetResearcherPassword(
        researcher.id,
      );

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      if (result.temporaryPassword) {
        setTemporaryPassword({
          name: result.userName ?? researcher.name,
          email: result.userEmail ?? researcher.email,
          password: result.temporaryPassword,
        });
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to reset researcher password:",
        error,
      );

      window.alert(
        "Something went wrong while resetting the password.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (researchers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">
          No researcher accounts found
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a researcher account to manage it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {temporaryPassword && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-amber-950 dark:text-amber-100">
                Temporary Password Generated
              </h3>

              <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                Give this temporary password to the
                researcher. It will not be shown again after
                this page is refreshed.
              </p>
            </div>

            <div className="rounded-md border bg-background p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Researcher
                  </p>

                  <p className="font-medium">
                    {temporaryPassword.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Email
                  </p>

                  <p className="font-medium">
                    {temporaryPassword.email}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Temporary Password
                </p>

                <code className="mt-1 block rounded-md bg-muted px-3 py-2 font-mono text-sm font-semibold">
                  {temporaryPassword.password}
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTemporaryPassword(null)}
              className="self-start rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium">
                Researcher
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Position
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Email
              </th>

              <th className="px-4 py-3 text-left font-medium">
                Account
              </th>

              <th className="px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {researchers.map((researcher) => {
              const isLoading =
                loadingId === researcher.id;

              return (
                <tr
                  key={researcher.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">
                        {researcher.name}
                      </p>

                      {researcher.person && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          /people/{researcher.person.slug}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {researcher.person?.designation ||
                      "Research Assistant"}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {researcher.email}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={
                          researcher.isActive
                            ? "inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                            : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {researcher.isActive
                          ? "Active"
                          : "Disabled"}
                      </span>

                      {researcher.mustChangePassword && (
                        <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                          Password Change Required
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleStatusChange(researcher)
                        }
                        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading
                          ? "Working..."
                          : researcher.isActive
                            ? "Disable"
                            : "Enable"}
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleResetPassword(researcher)
                        }
                        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {researchers.map((researcher) => {
          const isLoading =
            loadingId === researcher.id;

          return (
            <div
              key={researcher.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {researcher.name}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {researcher.person?.designation ||
                      "Research Assistant"}
                  </p>
                </div>

                <span
                  className={
                    researcher.isActive
                      ? "shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                      : "shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  }
                >
                  {researcher.isActive
                    ? "Active"
                    : "Disabled"}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <p>{researcher.email}</p>

                {researcher.mustChangePassword && (
                  <p className="text-amber-700 dark:text-amber-400">
                    Password change required
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 border-t pt-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleStatusChange(researcher)
                  }
                  className="text-sm font-medium text-primary disabled:opacity-50"
                >
                  {isLoading
                    ? "Working..."
                    : researcher.isActive
                      ? "Disable"
                      : "Enable"}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    handleResetPassword(researcher)
                  }
                  className="text-sm font-medium text-primary disabled:opacity-50"
                >
                  Reset Password
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}