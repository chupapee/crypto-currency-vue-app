const tickersSubscribers = new Map()

const API_KEY = '04369a47bcf26f5931268470e4d42fcbbe76c4b3b2d6760ad01e237f87eca6c6'
const BASE_URL = 'https://min-api.cryptocompare.com/data/pricemulti'

function subscribeToTickerOnWs(ticker) {
  const timer = setInterval(async () => {
    const data = await fetch(
      `${BASE_URL}?fsyms=${ticker}&tsyms=USD&api_key=${API_KEY}`
    );
    const res = await data.json();
    console.log(res);
    if (res.Response === "Error") {
    } else {
      const currentTicker = Object.keys(res)[0];
      const newPrice = res[currentTicker].USD;
      const tickerHandlers = tickersSubscribers.get(currentTicker) ?? [];
      tickerHandlers.forEach((fn) => fn(newPrice));
    }
  }, 5000);
}
export function subscribeToTicker(ticker, cl) {
  let callbackList = tickersSubscribers.get(ticker) || []
  tickersSubscribers.set(ticker, [...callbackList, cl])
  subscribeToTickerOnWs(ticker)
}

export function unSubscribeToTicker(ticker, cl) {
  let callbackList = tickersSubscribers.get(ticker) || []
  tickersSubscribers.set(ticker, [callbackList.filter(fn => fn !== cl)])
}