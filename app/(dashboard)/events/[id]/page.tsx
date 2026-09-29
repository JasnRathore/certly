import { redirect } from "next/navigation";

export default async function EventRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard?section=event&eventId=${encodeURIComponent(id)}`);
}
