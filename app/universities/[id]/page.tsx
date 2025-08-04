// app/universities/[id]/page.tsx
import { ClientUniversityPage } from "./ClientUniversityPage";

export default function Page({ params }: { params: { id: string } }) {
  return <ClientUniversityPage universityId={params.id} />;
}
