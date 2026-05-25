# InvestQuest — Product Specification
## Gamified Microlearning App for Teens · Module 1: Basics of Investing

**Version:** 1.0  
**Build target:** MVP (Module 1 only)  
**Audience:** Early teens (12–16) + linked parent account

---

## 1. Product Vision

InvestQuest is a story-driven, gamified microlearning web app that teaches teens financial literacy through daily 5–7 minute sessions. The teen plays as **Alex**, a 15-year-old with £500 in birthday money, navigating real-world financial decisions. Each daily session advances the story while teaching one focused concept.

**Core loop:**
> Open app → Read today's story beat → Learn the concept → Make a scenario choice → Pass a 3-question quiz → Earn XP + see reward → Close app (come back tomorrow)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite | Component-based, fast HMR |
| Styling | Tailwind CSS v3 | Utility-first, responsive |
| Backend / DB | Supabase | Auth, Postgres, Realtime |
| AI hints | Anthropic Claude API (`claude-sonnet-4-6`) | Personalised hints on wrong answers |
| Email | Resend | Weekly parent summary |
| Hosting | Vercel | Auto-deploys from GitHub |
| State | Zustand | Lightweight global state |
| Routing | React Router v6 | SPA routing |

---

## 3. Project File Structure

```
investquest/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── XPCounter.jsx
│   │   │   └── Tooltip.jsx        # Plain-English jargon tooltips
│   │   ├── lesson/                # Lesson flow screens
│   │   │   ├── StoryIntro.jsx
│   │   │   ├── ConceptCard.jsx
│   │   │   ├── ScenarioChoice.jsx
│   │   │   ├── QuizQuestion.jsx
│   │   │   ├── QuizHint.jsx       # AI-generated hint (wrong answer)
│   │   │   └── XPReward.jsx
│   │   ├── dashboard/             # Teen home screen
│   │   │   ├── StreakDisplay.jsx
│   │   │   ├── ModuleProgress.jsx
│   │   │   ├── BadgeCollection.jsx
│   │   │   └── ActivityHeatmap.jsx
│   │   ├── parent/                # Parent dashboard
│   │   │   ├── ParentDashboard.jsx
│   │   │   ├── ProgressReport.jsx
│   │   │   └── MilestoneNotice.jsx
│   │   └── layout/
│   │       ├── AppShell.jsx
│   │       ├── NavBar.jsx
│   │       └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Landing.jsx            # Marketing/signup page
│   │   ├── Login.jsx
│   │   ├── Register.jsx           # Teen + parent registration flow
│   │   ├── TeenDashboard.jsx
│   │   ├── DailyLesson.jsx        # Lesson flow orchestrator
│   │   ├── ModuleMap.jsx          # All 10 days overview
│   │   ├── ParentDashboard.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useLesson.js           # Lesson state machine
│   │   ├── useProgress.js         # XP, streaks, badges
│   │   ├── useAIHint.js           # Claude API hint fetcher
│   │   └── useAuth.js             # Supabase auth wrapper
│   ├── lib/
│   │   ├── supabase.js            # Supabase client
│   │   ├── anthropic.js           # Claude API client (server-side only)
│   │   └── xpSystem.js            # XP calculation logic
│   ├── content/
│   │   └── module1/
│   │       ├── index.js           # Module metadata
│   │       └── days/
│   │           ├── day1.js
│   │           ├── day2.js
│   │           ├── day3.js
│   │           ├── day4.js
│   │           ├── day5.js
│   │           ├── day6.js
│   │           ├── day7.js
│   │           ├── day8.js
│   │           ├── day9.js
│   │           └── day10.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── progressStore.js
│   ├── api/                       # Serverless functions (Vercel)
│   │   ├── hint.js                # POST /api/hint — calls Claude API
│   │   └── send-parent-email.js   # POST /api/send-parent-email
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── schema.sql                 # Full DB schema
├── .env.example
├── CLAUDE.md
├── spec.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 4. Database Schema (Supabase / PostgreSQL)

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('teen', 'parent')) NOT NULL,
  display_name TEXT NOT NULL,
  avatar_id TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent-teen link
CREATE TABLE parent_child (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, teen_id)
);

-- Module progress per teen
CREATE TABLE progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,           -- e.g. 'module1'
  day_number INT NOT NULL,           -- 1–10
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_score INT NOT NULL,           -- 0–3
  xp_earned INT NOT NULL,
  scenario_choice TEXT,              -- which option they picked
  UNIQUE(teen_id, module_id, day_number)
);

-- XP and levels
CREATE TABLE teen_stats (
  teen_id UUID REFERENCES profiles(id) PRIMARY KEY,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges earned
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teen_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,            -- e.g. 'first_lesson', 'module1_complete'
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(teen_id, badge_id)
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teen_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child ENABLE ROW LEVEL SECURITY;

-- Teens can only read/write their own data
CREATE POLICY "teen_own_progress" ON progress
  FOR ALL USING (auth.uid() = teen_id);

CREATE POLICY "teen_own_stats" ON teen_stats
  FOR ALL USING (auth.uid() = teen_id);

CREATE POLICY "teen_own_badges" ON badges
  FOR ALL USING (auth.uid() = teen_id);

-- Parents can read their linked teen's data
CREATE POLICY "parent_read_progress" ON progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child
      WHERE parent_id = auth.uid() AND teen_id = progress.teen_id
    )
  );

CREATE POLICY "parent_read_stats" ON teen_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM parent_child
      WHERE parent_id = auth.uid() AND teen_id = teen_stats.teen_id
    )
  );
```

---

## 5. Authentication & User Flows

### 5.1 Registration flow
1. Landing page → "Get Started" CTA
2. Choose role screen: **"I'm a teen"** or **"I'm a parent"**
3. Teen registration: display name, email, password, age confirmation (must be 13+)
4. After teen registers → "Invite your parent" screen with unique 6-digit link code
5. Parent registration: email, password → enters teen's link code → accounts linked
6. Parent can also register independently and link later

### 5.2 Login
- Single login page, role detected from `profiles.role`
- Redirect: teen → `/dashboard`, parent → `/parent`
- "Remember me" checkbox (30-day session)

### 5.3 Protected routes
- `/dashboard`, `/lesson/*`, `/module-map` → teen only
- `/parent` → parent only
- All others → redirect to `/login`

---

## 6. XP & Gamification System

### 6.1 XP values
| Action | XP earned |
|--------|-----------|
| Complete daily lesson | +30 XP |
| Perfect quiz score (3/3) | +20 XP bonus |
| 2/3 quiz score | +10 XP bonus |
| 7-day streak | +50 XP bonus |
| Complete Module 1 | +100 XP bonus |
| First ever lesson | +25 XP bonus (one-time) |

### 6.2 Level thresholds
| Level | Name | XP required |
|-------|------|-------------|
| 1 | Curious Saver | 0 |
| 2 | Budget Builder | 150 |
| 3 | Smart Spender | 350 |
| 4 | Investment Rookie | 650 |
| 5 | Market Explorer | 1,000 |

### 6.3 Streak system
- Streak increments when teen completes at least one lesson per calendar day
- Streak resets to 0 if a full calendar day passes with no activity
- `last_active_date` checked on login — update streak accordingly
- Streak freeze: awarded at level 3 (one use, earned perk)

### 6.4 Badges
| Badge ID | Name | Trigger |
|----------|------|---------|
| `first_lesson` | First Step | Complete Day 1 |
| `perfect_quiz` | Quiz Ace | Score 3/3 on any quiz |
| `streak_7` | Week Warrior | 7-day streak |
| `streak_14` | Fortnight Fighter | 14-day streak |
| `module1_complete` | Investing Initiate | Complete all 10 days |
| `comeback_kid` | Comeback Kid | Return after 3+ days away |

---

## 7. Lesson Flow (State Machine)

Each daily lesson has exactly 5 steps. The `useLesson` hook manages step transitions.

```
IDLE → STORY → CONCEPT → SCENARIO → QUIZ → REWARD → COMPLETE
```

### Step timings & layout
| Step | Max duration | Screen type |
|------|-------------|-------------|
| Story intro | 60s read time | Narrative card with character avatar |
| Concept card | 90s read time | Illustrated concept with jargon tooltip |
| Scenario choice | 60s | Two-option choice card, no wrong answer |
| Quiz (×3 questions) | 60s per Q | MCQ, 4 options, instant feedback |
| XP reward | — | Animated XP counter, badge if earned |

### Quiz hint logic
- First wrong answer: show "Try again" with the question still active
- Second wrong answer: call `POST /api/hint` with question + wrong answers → display AI hint
- Third wrong answer: reveal correct answer with explanation
- Score counts only first-attempt correct answers

---

## 8. AI Hint API (`/api/hint`)

**File:** `src/api/hint.js` (Vercel serverless function)

```javascript
// POST /api/hint
// Body: { question, wrongAnswers, concept, lessonDay }
// Returns: { hint: string }

// System prompt to use:
const SYSTEM_PROMPT = `You are a friendly tutor helping a 13–16 year old 
learn about investing. Give a single helpful hint in 2–3 sentences maximum. 
Use simple, encouraging language. Never just give the answer — guide them 
to think it through. No jargon without explanation. Always be positive.`;
```

**Security rules:**
- Validate request body before calling API
- Rate limit: max 10 hints per teen per day (store count in Supabase)
- Never expose the ANTHROPIC_API_KEY to the frontend
- Always call from server-side only

---

## 9. Module 1 Content: Basics of Investing

### Story premise
Alex is 15 and just received £500 in birthday money. Over 10 days, Alex learns what to do with it — save it, spend it, or invest it — by making real decisions and seeing the outcomes unfold.

---

### Day 1 — What is investing?

**Story intro:**
> Alex is sitting at the kitchen table staring at five crisp £100 notes. Gran said "don't spend it all at once." Mum said "put it in the bank." Alex's older cousin Jamie said "invest it." Alex has no idea what that means — but it sounds interesting.

**Concept:**
> **Investing** means putting your money to work so it can grow over time. Instead of your money sitting still (like in a piggy bank), you use it to buy something — like a small piece of a company — that you believe will become more valuable. You make money when that thing grows in value or pays you a share of its profits.
>
> **Jargon tooltip:** *"Return"* = the money you get back from an investment on top of what you put in.

**Scenario choice:**
> Alex finds out the local bakery is looking for investors. Jamie explains it simply. What does Alex decide first?
> - **Option A:** "I want to understand more before I do anything with my money." *(→ smart, cautious)*
> - **Option B:** "This sounds exciting — let's see where to start!" *(→ enthusiastic, needs guidance)*

**Quiz questions:**
1. What does investing mean?
   - a) Spending money on things you enjoy
   - b) **Putting money to work so it can grow** ✓
   - c) Keeping money safe in a box
   - d) Lending money to friends
   
2. Why might someone invest instead of just saving?
   - a) Investing is always safer than saving
   - b) Investing guarantees you'll get rich
   - c) **Investing can grow your money faster than keeping it in a bank** ✓
   - d) Investing means you never lose money

3. What is a "return" on an investment?
   - a) Giving money back to someone
   - b) Returning to a shop with a receipt
   - c) The original amount you invested
   - d) **The money you earn on top of what you put in** ✓

---

### Day 2 — What can you invest in?

**Story intro:**
> Alex googled "investing" and now has 47 tabs open. Stocks? Bonds? Funds? Gold? Alex texts Jamie: "This is overwhelming." Jamie replies: "Come over Saturday, I'll explain the basics." Alex feels better. One step at a time.

**Concept:**
> You can invest in many things. The most common ones are:
> - **Stocks (shares):** You buy a tiny piece of a company. If the company does well, your piece grows in value.
> - **Bonds:** You lend money to a company or government. They pay you back with interest.
> - **Funds:** A bundle of many stocks and bonds together — good for beginners because the risk is spread out.
> - **Property:** Buying buildings or land that can grow in value or earn rent.
>
> **Jargon tooltip:** *"Diversification"* = spreading your money across different investments so one bad one doesn't ruin everything.

**Scenario choice:**
> Jamie asks Alex: "If you could invest in one thing you know really well, what would it be?"
> - **Option A:** "A company I actually use and believe in."
> - **Option B:** "A mixture — I don't want all my eggs in one basket."

**Quiz questions:**
1. What does it mean to buy a "stock"?
   - a) Buying products from a store
   - b) Buying ingredients for cooking
   - c) **Buying a small ownership piece of a company** ✓
   - d) Putting money in a savings account

2. What is a "fund"?
   - a) Money raised for charity
   - b) **A collection of many investments bundled together** ✓
   - c) A type of bank account
   - d) A loan from the government

3. What does "diversification" mean?
   - a) Investing in only one very safe thing
   - b) Avoiding risky investments entirely
   - c) **Spreading investments to reduce risk** ✓
   - d) Changing your investment every day

---

### Day 3 — Risk and reward

**Story intro:**
> At Jamie's place, Alex sees a chart on the wall: a squiggly line going up and down, but overall trending upward over 20 years. "That's the stock market," Jamie says. "It goes up. It goes down. But over a long time? It's gone up more than almost anything else." Alex stares at the squiggly line.

**Concept:**
> Every investment has **risk** — the chance you might lose some money. But risk comes with potential **reward** — the possibility of earning more. Higher risk usually means higher potential reward, and lower risk usually means lower potential reward.
>
> - **Low risk, low reward:** Money in a savings account — safe, but grows slowly
> - **Medium risk, medium reward:** Bonds
> - **Higher risk, higher reward:** Stocks — can go up a lot, but also down
>
> **Jargon tooltip:** *"Volatility"* = how much an investment's value goes up and down. A volatile investment is like a rollercoaster.

**Scenario choice:**
> Alex has £500. Jamie asks: "How would you feel if your investment dropped to £400 next month, but you knew it might be worth £700 in 5 years?"
> - **Option A:** "I'd be stressed — I don't like seeing money go down."
> - **Option B:** "I could handle it — I'm thinking long term."

**Quiz questions:**
1. What is "risk" in investing?
   - a) The fees you pay to invest
   - b) **The chance that your investment could lose value** ✓
   - c) The time it takes to invest
   - d) The amount of money you invest

2. Which generally has higher risk AND higher potential reward?
   - a) A savings account
   - b) Government bonds
   - c) **Stocks in a growing company** ✓
   - d) Keeping cash under your mattress

3. What does "volatility" mean?
   - a) An investment that only goes up
   - b) A very safe, stable investment
   - c) **How much an investment's value goes up and down** ✓
   - d) The minimum amount you need to invest

---

### Day 4 — How the stock market works

**Story intro:**
> "So how do you actually buy a stock?" Alex asks. Jamie pulls out a phone. "Through an app — a broker. Companies list themselves on a 'stock exchange,' and millions of people buy and sell pieces of them every day. The price moves up when more people want to buy, and down when more people want to sell."

**Concept:**
> A **stock market** (or stock exchange) is a place — now mostly digital — where people buy and sell pieces of companies. Famous ones include:
> - **London Stock Exchange (LSE)** — UK
> - **New York Stock Exchange (NYSE)** — USA
> - **NASDAQ** — USA, lots of tech companies
>
> To buy stocks, you use a **broker** — an app or service that connects you to the market. You don't need to be rich; some platforms let you start with just £1.
>
> **Jargon tooltip:** *"Broker"* = a service that lets you buy and sell investments. Modern ones are apps on your phone.

**Scenario choice:**
> Alex discovers some investment apps require a parent's permission for under-18s. How does Alex respond?
> - **Option A:** "That makes sense — I'll ask Mum to help set it up."
> - **Option B:** "Annoying, but I'll use the time to keep learning first."

**Quiz questions:**
1. What is a stock exchange?
   - a) A shop where you buy shares in person
   - b) A place to swap one type of money for another
   - c) **A market where people buy and sell pieces of companies** ✓
   - d) A government bank

2. What makes a stock's price go up?
   - a) The company decides to raise the price
   - b) The government sets the price each day
   - c) **More people wanting to buy it than sell it** ✓
   - d) The stock exchange adds extra value daily

3. What is a "broker"?
   - a) Something that breaks when it stops working
   - b) A bank that lends money to companies
   - c) A government body that regulates markets
   - d) **A service that lets you buy and sell investments** ✓

---

### Day 5 — What is a portfolio?

**Story intro:**
> Jamie shows Alex a spreadsheet. "This is my portfolio," Jamie says. "All the different things I've invested in, in one place." Alex sees companies, funds, and even a bit of gold. "Why so many different things?" Alex asks. "Because I'm not betting everything on one horse," Jamie says with a grin.

**Concept:**
> A **portfolio** is your complete collection of investments. Just like a sports team needs different players with different strengths, a good portfolio has different types of investments.
>
> A well-balanced portfolio might include:
> - Some stocks (for growth)
> - Some bonds (for stability)
> - Some cash or savings (for safety)
>
> **Rebalancing** means occasionally adjusting your portfolio to keep the right mix as things change in value.
>
> **Jargon tooltip:** *"Asset allocation"* = deciding how to split your money between different types of investments.

**Scenario choice:**
> If Alex invested £500, which split sounds right for a teen with a long time horizon?
> - **Option A:** £400 in a stock fund, £100 in savings (more growth, more risk)
> - **Option B:** £250 in stocks, £150 in bonds, £100 in savings (balanced)

**Quiz questions:**
1. What is an investment portfolio?
   - a) A folder of your bank statements
   - b) The app you use to invest
   - c) **All your different investments collected together** ✓
   - d) A type of savings account

2. Why is it good to have different types of investments in your portfolio?
   - a) It makes your portfolio look more impressive
   - b) **It spreads risk so one bad investment doesn't hurt you badly** ✓
   - c) You earn more fees by having more investments
   - d) The government requires you to have at least three

3. What does "rebalancing" a portfolio mean?
   - a) Moving all your money into one strong investment
   - b) Starting fresh with a completely new portfolio
   - c) **Adjusting your investment mix to keep the right balance** ✓
   - d) Withdrawing half your portfolio each year

---

### Day 6 — Stocks vs. funds: which is better for beginners?

**Story intro:**
> Alex asks Jamie, "Should I pick individual stocks or buy a fund?" Jamie pauses. "Honestly? For a beginner, funds are usually smarter. Picking stocks is exciting, but unless you do a lot of research, you're basically guessing. A fund gives you a slice of everything."

**Concept:**
> **Individual stocks** mean you pick one company. If it does well, great — if it doesn't, your money suffers.
>
> **Index funds** are a type of fund that tracks a whole market index, like the top 100 UK companies. You own a tiny slice of all of them. They're:
> - Cheaper (low fees)
> - Automatically diversified
> - Historically reliable over the long term
>
> Many professional investors recommend index funds for most people — including Warren Buffett.
>
> **Jargon tooltip:** *"Index fund"* = a fund that copies the performance of a market index (like the FTSE 100). No guessing required.

**Scenario choice:**
> With £500, what would Alex do?
> - **Option A:** Pick one exciting tech company stock and hope for the best.
> - **Option B:** Put it into a low-cost index fund and let it grow steadily.

**Quiz questions:**
1. What is an index fund?
   - a) A fund managed by the smartest investors in the world
   - b) A fund that only invests in new companies
   - c) **A fund that tracks and copies the performance of a market index** ✓
   - d) A fund that guarantees returns

2. Why might an index fund be better for a beginner than picking individual stocks?
   - a) Index funds always make more money than stocks
   - b) You need less money to start an index fund
   - c) **Index funds are automatically diversified and require less research** ✓
   - d) Index funds are government-guaranteed

3. Who has famously recommended index funds for most investors?
   - a) Elon Musk
   - b) Bill Gates
   - c) The UK government
   - d) **Warren Buffett** ✓

---

### Day 7 — When should you start investing?

**Story intro:**
> Alex asks Mum: "When did you start investing?" Mum sighs. "Late thirties. I wish I'd started when I was your age." She pulls out a calculator. "Let me show you something about time and money that'll blow your mind."

**Concept:**
> The best time to start investing is **as early as possible** — because of something called compound interest (we'll cover that in the next module). But here's the idea: money invested early has more time to grow.
>
> **Example:** £100 invested at age 15 at 7% average annual growth → worth about **£1,500 by age 55**.
> The same £100 invested at age 30 → worth about **£540 by age 55**.
>
> Starting early isn't about having lots of money. It's about giving your money time.
>
> **Jargon tooltip:** *"Time horizon"* = how long you plan to keep your money invested. Longer = generally better for growth.

**Scenario choice:**
> Alex now understands why starting early matters. What's Alex's reaction?
> - **Option A:** "I want to invest some of my £500 now, even if it's a small amount."
> - **Option B:** "I'll wait until I have a job and more money."

**Quiz questions:**
1. Why does starting to invest early matter so much?
   - a) Younger people pay lower fees
   - b) The government gives bonuses for young investors
   - c) **Money invested early has more time to grow through compounding** ✓
   - d) Early investors get better stock choices

2. In the example, how much more did the £100 invested at 15 grow compared to investing at 30?
   - a) About the same
   - b) About 2x more
   - c) **About 3x more** ✓
   - d) About 10x more

3. What is a "time horizon" in investing?
   - a) The time you wait before selling an investment
   - b) The maximum number of years you're allowed to invest
   - c) **How long you plan to keep your money invested** ✓
   - d) When the stock market opens and closes each day

---

### Day 8 — What are the risks of investing?

**Story intro:**
> "Not everything goes up," Jamie warns Alex. "I lost money on a company once. Everyone was saying it was the next big thing. Then the CEO got caught lying. Stock crashed. I lost £200." Alex looks worried. "So you can actually lose money?" "Yes," Jamie says. "That's why you never invest money you can't afford to lose."

**Concept:**
> Investing always carries risk. Here are the main types:
>
> - **Market risk:** The whole market goes down (like during COVID-19 in 2020)
> - **Company risk:** One company does badly while others are fine
> - **Liquidity risk:** You can't easily get your money out when you need it
>
> **Golden rules to reduce risk:**
> 1. Only invest money you won't need for at least 3–5 years
> 2. Diversify (don't put everything in one place)
> 3. Don't panic-sell when prices drop temporarily
> 4. Do your research or use a fund
>
> **Jargon tooltip:** *"Market crash"* = a sudden, big drop in investment values across the market. They happen, and they recover — eventually.

**Scenario choice:**
> Alex's friend says a new app is going to "10x" in value. Should Alex invest?
> - **Option A:** "No — I don't know enough about it, and I can't afford to lose that money."
> - **Option B:** "I'll invest a tiny amount just for experience, but nothing I can't afford to lose."

**Quiz questions:**
1. What is "market risk"?
   - a) The risk that your broker's app crashes
   - b) The risk of choosing the wrong investment platform
   - c) **The risk that the whole market falls in value at once** ✓
   - d) The risk that a single company goes bankrupt

2. Which of these is a golden rule for managing investment risk?
   - a) Only invest in companies you've heard of on social media
   - b) Sell immediately when prices start to fall
   - c) Put all your money in one very safe investment
   - d) **Only invest money you won't need for at least 3–5 years** ✓

3. What should you NOT do when investment prices drop temporarily?
   - a) Keep your investment and wait
   - b) Research why prices dropped
   - c) **Panic-sell all your investments immediately** ✓
   - d) Review your diversification

---

### Day 9 — How do investors make money?

**Story intro:**
> Jamie shows Alex a dividend payment notification on their phone. "£12.40 just landed in my account," Jamie grins. "From what?" Alex asks. "From owning shares in a company. They share some of their profits with investors. It's called a dividend." Alex is impressed — money appearing without doing anything?

**Concept:**
> Investors make money in two main ways:
>
> **1. Capital gains** — buying something for less and selling it for more later.
> - Example: Buy a share at £10, sell it later for £14. You made £4.
>
> **2. Dividends** — some companies share a portion of their profits with shareholders regularly.
> - Example: Own 10 shares in a company. They pay £0.50 per share per year = £5 per year, just for holding the shares.
>
> Both can work together: a share can grow in value AND pay dividends.
>
> **Jargon tooltip:** *"Dividend yield"* = the percentage of a share's price that gets paid out as dividend per year. A 3% yield on a £100 share = £3/year.

**Scenario choice:**
> Alex prefers the idea of:
> - **Option A:** Buying shares that grow a lot in value over time (capital gains focus)
> - **Option B:** Buying shares that pay regular dividends (steady income focus)

**Quiz questions:**
1. What is a "capital gain"?
   - a) A type of government tax on investments
   - b) Money received from dividends
   - c) **Profit made from selling an investment for more than you paid** ✓
   - d) The interest earned in a savings account

2. What is a dividend?
   - a) A fee paid to your broker
   - b) A type of bond issued by governments
   - c) The original price you paid for a share
   - d) **A portion of a company's profits paid to shareholders** ✓

3. Can an investor make money from BOTH capital gains and dividends on the same share?
   - a) No — you can only benefit from one or the other
   - b) Only if you hold the share for more than 10 years
   - c) Only if the company is listed on the NYSE
   - d) **Yes — a share can grow in value and also pay dividends** ✓

---

### Day 10 — Building your investing mindset

**Story intro:**
> Alex sits at the same kitchen table, looking at the same £500. But now it looks different. Not just money — potential. Alex opens a notebook and writes: "Things I now know about investing." The list fills two pages. Mum looks over Alex's shoulder and smiles. "Your gran would be proud."

**Concept:**
> You've covered the foundations. Here's the mindset that separates successful long-term investors:
>
> ✅ **Think long-term.** Markets go up and down short-term. Zoom out.
> ✅ **Stay curious.** The more you learn, the better your decisions.
> ✅ **Start small.** You don't need £1,000. Start with £1 if that's what you have.
> ✅ **Be patient.** Wealth from investing is built over years, not days.
> ✅ **Don't follow hype.** "Everyone is buying X" is not investment advice.
>
> **Your Module 1 summary:** You now understand what investing is, what you can invest in, how risk and reward work, how markets operate, what a portfolio is, why starting early matters, and how investors make money.

**Scenario choice:**
> Alex decides what to do with the £500:
> - **Option A:** "I'll open a junior ISA with Mum's help and put £250 into an index fund."
> - **Option B:** "I'll keep learning first — maybe the next modules will help me decide."

**Quiz questions:**
1. Which of these is a good long-term investor mindset?
   - a) Check your investment value every hour
   - b) Sell whenever there is any sign of a dip
   - c) Follow social media tips for the best quick wins
   - d) **Be patient, stay diversified, and think in years not days** ✓

2. What is a Junior ISA?
   - a) A savings app for teenagers
   - b) A type of investment risk
   - c) **A tax-free investment account available for under-18s in the UK** ✓
   - d) A government grant for young people

3. What's the most important single lesson from Module 1?
   - a) Always pick individual stocks over funds
   - b) Wait until you're older to start investing
   - c) Only invest in companies you've heard of
   - d) **Start early, diversify, think long-term, and keep learning** ✓

---

## 10. Visual Design System

### Palette
```css
:root {
  --color-primary: #1a56db;       /* Electric blue — actions, CTAs */
  --color-primary-light: #e8f0fe;
  --color-accent: #f59e0b;        /* Amber — XP, streaks, rewards */
  --color-success: #10b981;       /* Green — correct answers, completion */
  --color-danger: #ef4444;        /* Red — wrong answers, warnings */
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
  
  /* Story mode overlay */
  --color-story-bg: #1e1b4b;     /* Deep indigo for story screens */
  --color-story-text: #e0e7ff;
}
```

### Typography
- Headings: `Nunito` (Google Font) — friendly, rounded, approachable for teens
- Body: `Inter` — clean, readable
- XP/numbers: `JetBrains Mono` — techy feel for numbers and scores

### Component style
- Rounded corners everywhere (`border-radius: 16px` for cards)
- Subtle drop shadows (not flat design)
- Animated transitions between lesson steps (slide-in from right)
- Correct answer: green flash + checkmark animation
- Wrong answer: red shake animation
- XP earned: number count-up animation

### Mobile-first
- All layouts must work on 375px width (iPhone SE)
- Touch targets minimum 44px
- Bottom navigation bar on mobile

---

## 11. Environment Variables

```bash
# .env.example
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key   # SERVER SIDE ONLY — never expose to frontend
RESEND_API_KEY=your_resend_api_key
VITE_APP_URL=http://localhost:5173
```

**Critical security rule:** `ANTHROPIC_API_KEY` must NEVER appear in any `VITE_` prefixed variable. It must only be used in `/src/api/` serverless functions.

---

## 12. Build Milestones

### Milestone 1 — Core lesson shell (Week 1–2)
**Goal:** Working Day 1 lesson, no auth required, progress in localStorage.

**Deliverables:**
- [ ] Vite + React + Tailwind project scaffold
- [ ] Supabase project created, schema applied
- [ ] Landing page with "Start Learning" CTA
- [ ] Full Day 1 lesson flow (Story → Concept → Scenario → Quiz × 3 → XP Reward)
- [ ] Lesson step transitions (animated)
- [ ] Quiz with correct/wrong answer feedback
- [ ] XP counter animation on reward screen
- [ ] localStorage progress saving
- [ ] Mobile-responsive layout
- [ ] Jargon tooltip component working

**Test:** A teen can complete Day 1 start-to-finish on mobile with no errors.

---

### Milestone 2 — Accounts + full module (Week 3–4)
**Goal:** Auth, all 10 days, streaks, badges, parent linking.

**Deliverables:**
- [ ] Supabase Auth integration (teen + parent registration)
- [ ] Role-based routing (teen dashboard vs parent dashboard)
- [ ] Parent-child link code system
- [ ] Progress saved to Supabase (replace localStorage)
- [ ] All 10 days of Module 1 content loaded from `/content/module1/`
- [ ] Module map screen (10 day nodes, locked/unlocked states)
- [ ] Streak counter (daily check-in logic)
- [ ] Badge award system (triggered by progress events)
- [ ] Teen dashboard (streak, level, XP bar, badge collection)
- [ ] XP level-up animation

**Test:** Two accounts (teen + parent) created, linked, and Day 1–3 completed. Progress persists across sessions.

---

### Milestone 3 — AI hints + parent dashboard (Week 5–6)
**Goal:** AI-powered hints, parent visibility, email report.

**Deliverables:**
- [ ] `POST /api/hint` serverless function (Claude API)
- [ ] AI hint shown on 2nd wrong quiz attempt
- [ ] Parent dashboard: progress overview, streak, module completion %, quiz accuracy
- [ ] Weekly email template (Resend) — triggered manually first, then scheduled
- [ ] Milestone push notification to parent on badge earned
- [ ] Rate limiting on hint API (10/day per teen)
- [ ] Content preview for parent (can see any lesson)
- [ ] Accessibility pass (WCAG AA minimum)

**Test:** Parent can see teen's full progress. AI hint appears on second wrong answer. Email sends successfully.

---

## 13. Key Constraints & Rules for Claude Code

1. **Never store `ANTHROPIC_API_KEY` in frontend code.** All Claude API calls go through `/src/api/hint.js` (server-side).
2. **Supabase RLS must be enabled on all tables.** No table should be publicly readable/writable.
3. **Quiz answers must not be in the frontend bundle.** Correct answer keys stay in `/content/` files but the validation logic must confirm — do not embed "correct: true" in the component state passed to the DOM.
4. **All lesson content is in `/src/content/module1/days/dayN.js`** — never hardcode lesson text inside components.
5. **Parent can never directly modify teen data** — read-only RLS policies for parents.
6. **Age check:** Teen registration must confirm age ≥ 13 (COPPA/GDPR compliance).
7. **AI hints are always displayed as suggestions, never as definitive answers.** Prefix hint with: "Here's a clue to help you think it through: …"
8. **Mobile-first:** Design for 375px first, then scale up.
9. **No lesson content may be skipped** — Day N+1 only unlocks after Day N is complete.

---

## 14. Suggested Build Order for Claude Code

Start with this command in Plan Mode:

```
Read spec.md thoroughly. Then:
1. Scaffold the Vite + React + Tailwind project
2. Show me the complete file structure you'll create
3. List all npm packages you'll install
4. Wait for my approval before writing any code
```

Then proceed milestone by milestone, one feature at a time, always showing a plan before executing.
