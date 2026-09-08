import Link from "next/link";
import { notFound } from "next/navigation";

import { PersonForm } from "@/components/forms/person-form";
import { getPersonById } from "@/features/people/queries";

type EditPersonPageProps = {
params: Promise<{
id: string;
}>;
};

export default async function EditPersonPage({
params,
}: EditPersonPageProps) {
const { id } = await params;

const person = await getPersonById(id);

if (!person) {
notFound();
}

return ( <div className="space-y-6"> <div> <Link
       href="/admin/people"
       className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
     >
← Back to People </Link>
    <h2 className="mt-4 text-2xl font-semibold tracking-tight">
      Edit Person
    </h2>

    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
      Update information for {person.name}.
    </p>
  </div>

  <section className="max-w-4xl rounded-xl border bg-background p-5 sm:p-8">
    <div className="mb-8 border-b pb-6">
      <h3 className="font-semibold">
        Person Information
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Update the information for this lab member.
      </p>
    </div>

    <PersonForm
      mode="edit"
      person={{
        id: person.id,
        name: person.name,
        email: person.email,
        designation: person.designation,
        department: person.department,
        bio: person.bio,
        isActive: person.isActive,
      }}
    />
  </section>
</div>
);
}
