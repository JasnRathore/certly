import Image from "next/image";

export function CertlyLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/certly-logo.svg"
      alt="Certly"
      width={400}
      height={400}
      priority={priority}
      className={className}
    />
  );
}
