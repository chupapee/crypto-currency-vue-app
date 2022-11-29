const tickersSubscribers = new Map()

const API_KEY = '04369a47bcf26f5931268470e4d42fcbbe76c4b3b2d6760ad01e237f87eca6c6'
const BASE_URL = 'https://min-api.cryptocompare.com/data/pricemulti'

// const socket = new WebSocket(
//   `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
// );

// const AGGREGATE_INDEX = 5

// socket.onmessage = (e) => {
//   const {TYPE: type, FROMSYMBOL: currentTicker, PRICE: newPrice} = JSON.parse(e.data)
//   if(type !== AGGREGATE_INDEX) return

//   const tickerHandlers = tickersSubscribers.get(currentTicker)
//   tickerHandlers.forEach(fn => fn(newPrice));
// }

function subscribeToTickerOnWs(ticker) {
  const timer = setInterval(async () => {
    const data = await fetch(`${BASE_URL}?fsyms=${ticker}&tsyms=USD&api_key=${API_KEY}`)
    const res = await data.json()
    
    const currentTicker = Object.keys(res)[0]
    const newPrice = res[currentTicker].USD

    const tickerHandlers = tickersSubscribers.get(currentTicker) ?? []
    tickerHandlers.forEach(fn => fn(newPrice));
  }, 5000)  

  // лимит запросов на вебсокеты кончился(((

  // сообщение для отправки на сервер
  // const message = JSON.stringify({
  //   action: 'SubAdd',
  //   subs: [`5~CCCAGG~${ticker}~USD`]
  // })

  // если сокет уже открыт, отправить сообщение
  // if(socket.readyState === WebSocket.OPEN) {
  //   socket.send(message)
  //   return
  // }
  // если сокет ещё не открыт, дождаться и только потом отправить сообщение
  // socket.addEventListener('open', () => {
  //   socket.send(message)
  // }, {once: true})
}

export function subscribeToTicker(ticker, cl) {
  let callbackList = tickersSubscribers.get(ticker) || []
  tickersSubscribers.set(ticker, [...callbackList, cl])

  subscribeToTickerOnWs(ticker)
}

export function unSubscribeToTicker(todo, cl) {
  let callbackList = tickersSubscribers.get(todo) || []
  tickersSubscribers.set(todo, [callbackList.filter(fn => fn !== cl)])
}