# READ ME

# Crypto Bubbles

Crypto Bubbles is a visualization of the top 65 Cryptocurrencies' market cap and real-time price volatility.

## Functionality & MVP

Crypto Bubbles is a single page application, built using force bubbles to help users quickly visualize and comprehend how large the market cap for each cryptocurrency is relative to its peers and whether the cryptocurrency has a net price gain over the past 30 seconds or a net loss. The market price is obtained using an AJAX call to coinmarketcap api every time the page refreshes. On the other hand, prices are obtained from cryptocompare using AJAX polling with an interval set to every 30 seconds.

![crypto-homepage.gif](/readme/crypto-homepage.gif)
The landing page when user first loads the application.

![crypto-market.gif](/readme/crypto-market.gif)
Market cap sorted in order. Users are able to hover over and press on the force bubble for more detail.

![crypto-percent.gif](/readme/crypto-percent.gif)
Price change of cryptocurrencies over the last 30 seconds. Force bubbles on top are the ones that had a net gain, center are unchanging, and lower are the ones that had a net loss. Users are able to hover over and press on the force bubble for more detail.  

![crypto-search.gif](/readme/crypto-search.gif)
The searching feature. Users are are able to search for the 65 cryptocurrencies on any of the three pages.

Overall, users are able to:
- navigate across three pages: homepage, market cap, and price change
- hover over the force bubble to view the name of the cryptocurrency and price
- click on the force bubble to view detail of the cryptocurrency  
- view market cap of cryptocurrency sorted from highest to lowest
- view net gain or loss every 30 seconds
- search for cryptocurrency on each of the three pages


## Architecture and Technologies

This project is implemented using the following technologies:
- JQuery
- D3.js
- coinmarketcap api
- cryptocompare api
