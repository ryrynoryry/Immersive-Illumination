<?php
error_reporting(E_ALL);
$fileName = $_POST['originalName']; // Name of the file to copy.
$sourcePath = $_POST['source']; // Path to file, with trailing /.
$destPath = $_POST['destination']; // Path to copy to.
$newName = $_POST['newName']; // What to rename the file too.

$sourceFile = $sourcePath . $fileName;
$destinationFile = $destPath . $newName;

if (copy($sourceFile, $destinationFile)) {
  echo "Copied {$sourceFile} to {$destinationFile}.";
} else {
  echo "Could not copy {$sourceFile} to {$destinationFile}!";
}
?>