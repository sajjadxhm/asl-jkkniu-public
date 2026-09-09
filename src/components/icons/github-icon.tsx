import { siGithub } from "simple-icons";

type GithubIconProps = {
  className?: string;
};

export function GithubIcon({
  className,
}: GithubIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d={siGithub.path} />
    </svg>
  );
}