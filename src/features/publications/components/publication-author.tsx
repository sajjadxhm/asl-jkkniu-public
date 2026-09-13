import Link from "next/link";

type PublicationAuthorProps = {
  author: {
    externalName: string | null;
    person: {
      name: string;
      slug: string;
      isActive: boolean;
      linkedinUrl: string | null;
      researcherProfile: { isPublic: boolean } | null;
    } | null;
  };
  className?: string;
};

export function PublicationAuthor({ author, className }: PublicationAuthorProps) {
  const person = author.person;
  const name = person?.name ?? author.externalName;
  if (person?.isActive && person.researcherProfile?.isPublic) {
    return <Link href={`/people/${person.slug}`} className={className}>{name}</Link>;
  }

  if (person?.linkedinUrl) {
    try {
      const url = new URL(person.linkedinUrl);
      if (url.protocol === "https:" || url.protocol === "http:") {
        return <a href={url.href} target="_blank" rel="noopener noreferrer" className={className}>{name}</a>;
      }
    } catch {
      // Invalid stored URLs should leave the author readable without a broken link.
    }
  }
  return <span className={className}>{name}</span>;
}
