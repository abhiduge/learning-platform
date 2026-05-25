export function StreakDisplay({ streak }) {
  return (
    <div className="flex items-center gap-3 bg-surface rounded-card shadow-card px-5 py-4">
      <span className="text-3xl">{streak > 0 ? '🔥' : '💤'}</span>
      <div>
        <p className="font-heading font-800 text-2xl text-[#0f172a] leading-none">
          {streak}
          <span className="text-base font-700 ml-1 text-muted">day streak</span>
        </p>
        {streak === 0 ? (
          <p className="text-xs text-muted font-body mt-0.5">Complete a lesson to start your streak</p>
        ) : (
          <p className="text-xs text-success font-body mt-0.5">Keep it up! Come back tomorrow</p>
        )}
      </div>
    </div>
  )
}
