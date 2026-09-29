import { redirect } from "next/navigation";

export default function MembersRoute() {
  redirect("/dashboard?section=members");
}
