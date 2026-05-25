export function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const base =
    'inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-card font-heading font-700 text-base transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95'

  const variants = {
    primary:
      'bg-primary text-white shadow-card hover:bg-blue-700 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-primary-light text-primary hover:bg-blue-100 focus-visible:ring-primary',
    ghost:
      'bg-transparent text-muted hover:bg-gray-100 focus-visible:ring-gray-400',
    accent:
      'bg-accent text-white shadow-card hover:bg-amber-500 focus-visible:ring-accent',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
