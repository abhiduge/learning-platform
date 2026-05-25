const day8 = {
  id: 'module1_day8',
  moduleId: 'module1',
  dayNumber: 8,
  title: 'What are the risks of investing?',

  story: {
    paragraphs: [
      "\"Not everything goes up,\" Jamie warns Alex. \"I lost money on a company once. Everyone was saying it was the next big thing. Then the CEO got caught lying. Stock crashed. I lost £200.\"",
      "Alex looks worried. \"So you can actually lose money?\" \"Yes,\" Jamie says. \"That's why you never invest money you can't afford to lose.\"",
    ],
  },

  concept: {
    heading: 'The risks of investing',
    body: 'Investing always carries risk. Market risk: the whole market goes down (like during COVID-19 in 2020). Company risk: one company does badly while others are fine. Liquidity risk: you can\'t easily get your money out when you need it. Golden rules to reduce risk: only invest money you won\'t need for at least 3–5 years; diversify (don\'t put everything in one place); don\'t panic-sell when prices drop temporarily; do your research or use a fund.',
    jargonTerm: 'Market crash',
    jargonDefinition: 'A sudden, big drop in investment values across the market. They happen, and they recover — eventually.',
  },

  scenario: {
    prompt: "Alex's friend says a new app is going to \"10x\" in value. Should Alex invest?",
    options: [
      { id: 'A', label: '"No — I don\'t know enough about it, and I can\'t afford to lose that money."', tone: 'disciplined' },
      { id: 'B', label: '"I\'ll invest a tiny amount just for experience, but nothing I can\'t afford to lose."', tone: 'experimental' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is "market risk"?',
      options: [
        'The risk that your broker\'s app crashes',
        'The risk of choosing the wrong investment platform',
        'The risk that the whole market falls in value at once',
        'The risk that a single company goes bankrupt',
      ],
      correctIndex: 2,
      explanation: 'Market risk affects all investments simultaneously — like during a financial crisis when almost everything falls together.',
    },
    {
      id: 'q2',
      question: 'Which of these is a golden rule for managing investment risk?',
      options: [
        'Only invest in companies you\'ve heard of on social media',
        'Sell immediately when prices start to fall',
        'Put all your money in one very safe investment',
        'Only invest money you won\'t need for at least 3–5 years',
      ],
      correctIndex: 3,
      explanation: 'Only investing money you won\'t need for years gives your investment time to recover from any short-term drops.',
    },
    {
      id: 'q3',
      question: 'What should you NOT do when investment prices drop temporarily?',
      options: [
        'Keep your investment and wait',
        'Research why prices dropped',
        'Panic-sell all your investments immediately',
        'Review your diversification',
      ],
      correctIndex: 2,
      explanation: 'Panic-selling locks in your losses. Most market drops are temporary — patient investors who hold on typically recover.',
    },
  ],
}

export default day8
