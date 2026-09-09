import { siOrcid } from "simple-icons";

type OrcidIconProps = {
  className?: string;
};

export function OrcidIcon({
  className,
}: OrcidIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={siOrcid.path} />
    </svg>
  );
}