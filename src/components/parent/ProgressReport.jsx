import { BADGE_DEFS } from '../../lib/badges'

export function ProgressReport({ teenName, stats, completedDays, badges }) {
  const streak = stats?.current_streak ?? 0
  const totalXp = stats?.total_xp ?? 0
  const level = stats?.level ?? 1

  // Avg quiz accuracy from stats isn't stored directly — display days and XP
  const completionPct = Math.round((completedDays / 10) * 100)

  return (
    <div className="bg-surface rounded-card shadow-card p-5 flex flex-col gap-5">
      <div>
        <p className="text-xs font-heading font-700 uppercase tracking-widest text-primary mb-1">
          Progress Overview
        </p>
        <h2 className="font-heading font-800 text-xl text-[#0f172a]">{teenName}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '🔥 Streak', value: `${streak} day${streak !== 1 ? 's' : ''}` },
          { label: '⭐ Total XP', value: `${totalXp} XP` },
          { label: '📖 Days done', value: `${completedDays} / 10` },
          { label: '🏅 Level', value: `Level ${level}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#f8fafc] rounded-card p-3">
            <p className="font-body text-xs text-muted">{label}</p>
            <p className="font-heading font-800 text-base text-[#0f172a] mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-body text-muted">Module 1 completion</span>
          <span className="font-heading font-700 text-primary">{completionPct}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completionPct} aria-valuemin={0} aria-valuemax={100} aria-label="Module 1 completion">
          <div
            className="h-full bg-success rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {badges.length > 0 && (
        <div>
          <p className="font-heading font-700 text-sm text-[#0f172a] mb-3">Badges earned</p>
          <div className="flex gap-3 flex-wrap">
            {badges.map((id) => {
              const def = BADGE_DEFS.find((b) => b.id === id)
              return def ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 bg-accent/15 text-[#92400e] rounded-full px-3 py-1.5 text-xs font-heading font-700"
                >
                  {def.emoji} {def.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}
