var data = [
  {week: 1, data: 2.175},
  {week: 2, data: 3.787},
  {week: 3, data: 6.7},
  {week: 4, data: 11.711},
  {week: 5, data: 20.495},
  {week: 6, data: 35.904},
  {week: 7, data: 62.789},
  {week: 8, data: 109.96},
  {week: 9, data: 192.419},
  {week: 10, data: 336.75},
  {week: 11, data: 589.3},
  {week: 12, data: 1031},
  {week: 13, data: 1800.95},
  {week: 14, data: 3157.987},
  {week: 15, data: 5525.766},
];

function adjustData(data) {
  var temp = [];
  for (var i = 0; i < data.length; i++) {
    temp[i] = data[i].data;
  }
  return temp;
}

function adjustLabel(data) {
  var temp = [];
  for (var i = 0; i < data.length; i++) {
    temp[i] = data[i].week;
  }
  return temp;
}

function showAnswer(data) {
  for (var i = 1; i <= 6; i++) {
    $('#answer-' + i).hide();
  }
  $('#answer-' + data).show();
}

function initAnswer() {
  for (var i = 1; i <= 6; i++) {
    $('#answer-' + i).hide();
  }
  $('#answer-1').show();
}

$(document).ready(function() {

  initAnswer();
  
  var dataset = adjustData(data);
  var labels = adjustLabel(data);

  var statistic_input = new Chart(document.getElementById('statistic-input'), {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Data Curah Hujan",
            data: dataset,
            fill: false,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 3,
            lineTension: 0.1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });


});