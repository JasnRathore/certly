import { auth } from "@/auth";
import { UserSettingsForm } from "@/components/UserSettingsForm";
import { db } from "@/lib/db";
import { getUserAvatarConfig } from "@/lib/user-avatar-storage";

export default async function DashboardUserSettings() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }
  const [avatarConfig, profileResult] = await Promise.all([
    getUserAvatarConfig(session.user.id),
    db.execute({
      sql: "SELECT name, email FROM User WHERE id = ?",
      args: [session.user.id],
    }),
  ]);
  const profile = profileResult.rows[0];

  return (
    <div className="flex-1 overflow-y-auto text-foreground">
      <div className="mx-auto max-w-full space-y-8">
        <UserSettingsForm
          user={{
            name: (profile?.name as string | undefined) ?? session.user.name,
            email: (profile?.email as string | undefined) ?? session.user.email,
            avatarConfig,
          }}
        />
      </div>
    </div>
  );
}
