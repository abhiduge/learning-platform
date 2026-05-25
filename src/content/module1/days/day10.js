const day10 = {
  id: 'module1_day10',
  moduleId: 'module1',
  dayNumber: 10,
  title: 'Building your investing mindset',

  story: {
    paragraphs: [
      "Alex sits at the same kitchen table, looking at the same £500. But now it looks different. Not just money — potential.",
      "Alex opens a notebook and writes: \"Things I now know about investing.\" The list fills two pages. Mum looks over Alex's shoulder and smiles. \"Your gran would be proud.\"",
    ],
  },

  concept: {
    heading: 'The investor mindset',
    body: 'You\'ve covered the foundations. Here\'s the mindset that separates successful long-term investors: Think long-term — markets go up and down short-term, zoom out. Stay curious — the more you learn, the better your decisions. Start small — you don\'t need £1,000, start with £1 if that\'s what you have. Be patient — wealth from investing is built over years, not days. Don\'t follow hype — "everyone is buying X" is not investment advice.',
    jargonTerm: 'Junior ISA',
    jargonDefinition: 'A tax-free investment account available for under-18s in the UK. A great way to start investing young.',
  },

  scenario: {
    prompt: "Alex decides what to do with the £500:",
    options: [
      { id: 'A', label: '"I\'ll open a Junior ISA with Mum\'s help and put £250 into an index fund."', tone: 'action' },
      { id: 'B', label: '"I\'ll keep learning first — maybe the next modules will help me decide."', tone: 'thoughtful' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'Which of these is a good long-term investor mindset?',
      options: [
        'Check your investment value every hour',
        'Sell whenever there is any sign of a dip',
        'Follow social media tips for the best quick wins',
        'Be patient, stay diversified, and think in years not days',
      ],
      correctIndex: 3,
      explanation: 'Patience and diversification are the foundations of long-term investing success — short-term noise rarely matters.',
    },
    {
      id: 'q2',
      question: 'What is a Junior ISA?',
      options: [
        'A savings app for teenagers',
        'A type of investment risk',
        'A tax-free investment account available for under-18s in the UK',
        'A government grant for young people',
      ],
      correctIndex: 2,
      explanation: 'A Junior ISA lets under-18s invest up to £9,000 a year completely tax-free — a powerful head start.',
    },
    {
      id: 'q3',
      question: 'What\'s the most important single lesson from Module 1?',
      options: [
        'Always pick individual stocks over funds',
        'Wait until you\'re older to start investing',
        'Only invest in companies you\'ve heard of',
        'Start early, diversify, think long-term, and keep learning',
      ],
      correctIndex: 3,
      explanation: 'These four principles — start early, diversify, think long-term, keep learning — are the foundation of smart investing at any age.',
    },
  ],
}

export default day10
