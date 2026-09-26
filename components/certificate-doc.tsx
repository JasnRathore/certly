export function CertificateDoc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="92" height="68" rx="4" fill="#FFFFFF" stroke="#1A1A2E" strokeWidth="2" />
      <rect x="9" y="9" width="78" height="54" rx="2" fill="none" stroke="#D9A404" strokeWidth="1.4" />
      <line x1="20" y1="24" x2="76" y2="24" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="34" x2="68" y2="34" stroke="#B7B5AC" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="24" y1="42" x2="72" y2="42" stroke="#B7B5AC" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="70" cy="54" r="7" fill="#B3121B" />
      <path d="M67 59 L67 68 L70 64 L73 68 L73 59 Z" fill="#B3121B" />
    </svg>
  );
}
