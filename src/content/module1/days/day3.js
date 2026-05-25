const day3 = {
  id: 'module1_day3',
  moduleId: 'module1',
  dayNumber: 3,
  title: 'Risk and reward',

  story: {
    paragraphs: [
      "At Jamie's place, Alex sees a chart on the wall: a squiggly line going up and down, but overall trending upward over 20 years.",
      "\"That's the stock market,\" Jamie says. \"It goes up. It goes down. But over a long time? It's gone up more than almost anything else.\" Alex stares at the squiggly line.",
    ],
  },

  concept: {
    heading: 'Risk and reward',
    body: 'Every investment has risk — the chance you might lose some money. But risk comes with potential reward — the possibility of earning more. Higher risk usually means higher potential reward, and lower risk usually means lower potential reward. Low risk, low reward: money in a savings account — safe, but grows slowly. Medium risk, medium reward: bonds. Higher risk, higher reward: stocks — can go up a lot, but also down.',
    jargonTerm: 'Volatility',
    jargonDefinition: 'How much an investment\'s value goes up and down. A volatile investment is like a rollercoaster.',
  },

  scenario: {
    prompt: "Alex has £500. Jamie asks: \"How would you feel if your investment dropped to £400 next month, but might be worth £700 in 5 years?\"",
    options: [
      { id: 'A', label: '"I\'d be stressed — I don\'t like seeing money go down."', tone: 'cautious' },
      { id: 'B', label: '"I could handle it — I\'m thinking long term."', tone: 'patient' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is "risk" in investing?',
      options: [
        'The fees you pay to invest',
        'The chance that your investment could lose value',
        'The time it takes to invest',
        'The amount of money you invest',
      ],
      correctIndex: 1,
      explanation: 'Risk is the chance that your investment loses value — the higher the potential reward, the more risk is usually involved.',
    },
    {
      id: 'q2',
      question: 'Which generally has higher risk AND higher potential reward?',
      options: [
        'A savings account',
        'Government bonds',
        'Stocks in a growing company',
        'Keeping cash under your mattress',
      ],
      correctIndex: 2,
      explanation: 'Stocks in growing companies carry higher risk but also the potential for much higher returns over time.',
    },
    {
      id: 'q3',
      question: 'What does "volatility" mean?',
      options: [
        'An investment that only goes up',
        'A very safe, stable investment',
        'How much an investment\'s value goes up and down',
        'The minimum amount you need to invest',
      ],
      correctIndex: 2,
      explanation: 'Volatility describes the swings — how dramatically an investment\'s price moves up and down over time.',
    },
  ],
}

export default day3
