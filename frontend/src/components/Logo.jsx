export default function Logo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="iFinance logo"
    >
      <rect width="32" height="32" rx="8" fill="#0D9488" />
      <circle cx="23" cy="9" r="2.5" fill="white" />
      <polyline
        points="8,23 13,16 18,19 23,9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
