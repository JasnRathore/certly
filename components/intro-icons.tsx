export function StackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="8" width="56" height="40" rx="3" stroke="#EDEDEF" strokeOpacity="0.45" strokeWidth="1.5" />
      <rect x="12" y="20" width="56" height="40" rx="3" fill="#0F0F12" stroke="#D9A404" strokeWidth="1.6" />
      <line x1="22" y1="34" x2="58" y2="34" stroke="#EDEDEF" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="22" y1="42" x2="46" y2="42" stroke="#EDEDEF" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="58" cy="50" r="5" fill="#B3121B" />
    </svg>
  );
}

export function StopwatchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="48" y1="6" x2="48" y2="14" stroke="#EDEDEF" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="9" x2="58" y2="9" stroke="#EDEDEF" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="42" r="24" stroke="#D9A404" strokeWidth="1.8" />
      <circle cx="48" cy="42" r="1.8" fill="#EDEDEF" />
      <line x1="48" y1="42" x2="48" y2="26" stroke="#EDEDEF" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="42" x2="60" y2="49" stroke="#EDEDEF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
