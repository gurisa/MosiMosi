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
    parameter: {a: 0, b: 0, C: 0, g: 0, n: 0, error: 0.1},
    chart: {},
    callback: false,
    config: {
      snowfall: {},
      raindrops: {},
      buttons: {
        stop: {},
        play: {},
      },
      man: false,
    },
    math: {
      total: {x: '', y: '', X: '', Y: '', X2: '', XY: '', ya: '', err: ''},
      average: {x: '', y: '', X: '', Y: '', X2: '', XY: '', ya: '', err: ''},
      equation: {a: '', b: '', y: '', g: ''},
      formula: {a: '', b: '', y: '', g: ''},
    },    
  },
  mounted: function() {  

    MathJax.Hub.Config({
      tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
    });

    this.chart = {
      options: {
        legend: {
          labels: {
            fontColor: '#34495e',
          }
        },
        responsive: true,
        title: {
          display: true,
          text: 'Grafik Regresi Model Curah Hujan',
          fontColor: '#34495e',
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
              labelString: 'Minggu',
              fontColor: '#34495e',
            },
            ticks: {
              fontColor: '#34495e',
              // fontSize: 18,
              // stepSize: 1,
              beginAtZero: true,
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Intensitas (mm3)',
              fontColor: '#34495e',
            },
            ticks: {
              fontColor: '#34495e',
              // fontSize: 18,
              // stepSize: 1,
              beginAtZero: true,
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
    
    this.config = {
      snowfall: {
        image : "assets/images/water.png",
        round : false, 
        shadow: false,
        minSize: 7, 
        maxSize: 20,
        minSpeed: 3,
        maxSpeed: 15,
        flakeColor: '#ecf0f1',
        flakeCount : 10,
        flakeIndex: 0,
        // collection : ".snow-container",   
      },
      raindrops: {
        position: 'fixed',
        positionBottom: 0,
        positionLeft: 0,
        color: '#2e86de',
        canvasHeight: 20, //tinggi air
        waveLength: 100, //panjang gelombang
        waveHeight: 20, //tinggi gelombang
        density: 0.005, //jarak antar tiap tetes air
        frequency: 10, //jumlah air menetes
        rippleSpeed: 0.01, //kecepatan tetes air
      },
      buttons: {
        stop: {
          active: false,
          label: 'Stop',
        },
        play: {
          active: false,
          label: 'Play',
        },
      },
      man: false,
    };

    this.setDefault();
    this.reInit();

    this.initChartPrediction();
    this.initChartInput();

    this.callback = true;

    this.rain();
  },
  methods: {
    reInit: function() {
      
      this.changeData(this.lnOf(this.adjust(this.data, 'x')), 'X');
      this.changeData(this.lnOf(this.adjust(this.data, 'y')), 'Y');
      this.changeData(this.multipleOf(this.adjust(this.data, 'x'), this.adjust(this.data, 'x')), 'X2');
      this.changeData(this.multipleOf(this.adjust(this.data, 'x'), this.adjust(this.data, 'Y')), 'XY');     

      this.parameter.n = this.data.length;
      
      this.total = {
        x: this.totalOf(this.adjust(this.data, 'x')),
        y: this.totalOf(this.adjust(this.data, 'y')),
        X: this.totalOf(this.adjust(this.data, 'x')),
        Y: this.totalOf(this.adjust(this.data, 'Y')),
        X2: this.totalOf(this.adjust(this.data, 'X2')),
        XY: this.totalOf(this.adjust(this.data, 'XY')),
        ya: this.totalOf(this.adjust(this.data, 'ya')),
        err: this.totalOf(this.error),
      };
  
      this.average = {
        x: this.averageOf(this.total.x, this.parameter.n),
        y: this.averageOf(this.total.y, this.parameter.n),
        X: this.averageOf(this.total.x, this.parameter.n),
        Y: this.averageOf(this.total.Y, this.parameter.n),
        X2: this.averageOf(this.total.X2, this.parameter.n),
        XY: this.averageOf(this.total.XY, this.parameter.n),
        ya: this.averageOf(this.total.ya, this.parameter.n),
        err: this.total.err / this.parameter.n,
      };

      this.parameter = {
        a: this.getA(),
        b: this.getB(),
        n: this.data.length,
      };

      this.changeData(this.yOf(this.adjust(this.data, 'x'), this.parameter.a, this.parameter.b), 'ya');
      this.total.ya = this.totalOf(this.adjust(this.data, 'ya'));      
      this.average.ya = this.averageOf(this.total.ya, this.parameter.n);
      
      this.prediction = this.yOf(this.adjust(this.data, 'x'), this.parameter.a, this.parameter.b);    
      this.error = this.errorOf(this.adjust(this.data, 'y'), this.adjust(this.data, 'ya'));
      
      this.total.err = this.totalOf(this.error);
      this.average.err = this.total.err / this.parameter.n;

      this.parameter.g = this.getG();

      if (this.callback === true) {
        this.updateChartInput();
        this.updateChartPrediction();
      }
      
      this.reInitFormula();
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
      this.reInit(); 
    },
    setRandom: function() {
      var data = this.data;
      if (data) {
        for (var i = 0; i < data.length; i++) {
          data[i].x = Math.floor((Math.random() * 30) + 1) + i;
          data[i].y = (Math.random() * 10000) + 1;
        }
        this.data = data;
        this.reInit(); 
      }            
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
    yOf: function(data, a, b) {
      var temp = [];
      if (data && a && b) {
        for (var i = 0; i < data.length; i++) {
          temp[i] = a * Math.pow(b, data[i]);
        }
      }
      return temp;
    },
    getA: function() {
      return Math.pow(Math.E, (this.average.Y - (Math.log(this.getB()) * this.average.X)));
    },
    getB: function() {
      return Math.pow(Math.E, ((this.parameter.n * this.total.XY) - (this.total.X * this.total.Y)) / ((this.parameter.n * this.total.X2) - (this.total.X * this.total.X)));
    },
    getG: function() {
      return (this.average.err / this.average.y) * 100;
    },
    addPrediction: function() {
      if (this.chart.config.prediction.data.datasets.length > 0 && this.prediction.length < 30) {
        this.prediction.push(this.parameter.a * Math.pow(this.parameter.b, this.prediction.length + 1));
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
    rain: function(amount = 0) {
      this.config.snowfall.minSize = (amount * 1) + 7;
      this.config.snowfall.maxSize = (amount * 1) + 20;
      this.config.snowfall.minSpeed = (amount * 4) + 3;
      this.config.snowfall.maxSpeed = (amount * 1) + 15;
      this.config.snowfall.flakeCount = (amount * 20) + 10;
      this.config.snowfall.image = (amount <= 3) ? "assets/images/water.png" : "assets/images/flake.png";
    },
    float: function(amount = 0) {
      this.config.raindrops.canvasHeight = (amount * 40) + 20;
      this.config.raindrops.waveLength = (amount * 5) + 100;
      this.config.raindrops.waveHeight = (amount * 30) + 20;
      this.config.raindrops.density = (amount * 0.001) + 0.005;
      this.config.raindrops.frequency = (amount * 10) + 10;
      this.config.raindrops.rippleSpeed = (amount * 0.01) + 0.01;
      var color = {
        r: (52 + (amount * 30)),
        g: (152 + (amount * 15)),
        b: (219 + (amount * 3)),
      };
      this.config.raindrops.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            
      if (amount > 3) {
        this.config.raindrops.canvasHeight = ((amount - 3) * 40) + 20;
        this.config.raindrops.waveLength = ((amount - 3) * 5) + 100;
        this.config.raindrops.waveHeight = ((amount - 3) * 5) + 20;
        this.config.raindrops.density = ((amount - 3) * 0.1) + 0.005;
        this.config.raindrops.frequency = ((amount - 3) * 5) + 10;
        this.config.raindrops.rippleSpeed = ((amount  - 5) * 0.005) + 0.01;
        this.nightMode();
      }
      else {
        this.normalMode();
      }
    },
    playButton: function() {
      this.rain(this.menu);
      this.float(this.menu);
      $(document).snowfall('clear');
      $(document).snowfall(this.config.snowfall);
      
      $('.raindrops').raindrops(this.config.raindrops);
      $('.raindrops').show();
      
      this.config.buttons.play.active = !this.config.buttons.play.active;
      this.config.buttons.stop.active = !this.config.buttons.stop.active;
    },
    stopButton: function() {      
      this.rain(this.menu);
      this.float(this.menu);
      $('.raindrops').hide();
      $(document).snowfall('clear');
      this.normalMode();

      this.config.buttons.play.active = !this.config.buttons.play.active;
      this.config.buttons.stop.active = !this.config.buttons.stop.active;
    },
    normalMode: function() {
      this.chart.config.input.options.title.fontColor = '#34495e';
      this.chart.config.input.options.legend.labels.fontColor = '#34495e'
      this.chart.config.input.options.scales.xAxes[0].ticks.fontColor = '#34495e';
      this.chart.config.input.options.scales.yAxes[0].ticks.fontColor = '#34495e';
      this.chart.config.input.options.scales.xAxes[0].scaleLabel.fontColor = '#34495e';
      this.chart.config.input.options.scales.yAxes[0].scaleLabel.fontColor = '#34495e';

      this.chart.config.prediction.options.title.fontColor = '#34495e';
      this.chart.config.prediction.options.legend.labels.fontColor = '#34495e'
      this.chart.config.prediction.options.scales.xAxes[0].ticks.fontColor = '#34495e';
      this.chart.config.prediction.options.scales.yAxes[0].ticks.fontColor = '#34495e';
      this.chart.config.prediction.options.scales.xAxes[0].scaleLabel.fontColor = '#34495e';
      this.chart.config.prediction.options.scales.yAxes[0].scaleLabel.fontColor = '#34495e';

      $('#container').removeClass('night');      
      this.updateChartInput();
      this.updateChartPrediction();
    },
    nightMode: function() {
      this.chart.config.input.options.title.fontColor = '#ecf0f1';
      this.chart.config.input.options.legend.labels.fontColor = '#ecf0f1'
      this.chart.config.input.options.scales.xAxes[0].ticks.fontColor = '#ecf0f1';
      this.chart.config.input.options.scales.yAxes[0].ticks.fontColor = '#ecf0f1';
      this.chart.config.input.options.scales.xAxes[0].scaleLabel.fontColor = '#ecf0f1';
      this.chart.config.input.options.scales.yAxes[0].scaleLabel.fontColor = '#ecf0f1';

      this.chart.config.prediction.options.title.fontColor = '#ecf0f1';
      this.chart.config.prediction.options.legend.labels.fontColor = '#ecf0f1'
      this.chart.config.prediction.options.scales.xAxes[0].ticks.fontColor = '#ecf0f1';
      this.chart.config.prediction.options.scales.yAxes[0].ticks.fontColor = '#ecf0f1';
      this.chart.config.prediction.options.scales.xAxes[0].scaleLabel.fontColor = '#ecf0f1';
      this.chart.config.prediction.options.scales.yAxes[0].scaleLabel.fontColor = '#ecf0f1';

      $('#container').addClass('night');      
      this.updateChartInput();
      this.updateChartPrediction();
    },
    reInitFormula: function() {
      var pattern = ['x', 'y', 'X', 'Y', 'X2', 'XY', 'ya', 'err'];
      var symbol = ['x', 'y', 'X', 'Y', 'X^2', 'XY', 'y\'', 'g'];
      var formula = ['a', 'b'];
      var formulaEquation = ['b1', 'b2', 'b3', 'b4', 'b5', 'a1', 'a2', 'a3', 'a4', 'a', 'b', 'y', 'g', 'e'];

      for (var i = 0; i < pattern.length; i++) {
        this.showFormulaTotal(pattern[i], symbol[i]);
        this.showFormulaAverage(pattern[i], symbol[i]);
      }

      for (var i = 0; i < formula.length; i++) {
        this.showFormula(formula[i]);
      }

      for (var i = 0; i < formulaEquation.length; i++) {
        this.showFormulaEquation(formulaEquation[i]);
      }

      this.$nextTick(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      });
    },
    showFormulaTotal: function(data, symbol = '') {
      if (this.total[data]) {
        this.math.total[data] = '`sum(' + this.toFixed(this.total[data], 4) + ')`';
      }      
    },
    showFormulaAverage: function(data, symbol = '') {
      if (this.average[data]) {
        this.math.average[data] = '`bar {' + symbol + '} (' + this.toFixed(this.average[data], 4) + ')`';
      }      
    },
    showFormulaEquation: function(data) {
      var equation = {
        b1: '$$ b = exp \\Biggl( { {{' + this.parameter.n + '}} \\sum({{ ' + this.toFixed(this.total.XY, 4) + '}}) - \\sum ({{' + this.toFixed(this.total.X, 4) + '}}) * \\sum ({{' + this.toFixed(this.total.Y, 4) + '}}) \\over {{' + this.parameter.n + ' }} \\sum ({{' + this.toFixed(this.total.X2, 4) + '}}) - \\sum ({{' + this.toFixed(this.total.X, 4) + '}})^2} \\Biggr) $$',
        b2: '$$ b = exp \\Biggl( { {{' + this.toFixed(this.parameter.n * this.total.XY, 4) + '}} - {{' + this.toFixed(this.total.X * this.total.Y, 4) + '}} \\over {{' + this.toFixed(this.parameter.n * this.total.X2, 4) + '}} - {{' + this.toFixed(this.total.X * this.total.X, 4) + '}} } \\Biggr) $$',
        b3: '$$ b = exp \\Biggl( { {{' + this.toFixed((this.parameter.n * this.total.XY) - (this.total.X * this.total.Y), 4) + '}} \\over {{' + this.toFixed((this.parameter.n * this.total.X2) - (this.total.X * this.total.X), 4) + '}} } \\Biggr) $$',
        b4: '$$ b = exp \\Biggl( { {{' + this.toFixed(((this.parameter.n * this.total.XY) - (this.total.X * this.total.Y)) / ((this.parameter.n * this.total.X2) - (this.total.X * this.total.X)), 4) + '}} } \\Biggr) $$',
        b5: '$$ b = { {{' + this.toFixed(Math.pow(Math.E, this.toFixed(((this.parameter.n * this.total.XY) - (this.total.X * this.total.Y)) / ((this.parameter.n * this.total.X2) - (this.total.X * this.total.X)), 4)), 4) + '}} } $$',
        a1: '$$ a = exp \\Biggl( {\\sum({{' +  this.toFixed(this.total.Y, 4) + '}}) \\over {{' + this.parameter.n + '}} } - {\\biggl( {{' + this.toFixed(Math.log(this.parameter.b), 4) + '}} {\\sum ({{' + this.toFixed(this.total.X, 4) + '}}) \\over {{' + this.parameter.n + '}} } \\biggr)} \\Biggr) $$',
        a2: '$$ a = exp \\Biggl( {{' + this.toFixed(this.average.Y, 4) + '}} - {\\biggl( {{' + this.toFixed(Math.log(this.parameter.b), 4) + '}} ({{' + this.toFixed(this.average.X, 4) + '}}) \\biggr)}  \\Biggr) $$',
        a3: '$$ a = exp \\Biggl( {{' + this.toFixed(this.average.Y - (Math.log(this.parameter.b) * this.average.X), 4) + '}} \\Biggr) $$',
        a4: '$$ a = {{' + this.toFixed(Math.pow(Math.E, this.toFixed(this.average.Y - (Math.log(this.parameter.b) * this.average.X), 4)), 4) + '}} $$',
        a: '$ a = {{' + this.toFixed(this.parameter.a, 4) + '}} $',
        b: '$ b = {{' + this.toFixed(this.parameter.b, 4) + '}} $',
        y: '$ y = {{' + this.toFixed(this.parameter.a, 4) + '}} (' + this.toFixed(this.parameter.b, 4) + '^{x}) $',
        g: '$ g = {{' + this.toFixed(this.parameter.g, 4) + '}}\\% $',
        e: '$$ e = {{ \\bar{g} \\over \\bar{y} }} = {{' + this.toFixed(this.average.err, 4) + '\\over ' + this.toFixed(this.average.y, 4) + '}} \\times 100\\% = {{ ' + this.toFixed((this.average.err / this.average.y) * 100, 4) + '\\%  }} $$',
      };
      this.math.equation[data] = equation[data];
    },
    showFormula: function(data) {
      switch (data) {
        case 'b':
          this.math.formula[data] = '$$ b = exp \\Biggl( {n\\sum_{i=1}^n (X[i] * Y[i]) - \\sum_{i=1}^n (X[i]) * \\sum_{i=1}^n (Y[i]) \\over (n\\sum_{i=1}^n (X[i]))^2 - (\\sum_{i=1}^n (X[i]))^2) } \\Biggr) $$';
        break;
        case 'a':
          this.math.formula[data] = '$$ a = exp \\Biggl( {\\sum_{i=1}^n (Y[i]) \\over n} - {\\biggl(ln(b) {\\sum_{i=1}^n (X[i]) \\over n} \\biggr) } \\Biggr) $$';
        break;   
        default:break;
      }      
    }
  },
  watch: {
    menu: function(newVal, oldVal) {
      if (this.config.buttons.play.active) {
        this.rain(newVal);
        this.float(newVal);
        
        $(document).snowfall('clear');
        $(document).snowfall(this.config.snowfall);

        $('.raindrops').remove();
        $('#container').append('<div class="raindrops" style="z-index: 10;">&nbsp;</div>');
        $('.raindrops').raindrops(this.config.raindrops);

        this.config.man = false;
        if (newVal === 1 || newVal === 2 || newVal === 3) {
          this.config.man = true;
        }              
      }
    }
  },
  computed: {

  }
});

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    if (document.getElementById('modal-rindu')) {
      $('#modal-rindu').modal({keyboard: false, focus: false, show: true });
    }
  }
}
