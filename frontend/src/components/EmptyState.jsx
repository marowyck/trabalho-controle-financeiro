export default function EmptyState({ title, description, action }) {
  return (
    <div className="surface flex flex-col items-center justify-center rounded-xl px-6 py-16 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="36" height="28" rx="4" stroke="#0D9488" strokeWidth="2" fill="none" />
          <path d="M4 17h36" stroke="#0D9488" strokeWidth="2" />
          <circle cx="11" cy="13.5" r="1.5" fill="#0D9488" />
          <circle cx="16" cy="13.5" r="1.5" fill="#14B8A6" />
          <circle cx="21" cy="13.5" r="1.5" fill="#14B8A6" />
          <path
            d="M14 30l4-5 4 3 5-6"
            stroke="#14B8A6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="27" cy="22" r="2" fill="#0D9488" />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-xs text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
