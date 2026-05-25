import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { parentEmail, teenName, stats, completedDays, badgeNames } = req.body ?? {}

  if (!parentEmail || !teenName) {
    return res.status(400).json({ error: 'Missing required fields: parentEmail, teenName' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'Email service is not configured.' })
  }

  const resend = new Resend(apiKey)

  const streak = stats?.current_streak ?? 0
  const totalXp = stats?.total_xp ?? 0
  const level = stats?.level ?? 1
  const daysCompleted = completedDays ?? 0
  const badges = badgeNames ?? []

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #0f172a; }
    .card { background: #fff; border-radius: 16px; padding: 32px; max-width: 480px; margin: 0 auto; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    h1 { font-family: Nunito, Arial, sans-serif; color: #1a56db; margin: 0 0 8px; font-size: 24px; }
    .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
    .badge { background: #fef3c7; color: #92400e; border-radius: 99px; padding: 4px 12px; font-size: 13px; font-weight: 700; }
    .stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
    .stat:last-child { border-bottom: none; }
    .label { color: #64748b; font-size: 14px; }
    .value { font-weight: 700; font-size: 14px; }
    .footer { margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📈 InvestQuest Progress Report</h1>
    <p style="color:#64748b; margin: 0 0 24px; font-size:14px;">
      Here's how <strong>${teenName}</strong> is doing with their investing lessons.
    </p>

    <div>
      <div class="stat"><span class="label">🔥 Current streak</span><span class="value">${streak} day${streak !== 1 ? 's' : ''}</span></div>
      <div class="stat"><span class="label">📖 Lessons completed</span><span class="value">${daysCompleted} / 10</span></div>
      <div class="stat"><span class="label">⭐ Total XP earned</span><span class="value">${totalXp} XP</span></div>
      <div class="stat"><span class="label">🏅 Level</span><span class="value">Level ${level}</span></div>
    </div>

    ${badges.length > 0 ? `
    <div style="margin-top:20px;">
      <p style="font-weight:700; font-size:14px; margin-bottom:8px;">Badges earned:</p>
      <div class="badge-row">
        ${badges.map((b) => `<span class="badge">${b}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="footer">
      Sent by InvestQuest · You're receiving this because you linked your parent account.
    </div>
  </div>
</body>
</html>`

  const text = `InvestQuest Progress Report for ${teenName}

Current streak: ${streak} day(s)
Lessons completed: ${daysCompleted}/10
Total XP: ${totalXp}
Level: ${level}
${badges.length > 0 ? `Badges earned: ${badges.join(', ')}` : ''}

Sent by InvestQuest`

  try {
    const { error } = await resend.emails.send({
      from: 'InvestQuest <noreply@investquest.app>',
      to: parentEmail,
      subject: `${teenName}'s InvestQuest progress update`,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ error: 'Failed to send email. Please try again.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    return res.status(502).json({ error: 'Failed to send email.' })
  }
}
