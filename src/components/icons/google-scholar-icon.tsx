import { siGooglescholar } from "simple-icons";

type GoogleScholarIconProps = {
  className?: string;
};

export function GoogleScholarIcon({
  className,
}: GoogleScholarIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={siGooglescholar.path} />
    </svg>
  );
}