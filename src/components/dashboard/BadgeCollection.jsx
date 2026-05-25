import { BADGE_DEFS } from '../../lib/badges'
import { Badge } from '../ui/Badge'

export function BadgeCollection({ earnedBadgeIds }) {
  return (
    <div className="bg-surface rounded-card shadow-card p-5">
      <h3 className="font-heading font-700 text-base text-[#0f172a] mb-4">Badges</h3>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {BADGE_DEFS.map((def) => (
          <Badge
            key={def.id}
            badgeId={def.id}
            earned={earnedBadgeIds.includes(def.id)}
          />
        ))}
      </div>
    </div>
  )
}
