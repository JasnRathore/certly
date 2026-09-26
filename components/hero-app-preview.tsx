import {
  Home,
  CalendarDays,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Search,
  Share2,
  Maximize2,
  Paperclip,
  Send,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { CertificateDoc } from "./certificate-doc";

const sidebarNav = [
  { icon: Home, label: "Home" },
  { icon: CalendarDays, label: "My events" },
  { icon: Bookmark, label: "Bookmarks" },
];

const workspaceLinks = ["Events", "Templates", "More"];

const events = [
  { name: "Techfest 2026 launch", active: true },
  { name: "Alumni meet certificates", active: false },
  { name: "Coding club workshop", active: false },
];

const activity = [
  { text: "You created this event", time: "3d" },
  { text: "You uploaded techfest-certificate.pdf", time: "3d" },
  { text: "You imported 342 recipients", time: "2d" },
];

export function HeroAppPreview() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[32px] bg-[#D9A404]/10 blur-3xl" />
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F12] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-[168px] shrink-0 flex-col border-r border-white/10 bg-[#131316] px-3 py-3 md:flex">
            <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] text-[#EDEDEF]">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[#D9A404] text-[9px] font-semibold text-[#0A0A0C]">
                T
              </span>
              Tech Council
              <ChevronDown className="ml-auto h-3 w-3 text-[#8B8B93]" />
            </div>
            <div className="mt-2 flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] text-[#8B8B93]">
              <Search className="h-3 w-3" />
              Search
            </div>
            <nav className="mt-3 space-y-0.5">
              {sidebarNav.map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[12px] text-[#9C9AA0]">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              ))}
            </nav>
            <div className="mt-4 px-1.5 text-[11px] text-[#5C5A62]">Workspace</div>
            <nav className="mt-1 space-y-0.5">
              {workspaceLinks.map((label) => (
                <div key={label} className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] text-[#9C9AA0]">
                  <ChevronRight className="h-3 w-3" />
                  {label}
                </div>
              ))}
            </nav>
            <div className="mt-4 px-1.5 text-[11px] text-[#5C5A62]">Your events</div>
            <nav className="mt-1 space-y-0.5">
              {events.map((event) => (
                <div
                  key={event.name}
                  className={`truncate rounded-md px-1.5 py-1 text-[12px] ${
                    event.active ? "bg-white/5 text-[#EDEDEF]" : "text-[#8B8B93]"
                  }`}
                >
                  {event.name}
                </div>
              ))}
            </nav>
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1 px-5 py-4">
            <div className="flex items-center justify-between text-[12px] text-[#8B8B93]">
              <span className="truncate font-mono">EVE-118 · Techfest 2026 launch</span>
              <div className="flex shrink-0 items-center gap-2">
                <Share2 className="h-3.5 w-3.5" />
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <h3 className="mt-2 text-[15px] font-medium text-[#EDEDEF]">Techfest 2026 launch</h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[#D9A404]">
                <Circle className="h-2 w-2 fill-current" />
                Sending
              </span>
              <span className="text-[#8B8B93]">Owner: You</span>
              <span className="hidden text-[#8B8B93] sm:inline">Due Sept 28</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[#9C9AA0]">
              Send certificates to all 342 registered participants before the closing ceremony.
            </p>

            <div className="mt-5 text-[12px] text-[#8B8B93]">Activity</div>
            <div className="mt-2 space-y-2.5 text-[12px]">
              {activity.map((item) => (
                <div key={item.text} className="flex items-center justify-between gap-3 text-[#9C9AA0]">
                  <span className="truncate">{item.text}</span>
                  <span className="shrink-0 text-[#5C5A62]">{item.time}</span>
                </div>
              ))}
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-[#8B8B93]">
                  <span className="flex items-center gap-1.5 text-[#D9A404]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D9A404]" />
                    Certly
                  </span>
                  <span>6h</span>
                </div>
                <p className="mt-1 text-[12px] text-[#EDEDEF]">Queued 342 certificates for sending.</p>
              </div>
              <div className="flex items-center justify-between text-[#9C9AA0]">
                <span>Sent 214 of 342</span>
                <span className="shrink-0 text-[#5C5A62]">38m</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#2FBE6F]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Marked event complete</span>
                <span className="ml-auto shrink-0 text-[#5C5A62]">12m</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="h-5 w-5 shrink-0 rounded-full bg-white/10" />
              <span className="text-[12px] text-[#5C5A62]">Write a comment...</span>
              <Paperclip className="ml-auto h-3.5 w-3.5 shrink-0 text-[#5C5A62]" />
              <Send className="h-3.5 w-3.5 shrink-0 text-[#5C5A62]" />
            </div>
          </div>

          {/* Right rail */}
          <div className="hidden w-[176px] shrink-0 flex-col gap-3 border-l border-white/10 bg-[#131316] px-4 py-4 lg:flex">
            <div className="text-[11px] text-[#5C5A62]">Properties</div>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <span className="text-[#8B8B93]">Status</span>
                <span className="text-[#D9A404]">Sending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8B93]">Owner</span>
                <span className="text-[#EDEDEF]">You</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8B93]">Recipients</span>
                <span className="text-[#EDEDEF]">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8B8B93]">Workspace</span>
                <span className="text-[#EDEDEF]">Tech Council</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] p-2">
              <CertificateDoc className="h-8 w-11 shrink-0" />
              <div className="min-w-0">
                <div className="truncate text-[11px] text-[#EDEDEF]">techfest-certificate.pdf</div>
                <div className="text-[10px] text-[#5C5A62]">Template</div>
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.02] p-2">
              <div className="text-[11px] text-[#8B8B93]">Reminder</div>
              <div className="mt-0.5 text-[12px] text-[#EDEDEF]">Send digital badges</div>
              <div className="text-[10px] text-[#5C5A62]">Sept 30</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
