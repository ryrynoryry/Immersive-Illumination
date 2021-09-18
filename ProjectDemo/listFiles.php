<?php
error_reporting(E_ALL);
$directory = $_POST['dir']; // the key we sent was "dir"
$files = array_values(array_diff(scandir($directory), array('.', '..'))); // Remove the '.' and '..' results.
// Encode the array to json to return it as the "result"
array_walk($files, function(&$value, $key, $path) { $value = $path . "/" . $value; }, $directory );

echo json_encode($files);
?>