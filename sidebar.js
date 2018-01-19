function updateSideBar(state){
  if(state === 'marketCap'){
    showMarketSidebar();
  }else if(state === 'percent'){
    showPercentSidebar();
  }
}

function showPercentSidebar(){
  console.log('in showPercentSidebar');
  const $sidebar = $('.sidebar-header');
  $sidebar.empty();
  $title = $("<h1> Percent Change </h1>");
  $sidebar.append($title);
  console.log($sidebar);
}
