export function RecipientsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="92" height="68" rx="4" fill="#FFFFFF" stroke="#1A1A2E" strokeWidth="2" />
      <circle cx="18" cy="19" r="6" fill="#1A1A2E" />
      <line x1="31" y1="19" x2="70" y2="19" stroke="#D9A404" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="37" r="6" fill="#1A1A2E" />
      <line x1="31" y1="37" x2="76" y2="37" stroke="#B7B5AC" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="55" r="6" fill="#B3121B" />
      <line x1="31" y1="55" x2="62" y2="55" stroke="#B7B5AC" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 72" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="16" width="52" height="38" rx="4" fill="#FFFFFF" stroke="#1A1A2E" strokeWidth="2" />
      <path d="M12 20 L38 40 L64 20" stroke="#1A1A2E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="70" y1="23" x2="88" y2="23" stroke="#D9A404" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="33" x2="83" y2="33" stroke="#D9A404" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="70" y1="43" x2="78" y2="43" stroke="#D9A404" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      <circle cx="18" cy="58" r="7" fill="#B3121B" />
      <path d="M14.5 58 l2.5 2.5 5 -5" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
