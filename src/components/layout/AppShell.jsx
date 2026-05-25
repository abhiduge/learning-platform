export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-body">
      <div
        className="w-full max-w-[430px] mx-auto min-h-screen relative overflow-hidden shadow-card-lg"
        role="main"
        aria-label="InvestQuest app"
      >
        {children}
      </div>
    </div>
  )
}
