const confettiColors = ["#ffd166", "#1b1020", "#fff4d6", "#7bf1a8", "#c4b5fd", "#ff6b9d"];

export function CarnivalBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="fest-mesh absolute inset-0 opacity-90" />
      <svg className="fest-blob absolute -left-24 top-8 h-[460px] w-[460px]" viewBox="0 0 200 200">
        <path
          fill="#ffd166"
          d="M47.7,-58.2C61.2,-47.3,71.2,-31.2,74.6,-13.8C78,3.7,74.7,22.4,64.6,36.8C54.4,51.3,37.4,61.4,19.5,66.7C1.6,72,-17.2,72.4,-33.5,65.4C-49.8,58.3,-63.6,43.8,-70.6,26.4C-77.6,9,-77.8,-11.3,-70.2,-28.1C-62.6,-44.9,-47.3,-58.2,-31.1,-68.1C-14.9,-78,1.1,-84.4,16.7,-80.2C32.4,-76,47.6,-61.1,47.7,-58.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg className="fest-blob-slow absolute -right-16 bottom-10 h-[380px] w-[380px]" viewBox="0 0 200 200">
        <path
          fill="#7b5cff"
          d="M39.4,-52.1C51.2,-44.1,60.7,-31.4,65.8,-16.4C70.9,-1.4,71.6,16,64.4,29.6C57.2,43.1,42.1,52.8,26.4,58.7C10.7,64.6,-5.6,66.7,-21.6,62.6C-37.6,58.5,-53.3,48.2,-62.4,33.7C-71.4,19.2,-73.9,0.5,-69.4,-16C-64.9,-32.5,-53.4,-46.8,-39.4,-54.4C-25.3,-62,-12.7,-62.9,1.1,-64.4C14.8,-65.9,29.7,-68,39.4,-52.1Z"
          transform="translate(100 100)"
        />
      </svg>
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="fest-confetti-piece"
          style={{
            left: `${(i * 9) % 100}%`,
            animationDelay: `${(i % 8) * 0.35}s`,
            animationDuration: `${6 + (i % 5)}s`,
            background: confettiColors[i % confettiColors.length],
            width: i % 3 === 0 ? 14 : 9,
            height: i % 2 === 0 ? 18 : 10,
          }}
        />
      ))}
    </div>
  );
}

export function AfterpartyBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#1b1020]" aria-hidden="true">
      <div className="fest-aurora absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,122,69,0.55),transparent_62%)]" />
      <div className="fest-aurora absolute -right-1/4 top-10 h-[60%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(123,92,255,0.5),transparent_60%)]" style={{ animationDelay: "-4s" }} />
      <div className="fest-aurora absolute bottom-0 left-1/3 h-[50%] w-[50%] rounded-full bg-[radial-gradient(circle,rgba(255,209,102,0.28),transparent_65%)]" style={{ animationDelay: "-7s" }} />
      <svg className="fest-spot absolute left-[12%] top-0 h-[70vh] w-[38vw]" viewBox="0 0 200 400">
        <defs>
          <linearGradient id="fest-spot-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd166" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#fest-spot-a)" points="90,0 110,0 200,400 0,400" />
      </svg>
      <svg className="fest-spot fest-spot-delay absolute right-[8%] top-0 h-[75vh] w-[42vw]" viewBox="0 0 200 400">
        <defs>
          <linearGradient id="fest-spot-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff6b9d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#fest-spot-b)" points="85,0 115,0 200,400 0,400" />
      </svg>
    </div>
  );
}

export function MainStageBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#ffd166]" aria-hidden="true">
      <div
        className="fest-wave absolute inset-y-0 left-0 flex w-[200%]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(#ff7a45 0% 8%, #ffd166 0% 16%)",
          backgroundSize: "56px 56px",
          opacity: 0.22,
        }}
      />
      <svg className="land-spin-slow absolute -right-24 -top-24 h-[520px] w-[520px] text-[#ff7a45]" viewBox="0 0 200 200">
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d="M100 100 L100 8 A4 4 0 0 1 108 12 Z"
            fill="currentColor"
            opacity="0.85"
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="36" fill="#fff4d6" />
        <circle cx="100" cy="100" r="22" fill="#1b1020" />
      </svg>
    </div>
  );
}

export function FestTicketSvg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 120" fill="none" aria-hidden="true">
      <path
        className="fest-draw"
        d="M12 18h150c6 0 10 4 10 10v10c0 8-6 14-14 14s-14 6-14 14 6 14 14 14 14 6 14 14v10c0 6-4 10-10 10H12c-6 0-10-4-10-10V28c0-6 4-10 10-10z"
        stroke="#1b1020"
        strokeWidth="4"
        fill="#fff4d6"
      />
      <path d="M48 18v84" stroke="#1b1020" strokeWidth="3" strokeDasharray="6 8" />
      <text x="62" y="52" fill="#1b1020" fontSize="14" fontWeight="800" fontFamily="ui-sans-serif">
        FEST PASS
      </text>
      <text x="62" y="78" fill="#ff7a45" fontSize="18" fontWeight="900" fontFamily="ui-sans-serif">
        ₹100
      </text>
    </svg>
  );
}

export function FestSealSvg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" aria-hidden="true">
      <circle cx="80" cy="80" r="72" fill="#7b5cff" stroke="#1b1020" strokeWidth="6" />
      <circle cx="80" cy="80" r="54" fill="#ffd166" stroke="#1b1020" strokeWidth="4" />
      <path
        className="fest-draw"
        d="M48 84 l18 18 46-48"
        fill="none"
        stroke="#1b1020"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FestStageSvg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 260" fill="none" aria-hidden="true">
      <rect x="20" y="170" width="320" height="50" rx="8" fill="#1b1020" />
      <rect x="70" y="90" width="220" height="90" rx="6" fill="#ff7a45" stroke="#1b1020" strokeWidth="5" />
      <rect x="90" y="108" width="180" height="54" rx="4" fill="#ffd166" />
      <text x="180" y="142" textAnchor="middle" fill="#1b1020" fontSize="18" fontWeight="900" fontFamily="ui-sans-serif">
        CERT SENT
      </text>
      <g className="fest-bob" style={{ transformOrigin: "80px 70px" }}>
        <circle cx="80" cy="58" r="18" fill="#ff6b9d" stroke="#1b1020" strokeWidth="4" />
      </g>
      <g className="fest-bob" style={{ transformOrigin: "280px 70px", animationDelay: "-1s" }}>
        <circle cx="280" cy="58" r="18" fill="#7bf1a8" stroke="#1b1020" strokeWidth="4" />
      </g>
      <path d="M40 40 L80 88" stroke="#ffd166" strokeWidth="6" strokeLinecap="round" />
      <path d="M320 40 L280 88" stroke="#c4b5fd" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function FestBunting() {
  return (
    <svg className="absolute left-0 top-0 h-24 w-[200%] fest-wave" viewBox="0 0 1200 80" aria-hidden="true">
      <path d="M0 18 H1200" stroke="#1b1020" strokeWidth="6" />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = i * 66;
        const fill = ["#ff7a45", "#ffd166", "#7b5cff", "#ff6b9d"][i % 4];
        return <polygon key={i} points={`${x},22 ${x + 30},22 ${x + 15},72`} fill={fill} stroke="#1b1020" strokeWidth="3" />;
      })}
    </svg>
  );
}

export function FestMailSvg({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 140" aria-hidden="true">
      <rect x="18" y="38" width="144" height="86" rx="10" fill="#fff4d6" stroke="#1b1020" strokeWidth="5" />
      <path className="fest-draw" d="M22 44 L90 92 L158 44" fill="none" stroke="#1b1020" strokeWidth="5" />
      <g className="land-float">
        <path d="M118 22 l36 10 -10 28 -36 -10 z" fill="#7bf1a8" stroke="#1b1020" strokeWidth="4" />
      </g>
    </svg>
  );
}
