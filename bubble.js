(function(){

  let width = 500;
  let height = 500;

  //no need margin for force diagram
  let svg = d3.select('#chart')
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
            .attr("transform", "translate(0,0)");
            //will push everything down to have the middle point be (0,0) if i change translate (width/2, height/2)

  //adding image to coin
  //creating definition and added pattern, then added image
  var defs = svg.append("defs"); //add defs tag to svg



  var radiusScale = d3.scaleSqrt().domain([1, 300]).range([10,80]); //make square root scale because it is the radius of the circle
    //domain - 1 is min and 300 is max from our data set
    //domain is range of all the possible input data values
    //range - smallest circle radius and largest circle radius
    //range is possible output range



  //create a force simulation - takes every circle and applies forces to them to get them to go to a certain place
  //we want all of ours to go towards the center
  //create simulation and use it later

  //simulation is a collection of forces about where we want our circles to go and how we want our circles to interact
  //to give a force, need .force(name)

  //step 1: get them to the middle
  //step 2: don't have them collide
  var simulation = d3.forceSimulation()
      .force("x", d3.forceX(width/2).strength(0.05)) //use x force to push everything to the middle
      .force("y", d3.forceY(height/2).strength(0.05))
      .force("collide", d3.forceCollide(function(d){
        return radiusScale(d.sales)+1;
      })); //put radius for collision to avoid. If radius of circle matches squares, won't have overlap
          //want every circle to have different collision force
          //+1 adds the spacing
          //"x","y","collide" can be called anything

  d3.queue()
    .defer(d3.csv, "crypto_data.csv")
    .await(ready);

  //need to run python server to get this to work
  function ready(error, datapoints){
    //1. read in data
    //2. make circles for each data
    //3. create simulation for all datas
    //4. everytime there is a tick of the clock, run reposition function
    //5. everytime tick happens, simulation will look at all forces applied and will see where the nodes have to be
          //have a force that tries to push all x's to the middle

    defs.selectAll(".artist-pattern")
      .data(datapoints)
      .enter().append("pattern")
      .attr("class", "artist-pattern") //need to change
      .attr("id",function(d){
        return d.name;
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height",1)
      .attr("width", 1)
      .attr("preserveAspectRatio","none")
      .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
      .attr("xlink:href",function(d){
        return "bitcoin.png";
      });

    //artist class doesn't exist so empty selection is returned
    //all the datapoints will be binded to the enter placeholders
    //each circle will replace placeholder with _data bindinded, each having a class "artist" with radius 10

    //for each data point create a circle
    var circles = svg.selectAll(".artist")
      .data(datapoints)
      .enter()
      .append("circle")
      .attr("class", "artist")
      .attr("r", function(d){
        return radiusScale(d.sales);
      })
      .attr("fill", function(d){
        return "url(#bitcoin)";
      })
      .attr("cx", 100)
      .attr("cy", 300)
      .on('click',function(d){
        console.log(d);
      });




    simulation.nodes(datapoints).on('tick', ticked); //every node is one of the circles

    //When we feed the datapoints to simulation, it will automatically call this function and update the cx,cy
    //because we registed the tick event
    function ticked(){
      circles.attr("cx", function(d){
        return d.x;
      })
      .attr("cy",function(d){
        return d.y;
      });

    }


  }

  //how simulation works:
  //every time a second goes by, simulation automatically updatese the position of all the nodes/circles
  //you need to write code to fire on every tick of the simulation
  //make a function called tick, and everytime it is called, grab the circles and set their cx


})();
