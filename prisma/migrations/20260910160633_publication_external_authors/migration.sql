-- Drop the old primary key temporarily.
ALTER TABLE "PublicationAuthor"
DROP CONSTRAINT "PublicationAuthor_pkey";

-- Add the new fields as nullable first so existing rows are preserved.
ALTER TABLE "PublicationAuthor"
ADD COLUMN "id" TEXT,
ADD COLUMN "externalName" TEXT;

-- Generate IDs for the existing PublicationAuthor rows.
UPDATE "PublicationAuthor"
SET "id" = 'pa_' || md5(
  "publicationId" || ':' || "personId" || ':' || "authorOrder"::text
)
WHERE "id" IS NULL;

-- Make personId nullable so external authors can exist.
ALTER TABLE "PublicationAuthor"
ALTER COLUMN "personId" DROP NOT NULL;

-- Make the new id column required.
ALTER TABLE "PublicationAuthor"
ALTER COLUMN "id" SET NOT NULL;

-- Make the new id the primary key.
ALTER TABLE "PublicationAuthor"
ADD CONSTRAINT "PublicationAuthor_pkey"
PRIMARY KEY ("id");

-- Index for publication lookups.
CREATE INDEX "PublicationAuthor_publicationId_idx"
ON "PublicationAuthor"("publicationId");

-- Prevent duplicate ASL authors within the same publication.
CREATE UNIQUE INDEX "PublicationAuthor_publicationId_personId_key"
ON "PublicationAuthor"("publicationId", "personId");