import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const SYSTEM_PROMPT = `You are a friendly tutor helping a 13–16 year old learn about investing. Give a single helpful hint in 2–3 sentences maximum. Use simple, encouraging language. Never just give the answer — guide them to think it through. No jargon without explanation. Always be positive.`

const HINT_DAILY_LIMIT = 10

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, wrongAnswers, concept, lessonDay, teenId, accessToken } = req.body ?? {}

  if (!question || !wrongAnswers || !concept || !lessonDay) {
    return res.status(400).json({ error: 'Missing required fields: question, wrongAnswers, concept, lessonDay' })
  }

  // Rate limiting via Supabase (authenticated as the teen)
  if (teenId && accessToken) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY,
        { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
      )

      const today = new Date().toISOString().slice(0, 10)
      const { data: usage } = await supabase
        .from('hint_usage')
        .select('count')
        .eq('teen_id', teenId)
        .eq('usage_date', today)
        .single()

      if (usage && usage.count >= HINT_DAILY_LIMIT) {
        return res.status(429).json({ error: 'Daily hint limit reached. Come back tomorrow!' })
      }

      // Upsert usage count
      await supabase.from('hint_usage').upsert(
        { teen_id: teenId, usage_date: today, count: (usage?.count ?? 0) + 1 },
        { onConflict: 'teen_id,usage_date' }
      )
    } catch {
      // Rate limiting failure is non-fatal — still serve the hint
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'AI hints are not configured on this server.' })
  }

  const anthropic = new Anthropic({ apiKey })

  const userMessage = `A student is learning about investing (Day ${lessonDay}: ${concept}).

Quiz question: "${question}"

They answered incorrectly. Their wrong answer(s): ${wrongAnswers.join(', ')}

Give them a gentle hint to guide their thinking — do NOT reveal the answer.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const hint = message.content[0]?.text ?? ''
    return res.status(200).json({ hint })
  } catch (err) {
    console.error('Claude API error:', err.message)
    return res.status(502).json({ error: 'Could not generate hint. Please try again.' })
  }
}
