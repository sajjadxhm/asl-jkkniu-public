import { ProjectEditorPage } from "@/features/projects/components/management-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectEditorPage portal="admin" id={id} />;
}
