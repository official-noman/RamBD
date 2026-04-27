import { redirect } from "next/navigation";

// Redirect old /product/[slug] URLs to new /pro/[slug]
export default async function OldProductRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const query = new URLSearchParams(sp as Record<string, string>).toString();
  redirect(query ? `/pro/${slug}?${query}` : `/pro/${slug}`);
}
