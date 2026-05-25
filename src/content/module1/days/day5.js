const day5 = {
  id: 'module1_day5',
  moduleId: 'module1',
  dayNumber: 5,
  title: 'What is a portfolio?',

  story: {
    paragraphs: [
      "Jamie shows Alex a spreadsheet. \"This is my portfolio,\" Jamie says. \"All the different things I've invested in, in one place.\" Alex sees companies, funds, and even a bit of gold.",
      "\"Why so many different things?\" Alex asks. \"Because I'm not betting everything on one horse,\" Jamie says with a grin.",
    ],
  },

  concept: {
    heading: 'What is a portfolio?',
    body: 'A portfolio is your complete collection of investments. Just like a sports team needs different players with different strengths, a good portfolio has different types of investments. A well-balanced portfolio might include some stocks (for growth), some bonds (for stability), and some cash or savings (for safety). Rebalancing means occasionally adjusting your portfolio to keep the right mix as things change in value.',
    jargonTerm: 'Asset allocation',
    jargonDefinition: 'Deciding how to split your money between different types of investments.',
  },

  scenario: {
    prompt: "If Alex invested £500, which split sounds right for a teen with a long time horizon?",
    options: [
      { id: 'A', label: '£400 in a stock fund, £100 in savings (more growth, more risk)', tone: 'growth-focused' },
      { id: 'B', label: '£250 in stocks, £150 in bonds, £100 in savings (balanced)', tone: 'balanced' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is an investment portfolio?',
      options: [
        'A folder of your bank statements',
        'The app you use to invest',
        'All your different investments collected together',
        'A type of savings account',
      ],
      correctIndex: 2,
      explanation: 'Your portfolio is everything you\'ve invested in — stocks, bonds, funds, and more — all viewed as one collection.',
    },
    {
      id: 'q2',
      question: 'Why is it good to have different types of investments in your portfolio?',
      options: [
        'It makes your portfolio look more impressive',
        'It spreads risk so one bad investment doesn\'t hurt you badly',
        'You earn more fees by having more investments',
        'The government requires you to have at least three',
      ],
      correctIndex: 1,
      explanation: 'Different investments react differently to market events — mixing them reduces the chance that everything drops at once.',
    },
    {
      id: 'q3',
      question: 'What does "rebalancing" a portfolio mean?',
      options: [
        'Moving all your money into one strong investment',
        'Starting fresh with a completely new portfolio',
        'Adjusting your investment mix to keep the right balance',
        'Withdrawing half your portfolio each year',
      ],
      correctIndex: 2,
      explanation: 'As investments grow at different rates, your original balance shifts — rebalancing brings it back to your intended split.',
    },
  ],
}

export default day5
