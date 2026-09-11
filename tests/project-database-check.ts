import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/lib/db/prisma";

async function main() {
  const slug = "cms-verification-" + randomUUID();
  const rollback = new Error("ROLLBACK_PROJECT_VERIFICATION");
  try {
    await prisma.$transaction(async (tx) => {
      const pi = await tx.person.create({ data: { name: "CMS verification", slug: slug + "-person" } });
      const area = await tx.researchArea.create({ data: { name: "CMS verification", slug: slug + "-area" } });
      const created = await tx.project.create({
        data: {
          title: "CMS verification (rolled back)", slug, principalInvestigatorId: pi.id,
          status: "PLANNED",
          members: { create: { personId: pi.id, role: "CO_INVESTIGATOR" } },
          researchAreas: { create: { researchAreaId: area.id } },
        },
      });
      await tx.project.update({ where: { id: created.id }, data: { status: "ONGOING", isFeatured: true } });
      await tx.projectMember.createMany({ data: [{ projectId: created.id, personId: pi.id }], skipDuplicates: true });
      const saved = await tx.project.findUniqueOrThrow({
        where: { id: created.id }, include: { members: true, researchAreas: true, principalInvestigator: true },
      });
      assert.equal(saved.status, "ONGOING");
      assert.equal(saved.isFeatured, true);
      assert.equal(saved.principalInvestigator.id, pi.id);
      assert.equal(saved.members.length, 1);
      assert.equal(saved.members[0].role, "CO_INVESTIGATOR");
      assert.equal(saved.researchAreas[0].researchAreaId, area.id);
      await tx.project.delete({ where: { id: created.id } });
      assert.equal(await tx.projectMember.count({ where: { projectId: created.id } }), 0);
      assert.equal(await tx.projectResearchArea.count({ where: { projectId: created.id } }), 0);
      assert.ok(await tx.person.findUnique({ where: { id: pi.id } }));
      assert.ok(await tx.researchArea.findUnique({ where: { id: area.id } }));
      throw rollback;
    }, { timeout: 30000 });
  } catch (error) {
    if (error !== rollback) throw error;
  }
  assert.equal(await prisma.project.count({ where: { slug } }), 0);
  assert.equal(await prisma.person.count({ where: { slug: slug + "-person" } }), 0);
  assert.equal(await prisma.researchArea.count({ where: { slug: slug + "-area" } }), 0);
  console.log("PASS: database create/update, PI/member/area relations, duplicate prevention, preserved member roles, delete cascades, and rollback cleanup.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
