export function Marquee({
  items,
  reverse = false,
  fast = false,
  className = "",
  itemClassName = "",
}: {
  items: string[];
  reverse?: boolean;
  fast?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const doubled = [...items, ...items];
  const anim = reverse ? "land-marquee-rev" : fast ? "land-marquee-fast" : "land-marquee";

  return (
    <div className={`land-marquee-wrap overflow-hidden ${className}`}>
      <div className={`${anim} flex w-max gap-8`}>
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={`whitespace-nowrap ${itemClassName}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
