// (function(){

//   (function poll(){
//    setTimeout(function(){
//       $.ajax({ url: "https://api.coinmarketcap.com/v1/ticker/", success: function(data){
//
//         // //Update your dashboard gauge
//         // // salesGauge.setValue(data.value);
//         // let nodes = createNodes(data);
//         // console.log("nodes are..");
//         // console.log(nodes);
//         //Setup the next poll recursively
//         poll();
//       }, dataType: "json"});
//     }, 3000);
//   })();
//
//
//   let width = 900;
//   let height = 900;
//
//   //no need margin for force diagram
//   let svg = d3.select('#chart')
//             .append("svg")
//             .attr("height", height)
//             .attr("width", width)
//             .append("g")
//             .attr("transform", "translate(0,0)");
//             //will push everything down to have the middle point be (0,0) if i change translate (width/2, height/2)
//
//
//   var radiusScale = d3.scaleSqrt().domain([1, 2000]).range([15,100]); //make square root scale because it is the radius of the circle
//   //domain - 1 is min and 300 is max from our data set
//   //domain is range of all the possible input data values
//   //range - smallest circle radius and largest circle radius
//   //range is possible output range
//
//
//   //create a force simulation - takes every circle and applies forces to them to get them to go to a certain place
//   //we want all of ours to go towards the center
//   //create simulation and use it later
//
//   //simulation is a collection of forces about where we want our circles to go and how we want our circles to interact
//   //to give a force, need .force(name)
//
//   //step 1: get them to the middle
//   //step 2: don't have them collide
//
//
//   var center = { x: width / 2, y: height / 2 };
//
//   var forceStrength = 0.05;
//
//   let forceYSplit = d3.forceY(function(d){
//     if(parseInt(d.percent_change_1h) >= 0){
//       return 200;
//     }else{
//       return 700;
//     }
//   });
//
//   function charge(d) {
//    return -Math.pow(d.radius, 2.0) * forceStrength;
//   }
//
//   let forceXCombine = d3.forceX(center.x).strength(0.05);
//   let forceYCombine = d3.forceY(center.y).strength(0.05);
//
//   //put radius for collision to avoid. If radius of circle matches squares, won't have overlap
//     //     //want every circle to have different collision force
//     //     //+1 adds the spacing
//     //     //"x","y","collide" can be called anything
//
//   let forceCollide = d3.forceCollide(function(d){
//     return radiusScale(d.market_cap_rounded)+2;
//   });
//
//
//   var simulation = d3.forceSimulation()
//       .force("x", forceXCombine) //use x force to push to either middle or the sides, depending on data element
//       .force("y", forceYCombine)
//       .force("collide", forceCollide);
//
//   d3.queue()
//     .defer(d3.csv, "crypto_data.csv")
//     .await(ready);
//
//   //need to run python server to get this to work
//   function ready(error, datapoints){
//     //1. read in data
//     //2. make circles for each data
//     //3. create simulation for all datas
//     //4. everytime there is a tick of the clock, run reposition function
//     //5. everytime tick happens, simulation will look at all forces applied and will see where the nodes have to be
//           //have a force t to the simulation that tries to push all x's to the middle
//
//
//     var circles = svg.selectAll(".artist")
//       .data(datapoints)
//       .enter()
//       .append("circle")
//         .attr("class", "artist")
//         .attr("r", function(d){
//           return radiusScale(d.market_cap_rounded);
//         })
//         .attr("fill", function(d){
//           return d.background_color;
//         })
//         .attr("cx", 100)
//         .attr("cy", 300)
//         .on('click',function(d){
//           console.log(d);
//         });
//
//     //datapoints are nodes, which are input to simulation
//     //it has all the data from csv tied to it, and also x,y, vx, vy
//     simulation.nodes(datapoints).on('tick', ticked); //every node is one of the circles
//
//     //When we feed the datapoints to simulation, it will automatically call this function and update the cx,cy
//     //because we registed the tick event
//     //this function does the actual repositioning based on current x, y values
//     function ticked(){
//       circles.attr("cx", function(d){
//         return d.x;
//       })
//       .attr("cy",function(d){
//         return d.y;
//       });
//     }
//
//     //each force (forceCombine, forceXSplit) is a function that gets called during each tick
//     //of the simulation. its job is to modify the position of some or all nodes in the simulation.
//     //before
//
//     //overwriting the force in this function
//     d3.select('#split').on('click',function(){
//       simulation
//         .force("y", forceYSplit)
//         .alphaTarget(0.25) //give an alphaTarget and restart simulation
//         .restart();
//     });
//
//     d3.select('#combine').on('click',function(){
//       simulation
//         .force("x", forceXCombine)
//         .force("y", forceYCombine)
//         .alphaTarget(0.25)
//         .restart();
//     });
//
//
//   }
//
//   //how simulation works:
//   //every time a second goes by, simulation automatically updatese the position of all the nodes/circles
//   //you need to write code to fire on every tick of the simulation
//   //make a function called tick, and everytime it is called, grab the circles and set their cx
//
//
// })();



function bubbleChart(){

  /**
  * SET UP
  */
  let width = 900;
  let height = 900;

  // These will be set in "chart" function
  var svg = null;
  var bubbles = null;
  var nodes = [];

  var center = { x: width / 2, y: height / 2 };
  var forceStrength = 0.05;

  let forceYSplit = d3.forceY(function(d){
    if(parseInt(d.percent_change_1h) >= 0){
      return 200;
    }else{
      return 700;
    }
  });

  //use to set distance between nodes so there won't be collision
  var radiusScale = d3.scaleSqrt().domain([1, 2000]).range([15,100]); //make square root scale because it is the radius of the circle

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


  function createNodes(rawData){
    var myNodes = rawData.map(function (d) {
      let market_cap_rounded = Math.floor(parseInt(d.market_cap_usd)/100000000);
      return {
        id: d.id,
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
    .attr('fill', function (d) { return "lightblue"; });

    bubbles = bubbles.merge(bubblesE);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
    .duration(2000)
    .attr('r', function (d) { return d.radius; });

    simulation.nodes(nodes);

    // Set initial layout to single group.
    groupBubbles();

    //for updating nodes
    //because of closure this function will have access to all things in this function
    return function(pricePath){
      console.log("in update...");
      console.log(pricePath);
      //continously call updates
      (function poll(){
       setTimeout(function(){
          $.ajax({ url: pricePath, success: function(data){
            console.log('success!');
            console.log(data);
            poll();
          }, dataType: "json"});
        }, 3000);
      })();

      // bubbles = svg.selectAll('circle')
      //           .data()
      //
      //
      // console.log('in update nodes');
      // bubbles
      //   .attr('cx', function(d){
      //     return 200;
      //   })
      //   .attr('cx', function(d){
      //     return 200;
      //   });
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
    if (displayName === 'split') {
      splitBubbles();
    } else {
      groupBubbles();
    }
  };

  function groupBubbles(){
    simulation
      .force("x", forceXCenter)
      .force("y", forceYCenter);

    simulation.alpha(1).restart(); //reset alpha to restart simulation
  }

  function splitBubbles() {
    simulation.force("y", forceYSplit);
    simulation.alpha(1).restart();
  }

  return chart;
}


var myBubbleChart = bubbleChart(); //chart gets returned
//need to set to global var because it has toggleDisplay property

var updateNodes = null;


function display(error, data){
  if(error){
    console.log(err);
  }
  pricePath = priceUrlPath(data);
  updateNodes = myBubbleChart('#chart', data); //display
  updateNodes(pricePath);

}


function priceUrlPath(rawData){
  var symbols = rawData.map(function (d) {
    return d.symbol;
  });

  //get top 65
  symbols = symbols.slice(0,65).join(",");
  path = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+symbols+'&tsyms=USD';
  console.log("path is");
  console.log(path);
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
