import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Home' },
  { to: '/module-map', icon: '🗺️', label: 'Module' },
]

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface border-t border-border z-50">
      <div className="flex">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 min-h-[56px] transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs font-heading font-700">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
