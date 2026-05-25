const day6 = {
  id: 'module1_day6',
  moduleId: 'module1',
  dayNumber: 6,
  title: 'Stocks vs. funds: which is better for beginners?',

  story: {
    paragraphs: [
      "Alex asks Jamie, \"Should I pick individual stocks or buy a fund?\" Jamie pauses.",
      "\"Honestly? For a beginner, funds are usually smarter. Picking stocks is exciting, but unless you do a lot of research, you're basically guessing. A fund gives you a slice of everything.\"",
    ],
  },

  concept: {
    heading: 'Stocks vs. funds for beginners',
    body: 'Individual stocks mean you pick one company. If it does well, great — if it doesn\'t, your money suffers. Index funds are a type of fund that tracks a whole market index, like the top 100 UK companies. You own a tiny slice of all of them. They\'re cheaper (low fees), automatically diversified, and historically reliable over the long term. Many professional investors recommend index funds for most people — including Warren Buffett.',
    jargonTerm: 'Index fund',
    jargonDefinition: 'A fund that copies the performance of a market index (like the FTSE 100). No guessing required.',
  },

  scenario: {
    prompt: "With £500, what would Alex do?",
    options: [
      { id: 'A', label: 'Pick one exciting tech company stock and hope for the best.', tone: 'speculative' },
      { id: 'B', label: 'Put it into a low-cost index fund and let it grow steadily.', tone: 'steady' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is an index fund?',
      options: [
        'A fund managed by the smartest investors in the world',
        'A fund that only invests in new companies',
        'A fund that tracks and copies the performance of a market index',
        'A fund that guarantees returns',
      ],
      correctIndex: 2,
      explanation: 'An index fund simply mirrors a market index — you automatically own a tiny piece of every company in that index.',
    },
    {
      id: 'q2',
      question: 'Why might an index fund be better for a beginner than picking individual stocks?',
      options: [
        'Index funds always make more money than stocks',
        'You need less money to start an index fund',
        'Index funds are automatically diversified and require less research',
        'Index funds are government-guaranteed',
      ],
      correctIndex: 2,
      explanation: 'Index funds spread your money automatically across many companies, removing the need to pick winners and losers.',
    },
    {
      id: 'q3',
      question: 'Who has famously recommended index funds for most investors?',
      options: [
        'Elon Musk',
        'Bill Gates',
        'The UK government',
        'Warren Buffett',
      ],
      correctIndex: 3,
      explanation: 'Warren Buffett, one of the world\'s greatest investors, has repeatedly said most people are better off in low-cost index funds.',
    },
  ],
}

export default day6
