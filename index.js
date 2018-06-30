var app = new Vue({
  el: '#app',
  data: {
    questions: [
      {'number': '1', 'text': 'Tentukan uraian verifikasi matematis dengan linearisasi untuk pembentukan model tersebut agar metoda regresi linier dapat dilakukan.'},
      {'number': '2', 'text': 'Bagaimana anda menghitung parameter a dan b dengan metoda regresinya?'},
      {'number': '3', 'text': 'Berdasarkan pertanyaan 2, tentukan nilai parameter a dan b untuk model tersebut.'},
      {'number': '4', 'text': 'Validasi model yang anda buat dengan menghitung data pengamatan melalui model tersebut'},
      {'number': '5', 'text': 'Gambarkan grafik data pengamatan yang sebenaranya dan grafik data pengamatan model'},
      {'number': '6', 'text': 'Simulasikan melalui model, untuk memperkirakan data curah hujan (dalam mm3) pada minggu ke 16. Apa pendapat anda tentang data curah hujan di masa-masa yang akan datang menurut model yang anda peroleh tersebut.'}
    ],
    menu: 0,
    data: [],
    parameter: {
      a: 0,
      b: 0,
    },
    chart: {},
  },
  mounted: function() {
    this.data = [
      {x: 1, y: 2.175, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 2, y: 3.787, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 3, y: 6.7, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 4, y: 11.711, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 5, y: 20.495, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 6, y: 35.904, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 7, y: 62.789, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 8, y: 109.96, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 9, y: 192.419, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 10, y: 336.75, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 11, y: 589.3, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 12, y: 1031, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 13, y: 1800.95, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 14, y: 3157.987, X: 0, Y: 0, X2: 0, XY: 0},
      {x: 15, y: 5525.766, X: 0, Y: 0, X2: 0, XY: 0},
    ]; 

    this.chart = {
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Grafik Regresi Model Curah Hujan'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Minggu'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Intensitas'
            },
            ticks: {
              beginAtZero:true
            }
          }]
        }
      },
    };

  },
  watch: {
    total: function(data) {
      return this.total(data);
    },
  },
  methods: {
    total: function(data) {
      if (data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
          total += data;
        }
        return total;
      }
    },
    adjust: function(data, property) {
      var temp = [];
      if (data && property) {        
        for (var i = 0; i < data.length; i++) {
          temp[i] = data[i][property];
        }        
      }
      return temp;
    },
    lnOf: function(data) {
      var temp = [];
      for (var i = 0; i < data.length; i++) {
        temp[i] = Math.log(data[i]);
      }
      return temp;
    },
    sqrOf: function(data) {
      var temp = [];
      for (var i = 0; i < data.length; i++) {
        temp[i] = Math.pow(data[i], 2);
      }
      return temp;
    },
    multipleOf: function(data1, data2) {
      var temp = [];
      if (data1 && data2) {
        if (data1.length === data2.length) {
          for (var i = 0; i < data1.length; i++) {
            temp[i] = data1[i] * data2[i];
          }
        }
      }
      return temp;
    },
    initStats: function() {

    }
  },
  computed: {

  }
});



// $(document).ready(function() {

  var labels = app.adjust(app.data, 'x');
  var dataset = app.adjust(app.data, 'y');
  var result = dataset;
  
  var X = app.lnOf(labels);
  var Y = app.lnOf(dataset);
  var X2 = app.sqrOf(X);
  var XY = app.multipleOf(X, Y);

  var stats_input = document.getElementById('statistic-input');
  if (stats_input) {
    new Chart(stats_input, {
      type: "line",
      data: {
          labels: labels,
          datasets: [
            {
              label: "Data Curah Hujan",
              data: dataset,
              fill: false,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 3,
              lineTension: 0.1,
              pointRadius: 8,
              pointHoverRadius: 13,
            },
            {
              label: "Data Hasil Perhitungan",
              data: result,
              fill: false,            
              backgroundColor: "rgba(254, 162, 135, 0.2)",
              borderColor: "rgba(254, 162, 135, 1)",
              borderWidth: 3,
              lineTension: 0.1,
              pointRadius: 8,
              pointHoverRadius: 13,
              borderDash: [5, 5],
            },
          ]
      },
      options: app.chart.options
    }); 
  }
 

// });