import { getActiveOrg } from "@/lib/auth-utils";
import { updateOrgSettings } from "@/app/actions/org";
import { SettingsTabs } from "@/components/SettingsTabs";
import { Input } from "@/components/ui/input";

export default async function DashboardSettings() {
  const { organization, role } = await getActiveOrg();
  const isAdmin = role === "ADMIN";

  return (
    <div className="max-w-full space-y-4 text-foreground">
      <SettingsTabs />

      {/* Section Card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {/* Card Header */}
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium text-card-foreground">Gmail Configuration</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure your Gmail credentials to send certificates directly to recipients.
          </p>
        </div>

        {/* Form Body & Footer */}
        <form action={updateOrgSettings}>
          <div className="space-y-3 border-t border-border p-4">
            <div>
              <label htmlFor="gmailAddress" className="mb-1.5 block text-xs text-muted-foreground">
                Gmail Address
              </label>
              <Input
                id="gmailAddress"
                name="gmailAddress"
                type="email"
                defaultValue={organization.gmailAddress || ""}
                placeholder="you@gmail.com"
                disabled={!isAdmin}
                className="h-8 w-full max-w-md px-3 text-[13px]"
              />
            </div>

            <div>
              <label htmlFor="gmailAppPassword" className="mb-1.5 block text-xs text-muted-foreground">
                App Password
              </label>
              <Input
                id="gmailAppPassword"
                name="gmailAppPassword"
                type="password"
                placeholder={organization.gmailAppPassword ? "••••••••••••" : "abcd efgh ijkl mnop"}
                disabled={!isAdmin}
                className="h-8 w-full max-w-md px-3 text-[13px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/50 px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Need an App Password? Enable 2-Step Verification on Google
            </span>
            {isAdmin && (
              <button
                type="submit"
                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
