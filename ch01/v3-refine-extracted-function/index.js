window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  statement(invoices[0], plays)
  callListeners()
});

function callListeners() {
  load()
  clear()
}

let plays =
{
  "hamlet": { "name": "Hamlet", "type": "tragedy" },
  "as-like": { "name": "As You Like It", "type": "comedy" },
  "othello": { "name": "Othello", "type": "tragedy" }
}

let invoices =
  [
    {
      "customer": "BigCo", "performances": [
        {
          "playID": "hamlet",
          "audience": 55
        },
        {
          "playID": "as-like",
          "audience": 35
        },
        {
          "playID": "othello",
          "audience": 40
        }
      ]
    }
  ]

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `<h1 class='title'>Statement for ${invoice.customer}\n</h1>`;
  const format = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = ammountFor(perf, play);

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);

    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += `<p>   ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n </p>`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  let main = document.getElementById('main')
  main.innerHTML = result;
  return result;
}

function ammountFor(aPerformance, play) {
  let result = 0;
  switch (play.type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;

    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 1000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown play type: ${play.type}`)
  }
  return result;
}

function load() {
  let loadButton = document.querySelector('button.load')
  loadButton.addEventListener('click', (event) => {
    event.preventDefault();
    statement(invoices[0], plays)
  });
}

function clear() {
  let clearButton = document.querySelector('button.clear')
  clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('main').innerHTML = '';
  });
}