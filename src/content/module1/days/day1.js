const day1 = {
  id: 'module1_day1',
  moduleId: 'module1',
  dayNumber: 1,
  title: 'What is investing?',

  story: {
    paragraphs: [
      "Alex is sitting at the kitchen table staring at five crisp £100 notes. Gran said \"don't spend it all at once.\" Mum said \"put it in the bank.\" Alex's older cousin Jamie said \"invest it.\"",
      "Alex has no idea what that means — but it sounds interesting.",
    ],
  },

  concept: {
    heading: 'What does investing mean?',
    body: 'Investing means putting your money to work so it can grow over time. Instead of your money sitting still (like in a piggy bank), you use it to buy something — like a small piece of a company — that you believe will become more valuable. You make money when that thing grows in value or pays you a share of its profits.',
    jargonTerm: 'Return',
    jargonDefinition: 'The money you get back from an investment on top of what you put in.',
  },

  scenario: {
    prompt: "Alex finds out the local bakery is looking for investors. Jamie explains it simply. What does Alex decide first?",
    options: [
      {
        id: 'A',
        label: '"I want to understand more before I do anything with my money."',
        tone: 'smart, cautious',
      },
      {
        id: 'B',
        label: '"This sounds exciting — let\'s see where to start!"',
        tone: 'enthusiastic, needs guidance',
      },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What does investing mean?',
      options: [
        'Spending money on things you enjoy',
        'Putting money to work so it can grow',
        'Keeping money safe in a box',
        'Lending money to friends',
      ],
      correctIndex: 1,
      explanation: 'Investing means using your money to buy something you believe will grow in value — putting it to work rather than keeping it idle.',
    },
    {
      id: 'q2',
      question: 'Why might someone invest instead of just saving?',
      options: [
        'Investing is always safer than saving',
        'Investing guarantees you\'ll get rich',
        'Investing can grow your money faster than keeping it in a bank',
        'Investing means you never lose money',
      ],
      correctIndex: 2,
      explanation: 'Investing gives your money the chance to grow faster than a standard savings account — though it does come with some risk.',
    },
    {
      id: 'q3',
      question: 'What is a "return" on an investment?',
      options: [
        'Giving money back to someone',
        'Returning to a shop with a receipt',
        'The original amount you invested',
        'The money you earn on top of what you put in',
      ],
      correctIndex: 3,
      explanation: 'A return is the profit you make — the extra money you receive beyond your original investment amount.',
    },
  ],
}

export default day1
