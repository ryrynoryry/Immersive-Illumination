<?php
error_reporting(E_ALL);
  if(isset($_POST['submitBtn']))
  {
    $data=$_POST['textdata'];
    $freq=$_POST['frequency'];
    $text = $data . "," . $freq . "\n";
    $fp = fopen('data.txt', 'a');
    fwrite($fp, $text);
    fclose($fp);

    echo $text;
  }
?>