const day2 = {
  id: 'module1_day2',
  moduleId: 'module1',
  dayNumber: 2,
  title: 'What can you invest in?',

  story: {
    paragraphs: [
      "Alex googled \"investing\" and now has 47 tabs open. Stocks? Bonds? Funds? Gold? Alex texts Jamie: \"This is overwhelming.\"",
      "Jamie replies: \"Come over Saturday, I'll explain the basics.\" Alex feels better. One step at a time.",
    ],
  },

  concept: {
    heading: 'What can you invest in?',
    body: 'You can invest in many things. The most common ones are: Stocks (shares) — you buy a tiny piece of a company. If the company does well, your piece grows in value. Bonds — you lend money to a company or government. They pay you back with interest. Funds — a bundle of many stocks and bonds together, good for beginners because the risk is spread out. Property — buying buildings or land that can grow in value or earn rent.',
    jargonTerm: 'Diversification',
    jargonDefinition: 'Spreading your money across different investments so one bad one doesn\'t ruin everything.',
  },

  scenario: {
    prompt: "Jamie asks Alex: \"If you could invest in one thing you know really well, what would it be?\"",
    options: [
      { id: 'A', label: '"A company I actually use and believe in."', tone: 'focused' },
      { id: 'B', label: '"A mixture — I don\'t want all my eggs in one basket."', tone: 'cautious' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What does it mean to buy a "stock"?',
      options: [
        'Buying products from a store',
        'Buying ingredients for cooking',
        'Buying a small ownership piece of a company',
        'Putting money in a savings account',
      ],
      correctIndex: 2,
      explanation: 'A stock represents a small ownership share of a company — when the company does well, your share grows in value.',
    },
    {
      id: 'q2',
      question: 'What is a "fund"?',
      options: [
        'Money raised for charity',
        'A collection of many investments bundled together',
        'A type of bank account',
        'A loan from the government',
      ],
      correctIndex: 1,
      explanation: 'A fund pools together many investments — spreading the risk and making it easier for beginners to get started.',
    },
    {
      id: 'q3',
      question: 'What does "diversification" mean?',
      options: [
        'Investing in only one very safe thing',
        'Avoiding risky investments entirely',
        'Spreading investments to reduce risk',
        'Changing your investment every day',
      ],
      correctIndex: 2,
      explanation: 'Diversification means spreading your money so that if one investment drops, the others can cushion the blow.',
    },
  ],
}

export default day2
