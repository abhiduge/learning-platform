const day4 = {
  id: 'module1_day4',
  moduleId: 'module1',
  dayNumber: 4,
  title: 'How the stock market works',

  story: {
    paragraphs: [
      "\"So how do you actually buy a stock?\" Alex asks. Jamie pulls out a phone. \"Through an app — a broker.\"",
      "\"Companies list themselves on a 'stock exchange,' and millions of people buy and sell pieces of them every day. The price moves up when more people want to buy, and down when more people want to sell.\"",
    ],
  },

  concept: {
    heading: 'How the stock market works',
    body: 'A stock market (or stock exchange) is a place — now mostly digital — where people buy and sell pieces of companies. Famous ones include the London Stock Exchange (LSE) in the UK, the New York Stock Exchange (NYSE) in the USA, and NASDAQ, which is home to many tech companies. To buy stocks, you use a broker — an app or service that connects you to the market. You don\'t need to be rich; some platforms let you start with just £1.',
    jargonTerm: 'Broker',
    jargonDefinition: 'A service that lets you buy and sell investments. Modern ones are apps on your phone.',
  },

  scenario: {
    prompt: "Alex discovers some investment apps require a parent's permission for under-18s. How does Alex respond?",
    options: [
      { id: 'A', label: '"That makes sense — I\'ll ask Mum to help set it up."', tone: 'practical' },
      { id: 'B', label: '"Annoying, but I\'ll use the time to keep learning first."', tone: 'patient' },
    ],
  },

  quiz: [
    {
      id: 'q1',
      question: 'What is a stock exchange?',
      options: [
        'A shop where you buy shares in person',
        'A place to swap one type of money for another',
        'A market where people buy and sell pieces of companies',
        'A government bank',
      ],
      correctIndex: 2,
      explanation: 'A stock exchange is a marketplace — now mostly digital — where buyers and sellers trade ownership shares in companies.',
    },
    {
      id: 'q2',
      question: 'What makes a stock\'s price go up?',
      options: [
        'The company decides to raise the price',
        'The government sets the price each day',
        'More people wanting to buy it than sell it',
        'The stock exchange adds extra value daily',
      ],
      correctIndex: 2,
      explanation: 'Stock prices rise when demand (buyers) exceeds supply (sellers) — basic supply and demand at work.',
    },
    {
      id: 'q3',
      question: 'What is a "broker"?',
      options: [
        'Something that breaks when it stops working',
        'A bank that lends money to companies',
        'A government body that regulates markets',
        'A service that lets you buy and sell investments',
      ],
      correctIndex: 3,
      explanation: 'A broker is your gateway to the market — today usually an app that lets you buy and sell investments easily.',
    },
  ],
}

export default day4
