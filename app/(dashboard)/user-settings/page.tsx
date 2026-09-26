import { auth } from "@/auth";
import { UserSettingsForm } from "@/components/UserSettingsForm";

export default async function UserSettingsPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">User Settings</h1>
          <p className="text-[#888] text-sm">Manage your personal account settings and preferences.</p>
        </div>

        <div className="h-px bg-[#222]" />

        <UserSettingsForm user={session.user} />
      </div>
    </div>
  );
}
