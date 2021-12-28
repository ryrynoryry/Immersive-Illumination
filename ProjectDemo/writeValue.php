<?php
error_reporting(E_ALL);
$data = $_POST['value']; // the key we sent was "value"
$fileName = $_POST['fileName']; // the key we sent was "fileName"
$fileMode = $_POST['fileMode']; // the key we sent was "fileMode"
$f = fopen($fileName, $fileMode);
fwrite($f, $data);
fclose($f);


// error_reporting(E_ALL);
// $data = $_POST['data'];
// $f = fopen('file.txt', 'w+');
// fwrite($f, $data);
// fclose($f);
?>