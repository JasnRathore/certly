export const landingFaq = [
  {
    question: "Is ₹100 really a one-time payment?",
    answer:
      "Yes. Pay once and the account is yours — no renewals, no yearly fee, no per-certificate charge. Use it for this event and every one after.",
  },
  {
    question: "How many certificates can we send?",
    answer: "As many as your event needs. Bring a list of 20 or 2,000 — it's the same ₹100.",
  },
  {
    question: "Do we need design skills to set up the template?",
    answer:
      "No. Upload the certificate design your club already uses and mark where the name goes — Certly handles the rest.",
  },
  {
    question: "Can more than one club member run events?",
    answer:
      "Yes — the account belongs to your club, not one person, so whoever's organising this year's event can log in and use it.",
  },
  {
    question: "We need a receipt to get reimbursed. Is that possible?",
    answer: "Yes, you'll get a payment receipt you can hand to your faculty advisor or treasurer for reimbursement.",
  },
];

export const useCases = [
  "Tech fests",
  "Hackathons",
  "Workshops",
  "Orientation",
  "Sports day",
  "Cultural night",
  "IEEE chapters",
  "NSS camps",
  "Coding clubs",
  "E-cell pitches",
];

export const steps = [
  { n: "01", title: "Upload the design", body: "Drop the certificate your design team already made." },
  { n: "02", title: "Import the list", body: "Names and emails from a spreadsheet. That's the whole guest list." },
  { n: "03", title: "Send in one pass", body: "PDFs generated and mailed from your org Gmail." },
];

export const looks = [
  { href: "/", label: "0", name: "Studio" },
  { href: "/1", label: "1", name: "Carnival" },
  { href: "/2", label: "2", name: "Maker" },
  { href: "/3", label: "3", name: "Main stage" },
  { href: "/4", label: "4", name: "Fest" },
] as const;

export const xTestimonials = [
  {
    handle: "ananya_core",
    name: "Ananya",
    role: "Cultural core",
    time: "2h",
    text: "412 participation certs left the auditorium wifi before the DJ even started. Treasurer paid ₹100 and went back to the stall.",
    likes: "128",
    replies: "14",
  },
  {
    handle: "ieee_sjec",
    name: "IEEE SJEC",
    role: "Chapter account",
    time: "1d",
    text: "Workshop + hackathon + guest lecture in one Gmail pass. We used to batch Canva PDFs till 4am. Never again.",
    likes: "86",
    replies: "9",
  },
  {
    handle: "sports_sec_nsut",
    name: "Vikram",
    role: "Sports secretary",
    time: "4d",
    text: "Medals on stage, certificates in inbox. Parents were screenshotting them in the stands. ₹100 from the event fund.",
    likes: "203",
    replies: "31",
  },
] as const;

export const googleReviews = [
  {
    name: "Meera Iyer",
    campus: "TechFest · VIT",
    rating: 5,
    time: "3 weeks ago",
    text: "Faculty advisor asked for a receipt. We had one. 900 names, one spreadsheet, no all-nighter. This is the stall fee that actually pays off.",
  },
  {
    name: "Arjun Nair",
    campus: "E-Cell · CET",
    rating: 5,
    time: "1 month ago",
    text: "Pitch winners got PDFs while they were still on stage. Looks official, sends from the club Gmail, and the price is a joke in a good way.",
  },
  {
    name: "Sana Qureshi",
    campus: "Literary club · JMI",
    rating: 5,
    time: "2 months ago",
    text: "Orientation certificates used to leak into week two. This year they were in first-year inboxes before the campus tour ended.",
  },
] as const;

export type LandingCta = {
  signedIn: boolean;
  primaryHref: string;
  primaryLabel: string;
};
