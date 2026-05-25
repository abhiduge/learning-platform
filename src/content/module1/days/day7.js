const day7 = {
  id: 'module1_day7',
  moduleId: 'module1',
  dayNumber: 7,
  title: 'When should you start investing?',

  story: {
    paragraphs: [
      "Alex asks Mum: \"When did you start investing?\" Mum sighs. \"Late thirties. I wish I'd started when I was your age.\"",
      "She pulls out a calculator. \"Let me show you something about time and money that'll blow your mind.\"",
    ],
  },

  concept: {
    heading: 'Why starting early matters so much',
    body: 'The best time to start investing is as early as possible — because money invested early has more time to grow. Example: £100 invested at age 15 at 7% average annual growth becomes worth about £1,500 by age 55. The same £100 invested at age 30 becomes worth about £540 by age 55. Starting early isn\'t about having lots of money. It\'s about giving your money time.',
    jargonTerm: 'Time horizon',
    jargonDefinition: 'How long you plan to keep your money invested. Longer generally means better for growth.',
  },

  scenario: {
    prompt: "Alex now understands why starting early matters. What's Alex's reaction?",
    options: [
      { id: 'A', label: '"I want to invest some of my £500 now, even if it\'s a small amount."', tone: 'action-oriented' },
      { id: 'B', label: '"I\'ll wait until I have a job and more money."', tone: 'cautious' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'Why does starting to invest early matter so much?',
      options: [
        'Younger people pay lower fees',
        'The government gives bonuses for young investors',
        'Money invested early has more time to grow through compounding',
        'Early investors get better stock choices',
      ],
      correctIndex: 2,
      explanation: 'The longer your money stays invested, the more time it has to compound — earning returns on top of previous returns.',
    },
    {
      id: 'q2',
      question: 'In the example, how much more did the £100 invested at 15 grow compared to investing at 30?',
      options: [
        'About the same',
        'About 2x more',
        'About 3x more',
        'About 10x more',
      ],
      correctIndex: 2,
      explanation: '£1,500 vs £540 — the early investor ended up with roughly 3x more, purely because of extra time.',
    },
    {
      id: 'q3',
      question: 'What is a "time horizon" in investing?',
      options: [
        'The time you wait before selling an investment',
        'The maximum number of years you\'re allowed to invest',
        'How long you plan to keep your money invested',
        'When the stock market opens and closes each day',
      ],
      correctIndex: 2,
      explanation: 'Your time horizon is how long you intend to leave your money invested — longer horizons allow more risk and more growth.',
    },
  ],
}

export default day7
