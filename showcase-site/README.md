# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Weather Widget Creation

## 1. API Key Creation
To create this widget we would need to establish a connection to another website via an API call. Application Program Interface(API) is the connection between 2 computer programs (ours and the website we're taking the services from). To establish this connection we would need to make an API call, however we can't establish a call without having an API key, its like trying to go inside a house without preparing a key to the lock. 

And so we would need to obtain the API key, to do this we would need to create an account to the source of the API, in the weather widget we are using Open Weather (https://openweathermap.org/) as our API so create an account, and click on the API tab and obtain the API Key.

## 2 State Management
When we're fetching we also need to establish states inside the program, basically it acts as a getter and setter it stores the value provided by the API, here we can set it by using it like the code provided below.

```
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
```

## 3 API Request 
Once we have our API Keys we need to send in the request to obtain information from the website. thefetchWeather function uses  `async()`  up establish a connection with OpenWeatherMap, it does this by making a fetch and response. We do a try catch for any errors. and inside we do a fetch (basically to send a request) and response (receiving the response and utilize information taken from it). To utlise this please change the `{YOUR_API_KEY_HERE}` variable in below, and change it to your API key

```
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={YOUR_API_KEY_HERE}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message);
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch (err) {
      setError("Error fetching weather data");
    }
  };
```

## 4 Setting pictures depending on the weather
Depending on the current weather condition we will be displaying the picture that corresponds to it.
```
  const weatherImages = {
    Clear: "clear.png",
    Clouds: "clouds.png",
    Snow: "snow.png",
    Rain: "rain.png",
    Drizzle: "drizzle.png",
    Thunderstorm: "thunderstorm.png",
    Mist: "mist.png",
    Fog: "fog.png",
  };
```
## 5 Widget Creation - Initiate
Now that we already establish the function to connect the website through the API, we can start to make it look pretty. We'll split this widget into 2 sections, a section for the search function and another to display the results. When building the search function, we would need an inputs such as the city name through the `onChange` variable and here we can utilise the state management again to store the value of the city to the city variable. Then we would need to create a button to conduct the method to conduct the api call, so we add an `onClick` effect to the button. In case of an error we also handle it by displaying the error.
```
    <div className="p-6 max-w-md mx-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl shadow-xl text-center">
      <h1 className="text-2xl font-bold mb-4">Weather Widget</h1>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 border p-2 rounded text-black"
        />
        <button
          onClick={fetchWeather}
          className="bg-white text-white-700 px-4 py-2 rounded font-semibold shadow-md hover:bg-gray-200 transition"
        >
          Search
        </button>
      </div>
   {error && <p className="text-red-300 mt-2">{error}</p>}
```
## 6 Widget Creation - Result
Once we already receive a response from the website we want to display it to the user, we can do this by displaying the weather name, as well as display the corresponding image related with the weather.
```
      {weather && (
        <div className="mt-6 p-4 bg-white text-black rounded-xl shadow-md">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p className="text-gray-700 capitalize">{weather.weather[0].description}</p>

          {/* Display corresponding weather image */}
          <div className="flex justify-center mt-4">
            <img
              src={weatherImages[weather.weather[0].main] || "default.png"}
              alt={weather.weather[0].main}
              className="w-24 h-24"
            />
          </div>

          <div className="flex justify-center items-center space-x-4 mt-3">
            <div className="text-4xl">{weather.main.temp}°C</div>
            <div>
              <p className="text-sm">Wind Speed: {weather.wind.speed} m/s</p>
              <p className="text-sm">Humidity: {weather.main.humidity}%</p>
            </div>
          </div>
        </div>
      )}
```
# Stock Widget Creation
## 1 API Registration
Similar to the weather widget we would need to create an API Key to access stock market prices, here we are using https://finnhub.io as our API. We would also need to understand what the response would be like and what kind of data we would take, so take a look at the documentation and see what you want information you would like to pull. For this API we would want to see the quotes over a certain time period and we can see the response attributes from this link https://finnhub.io/docs/api/quote, and we will be using those to generate the graph. 

The message received by Finnhub 
- `c` - Current price
- `d` - Change
- `dp` - Percent change
- `h` - High price of the day
- `l` - Low price of the day
- `o` - Open price of the day
- `pc` - Previous close price

### 1.2 Installing the dependencies
Since we are using recharts to show the graphs, we will need to to install it using ```npm install recharts``` on your command line

## 2 State Management
We need to setup state variables here:
- `ticker` – Stores user input for the stock symbol.
- `watchlist` – Holds the list of added stocks.
- `selectedStock` – Stores data for the currently selected stock.
- `error` – Displays error messages.

```
const StockTracker = () => {
  const [ticker, setTicker] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [error, setError] = useState("");
```
## 3 Fetch Data Function
After setting up we would need to interact with the API in order to obtain the response from the message. Similar to the weather app, please replace the `YOUR_API_KEY_HERE` with your own API key.
```
const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=YOUR_API_KEY_HERE`
    );
    const data = await response.json();

    if (!data || !data.c) {
      setError("Invalid ticker or data not found");
      return null;
    } else {
      setError("");
      return {
        symbol,
        currentPrice: data.c,
        change: data.d,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        history: generateMockData(), // Temporary mock data for the graph
       };
    }
  } catch (err) {
    setError("Error fetching stock data");
    return null;
  }
};
```
## 4 Function to add Tickers into the watchlist
Now that we have a function to call the API, we can store it inside of the watchlist. It first checks if the ticker field is empty, if its not empty then it fetches the stock data, and add it to the watchlist if its valid then we will clear the ticker field to empty afterwards.
```
  const addTicker = async () => {
    if (!ticker) return;
    const stock = await fetchStockData(ticker);
    if (stock) {
      setWatchlist((prev) => [...prev, stock]);
      setTicker("");
    }
  };

```
## 5 Function to Remove ticker and Select the Current Stock
To remove the ticker, we will be creating a new array that excludes the stock without the symbol, and once we remove it we will deslect it from the watchlist. With the selectStock, we just add it to the setSelectStock where we will be elaborating more about the selected stock.
```
  const removeTicker = (symbol) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
    if (selectedStock?.symbol === symbol) setSelectedStock(null);
  };

  const selectStock = (stock) => {
    setSelectedStock(stock);
  };
```
## 6 Generate Mock Data for the graph
Since the API's live price fluctuations are locked behind a paywall, we'll just making a mock graph to mimic the price movement of the stock. Here we just use $100 as the base line and using mathrandom to generate random numbers multiply it by 10 and fix it to 2 decimal places, and making 10 arrays so 10 different price points.
```
  const generateMockData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      time: `Day ${i + 1}`,
      price: (Math.random() * 10 + 100).toFixed(2),
    }));
  };
```
## 7 Creating the UI of the Stock Search Input
Here we build the UI to search for the stocks as well as adding functionality such as adding the ticker into the watchlist. As well as displaying the error messages

```
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Stock Tracker</h1>

      {/* Search Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter stock ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="flex-1 p-2 rounded text-white"
        />
        <button
          onClick={addTicker}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add
        </button>
      </div>

      {error && <p className="text-red-400 mb-2">{error}</p>}
```
## 8 Watchlist UI
For the watchlist UI, we will have to check if there are at least 1 item inside the watchlist, then it will add in the key with the stock symbol as well as a remove button which will default it to the stock.symbol on click. It also checks to see the change variable from the stock, and displays an up or down arrow depending on the price change relative to $0.
```
      {/* Watchlist */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Watchlist</h2>
        {watchlist.length > 0 ? (
          <ul>
            {watchlist.map((stock) => (
              <li
                key={stock.symbol}
                className="flex justify-between items-center p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => selectStock(stock)}
              >
                <span>{stock.symbol}</span>
                <div className="flex items-center">
                  <span className={`mr-2 ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {stock.change >= 0 ? "▲" : "▼"} ${stock.change.toFixed(2)}
                  </span>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTicker(stock.symbol);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No stocks added yet</p>
        )}
      </div>
```
## 9 Displaying Stock Details       
If the user has clicked on the stock tracker, then it will display the additional information such as the current price, etc. To display the mock graph we will be using a `responsiveContainer` which will automatically adjust the chart size based on the available space. We will then be giving the data from the mock history from `selectedStock.history`, and give it 2 axis which is time and price. The tooltip is there to pop up details when the user hovers over the charts and show exact prices. 
```
{/* Stock Details */}
      {selectedStock && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">{selectedStock.symbol} Details</h2>
          <p>Current Price: ${selectedStock.currentPrice.toFixed(2)}</p>
          <p>Open: ${selectedStock.open.toFixed(2)}</p>
          <p>High: ${selectedStock.high.toFixed(2)}</p>
          <p>Low: ${selectedStock.low.toFixed(2)}</p>
          <p>Previous Close: ${selectedStock.previousClose.toFixed(2)}</p>

          {/* Stock Price Graph */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Price Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={selectedStock.history}>
                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis domain={["auto", "auto"]} stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#4CAF50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
```
