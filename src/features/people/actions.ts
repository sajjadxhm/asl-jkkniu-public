"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/permissions/auth";
import {
personSchema,
type PersonInput,
} from "@/lib/validations/people";

function createSlug(name: string) {
return name
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

export async function createPerson(input: PersonInput) {
await requireRole(["SUPER_ADMIN", "ADMIN"]);

const result = personSchema.safeParse(input);

if (!result.success) {
return {
success: false,
message: "Invalid person information.",
};
}

const {
name,
email,
designation,
department,
bio,
isActive,
} = result.data;

const baseSlug = createSlug(name);

let slug = baseSlug;
let counter = 1;

while (
await prisma.person.findUnique({
where: { slug },
select: { id: true },
})
) {
slug = `${baseSlug}-${counter}`;
counter += 1;
}

const person = await prisma.person.create({
data: {
name,
slug,
email: email || null,
designation: designation || null,
department: department || null,
bio: bio || null,
isActive,
},
});

revalidatePath("/admin/people");
revalidatePath("/people", "layout");

return {
success: true,
message: "Person created successfully.",
personId: person.id,
};
}

export async function updatePerson(
id: string,
input: PersonInput,
) {
await requireRole(["SUPER_ADMIN", "ADMIN"]);

const result = personSchema.safeParse(input);

if (!result.success) {
return {
success: false,
message: "Invalid person information.",
};
}

const existingPerson = await prisma.person.findUnique({
where: {
id,
},
select: {
id: true,
},
});

if (!existingPerson) {
return {
success: false,
message: "Person not found.",
};
}

const {
name,
email,
designation,
department,
bio,
isActive,
} = result.data;

const updatedPerson = await prisma.person.update({
where: {
id,
},
data: {
name,
email: email || null,
designation: designation || null,
department: department || null,
bio: bio || null,
isActive,
},
});

revalidatePath("/admin/people");
revalidatePath("/people", "layout");
revalidatePath(`/admin/people/${id}/edit`);

return {
success: true,
message: "Person updated successfully.",
personId: updatedPerson.id,
};
}

export async function deletePerson(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const existingPerson = await prisma.person.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
      researcherProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!existingPerson) {
    return {
      success: false,
      message: "Person not found.",
    };
  }

  if (existingPerson.user || existingPerson.researcherProfile) {
    return {
      success: false,
      message:
        "Researcher profiles cannot be deleted from People. Manage the researcher account from the Researchers section.",
    };
  }

  await prisma.person.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/people");
revalidatePath("/people", "layout");

  return {
    success: true,
    message: "Person deleted successfully.",
  };
}