<?php
$servername = "localhost";
$username = "root";
$password = "Passw0rd123"; // Replace with your MySQL password
$dbname = "cash_register";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
