const day9 = {
  id: 'module1_day9',
  moduleId: 'module1',
  dayNumber: 9,
  title: 'How do investors make money?',

  story: {
    paragraphs: [
      "Jamie shows Alex a dividend payment notification on their phone. \"£12.40 just landed in my account,\" Jamie grins.",
      "\"From what?\" Alex asks. \"From owning shares in a company. They share some of their profits with investors. It's called a dividend.\" Alex is impressed — money appearing without doing anything?",
    ],
  },

  concept: {
    heading: 'Two ways investors make money',
    body: 'Investors make money in two main ways. Capital gains: buying something for less and selling it for more later. Example: buy a share at £10, sell it later for £14 — you made £4. Dividends: some companies share a portion of their profits with shareholders regularly. Example: own 10 shares paying £0.50 per share per year = £5 per year just for holding them. Both can work together: a share can grow in value AND pay dividends.',
    jargonTerm: 'Dividend yield',
    jargonDefinition: 'The percentage of a share\'s price paid out as dividend per year. A 3% yield on a £100 share = £3/year.',
  },

  scenario: {
    prompt: "Alex prefers the idea of:",
    options: [
      { id: 'A', label: 'Buying shares that grow a lot in value over time (capital gains focus)', tone: 'growth' },
      { id: 'B', label: 'Buying shares that pay regular dividends (steady income focus)', tone: 'income' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is a "capital gain"?',
      options: [
        'A type of government tax on investments',
        'Money received from dividends',
        'Profit made from selling an investment for more than you paid',
        'The interest earned in a savings account',
      ],
      correctIndex: 2,
      explanation: 'A capital gain is the profit from selling something for more than you paid — buy low, sell high.',
    },
    {
      id: 'q2',
      question: 'What is a dividend?',
      options: [
        'A fee paid to your broker',
        'A type of bond issued by governments',
        'The original price you paid for a share',
        'A portion of a company\'s profits paid to shareholders',
      ],
      correctIndex: 3,
      explanation: 'Companies that are profitable sometimes pay a share of those profits directly to investors — this is a dividend.',
    },
    {
      id: 'q3',
      question: 'Can an investor make money from BOTH capital gains and dividends on the same share?',
      options: [
        'No — you can only benefit from one or the other',
        'Only if you hold the share for more than 10 years',
        'Only if the company is listed on the NYSE',
        'Yes — a share can grow in value and also pay dividends',
      ],
      correctIndex: 3,
      explanation: 'Many great investments do both — the share price rises over time AND the company pays regular dividends.',
    },
  ],
}

export default day9
