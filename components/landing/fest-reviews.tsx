import { googleReviews, xTestimonials } from "@/lib/landing";
import { LandReveal } from "./land-reveal";

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.726-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.21-2.36H12v4.47h6.46a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.56-5.17 3.56-8.75z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.98l-3.88-3.01c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.2A7.2 7.2 0 0 1 4.89 12c0-.76.13-1.5.38-2.2V6.69H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.31l4-3.11z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.14 15.23 0 12 0 7.31 0 3.26 2.69 1.27 6.69l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-[#fbbc04]" aria-hidden="true">
          <path d="M10 1.5 12.5 7l6 .5-4.6 4 1.4 5.9L10 14.8 4.7 17.4l1.4-5.9L1.5 7.5l6-.5L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function FestReviews({ heading = "The core team already posted about it" }: { heading?: string }) {
  return (
    <section className="relative px-4 py-16 sm:px-8">
      <LandReveal>
        <p className="text-center text-xs font-black uppercase tracking-[0.35em]">Embedded social proof</p>
        <h2 className="mt-3 text-center text-4xl font-black uppercase leading-[0.9] sm:text-6xl [font-family:var(--font-archivo),Impact,sans-serif]">
          {heading}
        </h2>
      </LandReveal>
      <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-2">
        <LandReveal>
          <article className="rounded-3xl border-4 border-[#1b1020] bg-white p-5 shadow-[8px_8px_0_#1b1020]">
            <header className="mb-4 flex items-center justify-between border-b-4 border-[#1b1020] pb-3">
              <span className="flex items-center gap-2 text-sm font-black uppercase">
                <XMark /> Posts from X
              </span>
              <span className="text-[11px] font-bold opacity-60">live timeline look</span>
            </header>
            <ul className="space-y-4">
              {xTestimonials.map((post) => (
                <li key={post.handle} className="rounded-2xl border-2 border-[#1b1020]/15 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b1020] text-xs font-black text-[#ffd166]">
                      {post.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm font-black">
                        {post.name}
                        <span className="font-semibold opacity-50">@{post.handle}</span>
                        <span className="text-xs font-medium opacity-40">· {post.time}</span>
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wide opacity-50">{post.role}</p>
                      <p className="mt-2 text-sm font-medium leading-relaxed">{post.text}</p>
                      <p className="mt-3 flex gap-4 text-xs font-bold opacity-50">
                        <span>♡ {post.likes}</span>
                        <span>↩ {post.replies}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </LandReveal>
        <LandReveal delay={80}>
          <article className="rounded-3xl border-4 border-[#1b1020] bg-white p-5 shadow-[8px_8px_0_#1b1020]">
            <header className="mb-4 flex items-center justify-between border-b-4 border-[#1b1020] pb-3">
              <span className="flex items-center gap-2 text-sm font-black uppercase">
                <GoogleMark /> Google reviews
              </span>
              <span className="flex items-center gap-2 text-xs font-black">
                <Stars n={5} /> 4.9
              </span>
            </header>
            <ul className="space-y-4">
              {googleReviews.map((review) => (
                <li key={review.name} className="rounded-2xl border-2 border-[#1b1020]/15 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">{review.name}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wide opacity-50">{review.campus}</p>
                    </div>
                    <Stars n={review.rating} />
                  </div>
                  <p className="mt-2 text-sm font-medium leading-relaxed">{review.text}</p>
                  <p className="mt-2 text-[11px] font-bold uppercase opacity-40">{review.time}</p>
                </li>
              ))}
            </ul>
          </article>
        </LandReveal>
      </div>
    </section>
  );
}
