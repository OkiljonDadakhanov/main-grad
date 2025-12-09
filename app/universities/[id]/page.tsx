// app/universities/[id]/page.tsx
import { ClientUniversityPage } from "./ClientUniversityPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientUniversityPage universityId={id} />;
}
