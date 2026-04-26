import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Universities, Programs & Scholarships - GradAbroad",
  description:
    "Search for Korean universities, academic programs, and scholarships. Find the perfect match for your study abroad journey.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
