import { redirect } from "next/navigation";

export default function InvitationsRoute() {
  redirect("/dashboard?section=invitations");
}
