import { XPCounter } from '../ui/XPCounter'

export function ModuleProgress({ totalXp, completedDays }) {
  return (
    <div className="bg-surface rounded-card shadow-card p-5 flex flex-col gap-4">
      <XPCounter totalXp={totalXp} />
      <div className="flex items-center justify-between text-sm">
        <span className="font-body text-muted">Module 1 progress</span>
        <span className="font-heading font-700 text-primary">{completedDays}/10 days</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-700"
          style={{ width: `${(completedDays / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}
