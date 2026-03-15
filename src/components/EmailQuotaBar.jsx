const EmailQuotaBar = ({ usedEmails = 0, totalQuota = 100 }) => {
  const percentage = Math.min((usedEmails / totalQuota) * 100, 100);
  const remaining = totalQuota - usedEmails;

  const getColor = () => {
    if (percentage < 50) return 'green';
    if (percentage < 80) return 'yellow';
    return 'red';
  };

  const color = getColor();

  const barColor = {
    green: 'from-emerald-500 to-green-400',
    yellow: 'from-amber-500 to-yellow-400',
    red: 'from-red-500 to-rose-400',
  }[color];

  const glowColor = {
    green: 'shadow-emerald-500/40',
    yellow: 'shadow-amber-500/40',
    red: 'shadow-red-500/40',
  }[color];

  const textColor = {
    green: 'text-emerald-400',
    yellow: 'text-amber-400',
    red: 'text-red-400',
  }[color];

  const badgeBg = {
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    yellow: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  }[color];

  const dotColor = {
    green: 'bg-emerald-400',
    yellow: 'bg-amber-400',
    red: 'bg-red-400',
  }[color];

  return (
    <div className="card p-5">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Daily Email Quota</h3>
            <p className="text-xs text-gray-500 mt-0.5">Resets every 24 hours</p>
          </div>
        </div>

        {/* Percentage Badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
          {Math.round(percentage)}% used
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-3">
        {/* Track */}
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
          {/* Fill */}
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-lg ${glowColor} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-full" />
          </div>
        </div>

        {/* Marker at 80% - warning zone */}
        <div
          className="absolute top-0 h-2.5 w-px bg-gray-500/60"
          style={{ left: '80%' }}
          title="80% warning threshold"
        />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${textColor}`}>{usedEmails}</span>
          <span className="text-gray-500 text-sm">/ {totalQuota} emails used</span>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-sm font-semibold text-gray-300">{remaining} emails</p>
        </div>
      </div>

      {/* Threshold hints */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400/70 inline-block" />
          Safe (&lt;50%)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-amber-400/70 inline-block" />
          Caution (50–80%)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-red-400/70 inline-block" />
          Critical (&gt;80%)
        </div>
      </div>
    </div>
  );
};

export default EmailQuotaBar;
