import { redirect } from "next/navigation";

export default function UserSettingsRoute() {
  redirect("/dashboard?section=account");
}
