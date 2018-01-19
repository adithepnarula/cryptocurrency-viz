function bubbleChart(){

  /**
  * SET UP
  */
  let width = 900;
  let height = 700;

  //tool tip
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // These will be set in "chart" function
  var svg = null;
  var bubbles = null;
  var nodes = [];

  var center = { x: width / 2, y: height / 2 };
  var forceStrength = 0.05;

  let forceYSplit = d3.forceY(function(d){
    if(d.percent_change_10s > 0){
      return 150;
    }else if(d.percent_change_10s < 0){
      return 550;
    }else{
      return center.y;
    }
  });

  //use to set distance between nodes so there won't be collision
  var radiusScale = d3.scaleSqrt().domain([1, 2000]).range([8,70]); //make square root scale because it is the radius of the circle

  let forceXCenter = d3.forceX().strength(forceStrength).x(center.x);
  let forceYCenter = d3.forceY().strength(forceStrength).y(center.y);
  //data will be available because forceCollide is called inside after simulation nodes
  let forceCollide = d3.forceCollide(function(d){
    return radiusScale(d.market_cap_rounded)+2;
  });

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }



  var simulation = d3.forceSimulation()
      .velocityDecay(0.2)
      .force('x', forceXCenter)
      .force('y', forceYCenter)
      .force("collide", forceCollide)
      .force('charge', d3.forceManyBody().strength(charge))
      .on('tick', ticked);

  simulation.stop();


  var fillColor = d3.scaleOrdinal()
    .domain(['low', 'medium', 'high'])
    .range(['#d84b2a', '#beccae', '#7aa25c']);


  function createNodes(rawData){
    rawData = rawData.slice(0,numCryptos);
    var myNodes = rawData.map(function (d) {
      let market_cap_rounded = Math.floor(parseInt(d.market_cap_usd)/100000000);
      return {
        id: d.id,
        symbol: d.symbol,
        market_cap_rounded: market_cap_rounded,
        radius: radiusScale(market_cap_rounded),
        price: d.price_usd,
        percent_change_10s: d.percent_change_1h,
        x: 100,
        y: 300
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.market_cap_rounded - a.market_cap_rounded; });
    return myNodes;
  }



  var chart = function chart(selector, rawData){
    // convert raw data into array of objects containing data
    nodes = createNodes(rawData);
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
            .data(nodes, function (d) { return d.id; });

    var bubblesE = bubbles.enter().append('circle')
    .classed('bubble', true)
    .attr('r', 0)
    .attr('fill', function (d) { return fillColor('medium'); })
    .attr('stroke', function (d) { return d3.rgb(fillColor('high')).darker(); })
    .attr('fill', function (d) { return "lightblue"; })
    .on('click',function(d){
      console.log(d);
    })
    .on('mouseover', showDetail)
    .on('mouseout', hideDetail);

    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();


    //ajax call will update bubbles everything regardless
    function updateBubbles(priceData){

      let oldBubbles = svg.selectAll('circle');
      let nodes = oldBubbles.data();

      for(let i = 0; i < nodes.length; i++){

        if(priceData[nodes[i].symbol]){

          newPrice = priceData[nodes[i].symbol].USD;
          nodes[i].percent_change_10s = percentChange(nodes[i].price, newPrice);

          if(nodes[i].symbol === 'BTC'){
            console.log('BTC');
            console.log('old price = ' + nodes[i].price);
            console.log('new price = ' + newPrice);
            console.log('percent change = ' + nodes[i].percent_change_10s);
          }

          nodes[i].price = newPrice;

        }
      }

      oldBubbles.data(nodes, function (d) { return d.id; });

      if (state === 'percent'){
        percentBubbles();
      }

    }



    //for updating nodes
    //because of closure this function will have access to all things in this function
    return function(pricePath){
      //continously call updates
      (function poll(){
       setTimeout(function(){
          $.ajax({ url: pricePath, success: function(priceData){
            updateBubbles(priceData);
            poll();
          }, dataType: "json"});
        }, 15000);
      })();
    };

  };

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  /**
  * gives chart variable a toggleDisplay property
  * chart.toggleDisplay will be called outside to adjust the force by passing in a displayName
  */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'percent') {
      state = 'percent';
      percentBubbles();
    } else {
      state = 'market-cap';
      groupBubbles();
    }
  };

  function groupBubbles(){
    simulation
      .force("x", forceXCenter)
      .force("y", forceYCenter);

    simulation.alpha(1).restart(); //reset alpha to restart simulation
  }

  function percentBubbles() {
    simulation.force("y", forceYSplit);
    simulation.alpha(1).restart();
  }

  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    console.log('in showDetail');
    console.log(d.price);
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="name">Title: </span><span class="value">' +
                  d.id +
                  '</span><br/>' +
                  '<span class="name">Amount: </span><span class="value">$' +
                  addCommas(d.price) +
                  '</span><br/>' +
                  '<span class="name">Year: </span><span class="value">' +
                  d.price +
                  '</span>';
    console.log("content is = ");
    console.log(content);
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor('low')).darker());
    console.log('in hide detail');
    tooltip.hideTooltip();
  }



  return chart;
}


var myBubbleChart = bubbleChart(); //chart gets returned
//need to set to global var because it has toggleDisplay property

var numCryptos = 65;
var state = 'market-cap'; //set state on what to show

function display(error, data){
  if(error){
    console.log(err);
  }
  pricePath = priceUrlPath(data);
  let updateNodes = myBubbleChart('#chart', data); //display
  updateNodes(pricePath,data); //update price every 10 seconds
}


function priceUrlPath(rawData){
  rawData = rawData.slice(0,numCryptos);
  var symbols = rawData.map(function (d) {
    return d.symbol;
  });

  //get first 65
  // symbols = symbols.slice(0,numCryptos).join(",");
  symbols = symbols.join(",");
  path = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+symbols+'&tsyms=USD';
  return path;
}


d3.json('https://api.coinmarketcap.com/v1/ticker/', display);





/** SETTING UP BUTTONS **/

//set up buttons
setupButtons();

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('.buttonsbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);

      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/**helper function**/
function percentChange(originalNum, newNum){
  if(newNum > originalNum){
    return percentIncrease(originalNum,newNum);
  }else if(newNum < originalNum){
    return percentDecrease(originalNum,newNum);
  }else{
    return 0;
  }
}

function percentIncrease(originalNum, newNum){
  let increase = newNum - originalNum;
  return (increase/originalNum)*100;
}

function percentDecrease(originalNum, newNum){
  let decrease = originalNum - newNum;
  return -1 * ((decrease / originalNum)*100);
}


/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}
