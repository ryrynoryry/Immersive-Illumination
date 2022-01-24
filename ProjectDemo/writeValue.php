<?php
error_reporting(E_ALL);
$data = $_POST['value']; // the key we sent was "value"
$fileName = $_POST['fileName']; // the key we sent was "fileName"
$fileMode = $_POST['fileMode']; // the key we sent was "fileMode"
$f = fopen($fileName, $fileMode);

if ($f == false) {
  throw new Exception("$filename already exists", 252);
}

fwrite($f, $data);

$closed = fclose($f);

if ($closed == false) {
  throw new Exception("fclose failed for: $filename", 252);
}
echo $f;


// error_reporting(E_ALL);
// $data = $_POST['data'];
// $f = fopen('file.txt', 'w+');
// fwrite($f, $data);
// fclose($f);
?>