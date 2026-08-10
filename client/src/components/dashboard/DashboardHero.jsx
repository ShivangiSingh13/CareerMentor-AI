const DashboardHero = ({ name = 'Shivi' }) => (
  <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Good morning, {name}! 👋</h1>
      <p className="mt-3 max-w-2xl text-base text-slate-600">Here&apos;s your career progress at a glance.</p>
    </div>

    <div className="flex justify-start lg:justify-end">
      <div className="relative h-[180px] w-full max-w-[340px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.14),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(99,102,241,0.12),transparent_30%)]" />
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-5">
          <svg viewBox="0 0 360 180" className="h-full w-full max-w-[320px]">
            <defs>
              <linearGradient id="heroBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
            </defs>
            <circle cx="280" cy="56" r="34" fill="none" stroke="#93c5fd" strokeWidth="8" />
            <circle cx="280" cy="56" r="26" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="110" strokeDashoffset="16" />
            <circle cx="280" cy="56" r="8" fill="#3b82f6" />
            <path d="M248 76 308 18" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            <rect x="42" y="126" width="34" height="36" rx="10" fill="url(#heroBar)" />
            <rect x="86" y="98" width="34" height="64" rx="10" fill="url(#heroBar)" />
            <rect x="130" y="72" width="34" height="90" rx="10" fill="url(#heroBar)" />
            <path d="M36 162h240" stroke="#dbeafe" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  </section>
);

export default DashboardHero;