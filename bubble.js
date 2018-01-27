function bubbleChart(){

  /**
  * SET UP
  */
  let width = 800;
  let height = 800;

  //tool tip
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // These will be set in "chart" function
  var svg = null;
  var bubbles = null;
  var nodes = [];

  var center = { x: width / 2, y: height / 2 };
  var top = { y: height / 5 };
  var bottom = { y: height / 1.3 };

  var forceStrength = 0.05;

  let forceYSplit = d3.forceY(function(d){
    if(d.percent_change_10s > 0){
      // return 150;
      return top.y;
    }else if(d.percent_change_10s < 0){
      // return 550;
      return bottom.y;
    }else{
      return center.y;
    }
  });

  let forceXSort = function(d){
    let num_rows = 6;
    let space_between = 50;
    let left_margin = 150;
    let rank = d.rank - 1;

    temp = Math.floor(rank / num_rows);
    res = (temp * space_between) + left_margin;
    return res;
  };

  let forceYSort = function(d){
    let rank = d.rank - 1;
    temp = (rank % 6);
    res = (temp * 100) + 150;
    return res;
  };

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
    .domain(['low', 'medium', 'high', 'circle',
  'blue','orange'])
    .range(['#d84b2a', '#beccae', '#7aa25c','#000000','#61AFEF', '#c9b732']);


  function createNodes(rawData){

    var myNodes = rawData.map(function (d) {
      let market_cap_rounded = Math.floor(parseInt(d.market_cap_usd)/100000000);
      return {
        id: d.id,
        rank: d.rank,
        name: d.name,
        symbol: d.symbol,
        market_cap_rounded: market_cap_rounded,
        market_cap: d.market_cap_usd,
        radius: radiusScale(market_cap_rounded),
        price: d.price_usd,
        percent_change_10s: d.percent_change_1h, //need to change to 10s
        percent_change_1h: d.percent_change_1h,
        percent_change_24h: d.percent_change_24h,
        percent_change_7d: d.percent_change_7d,
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
    .attr('fill', d3.rgb(fillColor('circle')).darker())
    .attr('fill-opacity', 0.5)
    .attr('stroke', function (d) {
      return d3.rgb(fillColor('high')).darker();
    })
    .attr('class', 'force-bubble')
    .attr("stroke-width", 3)
    .on('click',function(d){
      showSidebarDetail(d, state);
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
    // groupBubbles();
    groupBubbles();


    //ajax call will update bubbles everything regardless
    function updateBubbles(priceData){

      let oldBubbles = svg.selectAll('circle');
      let nodes = oldBubbles.data();

      for(let i = 0; i < nodes.length; i++){
        let symbol = nodes[i].symbol;
        if(symbol === 'MIOTA'){
          symbol = 'IOTA';
        }

        if(priceData[symbol]){
          newPrice = priceData[symbol].USD;
          nodes[i].percent_change_10s = percentChange(nodes[i].price, newPrice);
          nodes[i].price = newPrice;

        }else{
          console.log("symbol not in: " + symbol);
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
        }, 30000);
      })();
    };

  };

  function ticked(e) {
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
      showPercentSidebar();
      clearDetailbar();
    } else if(displayName === 'market'){
      state = 'market';
      marketBubbles();
      showMarketSidebar();
      clearDetailbar();
    } else if(displayName === 'home'){
      state = 'home';
      groupBubbles();
      showHomeSidebar();
      clearDetailbar();
    }
  };

  /*
  * Each method applies different force to the bubbles
  *
  */
  function groupBubbles(){
    simulation
      .force("x", forceXCenter)
      .force("y", forceYCenter);

    simulation.alpha(1).restart(); //reset alpha to restart simulation

    var bubblesE = svg.selectAll('circle')
      .attr('stroke', d3.rgb(fillColor('orange')).darker());
  }

  function percentBubbles() {
    // showPriceChangeTitles();
    simulation.force("x", forceXCenter);
    simulation.force("y", forceYSplit);
    simulation.alpha(1).restart();

    var bubblesE = svg.selectAll('circle')
      .attr('stroke', function (d) {
        if(d.percent_change_10s > 0){
          return d3.rgb(fillColor('high')).darker();
        }else if(d.percent_change_10s === 0){
          return d3.rgb(fillColor('medium')).darker();
        }else{
          return d3.rgb(fillColor('low')).darker();
        }
      });

  }

  function marketBubbles(){
    simulation.force("x", d3.forceX().strength(forceStrength*2).x(forceXSort));
    simulation.force("y", d3.forceY().strength(forceStrength*2).y(forceYSort));
    simulation.alpha(2).restart();
    var bubblesE = svg.selectAll('circle')
      .attr('stroke', d3.rgb(fillColor('blue')).darker());
  }





  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    if(state === 'percent'){
      d3.select(this)
      .attr('fill', function(d){
        if(d.percent_change_10s > 0){
          return d3.rgb(fillColor('high')).darker();
        }else if(d.percent_change_10s === 0){
          return d3.rgb(fillColor('medium')).darker();
        }else{
          return d3.rgb(fillColor('low')).darker();
        }
      });
    }else if(state === 'market'){
      d3.select(this)
        .attr('fill', d3.rgb(fillColor('blue')).darker());
    }else if(state === 'home'){
      d3.select(this)
        .attr('fill', d3.rgb(fillColor('orange')).darker());
    }
    var content = '<span class="name">' + d.name +'</span><br/>' +
                  '<span class="value">$' + addCommas(d.price) +'</span><br/>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('fill', d3.rgb(fillColor('circle')).darker());
    tooltip.hideTooltip();
  }

  function showPriceChangeTitles() {
  // Another way to do this would be to create
  // the year texts once and then just hide them.
    var priceData = ['up', 'same', 'down'];
    var price = svg.selectAll('.price')
      .data(priceData);

    price.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return 200; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }



  return chart;
}


var myBubbleChart = bubbleChart(); //chart gets returned
//need to set to global var because it has toggleDisplay property

var numCryptos = 65;
var state = 'home'; //set state on what to show

//keep track of the higest gain and highest loss every 30 seconds
var highestPercentGain = null;
var highestPercentLoss = null;

function display(error, data){
  if(error){
    console.log(err);
  }
  data = data.slice(0, numCryptos); //get 65 cryptos
  pricePath = priceUrlPath(data);
  let updateNodes = myBubbleChart('#chart', data); //display
  updateNodes(pricePath,data); //update price every 30 seconds
}


function priceUrlPath(rawData){
  var symbols = rawData.map(function (d) {
    if(d.symbol==='MIOTA'){
      return 'IOTA'; //coinmarketcap has IOTA symbol has MIOTA but cryptocompare has IOTA
    }else{
      return d.symbol;
    }
  });
  symbols = symbols.join(",");
  path = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+symbols+'&tsyms=USD';
  return path;

}


d3.json('https://api.coinmarketcap.com/v1/ticker/', display);
// d3.json('https://api.coinmarketcap.com/v1/ticker/', getCurrentPrice);





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

function searchNode() {
    var svg = $('svg');
    var selectedVal = $('.search-input').val();
    selectedVal = $.trim(selectedVal.toLowerCase());
    console.log("selected value");
    console.log(selectedVal);
    var bubbles = d3.selectAll(".force-bubble");
    var selected = bubbles.filter(function(d, i){
      return d.id != selectedVal;
    });
    selected.style("opacity", "0");
    d3.selectAll(".force-bubble").transition()
        .duration(5000)
        .style("opacity", 1);

}
