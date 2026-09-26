export function CertificateSeal({ className }: { className?: string }) {
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg viewBox="0 0 120 150" className={className} xmlns="http://www.w3.org/2000/svg">
      <g>
        {spokes.map((angle) => (
          <rect
            key={angle}
            x="57"
            y="10"
            width="6"
            height="20"
            rx="2"
            fill="#D9A404"
            transform={`rotate(${angle} 60 54)`}
          />
        ))}
      </g>
      <circle cx="60" cy="54" r="27" fill="#D9A404" />
      <circle cx="60" cy="54" r="21" fill="#B3121B" />
      <polygon
        points="60,44 63,51 71,51 64.5,56 67,63.5 60,59 53,63.5 55.5,56 49,51 57,51"
        fill="#FBF8EF"
      />
      <polygon points="50,72 68,72 68,120 61,107 59,107 52,120" fill="#B3121B" />
      <line x1="60" y1="72" x2="60" y2="118" stroke="#8A0E14" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
