import Link from "next/link";

import { PersonForm } from "@/components/forms/person-form";

export default function NewPersonPage() {
return ( <div className="space-y-6"> <div> <Link
       href="/admin/people"
       className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
     >
← Back to People </Link>

    <h2 className="mt-4 text-2xl font-semibold tracking-tight">
      Add Person
    </h2>

    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
      Add a new researcher, faculty member, student, or lab
      member.
    </p>
  </div>

  <section className="max-w-4xl rounded-xl border bg-background p-5 sm:p-8">
    <div className="mb-8 border-b pb-6">
      <h3 className="font-semibold">
        Person Information
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Enter the information that will appear on the lab
        website.
      </p>
    </div>

    <PersonForm mode="create" />
  </section>
</div>
);
}
