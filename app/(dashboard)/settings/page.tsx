import { getActiveOrg } from "@/lib/auth-utils";
import { updateOrgSettings } from "@/app/actions/org";

export default async function SettingsPage() {
  const { organization, role } = await getActiveOrg();
  const isAdmin = role === "ADMIN";

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-sm font-medium text-white">Settings</h1>
        <p className="text-sm text-[#888] mt-1">Manage your organization settings</p>
      </div>

      {/* Section Card */}
      <div className="border border-[#222] rounded-lg overflow-hidden bg-black">
        {/* Card Header */}
        <div className="p-6">
          <h2 className="text-base font-medium text-white">Gmail Configuration</h2>
          <p className="text-sm text-[#888] mt-1">
            Configure your Gmail credentials to send certificates directly to recipients.
          </p>
        </div>

        {/* Form Body & Footer */}
        <form action={updateOrgSettings}>
          <div className="p-6 border-t border-[#222] space-y-4">
            <div>
              <label htmlFor="gmailAddress" className="text-[#888] text-sm mb-1.5 block">
                Gmail Address
              </label>
              <input
                id="gmailAddress"
                name="gmailAddress"
                type="email"
                defaultValue={organization.gmailAddress || ""}
                placeholder="you@gmail.com"
                disabled={!isAdmin}
                className="bg-black border border-[#333] rounded-md h-10 px-3 text-white text-sm w-full max-w-md focus:border-[#666] focus:outline-none placeholder:text-[#555] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="gmailAppPassword" className="text-[#888] text-sm mb-1.5 block">
                App Password
              </label>
              <input
                id="gmailAppPassword"
                name="gmailAppPassword"
                type="password"
                placeholder={organization.gmailAppPassword ? "••••••••••••" : "abcd efgh ijkl mnop"}
                disabled={!isAdmin}
                className="bg-black border border-[#333] rounded-md h-10 px-3 text-white text-sm w-full max-w-md focus:border-[#666] focus:outline-none placeholder:text-[#555] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="px-6 py-3 bg-[#0a0a0a] border-t border-[#222] flex justify-between items-center">
            <span className="text-xs text-[#888]">
              Need an App Password? Enable 2-Step Verification on Google
            </span>
            {isAdmin && (
              <button
                type="submit"
                className="bg-white text-black rounded-md px-4 h-9 text-sm font-medium hover:bg-[#ccc] transition cursor-pointer"
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
