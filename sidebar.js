function updateSideBar(state){
  if(state === 'marketCap'){
    showMarketSidebar();
  }else if(state === 'percent'){
    showPercentSidebar();
  }
}

function showPercentSidebar(){
  //set up header
  let $sidebarHeader = $('.sidebar-header');
  $sidebarHeader.empty();
  $title = $("<h1> Percentage Change </h1>");
  $sidebarHeader.append($title);

  //set up intro info
  let $sidebarIntro = $('.sidebar-intro');
  $sidebarIntro.empty();

  $info1 = $("<p> cryptocurrency price fluctuations are driven by many factors, such as ensuing news about losses, varying perceptions of the intrinsic value, and announcements of different tax treaments. Volatility in cryptocurrencies are capable in the form of 10x changes in price versus the U.S. dollar, in a relatively short period of time. </p>");
  $info2 = $("<p> The force bubbles on the right illustrates the fluctuative nature of cryptocurrency prices by polling for prices every 30 seconds. A force bubble charges to the top it shows a net gain, remains in the center if the price is the same, and shoots to the bottom if it shows a net loss over the last 30 seconds. Hover on the force bubble and press on them to find out more details!</p>");

  $sidebarIntro.append($info1);
  $sidebarIntro.append($info2);

}

function showSidebarDetail(data, state){
  if(state === 'marketCat'){
    showMarketSidebarDetail(data);
  }else if(state === 'percent'){
    showPercentSidebarDetail(data);
  }
}

function showPercentSidebarDetail(data){
  let $sidebarData = $('.sidebar-data');
  $sidebarData.empty();
  $title = $(`<h1 class="crypto-name"> ${data.name} </h1>`);

  data.percent_change_10s = Math.round(data.percent_change_10s*100) / 100;

  $10s_container = $('<div class="percent-container"></div>');
  $10s_number_container = $('<div class="percent_number_container"></div>');
  $10s_sign = $(`<div class="${data.percent_change_10s >= 0 ? 'plus' : 'minus'}" > ${data.percent_change_10s >= 0 ? '+' : '-'} </span>`);
  $10s_gain = $(`<div class="change"> ${(data.percent_change_10s < 0 ? (-1*data.percent_change_10s) : data.percent_change_10s)}%</div>`);
  $10s_gain_text = $(`<div class="time-text"> PAST 30 SECONDS (%)</div>`);


  $1h_container = $('<div class="percent-container"></div>');
  $1h_number_container = $('<div class="percent_number_container"></div>');
  $1h_sign = $(`<div class="${data.percent_change_1h >= 0 ? 'plus' : 'minus'}" > ${data.percent_change_1h >= 0 ? '+' : '-'} </span>`);
  $1h_gain = $(`<div class="change"> ${(data.percent_change_1h < 0 ? (-1*data.percent_change_1h) : data.percent_change_1h)}%</div>`);
  $1h_gain_text = $(`<div class="time-text"> PAST HOUR (%)</div>`);

  $24h_container = $('<div class="percent-container"></div>');
  $24h_number_container = $('<div class="percent_number_container"></div>');
  $24h_sign = $(`<div class="${data.percent_change_24h >= 0 ? 'plus' : 'minus'}" > ${data.percent_change_24h >= 0 ? '+' : '-'} </span>`);
  $24h_gain = $(`<div class="change"> ${(data.percent_change_24h < 0 ? (-1*data.percent_change_24h) : data.percent_change_24h)}%</div>`);
  $24h_gain_text = $(`<div class="time-text"> SINCE YESTERDAY (%)</div>`);

  $7d_container = $('<div class="percent-container"></div>');
  $7d_number_container = $('<div class="percent_number_container"></div>');
  $7d_sign = $(`<div class="${data.percent_change_7d >= 0 ? 'plus' : 'minus'}" > ${data.percent_change_7d >= 0 ? '+' : '-'} </span>`);
  $7d_gain = $(`<div class="change"> ${(data.percent_change_7d < 0 ? (-1*data.percent_change_7d) : data.percent_change_7d)}%</div>`);
  $7d_gain_text = $(`<div class="time-text"> SINCE LAST WEEK (%)</div>`);


  $sidebarData.append($title);

  $10s_number_container.append($10s_sign, $10s_gain);
  $10s_container.append($10s_number_container, $10s_gain_text);
  $sidebarData.append($10s_container);

  $1h_number_container.append($1h_sign, $1h_gain);
  $1h_container.append($1h_number_container, $1h_gain_text);
  $sidebarData.append($1h_container);

  $24h_number_container.append($24h_sign, $24h_gain);
  $24h_container.append($24h_number_container, $24h_gain_text);
  $sidebarData.append($24h_container);

  $7d_number_container.append($7d_sign, $7d_gain);
  $7d_container.append($7d_number_container, $7d_gain_text);
  $sidebarData.append($7d_container);

}


//market sidebar
function showMarketSidebar(){
  //set up header
  let $sidebarHeader = $('.sidebar-header');
  $sidebarHeader.empty();
  $title = $("<h1> Market Cap </h1>");
  $sidebarHeader.append($title);

  //set up intro info
  let $sidebarIntro = $('.sidebar-intro');
  $sidebarIntro.empty();
  $info = $("<p> lorem ipsum.. to remove market </p>");
  $sidebarIntro.append($info);
}