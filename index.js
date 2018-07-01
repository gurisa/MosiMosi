var app = new Vue({
  el: '#app',
  data: {
    questions: [
      {'number': '1', 'text': 'Tentukan uraian verifikasi matematis dengan linearisasi untuk pembentukan model tersebut agar metoda regresi linier dapat dilakukan.'},
      {'number': '2', 'text': 'Bagaimana anda menghitung parameter $a$ dan $b$ dengan metoda regresinya?'},
      {'number': '3', 'text': 'Berdasarkan pertanyaan 2, tentukan nilai parameter $a$ dan $b$ untuk model tersebut.'},
      {'number': '4', 'text': 'Validasi model yang anda buat dengan menghitung data pengamatan melalui model tersebut'},
      {'number': '5', 'text': 'Gambarkan grafik data pengamatan yang sebenaranya dan grafik data pengamatan model'},
      {'number': '6', 'text': 'Simulasikan melalui model, untuk memperkirakan data curah hujan (dalam $mm^3$) pada minggu ke 16. Apa pendapat anda tentang data curah hujan di masa-masa yang akan datang menurut model yang anda peroleh tersebut.'}
    ],
    menu: 0,
    data: [],
    prediction: [],
    error:[],
    total: [],
    average: [],
    parameter: {
      a: 0,
      b: 0,
      C: 0,
      g: 0,
      n: 0,
    },
    chart: {},
    callback: false,
  },
  mounted: function() {    
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
      config: {
        input: {},
        prediction: {},
      },
      object: {
        input: {},
        prediction: {},
      }
    };
    
    this.setDefault();
    this.reInit();

    this.initChartPrediction();
    this.initChartInput();

    this.callback = true;
  },
  methods: {
    reInit: function() {
      
      this.changeData(this.lnOf(this.adjust(this.data, 'x')), 'X');
      this.changeData(this.lnOf(this.adjust(this.data, 'y')), 'Y');
      this.changeData(this.multipleOf(this.adjust(this.data, 'X'), this.adjust(this.data, 'X')), 'X2');
      this.changeData(this.multipleOf(this.adjust(this.data, 'X'), this.adjust(this.data, 'Y')), 'XY');     

      this.parameter.n = this.data.length;
      
      this.total = {
        x: this.totalOf(this.adjust(this.data, 'x')),
        y: this.totalOf(this.adjust(this.data, 'y')),
        X: this.totalOf(this.adjust(this.data, 'X')),
        Y: this.totalOf(this.adjust(this.data, 'Y')),
        X2: this.totalOf(this.adjust(this.data, 'X2')),
        XY: this.totalOf(this.adjust(this.data, 'XY')),
        ya: this.totalOf(this.adjust(this.data, 'ya')),
        err: this.totalOf(this.error),
      };
  
      this.average = {
        x: this.averageOf(this.total.x, this.parameter.n),
        y: this.averageOf(this.total.y, this.parameter.n),
        X: this.averageOf(this.total.X, this.parameter.n),
        Y: this.averageOf(this.total.Y, this.parameter.n),
        X2: this.averageOf(this.total.X2, this.parameter.n),
        XY: this.averageOf(this.total.XY, this.parameter.n),
        ya: this.averageOf(this.total.ya, this.parameter.n),
        err: this.total.err / this.parameter.n,
      };

      this.parameter = {
        a: this.getA(),
        b: this.getB(),
        C: this.getC(),
        n: this.data.length,
      };

      this.changeData(this.yOf(this.adjust(this.data, 'x'), this.parameter.b, this.parameter.C), 'ya');

      this.total.ya = this.totalOf(this.adjust(this.data, 'ya'));      
      this.average.ya = this.averageOf(this.total.ya, this.parameter.n);
      
      this.prediction = this.yOf(this.adjust(this.data, 'x'), this.parameter.b, this.parameter.C);    
      this.error = this.errorOf(this.adjust(this.data, 'y'), this.adjust(this.data, 'ya'));
      
      this.total.err = this.totalOf(this.error);
      this.average.err = this.total.err / this.parameter.n;

      this.parameter.g = this.getG();
      
      if (this.callback === true) {
        this.updateChartInput();
        this.updateChartPrediction();
      }
    },
    setDefault: function() {
      this.data = [
        {x: 1, y: 2.175, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 2, y: 3.787, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 3, y: 6.7, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 4, y: 11.711, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 5, y: 20.495, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 6, y: 35.904, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 7, y: 62.789, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 8, y: 109.96, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 9, y: 192.419, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 10, y: 336.75, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 11, y: 589.3, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 12, y: 1031, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 13, y: 1800.95, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 14, y: 3157.987, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
        {x: 15, y: 5525.766, X: 0, Y: 0, X2: 0, XY: 0, ya: 0},
      ]; 
    },
    totalOf: function(data) {
      var total = 0;
      if (data) {        
        for (var i = 0; i < data.length; i++) {
          total += data[i];
        }        
      }
      return total;
    },
    averageOf: function(total, n) {
      if (total && n) {
        return total / n;
      }
    },
    changeData: function(data, property) {
      if (data && property && data.length === this.data.length) {
        for (var i = 0; i < this.data.length; i++) {
          this.data[i][property] = data[i];
        }  
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
    errorOf: function(data1, data2) {
      var temp = [];
      if (data1 && data2) {
        if (data1.length === data2.length) {
          for (var i = 0; i < data1.length; i++) {
            temp[i] = Math.abs(data1[i] - data2[i]);
          }
        }
      }
      return temp;
    },
    yOf: function(data, b, c) {
      var temp = [];
      if (data && b && c) {
        for (var i = 0; i < data.length; i++) {
          temp[i] = c * Math.pow(data[i], b);
        }
      }
      return temp;
    },
    getA: function() {
      return (this.average.Y - (this.getB() * this.average.X));
    },
    getB: function() {
      return (((this.parameter.n * this.total.XY) - (this.total.X * this.total.Y)) / ((this.parameter.n * this.total.X2) - (this.total.X * this.total.X)));
    },
    getC: function() {
      return Math.exp(this.getA());
    },
    getG: function() {
      return (this.average.err / this.average.y) * 100;
    },
    addPrediction: function() {     
      this.prediction.push(this.parameter.C * Math.pow(this.prediction.length+1, this.parameter.b));
      if (this.chart.config.prediction.data.datasets.length > 0 && this.prediction.length <= 30) {
        this.chart.config.prediction.data.labels.push(this.prediction.length);
        this.chart.object.prediction.update();
      }
      else {
        alert('It\'s enough ;)');
      }
    },
    removePrediction: function() {
      if (this.prediction.length > 15) {
        this.prediction.splice(this.prediction.length-1, 1);
        this.chart.config.prediction.data.labels.splice(this.prediction.length, 1);
        this.chart.object.prediction.update();
      }
      else {
        alert('It\'s enough ;)');
      }
    },
    toFixed: function(value, precision) {
      var power = Math.pow(10, precision || 0);
      return String(Math.round(value * power) / power);
    },
    initChartInput: function() {
      var stats_input = document.getElementById('statistic-input');
      if (stats_input) {
        this.chart.config.input = {
          type: "line",
            data: {
              labels: this.adjust(this.data, 'x'),
              datasets: [
                {
                  label: "Data Curah Hujan",
                  data: this.adjust(this.data, 'y'),
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
                  data: this.adjust(this.data, 'ya'),
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
            options: this.chart.options
        };
        this.chart.object.input = new Chart(stats_input, this.chart.config.input); 
      }
    },
    initChartPrediction: function() {
      var stats_prediction = document.getElementById('statistic-prediction');
      if (stats_prediction) {
        this.chart.config.prediction = {
          type: "line",
            data: {
                labels: this.adjust(this.data, 'x'),
                datasets: [
                  {
                    label: "Data Curah Hujan",
                    data: this.adjust(this.data, 'y'),
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
                    data: this.adjust(this.data, 'ya'),
                    fill: false,            
                    backgroundColor: "rgba(254, 162, 135, 0.2)",
                    borderColor: "rgba(254, 162, 135, 1)",
                    borderWidth: 3,
                    lineTension: 0.1,
                    pointRadius: 8,
                    pointHoverRadius: 13,
                    borderDash: [5, 5],
                  },
                  {
                    label: "Data Prediksi Model +N",
                    data: this.prediction,
                    fill: false,            
                    backgroundColor: "rgba(54, 162, 135, 0.2)",
                    borderColor: "rgba(54, 162, 135, 1)",
                    borderWidth: 3,
                    lineTension: 0.1,
                    pointRadius: 8,
                    pointHoverRadius: 13,
                    borderDash: [5, 5],
                  },
                ]
            },
            options: this.chart.options
        };      
        this.chart.object.prediction =  new Chart(stats_prediction, this.chart.config.prediction); 
      }
    },
    updateChartInput: function() {
      this.chart.config.input.data.labels = this.adjust(this.data, 'x');
      this.chart.config.input.data.datasets[0].data = this.adjust(this.data, 'y');
      this.chart.config.input.data.datasets[1].data = this.adjust(this.data, 'ya');
      this.chart.object.input.update();
    },
    updateChartPrediction: function() {
      this.chart.config.prediction.data.labels = this.adjust(this.data, 'x');
      this.chart.config.prediction.data.datasets[0].data = this.adjust(this.data, 'y');
      this.chart.config.prediction.data.datasets[1].data = this.adjust(this.data, 'ya');
      this.chart.config.prediction.data.datasets[2].data = this.prediction;
      this.chart.object.prediction.update();
    },
  },
  watch: {

  },
  computed: {

  }
});

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    if (document.getElementById('modal-rindu')) {
      // $('#modal-rindu').modal({keyboard: false, focus: false, show: true });
    }
  }
}



