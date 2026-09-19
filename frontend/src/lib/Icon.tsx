import { ICONS } from "./icon-data";

interface IconProps {
  /** Context key, e.g. "ui:share", "amen:Wifi", "hi:Self check-in". */
  name: string;
  className?: string;
}

/**
 * Renders one of the reference SVG icons verbatim. The markup is static and
 * captured from the reference, so injecting it is safe and pixel-exact.
 */
export function Icon({ name, className }: IconProps) {
  const svg = ICONS[name];
  if (!svg) return null;
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
