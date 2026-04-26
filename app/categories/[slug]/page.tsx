import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const name = params.slug.replace(/-/g, " ");
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: `${capitalized} Programs - GradAbroad`,
    description: `Explore ${capitalized} programs at Korean universities for Uzbek students.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Example: define known categories
  const validCategories = ["engineering", "business", "arts-humanities", "science", "medicine"];

  // Show 404 if the slug is invalid
  if (!validCategories.includes(slug.toLowerCase())) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold capitalize">{slug} Category</h1>
      <p className="mt-4 text-lg text-gray-600">
        Here you'll find resources related to <strong>{slug}</strong>.
      </p>
    </div>
  );
}
