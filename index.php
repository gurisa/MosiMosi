<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="assets/css/bootstrap.min.css">
  <title>Curah Hujan - Modelling & Simulation</title>
</head>
<body>
  <?php 
    $data = array(
      (object) ['week' => 1, 'data' => 2.175],
      (object) ['week' => 2, 'data' => 3.787],
      (object) ['week' => 3, 'data' => 6.7],
      (object) ['week' => 4, 'data' => 11.711],
      (object) ['week' => 5, 'data' => 20.495],
      (object) ['week' => 6, 'data' => 35.904],
      (object) ['week' => 7, 'data' => 62.789],
      (object) ['week' => 8, 'data' => 109.96],
      (object) ['week' => 9, 'data' => 192.419],
      (object) ['week' => 10, 'data' => 336.75],
      (object) ['week' => 11, 'data' => 589.3],
      (object) ['week' => 12, 'data' => 1031],
      (object) ['week' => 13, 'data' => 1800.95],
      (object) ['week' => 14, 'data' => 3157.987],
      (object) ['week' => 15, 'data' => 5525.766],
    );

    $question = array(
      (object) ['number' => 'Pertanyaan 1', 'text' => 'Tentukan uraian verifikasi matematis dengan linearisasi untuk pembentukan model tersebut agar metoda regresi linier dapat dilakukan.'],
      (object) ['number' => 'Pertanyaan 2', 'text' => 'Bagaimana anda menghitung parameter a dan b dengan metoda regresinya?'],
      (object) ['number' => 'Pertanyaan 3', 'text' => 'Berdasarkan pertanyaan 2, tentukan nilai parameter a dan b untuk model tersebut.'],
      (object) ['number' => 'Pertanyaan 4', 'text' => 'Validasi model yang anda buat dengan menghitung data pengamatan melalui model tersebut'],
      (object) ['number' => 'Pertanyaan 5', 'text' => 'Gambarkan grafik data pengamatan yang sebenaranya dan grafik data pengamatan model'],
      (object) ['number' => 'Pertanyaan 6', 'text' => 'Simulasikan melalui model, untuk memperkirakan data curah hujan (dalam mm3) pada minggu ke 16. Apa pendapat anda tentang data curah hujan di masa-masa yang akan datang menurut model yang anda peroleh tersebut.'],
    );
  ?>

  <div class="container">
    <hr>
    <h1 class="text-center">Curah Hujan</h1>
    <hr>
    <div class="row">
      <div class="col col-12 col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <table class="table">
          <thead>
            <tr>
              <th>Minggu</th>
              <th>Curah Hujan</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach($data as $key => $value) { ?>
            <tr>
              <td><?php echo $value->week; ?></td>
              <td><?php echo $value->data; ?></td>
            </tr>
            <?php } ?>
          </tbody>
          <tfoot>
            <tr>
              <th>Minggu</th>
              <th>Curah Hujan</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="col col-12 col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <div class="card text-white bg-dark">
          <div class="card-body">
            <h5 class="card-title">Petunjuk</h5>
            <p class="card-text">
              Hasil pengamatan 15 minggu pertama terhadap curah hujan di suatu wilayah diperoleh data seperti yang tetulis pada tabel. 
              Jika suatu pemodelan matematis dari data pengamatan tersebut ada kecenderungan berbentuk y = (a*b)^x dengan a, b adalah parameter data pengamatan, dan x, y adalah variable data pengamatan.
            </p>
          </div>
        </div>
        <hr>

        <div class="accordion" id="question">
          <?php foreach($question as $key => $value) { ?>
          <div class="card">
            <div class="card-header" id="<?php echo 'heading-' . $key; ?>">
              <h5 class="mb-0">
                <button class="btn " type="button" data-toggle="collapse" data-target="<?php echo '#data-' . $key; ?>" aria-expanded="true" aria-controls="<?php echo 'data-' . $key; ?>">
                  Lihat <?php echo $value->number; ?>
                </button>
              </h5>
            </div>

            <div id="<?php echo 'data-' . $key; ?>" class="collapse <?php echo ($key == 0 ) ? 'show' : ''; ?>" aria-labelledby="<?php echo 'heading-' . $key; ?>" data-parent="#question">
              <div class="card-body">
                <!-- <h5 class="card-title"><?php echo $value->number; ?></h5> -->
                <p class="card-text"><?php echo $value->text; ?></p>
                <button class="btn btn-primary">Lihat Jawaban</button>
              </div>
            </div>
          </div>
          <?php } ?>
        </div>

      </div>
    </div>
  </div>
  
  <script src="assets/js/jquery.min.js" type="text/javascript"></script>
  <script src="assets/js/bootstrap.min.js" type="text/javascript"></script>
  <script src="index.js" type="text/javascript"></script>
</body>
</html>