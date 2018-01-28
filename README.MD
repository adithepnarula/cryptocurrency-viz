# READ ME

# Crypto Bubbles

Crypto Bubbles is a visualization of the top 65 Cryptocurrencies' market cap and real-time price volatility.

## Functionality & MVP

Crypto Bubbles is a single page application, built using force bubbles to help users quickly visualize and comprehend how large the market cap for each cryptocurrency is relative to its peers and whether the cryptocurrency has a net price gain over the past 30 seconds or a net loss. The market price is obtained using an AJAX call to coinmarketcap api every time the page refreshes. On the other hand, prices are obtained from cryptocompare using AJAX polling with an interval set to every 30 seconds.

![test](/readme/test.gif)

Users are able to:
- navigate across three pages: homepage, market cap, and price change
- hover over the force bubble to view the name of the cryptocurrency and price
- click on the force bubble to view detail of the cryptocurrency  
- view market cap of cryptocurrency sorted from highest to lowest
- view net gain or loss every 30 seconds
- search for cryptocurrency on each of the three pages

## Wireframes

To be updated

## Architecture and Technologies

This project is implemented using the following technologies:
- JQuery
- D3.js
- coinmarketcap api
- cryptocompare api
