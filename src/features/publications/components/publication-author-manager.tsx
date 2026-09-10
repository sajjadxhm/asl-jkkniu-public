"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import type { PublicationInput } from "@/lib/validations/publications";

type PersonOption = {
  id: string;
  name: string;
  designation: string | null;
};

type PublicationAuthorInput = PublicationInput["authors"][number];

type PublicationAuthorManagerProps = {
  people: PersonOption[];
  value: PublicationAuthorInput[];
  onChange: (authors: PublicationAuthorInput[]) => void;
  disabled?: boolean;
  currentPersonId?: string | null;
  researcherMode?: boolean;
};

export function PublicationAuthorManager({
  people,
  value,
  onChange,
  disabled = false,
  currentPersonId,
  researcherMode = false,
}: PublicationAuthorManagerProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPersonSelector, setShowPersonSelector] =
    useState(false);
  const [showExternalInput, setShowExternalInput] =
    useState(false);
  const [externalName, setExternalName] = useState("");
  const [personSearch, setPersonSearch] = useState("");

  const selectedPersonIds = useMemo(
    () =>
      new Set(
        value
          .filter((author) => author.type === "PERSON")
          .map((author) => author.personId),
      ),
    [value],
  );

  const availablePeople = useMemo(() => {
    const search = personSearch.trim().toLowerCase();

    return people.filter((person) => {
      if (selectedPersonIds.has(person.id)) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        person.name.toLowerCase().includes(search) ||
        person.designation?.toLowerCase().includes(search)
      );
    });
  }, [people, personSearch, selectedPersonIds]);

  function addPerson(personId: string) {
    onChange([
      ...value,
      {
        type: "PERSON",
        personId,
      },
    ]);

    setPersonSearch("");
    setShowPersonSelector(false);
    setShowAddMenu(false);
  }

  function addExternalAuthor() {
    const name = externalName.trim();

    if (!name) {
      return;
    }

    onChange([
      ...value,
      {
        type: "EXTERNAL",
        name,
      },
    ]);

    setExternalName("");
    setShowExternalInput(false);
    setShowAddMenu(false);
  }

  function moveAuthor(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= value.length
    ) {
      return;
    }

    const next = [...value];

    [next[index], next[targetIndex]] = [
      next[targetIndex],
      next[index],
    ];

    onChange(next);
  }

  function removeAuthor(index: number) {
    const author = value[index];

    if (
      researcherMode &&
      author.type === "PERSON" &&
      author.personId === currentPersonId
    ) {
      return;
    }

    onChange(
      value.filter((_, authorIndex) => authorIndex !== index),
    );
  }

  function getPerson(personId: string) {
    return people.find((person) => person.id === personId);
  }

  return (
    <div className="space-y-4">
      {researcherMode && (
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex gap-3">
            <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-medium">
                You are automatically included as an author.
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your author entry cannot be removed. You can add
                ASL-JKKNIU researchers and external co-authors,
                then arrange them in the required publication order.
              </p>
            </div>
          </div>
        </div>
      )}

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <Users className="mx-auto size-7 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium">
            No authors added yet
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Add the authors in the order they should appear.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((author, index) => {
            const isCurrentResearcher =
              researcherMode &&
              author.type === "PERSON" &&
              author.personId === currentPersonId;

            if (author.type === "EXTERNAL") {
              return (
                <div
                  key={`external-${index}`}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {author.name}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        External Author
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={disabled || index === 0}
                        onClick={() =>
                          moveAuthor(index, -1)
                        }
                        className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move author up"
                      >
                        <ArrowUp className="size-4" />
                      </button>

                      <button
                        type="button"
                        disabled={
                          disabled ||
                          index === value.length - 1
                        }
                        onClick={() =>
                          moveAuthor(index, 1)
                        }
                        className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move author down"
                      >
                        <ArrowDown className="size-4" />
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => removeAuthor(index)}
                        className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Remove ${author.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const person = getPerson(author.personId);

            return (
              <div
                key={`person-${author.personId}`}
                className="rounded-lg border bg-background p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {person?.name ?? "Unknown researcher"}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {person?.designation
                        ? `${person.designation} · `
                        : ""}
                      ASL-JKKNIU
                    </p>

                    {isCurrentResearcher && (
                      <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        You
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={disabled || index === 0}
                      onClick={() =>
                        moveAuthor(index, -1)
                      }
                      className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Move author up"
                    >
                      <ArrowUp className="size-4" />
                    </button>

                    <button
                      type="button"
                      disabled={
                        disabled ||
                        index === value.length - 1
                      }
                      onClick={() =>
                        moveAuthor(index, 1)
                      }
                      className="rounded-md p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Move author down"
                    >
                      <ArrowDown className="size-4" />
                    </button>

                    <button
                      type="button"
                      disabled={
                        disabled || isCurrentResearcher
                      }
                      onClick={() => removeAuthor(index)}
                      className="rounded-md p-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label={`Remove ${
                        person?.name ?? "author"
                      }`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setShowAddMenu((current) => !current);
            setShowPersonSelector(false);
            setShowExternalInput(false);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" />
          Add Author
        </button>

        {showAddMenu && (
          <div className="mt-2 rounded-lg border bg-background p-2 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setShowAddMenu(false);
                setShowPersonSelector(true);
              }}
              className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted"
            >
              <UserRound className="mt-0.5 size-4 text-primary" />

              <span>
                <span className="block text-sm font-medium">
                  ASL-JKKNIU Researcher
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Select an existing researcher
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddMenu(false);
                setShowExternalInput(true);
              }}
              className="flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted"
            >
              <Users className="mt-0.5 size-4 text-primary" />

              <span>
                <span className="block text-sm font-medium">
                  External Author
                </span>

                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Add an author by name only
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {showPersonSelector && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                Select ASL-JKKNIU Researcher
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Search and add another researcher.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPersonSelector(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <input
            type="text"
            value={personSearch}
            onChange={(event) =>
              setPersonSearch(event.target.value)
            }
            placeholder="Search researcher..."
            className="mb-3 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            autoFocus
          />

          <div className="max-h-56 space-y-1 overflow-y-auto">
            {availablePeople.length === 0 ? (
              <p className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                No available researchers found.
              </p>
            ) : (
              availablePeople.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => addPerson(person.id)}
                  className="w-full rounded-md p-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="block text-sm font-medium">
                    {person.name}
                  </span>

                  {person.designation && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {person.designation}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {showExternalInput && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-3">
            <p className="text-sm font-medium">
              Add External Author
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Only the author&apos;s name is required.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={externalName}
              onChange={(event) =>
                setExternalName(event.target.value)
              }
              placeholder="Author full name"
              maxLength={200}
              className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setExternalName("");
                  setShowExternalInput(false);
                }}
                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!externalName.trim()}
                onClick={addExternalAuthor}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Author
              </button>
            </div>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Authors are saved in the order shown above.
        </p>
      )}
    </div>
  );
}