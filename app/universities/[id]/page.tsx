// app/universities/[id]/page.tsx
import type { Metadata } from "next";
import { ClientUniversityPage } from "./ClientUniversityPage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.gradabroad.net";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/universities/${id}/`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const name = data.university_name || "University";
      return {
        title: `${name} - GradAbroad`,
        description: `Learn about ${name}, its programs, scholarships and admission requirements.`,
      };
    }
  } catch {
    // fallback
  }
  return {
    title: "University Details - GradAbroad",
    description: "View university details, programs and admission requirements.",
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientUniversityPage universityId={id} />;
}
