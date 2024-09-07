function GroovyStacksLogo() {
  return (
    <svg
      width="240"
      height="240"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <g className="animate-float">
        <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="6" />
        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="5" fill="currentColor" />
      </g>
      <g className="origin-[30px_30px] animate-needle-move">
        <rect x="25" y="25" width="10" height="40" rx="2" fill="currentColor" />
        <rect x="23" y="23" width="14" height="14" rx="7" fill="currentColor" />
      </g>
    </svg>
  );
}

export function LoadingRecord() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="animate-pulse">
        <GroovyStacksLogo />
      </div>
    </div>
  );
}